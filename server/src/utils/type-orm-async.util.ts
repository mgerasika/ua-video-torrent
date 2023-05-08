import { ImdbDto } from '@server/dto/imdb.dto';
import { MovieDto } from '@server/dto/movie.dto';
import { ENV } from '@server/env';
import { ISqlReturn } from '@server/interfaces/sql-return.interface';
import { DataSource } from 'typeorm';

let _dataSource: DataSource | undefined = undefined;
const getDataSource = (): DataSource => {
    if (_dataSource) {
        return _dataSource;
    }
    _dataSource = new DataSource({
        type: 'postgres',
        username: ENV.user,
        host: ENV.host,
        database: ENV.database,
        password: ENV.password,
        port: ENV.port,
        entities: [MovieDto, ImdbDto],
        synchronize: true,
        poolSize: 10,
        logging: false,
    });
    return _dataSource;
};

export async function typeOrmAsync<T>(callback: (client: DataSource) => Promise<T>): Promise<ISqlReturn<T>> {
    let data: T | undefined = undefined;
    let error;
    let client;
    try {
        client = await getDataSource().initialize();
        if (!client.isInitialized) {
            return [, 'Client is not Initialized'];
        }
        data = (await callback(client)) as T;
    } catch (ex) {
        console.log('typeOrm error ', ex);
        error = ex;
    } finally {
        client?.destroy();
    }

    return [data, error];
}

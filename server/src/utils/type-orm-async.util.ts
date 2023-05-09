import { ImdbDto } from '@server/dto/imdb.dto';
import { MovieDto } from '@server/dto/movie.dto';
import { ENV } from '@server/env';
import { DataSource } from 'typeorm';
import { IQueryReturn } from './to-query.util';

const IS_DEBUG = ENV.node_env === 'development';

let _dataSource: DataSource | undefined = undefined;
const getDataSource = (): DataSource => {
    if (_dataSource) {
        return _dataSource;
    }
    _dataSource = new DataSource({
        type: 'postgres',
        username: IS_DEBUG ? ENV.owner_user : ENV.user,
        host: ENV.host,
        database: ENV.database,
        password: IS_DEBUG ? ENV.owner_password : ENV.password,
        port: ENV.port,
        entities: [MovieDto, ImdbDto],
        synchronize: true,
        poolSize: 10,
        logging: false,
    });
    return _dataSource;
};

export async function typeOrmAsync<T>(callback: (client: DataSource) => Promise<IQueryReturn<T>>): Promise<IQueryReturn<T>> {
    let client = getDataSource();
    try {
        if (!client.isInitialized) {
            client = await getDataSource().initialize();
        }
        if (!client.isInitialized) {
            return [, 'Client is not Initialized'];
        }
        const data: IQueryReturn<T> = (await callback(client)) as IQueryReturn<T>;
        return data;
    } catch (error) {
        console.log('typeOrm error ', error);
        return [, error];
    }
}

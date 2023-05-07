"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmAsync = void 0;
const imdb_dto_1 = require("@server/dto/imdb.dto");
const movie_dto_1 = require("@server/dto/movie.dto");
const env_1 = require("@server/env");
const typeorm_1 = require("typeorm");
let _dataSource = undefined;
const getDataSource = () => {
    if (_dataSource) {
        return _dataSource;
    }
    _dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        username: env_1.ENV.user,
        host: env_1.ENV.host,
        database: env_1.ENV.database,
        password: env_1.ENV.password,
        port: env_1.ENV.port,
        entities: [movie_dto_1.MovieDto, imdb_dto_1.ImdbDto],
        synchronize: true,
        poolSize: 1,
        logging: false,
    });
    return _dataSource;
};
async function typeOrmAsync(callback) {
    let data = undefined;
    let error;
    let client;
    try {
        client = await getDataSource().initialize();
        if (!client.isInitialized) {
            return [, 'Client is not Initialized'];
        }
        data = (await callback(client));
    }
    catch (ex) {
        console.log('typeOrm error ', ex);
        error = ex;
    }
    finally {
        client === null || client === void 0 ? void 0 : client.destroy();
    }
    return [data, error];
}
exports.typeOrmAsync = typeOrmAsync;
//# sourceMappingURL=type-orm-async.util.js.map
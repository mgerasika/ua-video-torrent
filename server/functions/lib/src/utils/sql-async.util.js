"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlAsync = void 0;
const { Pool } = require('pg');
const env_1 = require("@server/env");
// create a new PostgreSQL pool with your database configuration
let _pool = undefined;
const getPool = () => {
    if (_pool) {
        return _pool;
    }
    _pool = new Pool({
        user: env_1.ENV.user,
        host: env_1.ENV.host,
        database: env_1.ENV.database,
        password: env_1.ENV.password,
        port: env_1.ENV.port,
        max: 1,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    return _pool;
};
async function sqlAsync(callback) {
    let client;
    let data = undefined;
    let error;
    try {
        client = await getPool().connect();
        data = (await callback(client));
    }
    catch (ex) {
        error = ex;
    }
    finally {
        client === null || client === void 0 ? void 0 : client.release();
    }
    return [data, error];
}
exports.sqlAsync = sqlAsync;
//# sourceMappingURL=sql-async.util.js.map
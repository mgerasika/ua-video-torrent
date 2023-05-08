const { Pool } = require('pg');
import { ENV } from '@server/env';
import { ISqlReturn } from '@server/interfaces/sql-return.interface';
// create a new PostgreSQL pool with your database configuration
let _pool: typeof Pool | undefined = undefined;

const getPool = (): typeof Pool => {
    if (_pool) {
        return _pool;
    }
    _pool = new Pool({
        user: ENV.user,
        host: ENV.host,
        database: ENV.database,
        password: ENV.password,
        port: ENV.port,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    return _pool;
};

export async function sqlAsync<T>(callback: (client: any) => Promise<T>): Promise<ISqlReturn<T>> {
    let client;
    let data: T | undefined = undefined;
    let error;
    try {
        client = await getPool().connect();
        data = (await callback(client)) as T;
    } catch (ex) {
        error = ex;
    } finally {
        client?.release();
    }

    return [data, error];
}

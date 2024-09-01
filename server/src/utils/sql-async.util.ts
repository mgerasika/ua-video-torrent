const { Pool } = require('pg');
import { ENV } from '@server/env';
import { IQueryReturn } from './to-query.util';
import { IS_DEBUG } from '@server/constants/is-debug.constant';
// create a new PostgreSQL pool with your database configuration
let _pool: typeof Pool | undefined = undefined;

const getPool = (): typeof Pool => {
    if (_pool) {
        return _pool;
    }
    _pool = new Pool({
        user: IS_DEBUG ? ENV.owner_user : ENV.user,
        password: IS_DEBUG ? ENV.owner_password : ENV.password,
        host: ENV.host,
        database: ENV.database,
        port: ENV.port,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    return _pool;
};

export async function sqlAsync<T>(callback: (client: any) => Promise<T>): Promise<IQueryReturn<T>> {
    let client;
    try {
        client = await getPool().connect();
        const data = (await callback(client)) as T;
        client?.release();
        return [data];
    } catch (ex) {
        client?.release();
        return [, ex as Error];
    }
}

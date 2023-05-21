import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../parser/hurtom-all.controller';
import fs from 'fs';
import { cdnService } from './cdn.service';
import { dbService } from '../db.service';

interface IRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<Blob, void> {}

app.get(API_URL.api.cdn.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getFromCDNAsync({ fileName: req.params.id });
    if (error) {
        return res.status(400).send(error);
    }

    return res.send(data);
});

export const getFromCDNAsync = async ({ fileName }: { fileName: string }): Promise<IQueryReturn<Blob>> => {
    return await toQueryPromise((resolve, reject) => {
        fs.readFile(cdnService.cdnFile(fileName), (err: unknown, data) => {
            if (err) {
                return reject(err as string);
            }
            return resolve(data as unknown as Blob);
        });
    });
};

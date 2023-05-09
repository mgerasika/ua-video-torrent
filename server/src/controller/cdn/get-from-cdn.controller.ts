import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../parser/get-hurtom-all.controller';
import fs from 'fs';
import { cdnService } from './cdn.service';

interface IRequest {
    params: {
        file_name: string;
    };
}

interface IResponse extends IExpressResponse<Blob, void> {}

app.get(API_URL.api.cdn.get.file_name().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getFromCDNAsync({ fileName: req.params.file_name });
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

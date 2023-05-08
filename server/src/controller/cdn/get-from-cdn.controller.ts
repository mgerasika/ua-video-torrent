import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../tools/get-hurtom-all.controller';
import fs from 'fs';
import { cdnService } from './cdn.service';

interface IRequest {
    params: {
        fileName: string;
    };
}

interface IResponse extends IExpressResponse<Blob, void> {}

app.get(API_URL.api.cdn.get.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getFromCDNAsync({ fileName: req.params.fileName });
    if (error) {
        res.status(400).send(error);
    } else {
        res.send(data);
    }
});

export const getFromCDNAsync = async ({ fileName }: { fileName: string }): Promise<IQueryReturn<Blob>> => {
    return await toQuery(() => {
        return new Promise((resolve, reject) => {
            fs.readFile(cdnService.cdnFile(fileName), (err: unknown, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data as unknown as Blob);
            });
        });
    });
};

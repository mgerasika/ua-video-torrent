import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../tools/get-hurtom-all.controller';
import fs from 'fs';
import { cdnService } from './cdn.service';

interface IRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<Blob, void> {}

app.get(API_URL.api.cdn.get.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getFromCDNAsync({ id: req.params.id });
    if (error) {
        res.status(400).send(error);
    } else {
        res.send(data);
    }
});

export const getFromCDNAsync = async ({ id }: { id: string }): Promise<IQueryReturn<Blob>> => {
    return await toQuery(() => {
        return new Promise((resolve, reject) => {
            fs.readFile(cdnService.cdnFile(`${id}.torrent`), (err: unknown, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data as unknown as Blob);
            });
        });
    });
};

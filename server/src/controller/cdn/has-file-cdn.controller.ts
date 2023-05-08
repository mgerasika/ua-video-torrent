import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import fs from 'fs';
import { cdnService } from './cdn.service';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';

interface IRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.get(API_URL.api.cdn.get.id().hasFile.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await hasFileCDNAsync({ fileName: req.params.id });
    if (error) {
        res.status(400).send(error);
    } else {
        res.send(data);
    }
});

export const hasFileCDNAsync = async ({ fileName: fileName }: { fileName: string }): Promise<IQueryReturn<void>> => {
    return await toQuery(() => {
        return new Promise(async (resolve, reject) => {
            const res = fs.existsSync(cdnService.cdnFile(fileName));
            if (res) {
                resolve();
            } else {
                reject();
            }
        });
    });
};

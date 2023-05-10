import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import fs from 'fs';
import { cdnService } from './cdn.service';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';

interface IRequest {
    params: {
        file_name: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.get(API_URL.api.cdn.get.file_name().hasFile.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await hasFileCDNAsync({ fileName: req.params.file_name });
    if (error) {
        return res.status(400).send(error);
    }

    return res.send(data);
});

export const hasFileCDNAsync = async ({ fileName: fileName }: { fileName: string }): Promise<IQueryReturn<void>> => {
    return await toQueryPromise((resolve, reject) => {
        return fs.existsSync(cdnService.cdnFile(fileName)) ? resolve() : reject('some error');
    });
};
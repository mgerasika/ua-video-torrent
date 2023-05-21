import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import fs from 'fs';
import { cdnService } from './cdn.service';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';

interface IRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.get(API_URL.api.cdn.id().hasFile.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await hasFileCDNAsync({ fileName: req.params.id });
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

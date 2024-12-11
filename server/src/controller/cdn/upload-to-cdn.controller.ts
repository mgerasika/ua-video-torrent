import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { HURTOM_HEADERS } from '../parser/hurtom-all.controller';
import { cdnService } from './cdn.service';
import { error } from 'console';
import { ENV } from '@server/env';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
const fs = require('fs');

interface IRequest {
    body: {
        id: string;
        fileName: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.cdn.upload.toString(), async (req: IRequest, res: IResponse) => {
    if (!req.body.id) {
        return res.status(400).send('id is undefined');
    }
    const [data, error] = await uploadFileToCDNAsync({ downloadId: req.body.id, fileName: req.body.fileName });
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const uploadFileToCDNAsync = async ({
    downloadId,
    fileName,
}: {
    downloadId: string;
    fileName: string;
}): Promise<IQueryReturn<string>> => {
    const [response,error] = await toQuery(() =>
        axios.get(`https://toloka.to/download.php?id=${downloadId}`, {
            ...HURTOM_HEADERS,
            responseType: 'arraybuffer',
            responseEncoding: 'utf-8',
        }),
    );
    if(error) {
        return [,'Failed to download torrent ' + error];
    }

    const fileContent = response?.data as string;

    if (fileContent?.includes('<script')) {
        return [, 'File not found'];
    }

    return toQueryPromise((resolve, reject) => {
        const path = cdnService.cdnFile(fileName);
        fs.writeFile(path, fileContent, (err: unknown) => {
            if (err) {
                return reject(error as unknown as string);
            }
            return resolve(ENV.cdn + fileName);
        });
    });
};

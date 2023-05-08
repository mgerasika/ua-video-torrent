import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { HURTOM_HEADERS } from '../tools/get-hurtom-all.controller';
import { cdnService } from './cdn.service';
import { error } from 'console';
import { ENV } from '@server/env';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
const fs = require('fs');

interface IRequest {
    body: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.cdn.upload.toString(), async (req: IRequest, res: IResponse) => {
    if (!req.body.id) {
        res.status(400).send('id is undefined');
    } else {
        const [data, error] = await uploadFileToCDNAsync({ hurtomDownloadId: req.body.id });
        if (error) {
            res.status(400).send(error);
        } else {
            res.send(data);
        }
    }
});

export const uploadFileToCDNAsync = async ({
    hurtomDownloadId,
}: {
    hurtomDownloadId: string;
}): Promise<IQueryReturn<string>> => {
    return await toQuery(() =>
        axios
            .get(`https://toloka.to/download.php?id=${hurtomDownloadId}`, {
                ...HURTOM_HEADERS,
                responseType: 'arraybuffer',
                responseEncoding: 'utf-8',
            })
            .then((response) => {
                const fileContent = response.data as string;

                if (fileContent?.includes('<script')) {
                    throw 'File not found';
                }

                return new Promise( (resolve, reject) => {
                     fs.writeFile(cdnService.cdnFile(`${hurtomDownloadId}.torrent`), fileContent, (err: unknown) => {
                        if (err) {
                            return reject(error);
                        }
                        console.log('output file ', ENV.cdn + `${hurtomDownloadId}.torrent`);
                        return resolve(ENV.cdn + `${hurtomDownloadId}.torrent`);
                    });
                });
            }),
    );
};

import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../tools/get-hurtom-all.controller';
import { S3_BUCKED_NAME, s3 } from './s3.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
const fs = require('fs');

// permissions for s3 bucket

interface IRequest {
    body: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.s3.upload.toString(), async (req: IRequest, res: IResponse) => {
    if (!req.body.id) {
        res.status(400).send('id is undefined');
    } else {
        const [data, error] = await uploadFileToAmazonAsync({ hurtomDownloadId: req.body.id });
        if (error) {
            res.status(400).send(error);
        } else {
            res.send(data);
        }
    }
});

export const uploadFileToAmazonAsync = async ({
    hurtomDownloadId,
}: {
    hurtomDownloadId: string;
}): Promise<IQueryReturn<string>> => {
    console.log('uploadFileToAmazonAsync start');
    return await toQuery(
        async () =>
            await axios
                .get(`https://toloka.to/download.php?id=${hurtomDownloadId}`, {
                    ...HURTOM_HEADERS,
                    responseType: 'arraybuffer',
                    responseEncoding: 'utf-8',
                })
                .then(async (response) => {
                    const fileContent = response.data as string;

                    if (fileContent?.includes('<script')) {
                        throw 'File not found';
                    }

                    const command = new GetObjectCommand({
                        Bucket: S3_BUCKED_NAME,
                        Key: `${hurtomDownloadId}.torrent`,
                        // ContentType: 'application/x-bittorrent',
                    });

                    const sign = await getSignedUrl(s3, command, { expiresIn: 3600 });

                    const putObj = new PutObjectCommand({
                        Bucket: S3_BUCKED_NAME,
                        Key: `${hurtomDownloadId}.torrent`,
                        ContentType: 'application/x-bittorrent',
                        Body: fileContent,
                    });

                    await s3.send(putObj);
                    return sign;
                }),
    );
};

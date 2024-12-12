import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../parser/hurtom-all.controller';
import { S3_BUCKED_NAME, s3 } from './s3.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
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
        return res.status(400).send('id is undefined');
    }
    const [data, error] = await uploadFileToAmazonAsync({ id: req.body.id, cookies:[] });
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const uploadFileToAmazonAsync = async ({ id, cookies }: { id: string, cookies: string[] }): Promise<IQueryReturn<string>> => {
    console.log('uploadFileToAmazonAsync start');

    const [response] = await toQuery(() => axios.get(`https://toloka.to/download.php?id=${id}`, {  withCredentials: true,
    headers: 
    {...HURTOM_HEADERS,
        Cookie: cookies.map(cookie => cookie.split(';')[0]).join('; ')
    }}));

    const fileContent = response?.data as string;

    if (fileContent?.includes('<script')) {
        return [, 'File not found'];
    }

    const command = new GetObjectCommand({
        Bucket: S3_BUCKED_NAME,
        Key: `${id}.torrent`,
        // ContentType: 'application/x-bittorrent',
    });

    const [sign] = await toQuery(async () => await getSignedUrl(s3, command, { expiresIn: 3600 }));

    const putObj = new PutObjectCommand({
        Bucket: S3_BUCKED_NAME,
        Key: `${id}.torrent`,
        ContentType: 'application/x-bittorrent',
        Body: fileContent,
    });

    await s3.send(putObj);
    return Promise.resolve([sign || '']);
};

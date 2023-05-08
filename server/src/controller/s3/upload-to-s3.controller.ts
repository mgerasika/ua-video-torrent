import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../tools/get-hurtom-all.controller';
import { S3_BUCKED_NAME, s3 } from './s3.service';
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
    return toQuery(() =>
        axios
            .get(`https://toloka.to/download.php?id=${hurtomDownloadId}`, {
                ...HURTOM_HEADERS,
                responseType: 'arraybuffer',
                responseEncoding: 'utf-8',
            })
            .then((response) => {
                const fileContent = response.data as string;

                console.log('fileContent', fileContent);
                if (fileContent?.includes('<script')) {
                    throw 'File not found';
                }
                // const os = require('os');
                // const desktopPath = os.homedir() + '/Desktop/hello.txt';
                // fs.writeFileSync(desktopPath, fileContent);

                return new Promise((resolve, reject) => {
                    s3.upload(
                        {
                            Bucket: S3_BUCKED_NAME,
                            Key: `${hurtomDownloadId}.torrent`,
                            Body: fileContent,
                            ContentType: 'application/x-bittorrent',
                            ContentLength: fileContent.length,
                        },
                        function (err: any, data: any) {
                            if (err) {
                                return reject(err);
                            }
                            console.log(`File uploaded successfully. ${data.Location}`);
                            resolve(data.Location);
                        },
                    );
                });
            }),
    );
};

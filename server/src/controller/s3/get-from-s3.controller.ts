import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IPromiseReturn, toPromise } from '@server/utils/to-promise.util';
import { HURTOM_HEADERS } from '../tools/get-hurtom-all.controller';
import { S3_BUCKED_NAME, s3 } from './s3.service';

interface IRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<string, void> {}

app.get(API_URL.api.s3.get.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getFromS3Async({ id: req.params.id });
    if (error) {
        res.status(400).send(error);
    } else {
        res.send(data);
    }
});

export const getFromS3Async = async ({ id }: { id: string }): Promise<IPromiseReturn<Blob>> => {
    return toPromise(() =>
        axios.get(`https://toloka.to/download.php?id=${id}`, HURTOM_HEADERS).then((response) => {
            const params = {
                Bucket: S3_BUCKED_NAME,
                Key: `${id}.torrent`,
            };

            return new Promise((resolve, reject) => {
                s3.getObject(params, function (err: any, data: any) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data.Body);
                });
            });
        }),
    );
};

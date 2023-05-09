import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../parser/get-hurtom-all.controller';
import { S3_BUCKED_NAME, s3 } from './s3.service';
const { headObject } = require('@aws-sdk/s3-request-presigner');

interface IRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.get(API_URL.api.s3.get.id().hasFile.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await hasFileS3Async({ id: req.params.id });
    if (error) {
        res.status(400).send(error);
    }
    return res.send(data);
});

export const hasFileS3Async = async ({ id }: { id: string }): Promise<IQueryReturn<void>> => {
    return toQueryPromise((resolve, reject) => {
        const params = {
            Bucket: S3_BUCKED_NAME,
            Key: `${id}.torrent`,
        };

        headObject(s3, params, function (err: any, data: any) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

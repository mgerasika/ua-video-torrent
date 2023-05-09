import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { rejects } from 'assert';
import { HURTOM_HEADERS } from './get-hurtom-all.controller';

const cheerio = require('cheerio');

export interface IHurtomInfoByIdResponse {
    imdb_original_id: string;
}

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IHurtomInfoByIdResponse, void> {}

app.get(API_URL.api.parser.getHurtomAll.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getHurtomPageByIdAsync(req.params.id);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const getHurtomPageByIdAsync = async (id: string): Promise<IQueryReturn<IHurtomInfoByIdResponse>> => {
    const url = `https://toloka.to/${id}`;
    console.log('request url = ' + url);
    const [response, error] = await toQuery(() => axios.get(url, HURTOM_HEADERS));
    if (error) {
        return [undefined, error];
    }
    const html = response?.data;
    const $ = cheerio.load(html);

    const href = $('.postbody').find('a[rel=nofollow]').attr('href') || '';
    const parts = href.split('/').filter((f: string) => f);
    const imdb_original_id = parts.length ? parts[parts.length - 1] : '';
    if (imdb_original_id.length < 5 || imdb_original_id.length > 11) {
        return [, 'imdb id not found ' + imdb_original_id];
    }
    return [
        {
            imdb_original_id,
        },
    ];
};

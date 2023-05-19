import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { REZKA_HEADERS } from './rezka-all.controller';

const cheerio = require('cheerio');

export interface IRezkaInfoByIdResponse {
    en_name: string;
    year: number;
}

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IRezkaInfoByIdResponse, void> {}

app.get(API_URL.api.parser.getRezkaAll.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getRezkaPageByIdAsync(req.params.id);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const getRezkaPageByIdAsync = async (id: string): Promise<IQueryReturn<IRezkaInfoByIdResponse>> => {
    const url = `https://rezka.ag/${id}.html`;
    console.log('request url = ' + url);
    const [response, error] = await toQuery(() => axios.get(url, REZKA_HEADERS));
    if (error) {
        return [undefined, error];
    }
    const html = response?.data;
    const $ = cheerio.load(html);
    let year = id.replace('.html', '');
    year = year.substr(year.length - 4);
    return [
        {
            en_name: $('.b-post__origtitle').text().trim(),
            year: +year,
        },
    ];
};

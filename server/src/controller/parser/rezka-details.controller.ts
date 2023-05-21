import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { REZKA_HEADERS } from './rezka-all.controller';

const cheerio = require('cheerio');

export interface IRezkaInfoByIdResponse {
    en_name: string;
    year: number;
    imdb_rezka_relative_link: string;
}

interface IRequest extends IExpressRequest {
    body: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IRezkaInfoByIdResponse, void> {}

app.post(API_URL.api.parser.rezkaDetails.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await parseRezkaDetailsAsync(req.body.id);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const parseRezkaDetailsAsync = async (id: string): Promise<IQueryReturn<IRezkaInfoByIdResponse>> => {
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
    const relativeUrl = $('.b-post__info_rates').find('a').attr('href').trim();

    return [
        {
            en_name: $('.b-post__origtitle').text().trim(),
            year: +year,
            imdb_rezka_relative_link: relativeUrl,
        },
    ];
};

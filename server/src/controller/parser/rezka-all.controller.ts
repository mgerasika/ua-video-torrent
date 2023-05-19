import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { rejects } from 'assert';
import { ERezkaVideoType } from '@server/dto/rezka-movie.dto';
import Joi from 'joi';
import { validateSchema } from '@server/utils/validate-schema.util';

const START_PAGE = 1;
const END_PAGE = 2500;
const TIMEOUT = 5000;
const cheerio = require('cheerio');

export interface IRezkaInfoResponse {
    url_id: string;
    id_attr: string;
    href: string;
    year: number;
}

interface IRequest extends IExpressRequest {
    query: {
        type: ERezkaVideoType;
    };
}

interface IResponse extends IExpressResponse<IRezkaInfoResponse[], void> {}

const schema = Joi.object<IRequest['query']>({
    // type: Joi.options(...Object.values(ERezkaVideoType)).required(),
});

app.get(API_URL.api.parser.getRezkaAll.toString(), async (req: IRequest, res: IResponse) => {
    const [, validateError] = validateSchema(schema, req.query);
    if (validateError) {
        return res.status(400).send(validateError);
    }

    const [data, error] = await getAllRezkaPagesAsync({ type: req.query.type });
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const getAllRezkaPagesAsync = async ({
    type,
}: {
    type: ERezkaVideoType;
}): Promise<IQueryReturn<IRezkaInfoResponse[]>> => {
    const allHurtomItems: IRezkaInfoResponse[] = [];
    const fnAsync: any = async (page: number) => {
        const [hurtomItems, error] = await getRezkaPageAsync(page, type);
        if (hurtomItems) {
            allHurtomItems.push(hurtomItems as unknown as IRezkaInfoResponse);
            // cancel all

            return await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    const res = await fnAsync(++page);
                    if (res[0]) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }, TIMEOUT);
            });
        }

        if (allHurtomItems.length === 0) {
            return [undefined, error || 'return empty???'];
        } else {
            return [allHurtomItems.flat(), error];
        }
    };
    return await fnAsync(START_PAGE);
};

function getMovieName(text: string) {
    return text
        .replace(/\[.*?\]/g, '')
        .replace(/BDRip/g, '')
        .replace(/H\..*/g, '')
        .replace(/1080p/g, '')
        .replace(/BDRemux/g, '')
        .replace(/WEB-DL/g, '')
        .replace(/DVD/g, '')
        .replace(/Rip-AVC/g, '')
        .replace(/  /g, ' ')
        .replace(/\(.*/g, ' ')
        .trim();
}

export const REZKA_HEADERS = {
    headers: {
        'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
        Host: 'rezka.ag',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        cookie: 'SL_G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; PHPSESSID=3p8hdhuc1f2k5m295ao64qat13; dle_user_taken=1; dle_user_token=30f358e2681322bd118c71ab06481604; _ym_uid=1684426440709605085; _ym_d=1684426440; _ym_isad=1; _ym_hostIndex=0-2%2C1-0; _ym_visorc=b',
    },
};

const YEAR_REGEXP = /\((\d{4})\)/;
const getRezkaPageAsync = async (page: any, type: ERezkaVideoType): Promise<IQueryReturn<IRezkaInfoResponse[]>> => {
    const url = `https://rezka.ag/${type}s/page/${page}`;
    console.log('request url = ' + url);
    const [response, error] = await toQuery(async () => await axios.get(url, REZKA_HEADERS));
    if (error || page == END_PAGE) {
        return [undefined, error || 'custom error - end page limit'];
    }

    const html = response?.data;
    const $ = cheerio.load(html);

    let trs: any = [];
    $('.b-content__inline_item').each((_: any, htmlTr: any) => {
        trs.push($(htmlTr));
    });

    const movies = trs.map((tr: any): IRezkaInfoResponse => {
        const idAttr = tr.attr('data-id');
        const href = tr.attr('data-url');
        let year = href.replace('.html', '');
        year = year.substr(year.length - 4);
        const id = href.split('/').pop().replace('.html', '');
        return {
            url_id: id,
            id_attr: idAttr,
            href: tr.attr('data-url'),
            year: +year,
        };
    });

    if (movies.length === 0) {
        return [undefined, 'no more films'];
    } else {
        return [movies, undefined];
    }
};

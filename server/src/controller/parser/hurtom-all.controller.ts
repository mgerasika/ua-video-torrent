import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { rejects } from 'assert';

const cheerio = require('cheerio');

export interface IHurtomInfoResponse {
    id: string;
    name: string;
    year: string;
    uaName: string;
    enName: string;
    href: string;
    size: number;
    downloadId: string;
}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IHurtomInfoResponse[], void> {}

app.post(API_URL.api.parser.hurtomAll.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await parseHurtomAllPagesAsync();
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const parseHurtomAllPagesAsync = async (): Promise<IQueryReturn<IHurtomInfoResponse[]>> => {
    const allHurtomItems: IHurtomInfoResponse[] = [];
    const fnAsync: any = async (page: number) => {
        const [hurtomItems, error] = await getHurtomPageAsync(page);
        if (hurtomItems) {
            allHurtomItems.push(hurtomItems as unknown as IHurtomInfoResponse);
            return fnAsync(++page);
        }

        if (allHurtomItems.length === 0) {
            return [undefined, error];
        } else {
            return [allHurtomItems.flat(), undefined];
        }
    };
    return await fnAsync(0);
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

export const HURTOM_HEADERS = {
    headers: {
        authority: 'toloka.to',
        'sec-ch-ua': 'Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104',
        'sec-ch-ua-mobile': '?0',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        cookie: 'toloka_ssl=1; SL_G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; toloka_sid=f4bdc2cbd6e6b94ef324ff1c9d0737de; toloka_data=a%3A2%3A%7Bs%3A11%3A%22autologinid%22%3Bs%3A32%3A%224f00b79efebdb325648c81fd032a2b44%22%3Bs%3A6%3A%22userid%22%3Bi%3A318894%3B%7D',
    },
};
const YEAR_REGEXP = /\((\d{4})\)/;
const getHurtomPageAsync = async (page: any): Promise<IQueryReturn<IHurtomInfoResponse[]>> => {
    const url = `https://toloka.to/f139${page ? '-' + page * 90 : ''}`;
    console.log('request url = ' + url);
    const [response, error] = await toQuery(() => axios.get(url, HURTOM_HEADERS));
    if (error) {
        return [undefined, error];
    }
    const html = response?.data;
    const $ = cheerio.load(html);
    let trs: any = [];
    $('table.forumline').each((_: any, table: any) => {
        const htmlTrs = $(table).find('tr');
        if (htmlTrs) {
            htmlTrs.each((_: any, htmlTr: any) => {
                trs.push($(htmlTr));
            });
        }
    });

    const movies = trs
        .map((tr: any) => {
            const id = $(tr).find('a.topictitle').text().trim();

            const idx = id.indexOf('/');
            const uaName = getMovieName(id.substr(0, idx));
            const enName = getMovieName(id.substr(idx + 1));

            const match = id.match(YEAR_REGEXP);

            let year = undefined;
            if (match) {
                year = match[1];
            }

            let href = $(tr).find('a.topictitle').attr('href');
            if (href?.includes('?')) {
                const idx = href.indexOf('?');
                href = href.substr(0, idx);
            }
            const sizes = $(tr).find('a[rel=nofollow]').text().split('GB');
            return {
                id,
                name: getMovieName(id),
                year,
                uaName: uaName || '',
                enName: enName || '',
                href: href,
                downloadId: ($(tr).find('a[rel=nofollow]').attr('href') || '').replace('download.php?id=', ''),
                size: sizes.length ? +sizes[0].trim() : '',
            } as IHurtomInfoResponse;
        })
        .filter((item: any) => item.name);

    if (movies.length === 0) {
        return [undefined, 'hurtom no more films'];
    } else {
        return [movies, undefined];
    }
};

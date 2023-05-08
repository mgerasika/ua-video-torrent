import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';

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

app.get(API_URL.api.tools.getHurtomAll.toString(), async (req: IRequest, res: IResponse) => {
    const [data] = await getAllHurtomPagesAsync();
    res.send(data);
});

export const getAllHurtomPagesAsync = async (): Promise<[IHurtomInfoResponse[] | undefined, string | undefined]> => {
    const res: IHurtomInfoResponse[] = [];
    return new Promise((resolve) => {
        const fn = (idx: any) => {
            getHurtomPageAsync(idx)
                .then((tmpRes) => {
                    res.push(tmpRes as unknown as IHurtomInfoResponse);

                    return fn(++idx);
                })
                .catch(() => {
                    resolve([res.flat(), undefined]);
                });
        };
        return fn(0);
    });
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
        cookie: 'toloka_ssl=1; SL_G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; toloka_data=a%3A2%3A%7Bs%3A11%3A%22autologinid%22%3Bs%3A32%3A%22cdf68123baff7b1ac855ab785612eaa3%22%3Bs%3A6%3A%22userid%22%3Bi%3A318894%3B%7D; toloka_sid=9a9d3468814220472699ef74e82143b1',
    },
};
const YEAR_REGEXP = /\((\d{4})\)/;
const getHurtomPageAsync = (page: any): Promise<IHurtomInfoResponse[]> => {
    return new Promise((resolve, reject) => {
        const url = `https://toloka.to/f139${page ? '-' + page * 90 : ''}`;
        console.log('request url = ' + url);
        axios
            .get(url, HURTOM_HEADERS)
            .then((response: any) => {
                const html = response.data;
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

                const films = trs
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
                if (films.length === 0) {
                    reject('no more films');
                } else {
                    resolve(films);
                }
            })
            .catch((error: any) => {
                console.log(error);
                reject(error);
            });
    });
};

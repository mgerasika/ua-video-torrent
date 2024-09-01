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
        cookie: 'toloka___f=a%3A0%3A%7B%7D; toloka___uf=0; toloka___u=a%3A0%3A%7B%7D; toloka___tt=1724785269; toloka_ssl=1; toloka_318894_f=a%3A0%3A%7B%7D; toloka_318894_uf=1724785275; toloka_data=a%3A2%3A%7Bs%3A11%3A%22autologinid%22%3Bs%3A32%3A%2220b60d4dd7fec8f0fc266ee5b0068cfb%22%3Bs%3A6%3A%22userid%22%3Bi%3A318894%3B%7D; toloka_sid=9b283c7c4d1d50d6667a45fa776ccfd3; toloka_318894_u=a%3A132%3A%7Bi%3A681142%3Bi%3A0%3Bi%3A679082%3Bi%3A0%3Bi%3A128920%3Bi%3A0%3Bi%3A678453%3Bi%3A0%3Bi%3A115705%3Bi%3A0%3Bi%3A669795%3Bi%3A239790%3Bi%3A658611%3Bi%3A239790%3Bi%3A677058%3Bi%3A239790%3Bi%3A19053%3Bi%3A239790%3Bi%3A670200%3Bi%3A239790%3Bi%3A679525%3Bi%3A239790%3Bi%3A67387%3Bi%3A239790%3Bi%3A680992%3Bi%3A239790%3Bi%3A680632%3Bi%3A239790%3Bi%3A6081%3Bi%3A239790%3Bi%3A681002%3Bi%3A239790%3Bi%3A680939%3Bi%3A239790%3Bi%3A44375%3Bi%3A239790%3Bi%3A678039%3Bi%3A239790%3Bi%3A654051%3Bi%3A239790%3Bi%3A681067%3Bi%3A239790%3Bi%3A680494%3Bi%3A239790%3Bi%3A679637%3Bi%3A239790%3Bi%3A681152%3Bi%3A239790%3Bi%3A681203%3Bi%3A239790%3Bi%3A680303%3Bi%3A239790%3Bi%3A679884%3Bi%3A239790%3Bi%3A113237%3Bi%3A239790%3Bi%3A101123%3Bi%3A239790%3Bi%3A679695%3Bi%3A239790%3Bi%3A681220%3Bi%3A239790%3Bi%3A12625%3Bi%3A239790%3Bi%3A680370%3Bi%3A239790%3Bi%3A674449%3Bi%3A259791%3Bi%3A674447%3Bi%3A259791%3Bi%3A92761%3Bi%3A259791%3Bi%3A84152%3Bi%3A259791%3Bi%3A680974%3Bi%3A262319%3Bi%3A675910%3Bi%3A262319%3Bi%3A681224%3Bi%3A262319%3Bi%3A681225%3Bi%3A262319%3Bi%3A95090%3Bi%3A262319%3Bi%3A681233%3Bi%3A262319%3Bi%3A678249%3Bi%3A262319%3Bi%3A681234%3Bi%3A262319%3Bi%3A680526%3Bi%3A262319%3Bi%3A681231%3Bi%3A262319%3Bi%3A681230%3Bi%3A262319%3Bi%3A681227%3Bi%3A262319%3Bi%3A681228%3Bi%3A262319%3Bi%3A681229%3Bi%3A262319%3Bi%3A668894%3Bi%3A262319%3Bi%3A681222%3Bi%3A262319%3Bi%3A680852%3Bi%3A262319%3Bi%3A679976%3Bi%3A262319%3Bi%3A678049%3Bi%3A262319%3Bi%3A681030%3Bi%3A262319%3Bi%3A679864%3Bi%3A262319%3Bi%3A110546%3Bi%3A262319%3Bi%3A681130%3Bi%3A262319%3Bi%3A681223%3Bi%3A262319%3Bi%3A675872%3Bi%3A262319%3Bi%3A378397%3Bi%3A262319%3Bi%3A70608%3Bi%3A262319%3Bi%3A67154%3Bi%3A262319%3Bi%3A660961%3Bi%3A262319%3Bi%3A680848%3Bi%3A262319%3Bi%3A104984%3Bi%3A262319%3Bi%3A113189%3Bi%3A262319%3Bi%3A679865%3Bi%3A262319%3Bi%3A681183%3Bi%3A262319%3Bi%3A681132%3Bi%3A262319%3Bi%3A681081%3Bi%3A262319%3Bi%3A681226%3Bi%3A262319%3Bi%3A681235%3Bi%3A262319%3Bi%3A681221%3Bi%3A262319%3Bi%3A681232%3Bi%3A262319%3Bi%3A480258%3Bi%3A262319%3Bi%3A666969%3Bi%3A262319%3Bi%3A680475%3Bi%3A262319%3Bi%3A663134%3Bi%3A262319%3Bi%3A677551%3Bi%3A262319%3Bi%3A680137%3Bi%3A262319%3Bi%3A680738%3Bi%3A262319%3Bi%3A680422%3Bi%3A262319%3Bi%3A679439%3Bi%3A262319%3Bi%3A681068%3Bi%3A262319%3Bi%3A671634%3Bi%3A262319%3Bi%3A681240%3Bi%3A322041%3Bi%3A680477%3Bi%3A322041%3Bi%3A669428%3Bi%3A322041%3Bi%3A95691%3Bi%3A322041%3Bi%3A678361%3Bi%3A322041%3Bi%3A681196%3Bi%3A322041%3Bi%3A679607%3Bi%3A322041%3Bi%3A672032%3Bi%3A322041%3Bi%3A108025%3Bi%3A322041%3Bi%3A681217%3Bi%3A322041%3Bi%3A584204%3Bi%3A322041%3Bi%3A680223%3Bi%3A322041%3Bi%3A680794%3Bi%3A322041%3Bi%3A662132%3Bi%3A322041%3Bi%3A681001%3Bi%3A322041%3Bi%3A678487%3Bi%3A322041%3Bi%3A680295%3Bi%3A322041%3Bi%3A681137%3Bi%3A322041%3Bi%3A671203%3Bi%3A322041%3Bi%3A680682%3Bi%3A322041%3Bi%3A677830%3Bi%3A322041%3Bi%3A676808%3Bi%3A322041%3Bi%3A675929%3Bi%3A322041%3Bi%3A672175%3Bi%3A322041%3Bi%3A83158%3Bi%3A322041%3Bi%3A680662%3Bi%3A322041%3Bi%3A680879%3Bi%3A322041%3Bi%3A679267%3Bi%3A322041%3Bi%3A679885%3Bi%3A322041%3Bi%3A86347%3Bi%3A322041%3Bi%3A678654%3Bi%3A322041%3Bi%3A681237%3Bi%3A322041%3Bi%3A681238%3Bi%3A322041%3Bi%3A677998%3Bi%3A322041%3Bi%3A679285%3Bi%3A322041%3Bi%3A59006%3Bi%3A322041%3Bi%3A681178%3Bi%3A322041%3Bi%3A104313%3Bi%3A322041%3Bi%3A677653%3Bi%3A322041%3Bi%3A665840%3Bi%3A322041%3Bi%3A681236%3Bi%3A322041%3Bi%3A675934%3Bi%3A322041%3Bi%3A108674%3Bi%3A322041%3Bi%3A677702%3Bi%3A322041%3B%7D; toloka_318894_tt=1725161014',
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HURTOM_HEADERS = exports.getAllHurtomPagesAsync = void 0;
const express_app_1 = require("@server/express-app");
const axios_1 = __importDefault(require("axios"));
const api_url_constant_1 = require("@server/constants/api-url.constant");
const cheerio = require('cheerio');
express_app_1.app.get(api_url_constant_1.API_URL.api.tools.getHurtomAll.toString(), async (req, res) => {
    const [data] = await (0, exports.getAllHurtomPagesAsync)();
    res.send(data);
});
const getAllHurtomPagesAsync = async () => {
    const res = [];
    return new Promise((resolve) => {
        const fn = (idx) => {
            getHurtomPageAsync(idx)
                .then((tmpRes) => {
                res.push(tmpRes);
                return fn(++idx);
            })
                .catch(() => {
                resolve([res.flat(), undefined]);
            });
        };
        return fn(0);
    });
};
exports.getAllHurtomPagesAsync = getAllHurtomPagesAsync;
function getMovieName(text) {
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
exports.HURTOM_HEADERS = {
    headers: {
        authority: 'toloka.to',
        'sec-ch-ua': 'Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104',
        'sec-ch-ua-mobile': '?0',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        cookie: 'toloka_ssl=1; SL_G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; toloka_sid=3934feba1d836224a9e23ed1e7b3fd1b; toloka_data=a%3A2%3A%7Bs%3A11%3A%22autologinid%22%3Bs%3A32%3A%22180fb77e7e8abf58eae58fc3a96cced2%22%3Bs%3A6%3A%22userid%22%3Bi%3A318894%3B%7D',
    },
};
const YEAR_REGEXP = /\((\d{4})\)/;
const getHurtomPageAsync = (page) => {
    return new Promise((resolve, reject) => {
        const url = `https://toloka.to/f139${page ? '-' + page * 90 : ''}`;
        console.log('request url = ' + url);
        axios_1.default
            .get(url, exports.HURTOM_HEADERS)
            .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            let trs = [];
            $('table.forumline').each((_, table) => {
                const htmlTrs = $(table).find('tr');
                if (htmlTrs) {
                    htmlTrs.each((_, htmlTr) => {
                        trs.push($(htmlTr));
                    });
                }
            });
            const films = trs
                .map((tr) => {
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
                if (href === null || href === void 0 ? void 0 : href.includes('?')) {
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
                };
            })
                .filter((item) => item.name);
            if (films.length === 0) {
                reject('no more films');
            }
            else {
                resolve(films);
            }
        })
            .catch((error) => {
            console.log(error);
            reject(error);
        });
    });
};
//# sourceMappingURL=get-hurtom-all.controller.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchImdbMovieInfoAsync = void 0;
const express_app_1 = require("@server/express-app");
const axios_1 = __importDefault(require("axios"));
const api_url_constant_1 = require("@server/constants/api-url.constant");
express_app_1.app.post(api_url_constant_1.API_URL.api.tools.searchImdbInfo.toString(), async (req, res) => {
    const [data, error] = await (0, exports.searchImdbMovieInfoAsync)(req.body.enName, req.body.year);
    if (error) {
        res.status(400).send();
    }
    else {
        res.send(data);
    }
});
const searchImdbMovieInfoAsync = async (enMovieName, year) => {
    // const apiKey1 = '1768a885'; //mgerasika@gmail.com
    // const apiKey2 = 'f06cfff4'; //mger@ciklum.com
    const apiKey3 = '7a355028'; //oddbox.cypress@gmail.com
    if (!enMovieName) {
        throw Error('Empty movie');
    }
    return (0, axios_1.default)({
        method: 'get',
        url: 'http://www.omdbapi.com/',
        params: {
            apikey: apiKey3,
            t: enMovieName,
            y: year,
            type: 'movie', // вказуємо, що шукаємо фільм
        },
    }).then((r) => {
        const data = r.data;
        if (data.Response === 'False') {
            return [undefined, 'error'];
        }
        return [data, undefined];
    });
};
exports.searchImdbMovieInfoAsync = searchImdbMovieInfoAsync;
//# sourceMappingURL=search-imdb-movie-info.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupSearchMoviesAsync = void 0;
const express_app_1 = require("@server/express-app");
const api_url_constant_1 = require("@server/constants/api-url.constant");
const db_service_1 = require("../db.service");
express_app_1.app.get(api_url_constant_1.API_URL.api.movie.groupSearch.toString(), async (req, res) => {
    const [data, error] = await (0, exports.groupSearchMoviesAsync)();
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        res.send(data);
    }
});
const groupSearchMoviesAsync = async () => {
    const [movies, error] = await db_service_1.dbService.movie.searchMoviesAsync();
    if (movies) {
        const unique = Object.keys(movies.reduce((acc, it) => {
            acc[it.en_name || ''] = it.en_name;
            return acc;
        }, {}));
        const data = unique
            .map((key) => {
            const filteredMovies = movies.filter((m) => m.en_name === key);
            const firstMovie = filteredMovies.length ? filteredMovies[0] : undefined;
            return {
                enName: key,
                imdb_rating: (firstMovie === null || firstMovie === void 0 ? void 0 : firstMovie.imdb_rating) || 0,
                poster: (firstMovie === null || firstMovie === void 0 ? void 0 : firstMovie.poster) || '',
                movies: filteredMovies,
            };
        })
            .sort((a, b) => b.imdb_rating - a.imdb_rating);
        return [data, undefined];
    }
    return [undefined, error];
};
exports.groupSearchMoviesAsync = groupSearchMoviesAsync;
//# sourceMappingURL=group-search-movie.controller.js.map
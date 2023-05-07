"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupSearchMovieByIdAsync = void 0;
const express_app_1 = require("@server/express-app");
const api_url_constant_1 = require("@server/constants/api-url.constant");
const db_service_1 = require("../db.service");
express_app_1.app.get(api_url_constant_1.API_URL.api.movie.groupSearch.id().toString(), async (req, res) => {
    const [data, error] = await (0, exports.groupSearchMovieByIdAsync)(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        res.send(data);
    }
});
const groupSearchMovieByIdAsync = async (en_name) => {
    const [movies, error] = await db_service_1.dbService.movie.searchMoviesAsync();
    if (movies) {
        const filteredMovies = movies.filter((m) => m.en_name === en_name).sort((a, b) => a.size - b.size);
        const firstMovie = filteredMovies.length ? filteredMovies[0] : undefined;
        const data = {
            enName: (firstMovie === null || firstMovie === void 0 ? void 0 : firstMovie.en_name) || '',
            imdb_rating: (firstMovie === null || firstMovie === void 0 ? void 0 : firstMovie.imdb_rating) || 0,
            poster: (firstMovie === null || firstMovie === void 0 ? void 0 : firstMovie.poster) || '',
            movies: filteredMovies,
        };
        return [data, undefined];
    }
    return [undefined, error];
};
exports.groupSearchMovieByIdAsync = groupSearchMovieByIdAsync;
//# sourceMappingURL=group-search-movie-by-id.controller.js.map
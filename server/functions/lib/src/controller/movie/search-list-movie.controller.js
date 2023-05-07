"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMoviesAsync = void 0;
const express_app_1 = require("@server/express-app");
const sql_async_util_1 = require("@server/utils/sql-async.util");
const api_url_constant_1 = require("@server/constants/api-url.constant");
express_app_1.app.get(api_url_constant_1.API_URL.api.movie.search.toString(), async (req, res) => {
    const [data, error] = await (0, exports.searchMoviesAsync)();
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        res.send(data);
    }
});
const searchMoviesAsync = async () => {
    // return typeOrmAsync<ISearchMovie[]>(async (client) => {
    //     const rows = await client
    //         .getRepository(MovieDto)
    //         .createQueryBuilder('movie')
    //         .leftJoin(ImdbDto, 'imdb', 'imdb.id = movie.imdb_id')
    //         .select(['movie', 'imdb.imdb_rating', 'imdb.poster'])
    //         .getMany();
    //     return rows.map((row: any) => {
    //         return {
    //             ...row,
    //             imdb_rating: +row.imdb_rating,
    //         } as ISearchMovie;
    //     });
    // });
    return (0, sql_async_util_1.sqlAsync)(async (client) => {
        const { rows } = await client.query(`SELECT public.movie.*, imdb.poster, imdb.imdb_rating
FROM public.movie
LEFT JOIN public.imdb
    ON movie.imdb_id = imdb.id
where movie.imdb_id is not null
ORDER BY imdb.imdb_rating DESC, movie.en_name`);
        return rows.map((row) => {
            return Object.assign(Object.assign({}, row), { imdb_rating: +row.imdb_rating });
        });
    });
};
exports.searchMoviesAsync = searchMoviesAsync;
//# sourceMappingURL=search-list-movie.controller.js.map
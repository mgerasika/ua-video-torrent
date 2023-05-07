"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovieAsync = void 0;
const movie_dto_1 = require("@server/dto/movie.dto");
const express_app_1 = require("@server/express-app");
const type_orm_async_util_1 = require("@server/utils/type-orm-async.util");
const api_url_constant_1 = require("@server/constants/api-url.constant");
const get_movie_list_controller_1 = require("./get-movie-list.controller");
express_app_1.app.delete(api_url_constant_1.API_URL.api.movie.id().toString(), async (req, res) => {
    const [, error] = await (0, exports.deleteMovieAsync)(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        const [data] = await (0, get_movie_list_controller_1.getMoviesAllAsync)();
        res.send(data);
    }
});
const deleteMovieAsync = async (id) => {
    return (0, type_orm_async_util_1.typeOrmAsync)(async (client) => {
        const entityToDelete = await client.getRepository(movie_dto_1.MovieDto).findOne({ where: { id } });
        if (!entityToDelete) {
            throw 'entity not found';
        }
        return await client.getRepository(movie_dto_1.MovieDto).remove(entityToDelete);
    });
};
exports.deleteMovieAsync = deleteMovieAsync;
//# sourceMappingURL=delete-movie.controller.js.map
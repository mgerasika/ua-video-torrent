"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putMovieAsync = void 0;
const movie_dto_1 = require("@server/dto/movie.dto");
const express_app_1 = require("@server/express-app");
const type_orm_async_util_1 = require("@server/utils/type-orm-async.util");
const api_url_constant_1 = require("@server/constants/api-url.constant");
const get_movie_controller_1 = require("./get-movie.controller");
express_app_1.app.put(api_url_constant_1.API_URL.api.movie.id().toString(), async (req, res) => {
    const [, error] = await (0, exports.putMovieAsync)(req.params.id, req.body);
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        const [data] = await (0, get_movie_controller_1.getMovieByIdAsync)(req.params.id);
        res.send(data);
    }
});
const putMovieAsync = async (id, data) => {
    return (0, type_orm_async_util_1.typeOrmAsync)(async (client) => {
        const entityToUpdate = await client.getRepository(movie_dto_1.MovieDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            throw 'Entity not found';
        }
        return await client.getRepository(movie_dto_1.MovieDto).save(Object.assign(Object.assign({}, entityToUpdate), data));
    });
};
exports.putMovieAsync = putMovieAsync;
//# sourceMappingURL=put-movie.controller.js.map
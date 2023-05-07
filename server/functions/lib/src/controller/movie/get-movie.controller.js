"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieByIdAsync = void 0;
const movie_dto_1 = require("@server/dto/movie.dto");
const express_app_1 = require("@server/express-app");
const type_orm_async_util_1 = require("@server/utils/type-orm-async.util");
const api_url_constant_1 = require("@server/constants/api-url.constant");
express_app_1.app.get(api_url_constant_1.API_URL.api.movie.id().toString(), async (req, res) => {
    const [data, error] = await (0, exports.getMovieByIdAsync)(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        res.send(data);
    }
});
const getMovieByIdAsync = async (id) => {
    return (0, type_orm_async_util_1.typeOrmAsync)(async (client) => {
        const entity = await client.getRepository(movie_dto_1.MovieDto).findOne({ where: { id } });
        if (!entity) {
            throw 'entity not found';
        }
        return entity;
    });
};
exports.getMovieByIdAsync = getMovieByIdAsync;
//# sourceMappingURL=get-movie.controller.js.map
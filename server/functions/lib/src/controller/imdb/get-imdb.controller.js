"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImdbByIdAsync = void 0;
const imdb_dto_1 = require("@server/dto/imdb.dto");
const express_app_1 = require("@server/express-app");
const type_orm_async_util_1 = require("@server/utils/type-orm-async.util");
const api_url_constant_1 = require("@server/constants/api-url.constant");
express_app_1.app.get(api_url_constant_1.API_URL.api.imdb.id().toString(), async (req, res) => {
    const [data, error] = await (0, exports.getImdbByIdAsync)(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        res.send(data);
    }
});
const getImdbByIdAsync = async (id) => {
    return (0, type_orm_async_util_1.typeOrmAsync)(async (client) => {
        const entity = await client.getRepository(imdb_dto_1.ImdbDto).findOne({ where: { id } });
        if (!entity) {
            throw 'entity not found';
        }
        return entity;
    });
};
exports.getImdbByIdAsync = getImdbByIdAsync;
//# sourceMappingURL=get-imdb.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putImdbAsync = void 0;
const imdb_dto_1 = require("@server/dto/imdb.dto");
const express_app_1 = require("@server/express-app");
const type_orm_async_util_1 = require("@server/utils/type-orm-async.util");
const api_url_constant_1 = require("@server/constants/api-url.constant");
express_app_1.app.put(api_url_constant_1.API_URL.api.imdb.id().toString(), async (req, res) => {
    const [data, error] = await (0, exports.putImdbAsync)(req.params.id, req.body);
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        res.send(data);
    }
});
const putImdbAsync = async (id, data) => {
    return (0, type_orm_async_util_1.typeOrmAsync)(async (client) => {
        const entityToUpdate = await client.getRepository(imdb_dto_1.ImdbDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            throw 'Entity not found';
        }
        return await client.getRepository(imdb_dto_1.ImdbDto).save(Object.assign(Object.assign({}, entityToUpdate), data));
    });
};
exports.putImdbAsync = putImdbAsync;
//# sourceMappingURL=put-imdb.controller.js.map
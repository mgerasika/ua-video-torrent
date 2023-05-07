"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImdbAsync = void 0;
const api_url_constant_1 = require("@server/constants/api-url.constant");
const imdb_dto_1 = require("@server/dto/imdb.dto");
const express_app_1 = require("@server/express-app");
const type_orm_async_util_1 = require("@server/utils/type-orm-async.util");
express_app_1.app.delete(api_url_constant_1.API_URL.api.imdb.id().toString(), async (req, res) => {
    const [data, error] = await (0, exports.deleteImdbAsync)(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        res.send(data);
    }
});
const deleteImdbAsync = async (id) => {
    return (0, type_orm_async_util_1.typeOrmAsync)(async (client) => {
        const entityToDelete = await client.getRepository(imdb_dto_1.ImdbDto).findOne({ where: { id } });
        if (!entityToDelete) {
            throw 'entity not found';
        }
        return await client.getRepository(imdb_dto_1.ImdbDto).remove(entityToDelete);
    });
};
exports.deleteImdbAsync = deleteImdbAsync;
//# sourceMappingURL=delete-imdb.controller.js.map
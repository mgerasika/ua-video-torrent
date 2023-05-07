"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImdbAsync = void 0;
const imdb_dto_1 = require("@server/dto/imdb.dto");
const express_app_1 = require("@server/express-app");
const type_orm_async_util_1 = require("@server/utils/type-orm-async.util");
const api_url_constant_1 = require("@server/constants/api-url.constant");
express_app_1.app.post(api_url_constant_1.API_URL.api.imdb.toString(), async (req, res) => {
    const [data, error] = await (0, exports.postImdbAsync)(req.body);
    if (error) {
        res.status(400).send('error' + error);
    }
    else {
        res.send(data);
    }
});
const postImdbAsync = async (data) => {
    return (0, type_orm_async_util_1.typeOrmAsync)(async (client) => {
        return await client.getRepository(imdb_dto_1.ImdbDto).save(data);
    });
};
exports.postImdbAsync = postImdbAsync;
//# sourceMappingURL=post-imdb.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_URL = void 0;
const react_create_url_1 = require("react-create-url");
exports.API_URL = (0, react_create_url_1.createUrls)({
    swagger: react_create_url_1.EMPTY_URL_ITEM,
    api: {
        user: {
            id: (id) => react_create_url_1.EMPTY_URL_ITEM,
        },
        imdb: {
            id: (id) => react_create_url_1.EMPTY_URL_ITEM,
        },
        movie: {
            search: react_create_url_1.EMPTY_URL_ITEM,
            groupSearch: {
                id: (id) => react_create_url_1.EMPTY_URL_ITEM,
            },
            id: (id) => react_create_url_1.EMPTY_URL_ITEM,
        },
        tools: {
            getHurtomAll: react_create_url_1.EMPTY_URL_ITEM,
            setup: react_create_url_1.EMPTY_URL_ITEM,
            searchImdbInfo: react_create_url_1.EMPTY_URL_ITEM,
        },
        s3: {
            get: {
                id: (id) => ({
                    hasFile: react_create_url_1.EMPTY_URL_ITEM,
                }),
            },
            upload: react_create_url_1.EMPTY_URL_ITEM,
        },
    },
});
//# sourceMappingURL=api-url.constant.js.map
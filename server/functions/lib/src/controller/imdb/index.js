"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imdb = void 0;
const get_imdb_list_controller_1 = require("./get-imdb-list.controller");
const get_imdb_controller_1 = require("./get-imdb.controller");
const post_imdb_controller_1 = require("./post-imdb.controller");
const put_imdb_controller_1 = require("./put-imdb.controller");
const delete_imdb_controller_1 = require("./delete-imdb.controller");
exports.imdb = {
    getImdbAllAsync: get_imdb_list_controller_1.getImdbAllAsync,
    deleteImdbAsync: delete_imdb_controller_1.deleteImdbAsync,
    getImdbByIdAsync: get_imdb_controller_1.getImdbByIdAsync,
    postImdbAsync: post_imdb_controller_1.postImdbAsync,
    putImdbAsync: put_imdb_controller_1.putImdbAsync,
};
//# sourceMappingURL=index.js.map
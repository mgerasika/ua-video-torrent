"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = void 0;
const movie_1 = require("./movie");
const imdb_1 = require("./imdb");
const tools_1 = require("./tools");
const s3_1 = require("./s3");
exports.dbService = {
    movie: movie_1.movie,
    imdb: imdb_1.imdb,
    tools: tools_1.tools,
    s3: s3_1.s3,
};
//# sourceMappingURL=db.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tools = void 0;
const get_hurtom_all_controller_1 = require("./get-hurtom-all.controller");
const search_imdb_movie_info_controller_1 = require("./search-imdb-movie-info.controller");
const setup_controller_1 = require("./setup.controller");
exports.tools = {
    getAllHurtomPagesAsync: get_hurtom_all_controller_1.getAllHurtomPagesAsync,
    searchImdbMovieInfoAsync: search_imdb_movie_info_controller_1.searchImdbMovieInfoAsync,
    setup: setup_controller_1.setup,
};
//# sourceMappingURL=index.js.map
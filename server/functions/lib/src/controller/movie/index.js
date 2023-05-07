"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movie = void 0;
const get_movie_list_controller_1 = require("./get-movie-list.controller");
const group_search_movie_controller_1 = require("./group-search-movie.controller");
const group_search_movie_by_id_controller_1 = require("./group-search-movie-by-id.controller");
const search_list_movie_controller_1 = require("./search-list-movie.controller");
const get_movie_controller_1 = require("./get-movie.controller");
const post_movie_controller_1 = require("./post-movie.controller");
const put_movie_controller_1 = require("./put-movie.controller");
const delete_movie_controller_1 = require("./delete-movie.controller");
exports.movie = {
    getMoviesAllAsync: get_movie_list_controller_1.getMoviesAllAsync,
    searchMoviesAsync: search_list_movie_controller_1.searchMoviesAsync,
    groupSearchMoviesAsync: group_search_movie_controller_1.groupSearchMoviesAsync,
    groupSearchMovieByIdAsync: group_search_movie_by_id_controller_1.groupSearchMovieByIdAsync,
    getMovieByIdAsync: get_movie_controller_1.getMovieByIdAsync,
    postMovieAsync: post_movie_controller_1.postMovieAsync,
    putMovieAsync: put_movie_controller_1.putMovieAsync,
    deleteMovieAsync: delete_movie_controller_1.deleteMovieAsync,
};
//# sourceMappingURL=index.js.map
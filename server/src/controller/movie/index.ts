import { getMoviesAllAsync } from './get-movie-list.controller';
import { searchMoviesAsync } from './search/get-search-list-movie.controller';
import { getMovieByIdAsync } from './get-movie.controller';
import { postMovieAsync } from './post-movie.controller';
import { putMovieAsync } from './put-movie.controller';
import { deleteMovieAsync } from './delete-movie.controller';

export const movie = {
    getMoviesAllAsync,
    searchMoviesAsync,
    getMovieByIdAsync,
    postMovieAsync,
    putMovieAsync,
    deleteMovieAsync,
};

import { getMoviesAllAsync } from './get-movie-list.controller';
import { groupSearchMoviesAsync } from './group-search-movie.controller';
import { groupSearchMovieByIdAsync } from './group-search-movie-by-id.controller';
import { searchMoviesAsync } from './search-list-movie.controller';
import { getMovieByIdAsync } from './get-movie.controller';
import { postMovieAsync } from './post-movie.controller';
import { putMovieAsync } from './put-movie.controller';
import { deleteMovieAsync } from './delete-movie.controller';

export const movie = {
    getMoviesAllAsync,
    searchMoviesAsync,
    groupSearchMoviesAsync,
    groupSearchMovieByIdAsync,
    getMovieByIdAsync,
    postMovieAsync,
    putMovieAsync,
    deleteMovieAsync,
};

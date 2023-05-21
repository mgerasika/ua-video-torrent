import { searchRezkaMoviesWithoutStreamsAsync } from './search-href.controller';
import { getRezkaMoviesAllAsync } from './get-rezka-movie-list.controller';
import { getRezkaMovieByIdAsync } from './get-rezka-movie.controller';
import { postRezkaMovieAsync } from './post-rezka-movie.controller';
import { putRezkaMovieAsync } from './put-rezka-movie.controller';
import { deleteRezkaMovieAsync } from './delete-rezka-movie.controller';

export const rezkaMovie = {
    getRezkaMoviesAllAsync,
    getRezkaMovieByIdAsync,
    postRezkaMovieAsync,
    putRezkaMovieAsync,
    deleteRezkaMovieAsync,
    searchHrefRezkaMoviesAsync: searchRezkaMoviesWithoutStreamsAsync,
};

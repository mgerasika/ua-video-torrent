import { getImdbAllAsync } from './get-imdb-list.controller';
import { getImdbByIdAsync } from './get-imdb.controller';
import { postImdbAsync } from './post-imdb.controller';
import { putImdbAsync } from './put-imdb.controller';
import { deleteImdbAsync } from './delete-imdb.controller';
import { searchImdbMovieInfoAsync } from './search-imdb.controller';

export const imdb = {
    getImdbAllAsync,
    deleteImdbAsync,
    getImdbByIdAsync,
    postImdbAsync,
    putImdbAsync,
    searchImdbMovieInfoAsync,
};

import { getAllHurtomPagesAsync } from './get-hurtom-all.controller';
import { searchImdbMovieInfoAsync } from './search-imdb-movie-info.controller';
import { setupAsync } from './setup.controller';

export const tools = {
    getAllHurtomPagesAsync,
    searchImdbMovieInfoAsync,
    setupAsync: setupAsync,
};

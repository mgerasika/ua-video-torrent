import { IExpressRequest, IExpressResponse, app } from '@server/express-app';

import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../db.service';
import { ISearchMovieResponse } from './search-list-movie.controller';

export interface IGroupMovieResponse {
    enName: string;
    imdb_rating: number;
    poster: string;
    movies: ISearchMovieResponse[];
}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IGroupMovieResponse[], void> {}

app.get(API_URL.api.movie.groupSearch.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupSearchMoviesAsync();
    if (error) {
        res.status(400).send('error' + error);
    } else {
        res.send(data);
    }
});

export const groupSearchMoviesAsync = async (): Promise<[IGroupMovieResponse[] | undefined, any]> => {
    const [movies, error] = await dbService.movie.searchMoviesAsync();
    if (movies) {
        const unique = Object.keys(
            movies.reduce((acc: any, it) => {
                acc[it.en_name || ''] = it.en_name;
                return acc;
            }, {}),
        );

        const data = unique
            .map((key) => {
                const filteredMovies = movies.filter((m) => m.en_name === key);
                const firstMovie = filteredMovies.length ? filteredMovies[0] : undefined;
                return {
                    enName: key,
                    imdb_rating: firstMovie?.imdb_rating || 0,
                    poster: firstMovie?.poster || '',
                    movies: filteredMovies,
                };
            })
            .sort((a, b) => b.imdb_rating - a.imdb_rating);

        return [data, undefined];
    }
    return [undefined, error];
};

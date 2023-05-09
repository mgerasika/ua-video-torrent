import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../../db.service';
import { ISearchMovieResponse } from '../search/get-search-list-movie.controller';
import { IMovieResponse } from '../get-movie-list.controller';
import { IQueryReturn } from '@server/utils/to-query.util';

export interface IGroupMovieResponse {
    enName: string;
    imdb_original_id: string;
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
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const groupSearchMoviesAsync = async (): Promise<IQueryReturn<IGroupMovieResponse[]>> => {
    const [movies, error] = await dbService.movie.searchMoviesAsync();

    if (movies) {
        const unique = Object.keys(
            movies.reduce((acc: any, it: any) => {
                acc[it.en_name || ''] = it.en_name;
                return acc;
            }, {}),
        );

        const data = unique
            .map((key) => {
                const filteredMovies = movies.filter((m: IMovieResponse) => m.en_name === key);
                const firstMovie = filteredMovies.length ? filteredMovies[0] : undefined;
                return {
                    imdb_original_id: firstMovie?.imdb_original_id,
                    enName: key,
                    imdb_rating: firstMovie?.imdb_rating || 0,
                    poster: firstMovie?.poster || '',
                    movies: filteredMovies,
                } as IGroupMovieResponse;
            })
            .sort((a, b) => b.imdb_rating - a.imdb_rating);

        return [data as unknown as IGroupMovieResponse[]];
    } else {
        return [undefined, error as string];
    }
};

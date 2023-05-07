import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../db.service';
import { IGroupMovieResponse } from './group-search-movie.controller';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IGroupMovieResponse, void> {}

app.get(API_URL.api.movie.groupSearch.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupSearchMovieByIdAsync(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    } else {
        res.send(data);
    }
});

export const groupSearchMovieByIdAsync = async (en_name: string): Promise<[IGroupMovieResponse | undefined, any]> => {
    const [movies, error] = await dbService.movie.searchMoviesAsync();
    if (movies) {
        const filteredMovies = movies.filter((m) => m.en_name === en_name).sort((a, b) => a.size - b.size);

        const firstMovie = filteredMovies.length ? filteredMovies[0] : undefined;
        const data: IGroupMovieResponse = {
            enName: firstMovie?.en_name || '',
            imdb_rating: firstMovie?.imdb_rating || 0,
            poster: firstMovie?.poster || '',
            movies: filteredMovies,
        };

        return [data, undefined];
    }
    return [undefined, error];
};

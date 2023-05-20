import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IGroupMovieResponse } from './get-group-search-movie-list.controller';
import { IQueryReturn } from '@server/utils/to-query.util';
import { dbService } from '../db.service';

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

app.get(API_URL.api.groupMovie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupSearchMovieByIdAsync(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const groupSearchMovieByIdAsync = async (imdb_id: string): Promise<IQueryReturn<IGroupMovieResponse>> => {
    const [movies, error] = await dbService.movie.searchMoviesAsync();
    if (movies) {
        const filteredMovies = movies.filter((m) => m.hurtom_imdb_id === imdb_id).sort((a, b) => a.size - b.size);

        const firstMovie = filteredMovies.length ? filteredMovies[0] : undefined;
        const data: IGroupMovieResponse = {
            imdb_original_id: firstMovie?.hurtom_imdb_id || '',
            enName: firstMovie?.en_name || '',
            imdb_rating: firstMovie?.imdb_rating || 0,
            poster: firstMovie?.poster || '',
            movies: filteredMovies,
        };

        return [data, undefined];
    }
    return [undefined, error];
};

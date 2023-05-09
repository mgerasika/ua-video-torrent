import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../../db.service';
import { IGroupMovieResponse } from './get-group-search-movie-list.controller';
import { IQueryReturn } from '@server/utils/to-query.util';

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
    }
    return res.send(data);
});

export const getGroupId = (en_name: string) => en_name.replace(/[^a-zA-Z0-9]/g, '') || '';

export const groupSearchMovieByIdAsync = async (group_id: string): Promise<IQueryReturn<IGroupMovieResponse>> => {
    const [movies, error] = await dbService.movie.searchMoviesAsync();
    if (movies) {
        const filteredMovies = movies.filter((m) => getGroupId(m.en_name) === group_id).sort((a, b) => a.size - b.size);

        const firstMovie = filteredMovies.length ? filteredMovies[0] : undefined;
        const data: IGroupMovieResponse = {
            group_id: getGroupId(firstMovie?.en_name || ''),
            enName: firstMovie?.en_name || '',
            imdb_rating: firstMovie?.imdb_rating || 0,
            poster: firstMovie?.poster || '',
            movies: filteredMovies,
        };

        return [data, undefined];
    }
    return [undefined, error];
};

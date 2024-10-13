import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { dbService } from '../db.service';
import { ISearchMovieResponse } from '../movie/search/get-search-list-movie.controller';
import { IMovieResponse } from '../movie/get-movie-list.controller';
import { IQueryReturn } from '@server/utils/to-query.util';

interface IGroupMovieItem extends Pick<ISearchMovieResponse, 'torrent_url' | 'title' | 'size'> {}
export interface IGroupMovieResponse {
    year: string;
    genre: string
    enName: string;
    uaName: string;
    imdb_id: string;
    imdb_rating: number;
    poster: string;
    movies: IGroupMovieItem[];
}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IGroupMovieResponse[], void> {}

app.get(API_URL.api.groupMovie.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await groupSearchMoviesAsync();
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const groupSearchMoviesAsync = async (): Promise<IQueryReturn<IGroupMovieResponse[]>> => {
    const [movies, error] = await dbService.movie.searchMoviesAsync();
    const [imdbs, imdbError] = await dbService.imdb.getImdbAllAsync();

    if (movies) {
        const unique = Object.keys(
            movies.reduce((acc: any, it: ISearchMovieResponse) => {
                acc[it.imdb_id || ''] = it.imdb_id;
                return acc;
            }, {}),
        );

        const data = unique
            .map((key): IGroupMovieResponse => {
                const filteredMovies = movies.filter((m: IMovieResponse) => m.imdb_id === key);
                const firstMovie = filteredMovies.length ? filteredMovies[0] : undefined;
                const imdb= imdbs?.find(imdb => imdb.id === firstMovie?.imdb_id);
                return {
                    imdb_id: firstMovie?.imdb_id || '',
                    enName: firstMovie?.en_name || '',
                    uaName: firstMovie?.ua_name || '',
                    year: imdb?.year + '',
                    genre: (imdb?.json as any)?.Genre,
                    imdb_rating: firstMovie?.imdb_rating || 0,
                    poster: firstMovie?.poster || '',
                    movies: filteredMovies.map((m) => {
                        return {
                            torrent_url: m.torrent_url,
                            title: m.title,
                            size: m.size
                        };
                    }),
                };
            })
            .sort((a, b) => b.imdb_rating - a.imdb_rating);

        return [data ];
    } else {
        return [undefined, error as string];
    }
};

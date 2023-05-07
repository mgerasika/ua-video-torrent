import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { sqlAsync } from '@server/utils/sql-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IImdbResponse } from '../imdb/get-imdb-list.controller';
import { IMovieResponse } from './get-movie-list.controller';

export interface ISearchMovieResponse extends IMovieResponse, Omit<IImdbResponse, 'json'> {}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<ISearchMovieResponse[], void> {}

app.get(API_URL.api.movie.search.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await searchMoviesAsync();
    if (error) {
        res.status(400).send('error' + error);
    } else {
        res.send(data);
    }
});

export const searchMoviesAsync = async () => {
    // return typeOrmAsync<ISearchMovie[]>(async (client) => {
    //     const rows = await client
    //         .getRepository(MovieDto)
    //         .createQueryBuilder('movie')
    //         .leftJoin(ImdbDto, 'imdb', 'imdb.id = movie.imdb_id')
    //         .select(['movie', 'imdb.imdb_rating', 'imdb.poster'])
    //         .getMany();
    //     return rows.map((row: any) => {
    //         return {
    //             ...row,
    //             imdb_rating: +row.imdb_rating,
    //         } as ISearchMovie;
    //     });
    // });

    return sqlAsync<ISearchMovieResponse[]>(async (client) => {
        const { rows } = await client.query(`SELECT public.movie.*, imdb.poster, imdb.imdb_rating
FROM public.movie
LEFT JOIN public.imdb
    ON movie.imdb_id = imdb.id
where movie.imdb_id is not null
ORDER BY imdb.imdb_rating DESC, movie.en_name`);
        return rows.map((row: any) => {
            return {
                ...row,
                imdb_rating: +row.imdb_rating,
            } as ISearchMovieResponse;
        });
    });
};

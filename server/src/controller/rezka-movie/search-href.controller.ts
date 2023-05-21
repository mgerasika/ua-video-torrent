import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { sqlAsync } from '@server/utils/sql-async.util';
import { API_URL } from '@server/constants/api-url.constant';

export interface ISearchRezkaMovieResponse {
    href: string;
    rezka_imdb_id: string;
    id: string;
}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<ISearchRezkaMovieResponse[], void> {}

app.get(API_URL.api.rezkaMovie.searchRezkaWithoutStream.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await searchRezkaMoviesWithoutStreamsAsync();
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const searchRezkaMoviesWithoutStreamsAsync = async () => {
    return sqlAsync<ISearchRezkaMovieResponse[]>(async (client) => {
        const { rows } =
            await client.query(`select distinct rezka_movie.href, rezka_movie.rezka_imdb_id, rezka_movie.id FROM rezka_movie
	inner join movie on rezka_movie.rezka_imdb_id = movie.imdb_id
	where rezka_movie.rezka_imdb_id not in (select imdb_id from stream)`);
        return rows;
    });
};

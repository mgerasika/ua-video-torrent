import { MovieDto } from '@server/dto/movie.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';

export interface IMovieResponse {
    imdb_id: string;
    id: string;
    en_name: string;
    ua_name: string;
    href: string;
    year: number;
    title: string;
    download_id: string;
    size: number;
    aws_s3_torrent_url: string;
}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IMovieResponse[], void> {}

app.get(API_URL.api.movie.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getMoviesAllAsync();
    if (error) {
        res.status(400).send('error' + error);
    } else {
        res.send(data);
    }
});

export const getMoviesAllAsync = async () => {
    return typeOrmAsync<MovieDto[]>(async (client) => {
        return await client.getRepository(MovieDto).find();
    });
};

import { MovieDto } from '@server/dto/movie.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IMovieResponse, getMoviesAllAsync } from './get-movie-list.controller';

export interface IPostMovieBody extends Omit<IMovieResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPostMovieBody;
}

interface IResponse extends IExpressResponse<IMovieResponse[], void> {}

app.post(API_URL.api.movie.toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await postMovieAsync(req.body);
    if (error) {
        res.status(400).send('error' + error);
    } else {
        const [data] = await getMoviesAllAsync();
        res.send(data);
    }
});

export const postMovieAsync = async (data: Omit<MovieDto, 'id'>) => {
    return typeOrmAsync<MovieDto>(async (client) => {
        return [await client.getRepository(MovieDto).save(data)];
    });
};

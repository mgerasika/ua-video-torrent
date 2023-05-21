import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IRezkaMovieResponse, getRezkaMoviesAllAsync } from './get-rezka-movie-list.controller';
import { RezkaMovieDto } from '@server/dto/rezka-movie.dto';

export interface IPostRezkaMovieBody extends Omit<IRezkaMovieResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPostRezkaMovieBody;
}

interface IResponse extends IExpressResponse<IRezkaMovieResponse[], void> {}

app.post(API_URL.api.rezkaMovie.toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await postRezkaMovieAsync(req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }
    const [data] = await getRezkaMoviesAllAsync();
    return res.send(data);
});

export const postRezkaMovieAsync = async (data: Omit<RezkaMovieDto, 'id' | 'get_imdb_id'>) => {
    return typeOrmAsync<RezkaMovieDto>(async (client) => {
        return [await client.getRepository(RezkaMovieDto).save(data)];
    });
};

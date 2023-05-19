import { MovieDto } from '@server/dto/movie.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IRezkaMovieResponse, getRezkaMoviesAllAsync } from './get-rezka-movie-list.controller';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IRezkaMovieResponse[], void> {}

app.delete(API_URL.api.rezka_movie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await deleteRezkaMovieAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    const [data] = await getRezkaMoviesAllAsync();
    return res.send(data);
});

export const deleteRezkaMovieAsync = async (id: string) => {
    return typeOrmAsync<MovieDto>(async (client) => {
        const entityToDelete = await client.getRepository(MovieDto).findOne({ where: { id } });
        if (!entityToDelete) {
            return [undefined, 'entity not found'];
        }
        return [await client.getRepository(MovieDto).remove(entityToDelete)];
    });
};

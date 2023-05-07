import { MovieDto } from '@server/dto/movie.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IMovieResponse, getMoviesAllAsync } from './get-movie-list.controller';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IMovieResponse[], void> {}

app.delete(API_URL.api.movie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await deleteMovieAsync(req.params.id);
    if (error) {
        res.status(400).send('error' + error);
    } else {
        const [data] = await getMoviesAllAsync();
        res.send(data);
    }
});

export const deleteMovieAsync = async (id: string) => {
    return typeOrmAsync<MovieDto>(async (client) => {
        const entityToDelete = await client.getRepository(MovieDto).findOne({ where: { id } });
        if (!entityToDelete) {
            throw 'entity not found';
        }
        return await client.getRepository(MovieDto).remove(entityToDelete);
    });
};

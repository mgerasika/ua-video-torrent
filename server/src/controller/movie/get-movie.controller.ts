import { MovieDto } from '@server/dto/movie.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IMovieResponse } from './get-movie-list.controller';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IMovieResponse, void> {}

app.get(API_URL.api.movie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getMovieByIdAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getMovieByIdAsync = async (id: string) => {
    return typeOrmAsync<MovieDto>(async (client) => {
        const entity = await client.getRepository(MovieDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};

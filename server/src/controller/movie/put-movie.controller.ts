import { MovieDto } from '@server/dto/movie.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { getMovieByIdAsync } from './get-movie.controller';
import { IMovieResponse } from './get-movie-list.controller';

export interface IPutMovieBody extends Omit<IMovieResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPutMovieBody;
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IMovieResponse, void> {}

app.put(API_URL.api.movie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await putMovieAsync(req.params.id, req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }

    const [data] = await getMovieByIdAsync(req.params.id);
    return res.send(data);
});

export const putMovieAsync = async (id: string, data: Omit<MovieDto, 'id' | 'get_imdb_id'>) => {
    if (data.hurtom_imdb_id && !data.hurtom_imdb_id.startsWith('tt')) {
        return [, 'id should start from tt symbol'];
    }
    return typeOrmAsync<MovieDto>(async (client) => {
        const entityToUpdate = await client.getRepository(MovieDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(MovieDto).save({ ...entityToUpdate, ...data })];
    });
};

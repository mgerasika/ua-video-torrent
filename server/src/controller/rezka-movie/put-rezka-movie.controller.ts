import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { getRezkaMovieByIdAsync } from './get-rezka-movie.controller';
import { IRezkaMovieResponse } from './get-rezka-movie-list.controller';
import { RezkaMovieDto } from '@server/dto/rezka-movie.dto';

export interface IPutRezkaMovieBody extends Omit<IRezkaMovieResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPutRezkaMovieBody;
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IRezkaMovieResponse, void> {}

app.put(API_URL.api.rezkaMovie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await putRezkaMovieAsync(req.params.id, req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }

    const [data] = await getRezkaMovieByIdAsync(req.params.id);
    return res.send(data);
});

export const putRezkaMovieAsync = async (id: string, data: Omit<Partial<RezkaMovieDto>, 'id' | 'get_imdb_id'>) => {
    return typeOrmAsync<RezkaMovieDto>(async (client) => {
        const entityToUpdate = await client.getRepository(RezkaMovieDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(RezkaMovieDto).save({ ...entityToUpdate, ...data })];
    });
};

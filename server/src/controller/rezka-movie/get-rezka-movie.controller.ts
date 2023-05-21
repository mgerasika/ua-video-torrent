import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IRezkaMovieResponse } from './get-rezka-movie-list.controller';
import { RezkaMovieDto } from '@server/dto/rezka-movie.dto';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IRezkaMovieResponse, void> {}

app.get(API_URL.api.rezkaMovie.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getRezkaMovieByIdAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getRezkaMovieByIdAsync = async (id: string) => {
    return typeOrmAsync<RezkaMovieDto>(async (client) => {
        const entity = await client.getRepository(RezkaMovieDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};

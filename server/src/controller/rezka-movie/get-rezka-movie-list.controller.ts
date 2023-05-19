import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { ERezkaVideoType, RezkaMovieDto } from '@server/dto/rezka-movie.dto';

export interface IRezkaMovieResponse {
    id: string;
    en_name: string;
    href: string;
    url_id: string;
	year: number;
	video_type: ERezkaVideoType;
}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IRezkaMovieResponse[], void> {}

app.get(API_URL.api.rezka_movie.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getRezkaMoviesAllAsync();
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getRezkaMoviesAllAsync = async () => {
    return typeOrmAsync<RezkaMovieDto[]>(async (client) => {
        return [await client.getRepository(RezkaMovieDto).find()];
    });
};

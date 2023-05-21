import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IStreamDto, StreamDto } from '@server/dto/stream.dto';

export interface IStreamResponse extends IStreamDto {}

interface IRequest extends IExpressRequest {
    query: {
        imdb_id?: string;
    };
}

interface IResponse extends IExpressResponse<IStreamResponse[], void> {}

app.get(API_URL.api.stream.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getStreamAllAsync(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getStreamAllAsync = async (query: IRequest['query']) => {
    return typeOrmAsync<StreamDto[]>(async (client) => {
        const qb = client.getRepository(StreamDto).createQueryBuilder('stream').select('*');
        if (query.imdb_id) {
            qb.where('stream.imdb_id = :imdb_id', { imdb_id: query.imdb_id });
        }
        return [await qb.getRawMany()];
    });
};

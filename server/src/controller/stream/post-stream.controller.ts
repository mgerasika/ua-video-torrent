import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IStreamResponse, getStreamAllAsync } from './get-stream-list.controller';
import { StreamDto } from '@server/dto/stream.dto';

export interface IPostRezkaMovieBody extends Omit<IStreamResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPostRezkaMovieBody;
}

interface IResponse extends IExpressResponse<IStreamResponse[], void> {}

app.post(API_URL.api.stream.toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await postStreamAsync(req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }
    const [data] = await getStreamAllAsync({});
    return res.send(data);
});

export const postStreamAsync = async (data: Omit<StreamDto, 'id' | 'imdb_id'>) => {
    return typeOrmAsync<StreamDto>(async (client) => {
        return [await client.getRepository(StreamDto).save(data)];
    });
};

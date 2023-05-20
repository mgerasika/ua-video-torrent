import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { getStreamByIdAsync } from './get-stream.controller';
import { IStreamResponse } from './get-stream-list.controller';
import { StreamDto } from '@server/dto/stream.dto';

export interface IPutRezkaMovieBody extends Omit<IStreamResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IPutRezkaMovieBody;
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IStreamResponse, void> {}

app.put(API_URL.api.stream.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await putStreamAsync(req.params.id, req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }

    const [data] = await getStreamByIdAsync(req.params.id);
    return res.send(data);
});

export const putStreamAsync = async (id: string, data: Omit<Partial<StreamDto>, 'id'>) => {
    return typeOrmAsync<StreamDto>(async (client) => {
        const entityToUpdate = await client.getRepository(StreamDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(StreamDto).save({ ...entityToUpdate, ...data })];
    });
};

import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IStreamResponse, getStreamAllAsync } from './get-stream-list.controller';
import { StreamDto } from '@server/dto/stream.dto';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IStreamResponse[], void> {}

app.delete(API_URL.api.stream.id().toString(), async (req: IRequest, res: IResponse) => {
    const [, error] = await deleteStreamAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    const [data] = await getStreamAllAsync({});
    return res.send(data);
});

export const deleteStreamAsync = async (id: string) => {
    return typeOrmAsync<StreamDto>(async (client) => {
        const entityToDelete = await client.getRepository(StreamDto).findOne({ where: { id } });
        if (!entityToDelete) {
            return [undefined, 'entity not found'];
        }
        return [await client.getRepository(StreamDto).remove(entityToDelete)];
    });
};

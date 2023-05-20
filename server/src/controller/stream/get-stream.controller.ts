import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IStreamResponse } from './get-stream-list.controller';
import { StreamDto } from '@server/dto/stream.dto';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IStreamResponse, void> {}

app.get(API_URL.api.stream.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getStreamByIdAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getStreamByIdAsync = async (id: string) => {
    return typeOrmAsync<StreamDto>(async (client) => {
        const entity = await client.getRepository(StreamDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};

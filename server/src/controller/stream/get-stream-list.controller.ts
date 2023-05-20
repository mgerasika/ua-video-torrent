import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IStreamDto, StreamDto } from '@server/dto/stream.dto';

export interface IStreamResponse extends IStreamDto {}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IStreamResponse[], void> {}

app.get(API_URL.api.stream.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getStreamAllAsync();
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getStreamAllAsync = async () => {
    return typeOrmAsync<StreamDto[]>(async (client) => {
        return [await client.getRepository(StreamDto).find()];
    });
};

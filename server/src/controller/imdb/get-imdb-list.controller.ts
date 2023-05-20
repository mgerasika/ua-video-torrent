import { IImdbDto, ImdbDto } from '@server/dto/imdb.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';

export interface IImdbResponse extends IImdbDto {}

interface IRequest extends IExpressRequest {
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IImdbResponse[], void> {}

app.get(API_URL.api.imdb.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getImdbAllAsync();
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getImdbAllAsync = async () => {
    return typeOrmAsync<ImdbDto[]>(async (client) => {
        return [await client.getRepository(ImdbDto).find()];
    });
};

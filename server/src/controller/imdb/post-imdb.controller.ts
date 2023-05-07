import { ImdbDto } from '@server/dto/imdb.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IImdbResponse } from './get-imdb-list.controller';

interface IPostImdbBody extends Omit<IImdbResponse, 'id'> {}
interface IRequest extends IExpressRequest {
    body: IPostImdbBody;
}

interface IResponse extends IExpressResponse<IImdbResponse, void> {}

app.post(API_URL.api.imdb.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await postImdbAsync(req.body);
    if (error) {
        res.status(400).send('error' + error);
    } else {
        res.send(data);
    }
});

export const postImdbAsync = async (data: Omit<ImdbDto, 'id'>) => {
    return typeOrmAsync<ImdbDto>(async (client) => {
        return await client.getRepository(ImdbDto).save(data);
    });
};

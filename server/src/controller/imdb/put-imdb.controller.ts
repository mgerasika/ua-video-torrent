import { ImdbDto } from '@server/dto/imdb.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IImdbResponse } from './get-imdb-list.controller';

interface IPutImdbBody extends Omit<IImdbResponse, 'id'> {}
interface IRequest extends IExpressRequest {
    body: IPutImdbBody;
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IImdbResponse, void> {}

app.put(API_URL.api.imdb.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await putImdbAsync(req.params.id, req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const putImdbAsync = async (id: string, data: Omit<ImdbDto, 'id'>) => {
    return await typeOrmAsync<ImdbDto>(async (client) => {
        const entityToUpdate = await client.getRepository(ImdbDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(ImdbDto).save({ ...entityToUpdate, ...data })];
    });
    [];
};

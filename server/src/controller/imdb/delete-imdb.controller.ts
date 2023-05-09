import { API_URL } from '@server/constants/api-url.constant';
import { ImdbDto } from '@server/dto/imdb.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { IImdbResponse } from '@server/controller/imdb/get-imdb-list.controller';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IImdbResponse, void> {}

app.delete(API_URL.api.imdb.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await deleteImdbAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const deleteImdbAsync = async (id: string) => {
    return typeOrmAsync<ImdbDto>(async (client) => {
        const entityToDelete = await client.getRepository(ImdbDto).findOne({ where: { id } });
        if (!entityToDelete) {
            return [, 'entity not found'];
        }
        return [await client.getRepository(ImdbDto).remove(entityToDelete)];
    });
};

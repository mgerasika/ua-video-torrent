import { ImdbDto } from '@server/dto/imdb.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { IImdbResponse } from '@server/controller/imdb/get-imdb-list.controller';

interface IRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<IImdbResponse, void> {}

app.get(API_URL.api.imdb.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getImdbByIdAsync(req.params.id);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getImdbByIdAsync = async (id: string) => {
    return typeOrmAsync<ImdbDto>(async (client) => {
        const entity = await client.getRepository(ImdbDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};

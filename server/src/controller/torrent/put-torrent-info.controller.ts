import { MovieDto } from '@server/dto/movie.dto';
import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { ITorrentInfoResponse } from './get-torrent-info.controller';
import { TorrentInfoDto } from '@server/dto/torrent-info';

interface IRequest extends IExpressRequest {
    body: ITorrentInfoResponse;
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.put(API_URL.api.torrent.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await putTorrentInfoAsync(req.params.id, req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }

    return res.send(data);
});

export const putTorrentInfoAsync = async (id: string, data: ITorrentInfoResponse) => {
    return typeOrmAsync<TorrentInfoDto>(async (client) => {
        return [await client.getRepository(TorrentInfoDto).save<TorrentInfoDto>({ id: id, num_peers: data.peers })];
    });
};

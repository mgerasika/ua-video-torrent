import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../parser/get-hurtom-all.controller';
import fs from 'fs';
import { dbService } from '../db.service';
import { cdnService } from '../cdn/cdn.service';
import WebTorrent from 'webtorrent';

interface ITorrentInfo {
    peers: number;
}
interface IRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<ITorrentInfo, void> {}

app.get(API_URL.api.torrent.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getTorrentInfo({ id: req.params.id });
    if (error) {
        return res.status(400).send(error);
    }

    return res.send(data);
});

export const getTorrentInfo = async ({ id }: { id: string }): Promise<IQueryReturn<ITorrentInfo>> => {
    const [, torrentError] = await dbService.cdn.getFromCDNAsync({ fileName: `${id}.torrent` });
    if (torrentError) {
        return [, torrentError];
    }
    return await toQueryPromise((resolve, reject) => {
        const client = new WebTorrent();
        client.add(cdnService.cdnFile(`${id}.torrent`), (torrent: any) => {
            const numSeeders = torrent.numPeers;
            console.log('Number of Seeders', torrent.numPeers);
            resolve({ peers: torrent.numPeers as unknown as number });
        });
    });
};

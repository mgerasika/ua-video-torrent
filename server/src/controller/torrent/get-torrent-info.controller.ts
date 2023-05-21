import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
import { HURTOM_HEADERS } from '../parser/hurtom-all.controller';
import fs from 'fs';
import { dbService } from '../db.service';
import { cdnService } from '../cdn/cdn.service';
import WebTorrent from 'webtorrent';

export interface ITorrentInfoResponse {
    peers: number;
}
interface IRequest {
    params: {
        id: string;
    };
}

interface IResponse extends IExpressResponse<ITorrentInfoResponse, void> {}

app.get(API_URL.api.torrent.id().toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getTorrentInfoAsync({ id: req.params.id });
    if (error) {
        return res.status(400).send(error);
    }

    return res.send(data);
});

export const getTorrentInfoAsync = async ({ id }: { id: string }): Promise<IQueryReturn<ITorrentInfoResponse>> => {
    const [, torrentError] = await dbService.cdn.getFromCDNAsync({ fileName: `${id}.torrent` });
    if (torrentError) {
        return [, torrentError];
    }
    return await toQueryPromise((resolve, reject) => {
        const client = new WebTorrent();
        client.add(cdnService.cdnFile(`${id}.torrent`), (torrent: any) => {
            const numSeeders = torrent.numPeers;
            // resolve({ peers: torrent.numPeers as unknown as number });
        });

        client.on('torrent', (torrent: any) => {
            console.log('torrent');
            console.log('Client is downloading:', torrent);
            resolve({ peers: torrent.numPeers });
        });

        client.on('error', function (err) {
            reject(err);
        });
    });
};

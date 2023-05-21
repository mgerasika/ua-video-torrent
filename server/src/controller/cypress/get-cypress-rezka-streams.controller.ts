import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
import { rejects } from 'assert';
const cypress = require('cypress');

export interface IVideoInfoResult {
    en_name: string;
    year: number;
    url: string;
    imdb_rezka_relative_link: string;
    translations: ITranslation[];
}

export interface ITranslation {
    resolutions: IResolutionItem[];
    translation: string;
}

export interface IResolutionItem {
    resolution: string;
    streams: string[];
}

interface IRequest extends IExpressRequest {
    body: {
        href: string;
    };
    query: {
        page?: number;
        limit: number;
    };
}

interface IResponse extends IExpressResponse<IVideoInfoResult, void> {}

app.get(API_URL.api.cypress.streams.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getCypressRezkaStreamsAsync(decodeURIComponent(req.body.href));
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const getCypressRezkaStreamsAsync = async (href: string): Promise<IQueryReturn<IVideoInfoResult>> => {
    return toQueryPromise<IVideoInfoResult>((resolve, reject) => {
        cypress
            .run({
                env: {
                    CYPRESS_NO_COMMAND_LOG: 1,
                    URL: href,
                },
                spec: './cypress/integration/get-rezka-streams.spec.ts',
            })
            .then((results: any) => {
                try {
                    resolve(JSON.parse(results.runs[0].tests[0].attempts[0].error.message));
                } catch (ex) {
                    reject('error when try got error from test ' + JSON.stringify(results, null, 2));
                }
            })
            .catch((err: any) => {
                reject('error when execute test ' + err);
            });
    });
};

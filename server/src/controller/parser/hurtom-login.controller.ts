import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IQueryReturn, toQuery } from '@server/utils/to-query.util';
import { rejects } from 'assert';
import { HURTOM_HEADERS } from './hurtom-all.controller';

const cheerio = require('cheerio');

export interface IHurtomLoginResponse {
    status: string;
    cookies: string[];
}

interface IRequest extends IExpressRequest {
   
}

interface IResponse extends IExpressResponse<IHurtomLoginResponse, void> {}

app.post(API_URL.api.parser.hurtomLogin.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await hurtomLoginAsync();
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const hurtomLoginAsync = async (): Promise<IQueryReturn<IHurtomLoginResponse>> => {
    // mgerasika@gmail.com
    // o4jbfv30
    const url = `https://toloka.to/login.php`;
    const fd = new FormData();
    fd.append('username', 'mgerasika@gmail.com');
    fd.append('password', 'o4jbfv30');
    fd.append('autologin', 'on');
    fd.append('ssl', 'on');
    fd.append('redirect', 'index.php?');
    fd.append('login', 'Вхід');
    const [response, error] = await toQuery(() => axios.post(url, fd, {headers: HURTOM_HEADERS,  withCredentials: true,}, ));
    if (error) {
        return [undefined, error];
    }
    const cookies = response?.headers['set-cookie'] || [];
    return [
        {
            status: response?.statusText || '',
            cookies: cookies
        },
    ];
};

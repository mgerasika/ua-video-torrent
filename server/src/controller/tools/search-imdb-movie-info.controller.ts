import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';

export interface IImdbResultResponse {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: IImdbRating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
}

export interface IImdbRating {
    Source: string;
    Value: string;
}

interface ISearchImdbBody {
    enName: string;
    year: string;
}
interface IRequest extends IExpressRequest {
    body: ISearchImdbBody;
}

interface IError {
    message: string;
    code: string;
}
interface IResponse extends IExpressResponse<IImdbResultResponse, IError> {}

app.post(API_URL.api.tools.searchImdbInfo.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await searchImdbMovieInfoAsync(req.body.enName, req.body.year);
    if (error) {
        res.status(400).send();
    } else {
        res.send(data);
    }
});

export const searchImdbMovieInfoAsync = async (
    enMovieName: string,
    year: string,
): Promise<[IImdbResultResponse | undefined, string | undefined]> => {
    // const apiKey1 = '1768a885'; //mgerasika@gmail.com
    // const apiKey2 = 'f06cfff4'; //mger@ciklum.com
    const apiKey3 = '7a355028'; //oddbox.cypress@gmail.com
    if (!enMovieName) {
        throw Error('Empty movie');
    }
    return axios({
        method: 'get',
        url: 'http://www.omdbapi.com/',
        params: {
            apikey: apiKey3,
            t: enMovieName,
            y: year,
            type: 'movie', // вказуємо, що шукаємо фільм
        },
    }).then((r: any) => {
        const data = r.data;
        if (data.Response === 'False') {
            return [undefined, 'error'];
        }
        return [data, undefined];
    });
};

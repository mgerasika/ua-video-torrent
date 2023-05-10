import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IImdbResponse, getImdbAllAsync } from '../imdb/get-imdb-list.controller';
import { postImdbAsync } from '../imdb/post-imdb.controller';
import { getMoviesAllAsync } from '../movie/get-movie-list.controller';
import { putMovieAsync } from '../movie/put-movie.controller';
import { MovieDto } from '@server/dto/movie.dto';
import { dbService } from '../db.service';
import Joi from 'joi';
import { validateSchema } from '@server/utils/validate-schema.util';
import { IImdbResultResponse } from '../imdb/search-imdb.controller';
import { createLogs } from '@server/utils/create-logs.utils';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';
import { movie } from '../movie';
import { IQueryReturn } from '@server/utils/to-query.util';

export interface ISetupBody {
    updateHurtom: boolean;
    updateImdb: boolean;
    uploadToCdn: boolean;
    searchImdb: boolean;
    searchImdbIdInHurtom: boolean;
    uploadTorrentToS3FromMovieDB: boolean;
}

interface IRequest extends IExpressRequest {
    body: ISetupBody;
}

interface IResponse extends IExpressResponse<string[], void> {}

const schema = Joi.object<ISetupBody>({
    updateHurtom: Joi.boolean().required(),
    updateImdb: Joi.boolean().required(),
    uploadTorrentToS3FromMovieDB: Joi.boolean().required(),
    uploadToCdn: Joi.boolean().required(),
    searchImdb: Joi.boolean().required(),
    searchImdbIdInHurtom: Joi.boolean().required(),
});

app.post(API_URL.api.tools.setup.toString(), async (req: IRequest, res: IResponse) => {
    const [, validateError] = validateSchema(schema, req.body);
    if (validateError) {
        return res.status(400).send(validateError);
    }

    const [logs, setupError] = await setupAsync(req.body);
    if (setupError) {
        return res.status(400).send(setupError);
    }
    return res.send(logs);
});

export const setupAsync = async ({
    updateHurtom,
    updateImdb,
    uploadTorrentToS3FromMovieDB,
    uploadToCdn,
    searchImdb,
    searchImdbIdInHurtom,
}: ISetupBody): Promise<IQueryReturn<string[]>> => {
    const logs = createLogs();

    const [movies = []] = await getMoviesAllAsync();
    if (updateHurtom) {
        const [hurtomItems = [], hurtomError] = await dbService.parser.getAllHurtomPagesAsync();
        if (hurtomError) {
            logs.push(`hurtom items error`, hurtomError);
            return [undefined, logs.get() as any];
        } else {
            logs.push(`hurtom items success count=${hurtomItems?.length}`);
        }

        await oneByOneAsync(hurtomItems, async (hurtomItem) => {
            const movie = movies?.find((movie) => movie.href === hurtomItem.href);
            if (!movie) {
                const [, postError] = await dbService.movie.postMovieAsync({
                    en_name: hurtomItem.enName,
                    href: hurtomItem.href,
                    title: hurtomItem.id,
                    ua_name: hurtomItem.uaName,
                    year: +hurtomItem.year,
                    download_id: hurtomItem.downloadId,
                    aws_s3_torrent_url: '',
                    size: hurtomItem.size,
                });
                if (postError) {
                    return logs.push(`post movie error ${hurtomItem.id} error=${postError}`);
                }
                logs.push(`post movie success ${hurtomItem.id} `);
            } else if (!movie.download_id) {
                const [, putError] = await dbService.movie.putMovieAsync(movie.id, {
                    ...movie,
                    size: hurtomItem.size,
                    download_id: hurtomItem.downloadId,
                });
                if (putError) {
                    return logs.push(`put movie error ${hurtomItem.id} error=${putError}`);
                }
                logs.push(`put movie success ${hurtomItem.id} `);
            }
        });
    }

    if (uploadTorrentToS3FromMovieDB) {
        await oneByOneAsync(
            movies.filter((m) => m.download_id === '142850' && !m.aws_s3_torrent_url && m.download_id),
            async (movie) => {
                const [hasFile] = await dbService.s3.hasFileS3Async({ id: movie.download_id });
                if (hasFile) {
                    return;
                }
                const [successUpload, errorUpload] = await dbService.s3.uploadFileToAmazonAsync({
                    id: movie.download_id,
                });
                if (errorUpload) {
                    return logs.push(`error upload to s3`, errorUpload);
                }

                logs.push(`success upload to s3`, movie.download_id);
                await dbService.movie.putMovieAsync(movie.id, {
                    ...movie,
                    aws_s3_torrent_url: successUpload as string,
                });
            },
        );
    }

    if (uploadToCdn) {
        await oneByOneAsync(
            movies.filter((movie) => !movie.aws_s3_torrent_url && movie.download_id),
            async (movie) => {
                const fileName = `${movie.download_id}.torrent`;
                const [hasFile] = await dbService.cdn.hasFileCDNAsync({ fileName: fileName });
                if (hasFile) {
                    return;
                }
                const [successUpload, errorUpload] = await dbService.cdn.uploadFileToCDNAsync({
                    fileName: fileName,
                    hurtomId: movie.download_id,
                });
                if (errorUpload) {
                    return logs.push(`error upload to cdn`, errorUpload);
                }
                logs.push(`success upload to cdn`, movie.download_id);
                await dbService.movie.putMovieAsync(movie.id, {
                    ...movie,
                    aws_s3_torrent_url: successUpload || '',
                });
            },
        );
    }

    if (searchImdbIdInHurtom) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();

        await oneByOneAsync(
            movies.filter((movieItem) => !movieItem.imdb_original_id || !movieItem.imdb_id),
            async (movieItem) => {
                let imdbInfo = imdbInfoItems.find(
                    (imdbItem) =>
                        imdbItem.en_name === movieItem.en_name || imdbItem.original_id === movieItem.imdb_original_id,
                );
                if (imdbInfo) {
                    return;
				}
                const [hurtomDetails, hurtomError] = await dbService.parser.getHurtomPageByIdAsync(movieItem.href || '');
                if (hurtomError) {
                    return logs.push(`hurtom info by id not found ${movieItem.en_name} error=${hurtomError}`);
                }
                if (hurtomDetails?.imdb_original_id) {
                    logs.push('found imdbId on hurtom site ', hurtomDetails.imdb_original_id);

                    imdbInfo = imdbInfoItems.find((imdbItem) => imdbItem.original_id === hurtomDetails.imdb_original_id);
                    if (imdbInfo) {
                        const [, putMovieError] = await dbService.movie.putMovieAsync(movieItem.id, {
                            ...movieItem,
                            imdb: imdbInfo,
                            imdb_original_id: imdbInfo?.original_id,
                        });
                        if (putMovieError) {
                            return logs.push(`put movie imdb_id error ${movieItem.id} error=${putMovieError}`);
                        }
                        logs.push(`put movie imdb_id success ${movieItem.id} `);
                    }
                }
            },
        );
    }

    if (searchImdb) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();

        await oneByOneAsync(
            movies.filter((movieItem) => !movieItem.imdb_original_id || !movieItem.imdb_id),
            async (movieItem) => {
                const imdbInfo = imdbInfoItems.find(
                    (imdbItem) =>
                        imdbItem.en_name === movieItem.en_name || imdbItem.original_id === movieItem.imdb_original_id,
                );
                if (imdbInfo) {
                    return;
                }
                const [newImdbInfo, newImdbInfoError] = await dbService.imdb.searchImdbMovieInfoAsync(
                    movieItem.en_name,
                    movieItem.year + '',
                    movieItem.imdb_original_id,
                );
                if (newImdbInfoError) {
                    return logs.push(`imdb info not found ${movieItem.en_name} error=${newImdbInfoError}`);
                }

                if (newImdbInfo) {
                    const [, postImdbError] = await postImdbAsync({
                        en_name: newImdbInfo.Title,
                        imdb_rating: +newImdbInfo.imdbRating,
                        json: JSON.stringify(newImdbInfo),
                        poster: newImdbInfo.Poster,
                        year: +newImdbInfo.Year,
                        original_id: newImdbInfo.imdbID,
                    });
                    if (postImdbError) {
                        return logs.push(`imdb post error ${movieItem.en_name} imdbId = ${newImdbInfo.imdbID}`);
                    }
                    logs.push(`imdb post ${movieItem.en_name} imdbId = ${newImdbInfo.imdbID}`);
                }
            },
        );
    }

    if (updateImdb) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();
        logs.push('imdbInfoItems.length', imdbInfoItems.length);

        await oneByOneAsync(
            imdbInfoItems.filter((imdbInfo) => !imdbInfo.original_id),
            async (imdbInfo) => {
                const [, putError] = await dbService.imdb.putImdbAsync(imdbInfo.id, {
                    ...imdbInfo,
                    original_id: (JSON.parse(imdbInfo.json) as unknown as IImdbResultResponse).imdbID,
                });
                if (putError) {
                    return logs.push(`put imdb error ${imdbInfo.id} error=${putError}`);
                }
                logs.push(`put imdb success ${imdbInfo.id}`);
            },
        );

        await oneByOneAsync(
            movies.filter((movieItem) => !movieItem.imdb_original_id || !movieItem.imdb_id),
            async (movieItem) => {
                const imdbInfo = imdbInfoItems.find(
                    (imdbItem) =>
                        imdbItem.en_name === movieItem.en_name || imdbItem.original_id === movieItem.imdb_original_id,
                );
                if (!imdbInfo) {
                    return;
                }
                const [, putMovieError] = await dbService.movie.putMovieAsync(movieItem.id, {
                    ...movieItem,
                    imdb: imdbInfo,
                    imdb_original_id: imdbInfo.original_id,
                });
                if (putMovieError) {
                    return logs.push(`put movie imdb_id error ${movieItem.id} error=${putMovieError}`);
                }
                logs.push(`put movie imdb_id success ${movieItem.id} `);
            },
        );
    }

    return [logs.get(), undefined];
};

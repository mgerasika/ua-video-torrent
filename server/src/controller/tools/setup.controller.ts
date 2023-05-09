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
import { IImdbResultResponse } from './search-imdb-movie-info.controller';
import { createLogs } from '@server/utils/create-logs.utils';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';
import { movie } from '../movie';

export interface ISetupBody {
    updateHurtom: boolean;
    updateImdb: boolean;
    uploadToCdn: boolean;
    searchImdb: boolean;
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
});

app.post(API_URL.api.tools.setup.toString(), async (req: IRequest, res: IResponse) => {
    const [, validateError] = validateSchema(schema, req.body);
    if (validateError) {
        return res.status(400).send(validateError);
    }

    const [logs, error] = await setupAsync(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    res.send(logs);
});

export const setupAsync = async ({
    updateHurtom,
    updateImdb,
    uploadTorrentToS3FromMovieDB,
    uploadToCdn,
    searchImdb,
}: ISetupBody): Promise<[string[], any]> => {
    const logs = createLogs();

    const [movies = []] = await getMoviesAllAsync();
    if (updateHurtom) {
        const [hurtomItems = [], hurtomError] = await dbService.tools.getAllHurtomPagesAsync();
        if (hurtomError) {
            logs.push(`hurtom items error`, hurtomError);
            return Promise.reject(logs.get());
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
                    logs.push(`post movie error ${hurtomItem.id} error=${postError}`);
                } else {
                    logs.push(`post movie success ${hurtomItem.id} `);
                }
            } else if (!movie.download_id) {
                const [, putError] = await dbService.movie.putMovieAsync(movie.id, {
                    ...movie,
                    size: hurtomItem.size,
                    download_id: hurtomItem.downloadId,
                });
                if (putError) {
                    logs.push(`put movie error ${hurtomItem.id} error=${putError}`);
                } else {
                    logs.push(`put movie success ${hurtomItem.id} `);
                }
            }
            return Promise.resolve();
        });
    }

    if (uploadTorrentToS3FromMovieDB) {
        await oneByOneAsync(
            movies.filter((m) => m.download_id === '142850'),
            async (movie) => {
                if (!movie.aws_s3_torrent_url && movie.download_id) {
                    const [, hasFileError] = await dbService.s3.hasFileS3Async({ id: movie.download_id });
                    if (hasFileError) {
                        const [successUpload, errorUpload] = await dbService.s3.uploadFileToAmazonAsync({
                            hurtomDownloadId: movie.download_id,
                        });
                        if (successUpload) {
                            logs.push(`success upload to s3`, movie.download_id);
                        } else {
                            logs.push(`error upload to s3`, errorUpload);
                        }

                        if (successUpload) {
                            await dbService.movie.putMovieAsync(movie.id, {
                                ...movie,
                                aws_s3_torrent_url: successUpload,
                            });
                        }
                    } else {
                        await dbService.movie.putMovieAsync(movie.id, {
                            ...movie,
                            aws_s3_torrent_url: movie.download_id,
                        });
                    }
                } else if (!movie.download_id) {
                    await putMovieAsync(movie.id, {
                        ...movie,
                        aws_s3_torrent_url: '',
                    });
                }
                return Promise.resolve();
            },
        );
    }

    if (uploadToCdn) {
        await oneByOneAsync(movies, async (movie) => {
            if (!movie.download_id) {
                await putMovieAsync(movie.id, {
                    ...movie,
                    aws_s3_torrent_url: '',
                });
            } else if (!movie.aws_s3_torrent_url && movie.download_id) {
                const fileName = `${movie.download_id}.torrent`;
                const [, hasFileError] = await dbService.cdn.hasFileCDNAsync({ fileName: fileName });
                if (hasFileError) {
                    const [successUpload, errorUpload] = await dbService.cdn.uploadFileToCDNAsync({
                        fileName: fileName,
                        hurtomId: movie.download_id,
                    });
                    if (errorUpload) {
                        logs.push(`error upload to cdn`, errorUpload);
                    } else {
                        logs.push(`success upload to cdn`, movie.download_id);
                        await dbService.movie.putMovieAsync(movie.id, {
                            ...movie,
                            aws_s3_torrent_url: successUpload || '',
                        });
                    }
                }
            }
            return Promise.resolve();
        });
    }

    if (searchImdb) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();

        await oneByOneAsync(movies, async (movieItem) => {
            if (!movieItem.imdb_original_id || !movieItem.imdb_id) {
                const imdbInfo = imdbInfoItems.find(
                    (imdbItem) =>
                        imdbItem.en_name === movieItem.en_name || imdbItem.original_id === movieItem.imdb_original_id,
                );
                if (!imdbInfo) {
                    const [newImdbInfo, error] = await dbService.tools.searchImdbMovieInfoAsync(
                        movieItem.en_name,
                        movieItem.year + '',
                        movieItem.imdb_original_id,
                    );
                    if (newImdbInfo) {
                        const [dbImdbInfoWithId, postImdbError] = await postImdbAsync({
                            en_name: newImdbInfo.Title,
                            imdb_rating: +newImdbInfo.imdbRating,
                            json: JSON.stringify(newImdbInfo),
                            poster: newImdbInfo.Poster,
                            year: +newImdbInfo.Year,
                            original_id: newImdbInfo.imdbID,
                        });
                        if (postImdbError) {
                            logs.push(`imdb post error ${movieItem.en_name} imdbId = ${newImdbInfo.imdbID}`);
                        } else {
                            logs.push(`imdb post ${movieItem.en_name} imdbId = ${newImdbInfo.imdbID}`);

                            const [, putMovieError] = await dbService.movie.putMovieAsync(movieItem.id, {
                                ...movieItem,
                                imdb: dbImdbInfoWithId,
                                imdb_original_id: dbImdbInfoWithId?.original_id,
                            });
                            if (putMovieError) {
                                logs.push(`put movie v2 imdb_id error ${movieItem.id} error=${putMovieError}`);
                            } else {
                                logs.push(`put movie v2 imdb_id success ${movieItem.id} `);
                            }
                        }
                    }
                    if (error) {
                        logs.push(`imdb info not found ${movieItem.en_name} error=${error}`);
                    }
                }
            }
            return Promise.resolve();
        });
    }

    if (updateImdb) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();
        logs.push('imdbInfoItems.length', imdbInfoItems.length);

        await oneByOneAsync(imdbInfoItems, async (imdbInfo) => {
            if (!imdbInfo.original_id) {
                const [, putError] = await dbService.imdb.putImdbAsync(imdbInfo.id, {
                    ...imdbInfo,
                    original_id: (JSON.parse(imdbInfo.json) as unknown as IImdbResultResponse).imdbID,
                });
                if (putError) {
                    logs.push(`put imdb error ${imdbInfo.id} error=${putError}`);
                } else {
                    logs.push(`put imdb success ${imdbInfo.id}`);
                }
            }
            return Promise.resolve();
        });

        await oneByOneAsync(movies, async (movieItem) => {
            if (!movieItem.imdb_original_id || !movieItem.imdb_id) {
                const imdbInfo = imdbInfoItems.find(
                    (imdbItem) =>
                        imdbItem.en_name === movieItem.en_name || imdbItem.original_id === movieItem.imdb_original_id,
                );
                if (imdbInfo) {
                    const [, putMovieError] = await dbService.movie.putMovieAsync(movieItem.id, {
                        ...movieItem,
                        imdb: imdbInfo,
                        imdb_original_id: imdbInfo.original_id,
                    });
                    if (putMovieError) {
                        logs.push(`put movie imdb_id error ${movieItem.id} error=${putMovieError}`);
                    } else {
                        logs.push(`put movie imdb_id success ${movieItem.id} `);
                    }
                }
            }
            return Promise.resolve();
        });
    }

    return [logs.get(), undefined];
};

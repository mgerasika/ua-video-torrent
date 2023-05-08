import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { getImdbAllAsync } from '../imdb/get-imdb-list.controller';
import { postImdbAsync } from '../imdb/post-imdb.controller';
import { getMoviesAllAsync } from '../movie/get-movie-list.controller';
import { putMovieAsync } from '../movie/put-movie.controller';
import { MovieDto } from '@server/dto/movie.dto';
import { dbService } from '../db.service';
import Joi from 'joi';
import { validateSchema } from '@server/utils/validate-schema.util';

export interface ISetupBody {
    updateHurtom: boolean;
    updateImdb: boolean;
    uploadToCdn: boolean;
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
}: ISetupBody): Promise<[string[], undefined]> => {
    const logs: string[] = [];

    const [movies] = await getMoviesAllAsync();
    if (updateHurtom) {
        const [hurtomItems] = await dbService.tools.getAllHurtomPagesAsync();
        if (hurtomItems) {
            logs.push(`hurtom items received count=${hurtomItems.length}`);

            const fns = hurtomItems.map((hurtomItem) => {
                return async () => {
                    const movie = movies?.find((movie) => movie.href === hurtomItem.href);
                    if (!movie) {
                        const [, error] = await dbService.movie.postMovieAsync({
                            en_name: hurtomItem.enName,
                            href: hurtomItem.href,
                            title: hurtomItem.id,
                            ua_name: hurtomItem.uaName,
                            year: +hurtomItem.year,
                            download_id: hurtomItem.downloadId,
                            aws_s3_torrent_url: '',
                            size: hurtomItem.size,
                        });
                        if (error) {
                            logs.push(`add movie error ${hurtomItem.id} error=${error}`);
                        } else {
                            logs.push(`add movie success ${hurtomItem.id} `);
                        }
                    } else {
                        const [, putError] = await dbService.movie.putMovieAsync(movie.id, {
                            ...movie,
                            size: hurtomItem.size,
                            download_id: hurtomItem.downloadId,
                        });
                        if (putError) {
                            logs.push(`update movie error ${hurtomItem.id} error=${putError}`);
                        } else {
                            logs.push(`update movie success ${hurtomItem.id} `);
                        }
                    }
                    return Promise.resolve();
                };
            });

            await fns.reduce((acc, curr: any) => {
                return acc.then(curr);
            }, Promise.resolve());
        }
    }

    if (uploadTorrentToS3FromMovieDB) {
        if (movies) {
            const fns = movies.map((movie: MovieDto) => {
                return async () => {
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
                };
            });

            if (fns.length) {
                await fns.reduce((acc, curr: any) => {
                    return acc.then(curr);
                }, Promise.resolve());
            }
        }
    }

    if (uploadToCdn) {
        if (movies) {
            const fns = movies.map((movie: MovieDto) => {
                return async () => {
                    if (!movie.aws_s3_torrent_url && movie.download_id) {
                        const [, hasFileError] = await dbService.cdn.hasFileCDNAsync({ id: movie.download_id });
                        if (hasFileError) {
                            const [successUpload, errorUpload] = await dbService.cdn.uploadFileToCDNAsync({
                                hurtomDownloadId: movie.download_id,
                            });
                            if (successUpload) {
                                logs.push(`success upload to cdn`, movie.download_id);
                            } else {
                                logs.push(`error upload to cdn`, errorUpload);
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
                };
            });

            if (fns.length) {
                await fns.reduce((acc, curr: any) => {
                    return acc.then(curr);
                }, Promise.resolve());
            }
        }
    }

    if (updateImdb) {
        const [imdbInfoItems] = await getImdbAllAsync();
        if (imdbInfoItems && movies) {
            const fns = movies.map((movieItem) => {
                return async () => {
                    if (!movieItem.imdb) {
                        const imdbInfo = imdbInfoItems.find((item) => item.en_name === movieItem.en_name);
                        if (imdbInfo) {
                            const [, error] = await putMovieAsync(movieItem.id, {
                                ...movieItem,
                                imdb: imdbInfo,
                            });
                            if (error) {
                                logs.push(`add imdb_id error ${movieItem.id} error=${error}`);
                            } else {
                                logs.push(`add imdb_id success ${movieItem.id} `);
                            }
                        } else {
                            const [newInfo, error] = await dbService.tools.searchImdbMovieInfoAsync(
                                movieItem.en_name,
                                movieItem.year + '',
                            );
                            if (newInfo) {
                                logs.push(`imdb found ${movieItem.en_name}`);
                                await postImdbAsync({
                                    en_name: newInfo.Title,
                                    imdb_rating: +newInfo.imdbRating,
                                    json: JSON.stringify(newInfo),
                                    poster: newInfo.Poster,
                                    year: +newInfo.Year,
                                });
                            }
                            if (error) {
                                logs.push(`imdb info not found ${movieItem.en_name} error=${error}`);
                            }
                        }
                    }
                    return Promise.resolve();
                };
            });

            await fns.reduce((acc, curr: any) => {
                return acc.then(curr);
            }, Promise.resolve());
        }
    }

    return [logs, undefined];
};

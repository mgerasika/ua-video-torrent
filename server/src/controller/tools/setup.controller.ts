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
import { createLogs } from '@server/utils/create-logs.utils';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';
import { IQueryReturn } from '@server/utils/to-query.util';
import { ERezkaVideoType, RezkaMovieDto } from '@server/dto/rezka-movie.dto';
import { EResolution } from '@server/enum/resolution.enum';
import { ETranslation } from '@server/enum/translation.enum';
import { ImdbDto } from '@server/dto/imdb.dto';
import { IResolutionItem } from '../cypress/get-cypress-rezka-streams.controller';

export interface ISetupBody {
    updateHurtom: boolean;
    uploadToCdn: boolean;
    searchImdb: boolean;
    searchImdbIdInHurtom: boolean;
    fixRelationIntoMovieDb: boolean;
    uploadTorrentToS3FromMovieDB: boolean;
    updateRezka: boolean;
    updateRezkaById: boolean;
    updateRezkaImdbId: boolean;
    updateRezkaStreams: boolean;
    rezkaType: ERezkaVideoType;
}

interface IRequest extends IExpressRequest {
    body: ISetupBody;
}

interface IResponse extends IExpressResponse<string[], void> {}

const schema = Joi.object<ISetupBody>({
    updateHurtom: Joi.boolean().required(),
    uploadTorrentToS3FromMovieDB: Joi.boolean().required(),
    uploadToCdn: Joi.boolean().required(),
    searchImdb: Joi.boolean().required(),
    searchImdbIdInHurtom: Joi.boolean().required(),

    updateRezka: Joi.boolean().required(),
    updateRezkaById: Joi.boolean().required(),
    updateRezkaImdbId: Joi.boolean().required(),
    updateRezkaStreams: Joi.boolean().required(),
    fixRelationIntoMovieDb: Joi.boolean().required(),
    rezkaType: Joi.string()
        .valid(...Object.values(ERezkaVideoType))
        .required(),
});

app.post(API_URL.api.tools.setup.toString(), async (req: IRequest, res: IResponse) => {
    (req as any).setTimeout(60 * 60 * 60 * 10000);
    (req as any).connection.on('close', function () {
        console.log('cancel request');
    });

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

export const setupAsync = async (props: ISetupBody): Promise<IQueryReturn<string[]>> => {
    const logs = createLogs();

    const [dbMovies = []] = await dbService.movie.getMoviesAllAsync();
    if (props.updateHurtom) {
        const [parseItems = [], parseError] = await dbService.parser.parseHurtomAllPagesAsync();
        if (parseError) {
            logs.push(`hurtom items error`, parseError);
            return [undefined, logs.get() as any];
        } else {
            logs.push(`hurtom items success count=${parseItems?.length}`);
        }

        await oneByOneAsync(parseItems, async (hurtomItem) => {
            const movie = dbMovies?.find((movie) => movie.href === hurtomItem.href);
            if (!movie) {
                const [, postError] = await dbService.movie.postMovieAsync({
                    en_name: hurtomItem.enName,
                    href: hurtomItem.href,
                    title: hurtomItem.id,
                    ua_name: hurtomItem.uaName,
                    year: +hurtomItem.year,
                    download_id: hurtomItem.downloadId,
                    aws_s3_torrent_url: null as unknown as '',
                    size: hurtomItem.size,
                    hurtom_imdb_id: '',
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

    if (props.uploadTorrentToS3FromMovieDB) {
        await oneByOneAsync(
            dbMovies.filter((m) => !m.aws_s3_torrent_url && m.download_id),
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

    if (props.uploadToCdn) {
        await oneByOneAsync(
            dbMovies.filter((movie) => !movie.aws_s3_torrent_url && movie.download_id),
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

    if (props.searchImdbIdInHurtom) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();

        const filtered = dbMovies.filter((movieItem) => !movieItem.hurtom_imdb_id);
        logs.push(`found ${filtered.length} items without IMDB id`);
        await oneByOneAsync(filtered, async (movieItem) => {
            let imdbId = undefined;
            let imdbInfo = imdbInfoItems.find(
                (imdbItem) => imdbItem.en_name === movieItem.en_name || imdbItem.id === movieItem.hurtom_imdb_id,
            );
            if (imdbInfo) {
                imdbId = imdbInfo.id;
            } else {
                const [hurtomDetails, hurtomError] = await dbService.parser.parseHurtomDetailsAsync(movieItem.href || '');
                if (hurtomError) {
                    return logs.push(hurtomError);
                }
                imdbId = hurtomDetails?.imdb_id;
            }
            if (imdbId) {
                logs.push('found imdbId on hurtom site ', imdbId);

                const [, putMovieError] = await dbService.movie.putMovieAsync(movieItem.id, {
                    ...movieItem,
                    hurtom_imdb_id: imdbId,
                });
                if (putMovieError) {
                    return logs.push(`put movie hurtom_imdb_id error ${movieItem.id} error=${putMovieError}`);
                }
                logs.push(`put movie hurtom_imdb_id success ${movieItem.id} `);
            }
        });
    }

    if (props.searchImdb) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();

        await oneByOneAsync(dbMovies, async (movieItem) => {
            const imdbInfo = imdbInfoItems.find(
                (imdbItem) =>
                    imdbItem.en_name === movieItem.en_name ||
                    imdbItem.id === movieItem.hurtom_imdb_id ||
                    imdbItem.id === movieItem.imdb_id,
            );
            if (imdbInfo) {
                return;
            }
            const [newImdbInfo, newImdbInfoError] = await dbService.imdb.searchImdbMovieInfoAsync(
                movieItem.en_name,
                movieItem.year + '',
                movieItem.hurtom_imdb_id,
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
                    id: newImdbInfo.imdbID,
                });
                if (postImdbError) {
                    return logs.push(`imdb post error ${movieItem.en_name} imdbId = ${newImdbInfo.imdbID}`);
                }
                logs.push(`imdb post success ${movieItem.en_name} imdbId = ${newImdbInfo.imdbID}`);
            }
        });
    }

    if (props.fixRelationIntoMovieDb) {
        const [imdbInfoItems = []] = await dbService.imdb.getImdbAllAsync();

        const filtered = dbMovies.filter((movieItem) => !movieItem.imdb_id);
        logs.push(`found ${filtered.length} items without IMDB id`);
        await oneByOneAsync(filtered, async (movieItem) => {
            const imdbInfo = imdbInfoItems.find(
                (imdbItem) => imdbItem.en_name === movieItem.en_name || imdbItem.id === movieItem.hurtom_imdb_id,
            );

            if (imdbInfo) {
                const [, putMovieError] = await dbService.movie.putMovieAsync(movieItem.id, {
                    ...movieItem,
                    imdb: imdbInfo,
                    hurtom_imdb_id: imdbInfo?.id,
                });
                if (putMovieError) {
                    return logs.push(`put movie imdb_id relation error ${movieItem.id} error=${putMovieError}`);
                }
                logs.push(`put movie imdb_id relation success ${movieItem.id} `);
            }
        });
    }

    if (props.updateRezka) {
        const [rezkaDbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync();

        const [parseItems = [], parserError] = await dbService.parser.parseRezkaAllPagesAsync({ type: props.rezkaType });
        if (parserError) {
            logs.push(`rezka items has some error`, parserError);
        }
        logs.push(`rezka items return success count=${parseItems?.length}`);

        await oneByOneAsync(parseItems, async (parseItem) => {
            const dbMovie = rezkaDbMovies?.find((movie) => movie.href === parseItem.href);
            if (!dbMovie) {
                const [, postError] = await dbService.rezkaMovie.postRezkaMovieAsync({
                    href: parseItem.href,
                    url_id: parseItem.url_id,
                    en_name: '',
                    year: parseItem.year,
                    video_type: props.rezkaType,
                    rezka_imdb_id: null as unknown as string,
                });
                if (postError) {
                    return logs.push(`post rezka movie error ${parseItem.url_id} error=${postError}`);
                }
                logs.push(`post rezka movie success ${parseItem.url_id} `);
            }
        });
    }

    if (props.updateRezkaById) {
        const [rezkaDbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync();

        await oneByOneAsync(
            rezkaDbMovies.filter((f) => !f.en_name),
            async (dbMovie) => {
                const [parseItem, parserError] = await dbService.parser.parseRezkaDetailsAsync(dbMovie.url_id);
                if (parserError) {
                    logs.push(`rezka by id error`, parserError);
                    return;
                } else if (parseItem) {
                    const [, postError] = await dbService.rezkaMovie.putRezkaMovieAsync(dbMovie.id, {
                        en_name: parseItem.en_name,
                    });
                    if (postError) {
                        return logs.push(`post rezka movie error ${dbMovie.id} error=${postError}`);
                    }
                    logs.push(`post rezka movie success ${dbMovie.id} `);
                }
            },
            { timeout: 5000 },
        );
    }

    if (props.updateRezkaImdbId) {
        const [rezkaDbMovies = []] = await dbService.rezkaMovie.getRezkaMoviesAllAsync();

        const items = rezkaDbMovies.filter((f) => !f.rezka_imdb_id).reverse();
        logs.push('download imdb ids  for ' + items.length);
        await oneByOneAsync(
            items,
            async (dbMovie) => {
                const [parseItem, parserError] = await dbService.cypress.getCypressImdbAsync(dbMovie.href);
                if (parserError) {
                    logs.push(`parse cypress rezka by href error`, parserError);
                    return;
                } else if (parseItem) {
                    const [, postError] = await dbService.rezkaMovie.putRezkaMovieAsync(dbMovie.id, {
                        rezka_imdb_id: parseItem.id,
                    });
                    if (postError) {
                        return logs.push(`post rezka movie error ${dbMovie.id} error=${postError}`);
                    }
                    logs.push(`post rezka movie imdbId success ${dbMovie.id} `);
                }
            },
            { timeout: 0 },
        );
    }

    if (props.updateRezkaStreams) {
        const [hrefObjects = []] = await dbService.rezkaMovie.searchHrefRezkaMoviesAsync();
        logs.push('download streams for ' + hrefObjects.length);
        await oneByOneAsync(
            hrefObjects,
            async (hrefObj) => {
                const [parseItem, parserError] = await dbService.cypress.getCypressRezkaStreamsAsync(hrefObj.href);
                if (parserError) {
                    logs.push(`parse cypress rezka by href error`, parserError);
                    return;
                } else if (parseItem) {
                    await oneByOneAsync(
                        parseItem.translations.filter(
                            (t) => t.translation.includes('Украинский') || t.translation.includes('Оригинал'),
                        ),
                        async (translation) => {
                            await oneByOneAsync(
                                [
                                    translation.resolutions
                                        .filter(
                                            (resolution) =>
                                                resolution.resolution.includes('1080') ||
                                                resolution.resolution.includes('1280p'),
                                        )
                                        .pop(),
                                ].filter((f) => f) as IResolutionItem[],
                                async (resolution: IResolutionItem) => {
                                    await oneByOneAsync(
                                        resolution.streams,
                                        async (stream) => {
                                            const [postStream, postStreamError] = await dbService.stream.postStreamAsync({
                                                stream_url: stream,
                                                translation_original_text: translation.translation,
                                                imdb: new ImdbDto(hrefObj.rezka_imdb_id),
                                                resolution_enum: ('_' + resolution.resolution) as EResolution,
                                                translation_enum: null as unknown as ETranslation,
                                            });
                                            if (postStreamError) {
                                                logs.push(`post stream error`, postStreamError);
                                                return;
                                            } else if (postStream) {
                                                logs.push(`post stream success`, postStream);
                                            }
                                        },
                                        { timeout: 0 },
                                    );
                                },
                                { timeout: 0 },
                            );
                        },
                        { timeout: 0 },
                    );
                }
            },
            { timeout: 0 },
        );
    }

    return [logs.get(), undefined];
};

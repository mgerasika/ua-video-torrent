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
import { EResolution } from '@server/enum/resolution.enum';
import { ETranslation } from '@server/enum/translation.enum';
import { ImdbDto } from '@server/dto/imdb.dto';

export interface ISetupBody {
    updateHurtom: boolean;
    uploadToCdn: boolean;
    searchImdb: boolean;
    searchImdbIdInHurtom: boolean;
    fixRelationIntoMovieDb: boolean;
    uploadTorrentToS3FromMovieDB: boolean;
}

interface IRequest extends IExpressRequest {
    body: ISetupBody;
}

interface IResponse extends IExpressResponse<string[], void> {}

const schema = Joi.object<ISetupBody>({
    updateHurtom: Joi.boolean().required(),
    uploadToCdn: Joi.boolean().required(),
    searchImdb: Joi.boolean().required(),
    fixRelationIntoMovieDb: Joi.boolean().required(),
    searchImdbIdInHurtom: Joi.boolean().required(),
    uploadTorrentToS3FromMovieDB: Joi.boolean().required(),
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
                    json: newImdbInfo,
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
                (imdbItem) => imdbItem.id === movieItem.hurtom_imdb_id,
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

    return [logs.get(), undefined];
};

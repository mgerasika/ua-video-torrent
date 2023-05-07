"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const express_app_1 = require("@server/express-app");
const api_url_constant_1 = require("@server/constants/api-url.constant");
const get_imdb_list_controller_1 = require("../imdb/get-imdb-list.controller");
const post_imdb_controller_1 = require("../imdb/post-imdb.controller");
const get_movie_list_controller_1 = require("../movie/get-movie-list.controller");
const put_movie_controller_1 = require("../movie/put-movie.controller");
const get_hurtom_all_controller_1 = require("./get-hurtom-all.controller");
const db_service_1 = require("../db.service");
const joi_1 = __importDefault(require("joi"));
const validate_schema_util_1 = require("@server/utils/validate-schema.util");
const schema = joi_1.default.object({
    updateHurtom: joi_1.default.boolean().required(),
    updateImdb: joi_1.default.boolean().required(),
    uploadTorrentToS3FromMovieDB: joi_1.default.boolean().required(),
});
express_app_1.app.post(api_url_constant_1.API_URL.api.tools.setup.toString(), async (req, res) => {
    const [, validateError] = (0, validate_schema_util_1.validateSchema)(schema, req.body);
    if (validateError) {
        return res.status(400).send(validateError);
    }
    const [logs, error] = await (0, exports.setup)(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    res.send(logs);
});
const setup = async ({ updateHurtom, updateImdb, uploadTorrentToS3FromMovieDB, }) => {
    const logs = [];
    const [movies] = await (0, get_movie_list_controller_1.getMoviesAllAsync)();
    if (updateHurtom) {
        const [hurtomItems] = await (0, get_hurtom_all_controller_1.getAllHurtomPagesAsync)();
        if (hurtomItems) {
            logs.push(`hurtom items received count=${hurtomItems.length}`);
            const fns = hurtomItems.map((hurtomItem) => {
                return async () => {
                    const movie = movies === null || movies === void 0 ? void 0 : movies.find((movie) => movie.href === hurtomItem.href);
                    if (!movie) {
                        const [, error] = await db_service_1.dbService.movie.postMovieAsync({
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
                        }
                        else {
                            logs.push(`add movie success ${hurtomItem.id} `);
                        }
                    }
                    else {
                        const [, putError] = await db_service_1.dbService.movie.putMovieAsync(movie.id, Object.assign(Object.assign({}, movie), { size: hurtomItem.size, download_id: hurtomItem.downloadId }));
                        if (putError) {
                            logs.push(`update movie error ${hurtomItem.id} error=${putError}`);
                        }
                        else {
                            logs.push(`update movie success ${hurtomItem.id} `);
                        }
                    }
                    return Promise.resolve();
                };
            });
            await fns.reduce((acc, curr) => {
                return acc.then(curr);
            }, Promise.resolve());
        }
    }
    if (uploadTorrentToS3FromMovieDB) {
        if (movies) {
            const fns = movies.map((movie) => {
                return async () => {
                    if (!movie.aws_s3_torrent_url && movie.download_id) {
                        const [, hasFileError] = await db_service_1.dbService.s3.hasFileS3Async({ id: movie.download_id });
                        if (hasFileError) {
                            const [successUpload, errorUpload] = await db_service_1.dbService.s3.uploadFileToAmazonAsync({
                                hurtomDownloadId: movie.download_id,
                            });
                            if (successUpload) {
                                logs.push(`success upload to s3`, movie.download_id);
                            }
                            else {
                                logs.push(`error upload to s3`, errorUpload);
                            }
                            if (successUpload) {
                                await db_service_1.dbService.movie.putMovieAsync(movie.id, Object.assign(Object.assign({}, movie), { aws_s3_torrent_url: successUpload }));
                            }
                        }
                        else {
                            await db_service_1.dbService.movie.putMovieAsync(movie.id, Object.assign(Object.assign({}, movie), { aws_s3_torrent_url: movie.download_id }));
                        }
                    }
                    else if (!movie.download_id) {
                        await (0, put_movie_controller_1.putMovieAsync)(movie.id, Object.assign(Object.assign({}, movie), { aws_s3_torrent_url: '' }));
                    }
                    return Promise.resolve();
                };
            });
            await fns.reduce((acc, curr) => {
                return acc.then(curr);
            }, Promise.resolve());
        }
    }
    if (updateImdb) {
        const [imdbInfoItems] = await (0, get_imdb_list_controller_1.getImdbAllAsync)();
        if (imdbInfoItems && movies) {
            const fns = movies.map((movieItem) => {
                return async () => {
                    if (!movieItem.imdb) {
                        const imdbInfo = imdbInfoItems.find((item) => item.en_name === movieItem.en_name);
                        if (imdbInfo) {
                            const [, error] = await (0, put_movie_controller_1.putMovieAsync)(movieItem.id, Object.assign(Object.assign({}, movieItem), { imdb: imdbInfo }));
                            if (error) {
                                logs.push(`add imdb_id error ${movieItem.id} error=${error}`);
                            }
                            else {
                                logs.push(`add imdb_id success ${movieItem.id} `);
                            }
                        }
                        else {
                            const [newInfo, error] = await db_service_1.dbService.tools.searchImdbMovieInfoAsync(movieItem.en_name, movieItem.year + '');
                            if (newInfo) {
                                logs.push(`imdb found ${movieItem.en_name}`);
                                await (0, post_imdb_controller_1.postImdbAsync)({
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
            await fns.reduce((acc, curr) => {
                return acc.then(curr);
            }, Promise.resolve());
        }
    }
    return [logs, undefined];
};
exports.setup = setup;
//# sourceMappingURL=setup.controller.js.map
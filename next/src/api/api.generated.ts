/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disabled no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CustomAxiosResponse,
  CustomPromise,
  IBEError,
  IRequestService,
  formatUrl,
  requestService,
} from 'swagger-to-typescript2'
import { ENV } from '../env'

const API_SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? ENV.LOCAL
    : 'http://178.210.131.101:8004/'

// DON'T REMOVE THIS COMMENTS!!! Code between comments auto-generated
// INSERT START
export enum ERezkaVideoType {
  film = 'film',
  cartoon = 'cartoon',
}
export interface IVideoInfoResult {
  en_name: string
  year: number
  url: string
  translations: ITranslation[]
}
export interface ITranslation {
  resolutions: IResolutionItem[]
  translation: string
}
export interface IResolutionItem {
  resolution: string
  streams: string[]
}
export interface IGroupMovieResponse {
  enName: string
  imdb_original_id: string
  imdb_rating: number
  poster: string
  movies: IGroupMovieItem[]
}
export interface IGroupMovieItem {
  title: string
  size: number
  aws_s3_torrent_url: string
}
export interface IImdbResponse {
  id: string
  en_name: string
  poster: string
  imdb_rating: number
  year: number
  json: string
}
export interface IPostImdbBody {
  id: string
  en_name: string
  poster: string
  imdb_rating: number
  year: number
  json: string
}
export interface IPutImdbBody {
  en_name: string
  poster: string
  imdb_rating: number
  year: number
  json: string
}
export interface ISearchImdbBody {
  enName: string
  year: string
  id?: string
}
export interface IImdbResultResponse {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: IImdbRating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}
export interface IImdbRating {
  Source: string
  Value: string
}
export interface IError {
  message: string
  code: string
}
export interface IMovieResponse {
  imdb_id: string
  id: string
  en_name: string
  ua_name: string
  href: string
  year: number
  title: string
  download_id: string
  size: number
  aws_s3_torrent_url: string
  hurtom_imdb_id: string
}
export interface IPostMovieBody {
  imdb_id: string
  en_name: string
  ua_name: string
  href: string
  year: number
  title: string
  download_id: string
  size: number
  aws_s3_torrent_url: string
  hurtom_imdb_id: string
}
export interface IPutMovieBody {
  imdb_id: string
  en_name: string
  ua_name: string
  href: string
  year: number
  title: string
  download_id: string
  size: number
  aws_s3_torrent_url: string
  hurtom_imdb_id: string
}
export interface ISearchMovieResponse {
  id: string
  en_name: string
  poster: string
  imdb_rating: number
  year: number
  imdb_id: string
  ua_name: string
  href: string
  title: string
  download_id: string
  size: number
  aws_s3_torrent_url: string
  hurtom_imdb_id: string
}
export interface IHurtomInfoResponse {
  id: string
  name: string
  year: string
  uaName: string
  enName: string
  href: string
  size: number
  downloadId: string
}
export interface IHurtomInfoByIdResponse {
  imdb_id: string
}
export interface IRezkaInfoResponse {
  url_id: string
  id_attr: string
  href: string
  year: number
}
export interface IRezkaInfoByIdResponse {
  en_name: string
  year: number
}
export interface IRezkaMovieResponse {
  id: string
  en_name: string
  href: string
  url_id: string
  year: number
  video_type: ERezkaVideoType
}
export interface IPostRezkaMovieBody {
  en_name: string
  href: string
  url_id: string
  year: number
  video_type: ERezkaVideoType
}
export interface IPutRezkaMovieBody {
  en_name: string
  href: string
  url_id: string
  year: number
  video_type: ERezkaVideoType
}
export interface ISetupBody {
  updateHurtom: boolean
  uploadToCdn: boolean
  searchImdb: boolean
  searchImdbIdInHurtom: boolean
  fixRelationIntoMovieDb: boolean
  uploadTorrentToS3FromMovieDB: boolean
  updateRezka: boolean
  updateRezkaById: boolean
  rezkaType: ERezkaVideoType
}
export interface ITorrentInfo {
  peers: number
}
export type TCdnGetFileNameGetError = '' | 'undefined'
export type TCdnGetFileNameHasFileGetError = '' | 'undefined'
export type TCdnUploadPostError = '' | 'undefined'
export type TCypressIdGetError = '' | 'undefined'
export type TGroupMovieGetError = '' | 'undefined'
export type TGroupMovieIdGetError = '' | 'undefined'
export type TImdbIdDeleteError = '' | 'undefined'
export type TImdbIdGetError = '' | 'undefined'
export type TImdbIdPutError = '' | 'undefined'
export type TImdbGetError = '' | 'undefined'
export type TImdbPostError = '' | 'undefined'
export type TImdbSearchPostError = '' | 'undefined'
export type TMovieIdDeleteError = '' | 'undefined'
export type TMovieIdGetError = '' | 'undefined'
export type TMovieIdPutError = '' | 'undefined'
export type TMovieGetError = '' | 'undefined'
export type TMoviePostError = '' | 'undefined'
export type TMovieSearchGetError = '' | 'undefined'
export type TParserGetHurtomAllGetError = '' | 'undefined'
export type TParserGetHurtomAllIdGetError = '' | 'undefined'
export type TParserGetRezkaAllGetError = '' | 'undefined'
export type TParserGetRezkaAllIdGetError = '' | 'undefined'
export type TRezkaMovieIdDeleteError = '' | 'undefined'
export type TRezkaMovieIdGetError = '' | 'undefined'
export type TRezkaMovieIdPutError = '' | 'undefined'
export type TRezkaMovieGetError = '' | 'undefined'
export type TRezkaMoviePostError = '' | 'undefined'
export type TS3GetIdGetError = '' | 'undefined'
export type TS3GetIdHasFileGetError = '' | 'undefined'
export type TS3UploadPostError = '' | 'undefined'
export type TToolsSetupPostError = '' | 'undefined'
export type TTorrentIdGetError = '' | 'undefined'
export type TTorrentIdPutError = '' | 'undefined'
export type TPartialErrorCodes =
  | TCdnGetFileNameGetError
  | TCdnGetFileNameHasFileGetError
  | TCdnUploadPostError
  | TCypressIdGetError
  | TGroupMovieGetError
  | TGroupMovieIdGetError
  | TImdbIdDeleteError
  | TImdbIdGetError
  | TImdbIdPutError
  | TImdbGetError
  | TImdbPostError
  | TImdbSearchPostError
  | TMovieIdDeleteError
  | TMovieIdGetError
  | TMovieIdPutError
  | TMovieGetError
  | TMoviePostError
  | TMovieSearchGetError
  | TParserGetHurtomAllGetError
  | TParserGetHurtomAllIdGetError
  | TParserGetRezkaAllGetError
  | TParserGetRezkaAllIdGetError
  | TRezkaMovieIdDeleteError
  | TRezkaMovieIdGetError
  | TRezkaMovieIdPutError
  | TRezkaMovieGetError
  | TRezkaMoviePostError
  | TS3GetIdGetError
  | TS3GetIdHasFileGetError
  | TS3UploadPostError
  | TToolsSetupPostError
  | TTorrentIdGetError
  | TTorrentIdPutError
  | ''

export const createApiRequest = (rs: IRequestService) => ({
  cdnGetFileNameGet: (
    file_name: string,
  ): CustomPromise<
    CustomAxiosResponse<Blob, TCdnGetFileNameGetError>,
    IBEError<TCdnGetFileNameGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cdn/get/${file_name}`)),

  cdnGetFileNameHasFileGet: (
    file_name: string,
  ): CustomPromise<
    CustomAxiosResponse<void, TCdnGetFileNameHasFileGetError>,
    IBEError<TCdnGetFileNameHasFileGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cdn/get/${file_name}hasFile/`)),

  cdnUploadPost: (): CustomPromise<
    CustomAxiosResponse<void, TCdnUploadPostError>,
    IBEError<TCdnUploadPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/cdn/upload/`)),

  cypressIdGet: (
    id: string,
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<IVideoInfoResult, TCypressIdGetError>,
    IBEError<TCypressIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cypress/${id}`, query)),

  groupMovieGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IGroupMovieResponse>, TGroupMovieGetError>,
    IBEError<TGroupMovieGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/group-movie/`, query)),

  groupMovieIdGet: (
    id: string,
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<IGroupMovieResponse, TGroupMovieIdGetError>,
    IBEError<TGroupMovieIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/group-movie/${id}`, query)),

  imdbIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdDeleteError>,
    IBEError<TImdbIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/imdb/${id}`)),

  imdbIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdGetError>,
    IBEError<TImdbIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/imdb/${id}`)),

  imdbIdPut: (
    id: string,
    body: IPutImdbBody,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdPutError>,
    IBEError<TImdbIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/imdb/${id}`), body),

  imdbGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IImdbResponse>, TImdbGetError>,
    IBEError<TImdbGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/imdb/`, query)),

  imdbPost: (
    body: IPostImdbBody,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbPostError>,
    IBEError<TImdbPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/imdb/`), body),

  imdbSearchPost: (
    body: ISearchImdbBody,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResultResponse, TImdbSearchPostError>,
    IBEError<TImdbSearchPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/imdb/search/`), body),

  movieIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Array<IMovieResponse>, TMovieIdDeleteError>,
    IBEError<TMovieIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/movie/${id}`)),

  movieIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IMovieResponse, TMovieIdGetError>,
    IBEError<TMovieIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/movie/${id}`)),

  movieIdPut: (
    id: string,
    body: IPutMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<IMovieResponse, TMovieIdPutError>,
    IBEError<TMovieIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/movie/${id}`), body),

  movieGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IMovieResponse>, TMovieGetError>,
    IBEError<TMovieGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/movie/`, query)),

  moviePost: (
    body: IPostMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<Array<IMovieResponse>, TMoviePostError>,
    IBEError<TMoviePostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/movie/`), body),

  movieSearchGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<ISearchMovieResponse>, TMovieSearchGetError>,
    IBEError<TMovieSearchGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/movie/search/`, query)),

  parserGetHurtomAllGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<
      Array<IHurtomInfoResponse>,
      TParserGetHurtomAllGetError
    >,
    IBEError<TParserGetHurtomAllGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/parser/get-hurtom-all/`, query)),

  parserGetHurtomAllIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IHurtomInfoByIdResponse, TParserGetHurtomAllIdGetError>,
    IBEError<TParserGetHurtomAllIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/parser/get-hurtom-all/${id}`)),

  parserGetRezkaAllGet: (
    query: { type?: ERezkaVideoType } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaInfoResponse>, TParserGetRezkaAllGetError>,
    IBEError<TParserGetRezkaAllGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/parser/get-rezka-all/`, query)),

  parserGetRezkaAllIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IRezkaInfoByIdResponse, TParserGetRezkaAllIdGetError>,
    IBEError<TParserGetRezkaAllIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/parser/get-rezka-all/${id}`)),

  rezkaMovieIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMovieIdDeleteError>,
    IBEError<TRezkaMovieIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/rezka_movie/${id}`)),

  rezkaMovieIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IRezkaMovieResponse, TRezkaMovieIdGetError>,
    IBEError<TRezkaMovieIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/rezka_movie/${id}`)),

  rezkaMovieIdPut: (
    id: string,
    body: IPutRezkaMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<IRezkaMovieResponse, TRezkaMovieIdPutError>,
    IBEError<TRezkaMovieIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/rezka_movie/${id}`), body),

  rezkaMovieGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMovieGetError>,
    IBEError<TRezkaMovieGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/rezka_movie/`, query)),

  rezkaMoviePost: (
    body: IPostRezkaMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMoviePostError>,
    IBEError<TRezkaMoviePostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/rezka_movie/`), body),

  s3GetIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<string, TS3GetIdGetError>,
    IBEError<TS3GetIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/s3/get/${id}`)),

  s3GetIdHasFileGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<void, TS3GetIdHasFileGetError>,
    IBEError<TS3GetIdHasFileGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/s3/get/${id}hasFile/`)),

  s3UploadPost: (): CustomPromise<
    CustomAxiosResponse<void, TS3UploadPostError>,
    IBEError<TS3UploadPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/s3/upload/`)),

  toolsSetupPost: (
    body: ISetupBody,
  ): CustomPromise<
    CustomAxiosResponse<string[], TToolsSetupPostError>,
    IBEError<TToolsSetupPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/tools/setup/`), body),

  torrentIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<ITorrentInfo, TTorrentIdGetError>,
    IBEError<TTorrentIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/torrent/${id}`)),

  torrentIdPut: (
    id: string,
    body: ITorrentInfo,
  ): CustomPromise<
    CustomAxiosResponse<void, TTorrentIdPutError>,
    IBEError<TTorrentIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/torrent/${id}`), body),
})

const URL = {
  cdnGetFileNameGet: (file_name: string): string => `api/cdn/get/${file_name}`,
  cdnGetFileNameHasFileGet: (file_name: string): string =>
    `api/cdn/get/${file_name}hasFile/`,
  cdnUploadPost: (): string => `api/cdn/upload/`,
  cypressIdGet: (id: string): string => `api/cypress/${id}`,
  groupMovieGet: (): string => `api/group-movie/`,
  groupMovieIdGet: (id: string): string => `api/group-movie/${id}`,
  imdbIdDelete: (id: string): string => `api/imdb/${id}`,
  imdbIdGet: (id: string): string => `api/imdb/${id}`,
  imdbIdPut: (id: string): string => `api/imdb/${id}`,
  imdbGet: (): string => `api/imdb/`,
  imdbPost: (): string => `api/imdb/`,
  imdbSearchPost: (): string => `api/imdb/search/`,
  movieIdDelete: (id: string): string => `api/movie/${id}`,
  movieIdGet: (id: string): string => `api/movie/${id}`,
  movieIdPut: (id: string): string => `api/movie/${id}`,
  movieGet: (): string => `api/movie/`,
  moviePost: (): string => `api/movie/`,
  movieSearchGet: (): string => `api/movie/search/`,
  parserGetHurtomAllGet: (): string => `api/parser/get-hurtom-all/`,
  parserGetHurtomAllIdGet: (id: string): string =>
    `api/parser/get-hurtom-all/${id}`,
  parserGetRezkaAllGet: (): string => `api/parser/get-rezka-all/`,
  parserGetRezkaAllIdGet: (id: string): string =>
    `api/parser/get-rezka-all/${id}`,
  rezkaMovieIdDelete: (id: string): string => `api/rezka_movie/${id}`,
  rezkaMovieIdGet: (id: string): string => `api/rezka_movie/${id}`,
  rezkaMovieIdPut: (id: string): string => `api/rezka_movie/${id}`,
  rezkaMovieGet: (): string => `api/rezka_movie/`,
  rezkaMoviePost: (): string => `api/rezka_movie/`,
  s3GetIdGet: (id: string): string => `api/s3/get/${id}`,
  s3GetIdHasFileGet: (id: string): string => `api/s3/get/${id}hasFile/`,
  s3UploadPost: (): string => `api/s3/upload/`,
  toolsSetupPost: (): string => `api/tools/setup/`,
  torrentIdGet: (id: string): string => `api/torrent/${id}`,
  torrentIdPut: (id: string): string => `api/torrent/${id}`,
}
// INSERT END
// DON'T REMOVE THIS COMMENTS!!!

export const API_URL = URL
export const api = {
  ...createApiRequest(requestService),
}

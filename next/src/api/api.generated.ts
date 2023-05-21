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
export enum EResolution {
  _360p = '_360p',
  _480p = '_480p',
  _720p = '_720p',
  _1080p = '_1080p',
  _1280p = '_1280p',
}
export enum ETranslation {
  default = 'default',
  ua_1 = 'ua_1',
}
export interface IVideoInfoResult {
  en_name: string
  year: number
  url: string
  imdb_rezka_relative_link: string
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
  imdb_id: string
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
  id: string
  en_name: string
  ua_name: string
  href: string
  year: number
  title: string
  download_id: string
  size: number
  aws_s3_torrent_url: string
  imdb?: ImdbDto
  imdb_id?: string
  hurtom_imdb_id: string
}
export interface ImdbDto {
  id: string
  en_name: string
  poster: string
  imdb_rating: number
  year: number
  json: string
}
export interface IPutMovieBody {
  en_name: string
  ua_name: string
  href: string
  year: number
  title: string
  download_id: string
  size: number
  aws_s3_torrent_url: string
  imdb?: ImdbDto
  imdb_id?: string
  hurtom_imdb_id: string
}
export interface IPostMovieBody {
  en_name: string
  ua_name: string
  href: string
  year: number
  title: string
  download_id: string
  size: number
  aws_s3_torrent_url: string
  imdb?: ImdbDto
  imdb_id?: string
  hurtom_imdb_id: string
}
export interface ISearchMovieResponse {
  id: string
  en_name: string
  poster: string
  imdb_rating: number
  year: number
  ua_name: string
  href: string
  title: string
  download_id: string
  size: number
  aws_s3_torrent_url: string
  imdb?: ImdbDto
  imdb_id?: string
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
  imdb_rezka_relative_link: string
}
export interface IRezkaMovieResponse {
  id: string
  en_name: string
  url_id: string
  year: number
  href: string
  video_type: ERezkaVideoType
  imdb?: ImdbDto
  imdb_id?: string
  rezka_imdb_id: string
}
export interface IPostRezkaMovieBody {
  en_name: string
  url_id: string
  year: number
  href: string
  video_type: ERezkaVideoType
  imdb?: ImdbDto
  imdb_id?: string
  rezka_imdb_id: string
}
export interface IPutRezkaMovieBody {
  en_name: string
  url_id: string
  year: number
  href: string
  video_type: ERezkaVideoType
  imdb?: ImdbDto
  imdb_id?: string
  rezka_imdb_id: string
}
export interface ISearchRezkaMovieResponse {
  href: string
  rezka_imdb_id: string
  id: string
}
export interface IStreamResponse {
  id: string
  translation_original_text: string
  resolution_enum: EResolution
  translation_enum: ETranslation
  stream_url: string
  imdb?: ImdbDto
  imdb_id?: string
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
  updateRezkaImdbId: boolean
  updateRezkaStreams: boolean
  rezkaType: ERezkaVideoType
}
export interface ITorrentInfoResponse {
  peers: number
}
export type TCdnIdGetError = '' | 'undefined'
export type TCdnIdHasFileGetError = '' | 'undefined'
export type TCdnUploadPostError = '' | 'undefined'
export type TCypressImdbGetError = '' | 'undefined'
export type TCypressStreamsGetError = '' | 'undefined'
export type TGroupMovieGetError = '' | 'undefined'
export type TImdbGetError = '' | 'undefined'
export type TImdbPostError = '' | 'undefined'
export type TImdbIdDeleteError = '' | 'undefined'
export type TImdbIdGetError = '' | 'undefined'
export type TImdbIdPutError = '' | 'undefined'
export type TGroupMovieIdGetError = '' | 'undefined'
export type TImdbSearchPostError = '' | 'undefined'
export type TMovieIdDeleteError = '' | 'undefined'
export type TMovieIdGetError = '' | 'undefined'
export type TMovieIdPutError = '' | 'undefined'
export type TMovieGetError = '' | 'undefined'
export type TMoviePostError = '' | 'undefined'
export type TMovieSearchGetError = '' | 'undefined'
export type TParserHurtomAllPostError = '' | 'undefined'
export type TParserHurtomDetailsPostError = '' | 'undefined'
export type TParserRezkaAllPostError = '' | 'undefined'
export type TParserRezkaDetailsPostError = '' | 'undefined'
export type TRezkaMovieIdDeleteError = '' | 'undefined'
export type TRezkaMovieIdGetError = '' | 'undefined'
export type TRezkaMovieIdPutError = '' | 'undefined'
export type TRezkaMovieGetError = '' | 'undefined'
export type TRezkaMoviePostError = '' | 'undefined'
export type TS3IdGetError = '' | 'undefined'
export type TRezkaMovieSearchRezkaWithoutStreamGetError = '' | 'undefined'
export type TS3IdHasFileGetError = '' | 'undefined'
export type TS3UploadPostError = '' | 'undefined'
export type TStreamIdDeleteError = '' | 'undefined'
export type TStreamIdPutError = '' | 'undefined'
export type TStreamIdGetError = '' | 'undefined'
export type TStreamPostError = '' | 'undefined'
export type TStreamGetError = '' | 'undefined'
export type TToolsSetupPostError = '' | 'undefined'
export type TTorrentIdGetError = '' | 'undefined'
export type TTorrentIdPutError = '' | 'undefined'
export type TPartialErrorCodes =
  | TCdnIdGetError
  | TCdnIdHasFileGetError
  | TCdnUploadPostError
  | TCypressImdbGetError
  | TCypressStreamsGetError
  | TGroupMovieGetError
  | TImdbGetError
  | TImdbPostError
  | TImdbIdDeleteError
  | TImdbIdGetError
  | TImdbIdPutError
  | TGroupMovieIdGetError
  | TImdbSearchPostError
  | TMovieIdDeleteError
  | TMovieIdGetError
  | TMovieIdPutError
  | TMovieGetError
  | TMoviePostError
  | TMovieSearchGetError
  | TParserHurtomAllPostError
  | TParserHurtomDetailsPostError
  | TParserRezkaAllPostError
  | TParserRezkaDetailsPostError
  | TRezkaMovieIdDeleteError
  | TRezkaMovieIdGetError
  | TRezkaMovieIdPutError
  | TRezkaMovieGetError
  | TRezkaMoviePostError
  | TS3IdGetError
  | TRezkaMovieSearchRezkaWithoutStreamGetError
  | TS3IdHasFileGetError
  | TS3UploadPostError
  | TStreamIdDeleteError
  | TStreamIdPutError
  | TStreamIdGetError
  | TStreamPostError
  | TStreamGetError
  | TToolsSetupPostError
  | TTorrentIdGetError
  | TTorrentIdPutError
  | ''

export const createApiRequest = (rs: IRequestService) => ({
  cdnIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Blob, TCdnIdGetError>,
    IBEError<TCdnIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cdn/${id}`)),

  cdnIdHasFileGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<void, TCdnIdHasFileGetError>,
    IBEError<TCdnIdHasFileGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cdn/${id}hasFile/`)),

  cdnUploadPost: (): CustomPromise<
    CustomAxiosResponse<void, TCdnUploadPostError>,
    IBEError<TCdnUploadPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/cdn/upload/`)),

  cypressImdbGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<string, TCypressImdbGetError>,
    IBEError<TCypressImdbGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cypress/imdb/`, query)),

  cypressStreamsGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<IVideoInfoResult, TCypressStreamsGetError>,
    IBEError<TCypressStreamsGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cypress/streams/`, query)),

  groupMovieGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IGroupMovieResponse>, TGroupMovieGetError>,
    IBEError<TGroupMovieGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/group-movie/`, query)),

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

  groupMovieIdGet: (
    id: string,
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<IGroupMovieResponse, TGroupMovieIdGetError>,
    IBEError<TGroupMovieIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/group-movie/${id}`, query)),

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

  parserHurtomAllPost: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IHurtomInfoResponse>, TParserHurtomAllPostError>,
    IBEError<TParserHurtomAllPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/parser/hurtom-all/`, query)),

  parserHurtomDetailsPost: (): CustomPromise<
    CustomAxiosResponse<IHurtomInfoByIdResponse, TParserHurtomDetailsPostError>,
    IBEError<TParserHurtomDetailsPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/parser/hurtom-details/`)),

  parserRezkaAllPost: (
    query: { type?: ERezkaVideoType } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaInfoResponse>, TParserRezkaAllPostError>,
    IBEError<TParserRezkaAllPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/parser/rezka-all/`, query)),

  parserRezkaDetailsPost: (): CustomPromise<
    CustomAxiosResponse<IRezkaInfoByIdResponse, TParserRezkaDetailsPostError>,
    IBEError<TParserRezkaDetailsPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/parser/rezka-details/`)),

  rezkaMovieIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMovieIdDeleteError>,
    IBEError<TRezkaMovieIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/rezka-movie/${id}`)),

  rezkaMovieIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IRezkaMovieResponse, TRezkaMovieIdGetError>,
    IBEError<TRezkaMovieIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/rezka-movie/${id}`)),

  rezkaMovieIdPut: (
    id: string,
    body: IPutRezkaMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<IRezkaMovieResponse, TRezkaMovieIdPutError>,
    IBEError<TRezkaMovieIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/rezka-movie/${id}`), body),

  rezkaMovieGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMovieGetError>,
    IBEError<TRezkaMovieGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/rezka-movie/`, query)),

  rezkaMoviePost: (
    body: IPostRezkaMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMoviePostError>,
    IBEError<TRezkaMoviePostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/rezka-movie/`), body),

  s3IdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<string, TS3IdGetError>,
    IBEError<TS3IdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/s3/${id}`)),

  rezkaMovieSearchRezkaWithoutStreamGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<
      Array<ISearchRezkaMovieResponse>,
      TRezkaMovieSearchRezkaWithoutStreamGetError
    >,
    IBEError<TRezkaMovieSearchRezkaWithoutStreamGetError>
  > =>
    rs.get(
      formatUrl(
        API_SERVER_URL + `api/rezka-movie/search-rezka-without-stream/`,
        query,
      ),
    ),

  s3IdHasFileGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<void, TS3IdHasFileGetError>,
    IBEError<TS3IdHasFileGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/s3/${id}hasFile/`)),

  s3UploadPost: (): CustomPromise<
    CustomAxiosResponse<void, TS3UploadPostError>,
    IBEError<TS3UploadPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/s3/upload/`)),

  streamIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Array<IStreamResponse>, TStreamIdDeleteError>,
    IBEError<TStreamIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/stream/${id}`)),

  streamIdPut: (
    id: string,
    body: IPutRezkaMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<IStreamResponse, TStreamIdPutError>,
    IBEError<TStreamIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/stream/${id}`), body),

  streamIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IStreamResponse, TStreamIdGetError>,
    IBEError<TStreamIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/stream/${id}`)),

  streamPost: (
    body: IPostRezkaMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<Array<IStreamResponse>, TStreamPostError>,
    IBEError<TStreamPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/stream/`), body),

  streamGet: (
    query: { imdb_id?: string } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IStreamResponse>, TStreamGetError>,
    IBEError<TStreamGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/stream/`, query)),

  toolsSetupPost: (
    body: ISetupBody,
  ): CustomPromise<
    CustomAxiosResponse<string[], TToolsSetupPostError>,
    IBEError<TToolsSetupPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/tools/setup/`), body),

  torrentIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<ITorrentInfoResponse, TTorrentIdGetError>,
    IBEError<TTorrentIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/torrent/${id}`)),

  torrentIdPut: (
    id: string,
    body: ITorrentInfoResponse,
  ): CustomPromise<
    CustomAxiosResponse<void, TTorrentIdPutError>,
    IBEError<TTorrentIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/torrent/${id}`), body),
})

const URL = {
  cdnIdGet: (id: string): string => `api/cdn/${id}`,
  cdnIdHasFileGet: (id: string): string => `api/cdn/${id}hasFile/`,
  cdnUploadPost: (): string => `api/cdn/upload/`,
  cypressImdbGet: (): string => `api/cypress/imdb/`,
  cypressStreamsGet: (): string => `api/cypress/streams/`,
  groupMovieGet: (): string => `api/group-movie/`,
  imdbGet: (): string => `api/imdb/`,
  imdbPost: (): string => `api/imdb/`,
  imdbIdDelete: (id: string): string => `api/imdb/${id}`,
  imdbIdGet: (id: string): string => `api/imdb/${id}`,
  imdbIdPut: (id: string): string => `api/imdb/${id}`,
  groupMovieIdGet: (id: string): string => `api/group-movie/${id}`,
  imdbSearchPost: (): string => `api/imdb/search/`,
  movieIdDelete: (id: string): string => `api/movie/${id}`,
  movieIdGet: (id: string): string => `api/movie/${id}`,
  movieIdPut: (id: string): string => `api/movie/${id}`,
  movieGet: (): string => `api/movie/`,
  moviePost: (): string => `api/movie/`,
  movieSearchGet: (): string => `api/movie/search/`,
  parserHurtomAllPost: (): string => `api/parser/hurtom-all/`,
  parserHurtomDetailsPost: (): string => `api/parser/hurtom-details/`,
  parserRezkaAllPost: (): string => `api/parser/rezka-all/`,
  parserRezkaDetailsPost: (): string => `api/parser/rezka-details/`,
  rezkaMovieIdDelete: (id: string): string => `api/rezka-movie/${id}`,
  rezkaMovieIdGet: (id: string): string => `api/rezka-movie/${id}`,
  rezkaMovieIdPut: (id: string): string => `api/rezka-movie/${id}`,
  rezkaMovieGet: (): string => `api/rezka-movie/`,
  rezkaMoviePost: (): string => `api/rezka-movie/`,
  s3IdGet: (id: string): string => `api/s3/${id}`,
  rezkaMovieSearchRezkaWithoutStreamGet: (): string =>
    `api/rezka-movie/search-rezka-without-stream/`,
  s3IdHasFileGet: (id: string): string => `api/s3/${id}hasFile/`,
  s3UploadPost: (): string => `api/s3/upload/`,
  streamIdDelete: (id: string): string => `api/stream/${id}`,
  streamIdPut: (id: string): string => `api/stream/${id}`,
  streamIdGet: (id: string): string => `api/stream/${id}`,
  streamPost: (): string => `api/stream/`,
  streamGet: (): string => `api/stream/`,
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

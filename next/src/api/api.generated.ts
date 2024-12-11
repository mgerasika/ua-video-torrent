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
    : ENV.LOCAL; //'http://178.210.131.101:8004/'

console.log('API_SERVER_URL', API_SERVER_URL)
// DON'T REMOVE THIS COMMENTS!!! Code between comments auto-generated
// INSERT START
export interface IGroupMovieResponse {
  year: string;
  genre: string
  enName: string
  uaName: string;
  imdb_id: string
  imdb_rating: number
  poster: string
  movies: IGroupMovieItem[]
}
export interface IGroupMovieItem {
  title: string
  size: number
  torrent_url: string
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
  torrent_url: string
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
export interface IPostMovieBody {
  en_name: string
  ua_name: string
  href: string
  year: number
  title: string
  download_id: string
  size: number
  torrent_url: string
  imdb?: ImdbDto
  imdb_id?: string
  hurtom_imdb_id: string
}
export interface IPutMovieBody {
  en_name: string
  ua_name: string
  href: string
  year: number
  title: string
  download_id: string
  size: number
  torrent_url: string
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
  torrent_url: string
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
export interface ISetupBody {
  updateHurtom: boolean
  uploadToCdn: boolean
  searchImdb: boolean
  searchImdbIdInHurtom: boolean
  fixRelationIntoMovieDb: boolean
  uploadTorrentToS3FromMovieDB: boolean
}
export interface ITorrentInfoResponse {
  peers: number
}
export type TCdnIdGetError = '' | 'undefined'
export type TCdnIdHasFileGetError = '' | 'undefined'
export type TCdnUploadPostError = '' | 'undefined'
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
export type TParserHurtomAllPostError = '' | 'undefined'
export type TParserHurtomDetailsPostError = '' | 'undefined'
export type TS3IdGetError = '' | 'undefined'
export type TS3IdHasFileGetError = '' | 'undefined'
export type TS3UploadPostError = '' | 'undefined'
export type TToolsSetupPostError = '' | 'undefined'
export type TTorrentIdGetError = '' | 'undefined'
export type TTorrentIdPutError = '' | 'undefined'
export type TPartialErrorCodes =
  | TCdnIdGetError
  | TCdnIdHasFileGetError
  | TCdnUploadPostError
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
  | TParserHurtomAllPostError
  | TParserHurtomDetailsPostError
  | TS3IdGetError
  | TS3IdHasFileGetError
  | TS3UploadPostError
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

  s3IdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<string, TS3IdGetError>,
    IBEError<TS3IdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/s3/${id}`)),

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
  parserHurtomAllPost: (): string => `api/parser/hurtom-all/`,
  parserHurtomDetailsPost: (): string => `api/parser/hurtom-details/`,
  s3IdGet: (id: string): string => `api/s3/${id}`,
  s3IdHasFileGet: (id: string): string => `api/s3/${id}hasFile/`,
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

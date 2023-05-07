/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disabled no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ENV } from "@src/env";
import {
  CustomAxiosResponse,
  CustomPromise,
  IBEError,
  IRequestService,
  formatUrl,
  requestService,
} from "swagger-to-typescript2";

const API_SERVER_URL =
  process.env.NODE_ENV === "development" ? ENV.LOCAL : ENV.FIREBASE_SERVER_URL;

// DON'T REMOVE THIS COMMENTS!!! Code between comments auto-generated
// INSERT START
export interface IImdbResponse {
  id: string;
  en_name: string;
  poster: string;
  imdb_rating: number;
  year: number;
  json: string;
}
export interface IPostImdbBody {
  en_name: string;
  poster: string;
  imdb_rating: number;
  year: number;
  json: string;
}
export interface IPutImdbBody {
  en_name: string;
  poster: string;
  imdb_rating: number;
  year: number;
  json: string;
}
export interface IMovieResponse {
  imdb_id: string;
  id: string;
  en_name: string;
  ua_name: string;
  href: string;
  year: number;
  title: string;
  download_id: string;
  size: number;
  aws_s3_torrent_url: string;
}
export interface IGroupMovieResponse {
  enName: string;
  imdb_rating: number;
  poster: string;
  movies: ISearchMovieResponse[];
}
export interface ISearchMovieResponse {
  id: string;
  en_name: string;
  poster: string;
  imdb_rating: number;
  year: number;
  imdb_id: string;
  ua_name: string;
  href: string;
  title: string;
  download_id: string;
  size: number;
  aws_s3_torrent_url: string;
}
export interface IPostMovieBody {
  imdb_id: string;
  en_name: string;
  ua_name: string;
  href: string;
  year: number;
  title: string;
  download_id: string;
  size: number;
  aws_s3_torrent_url: string;
}
export interface IPutMovieBody {
  imdb_id: string;
  en_name: string;
  ua_name: string;
  href: string;
  year: number;
  title: string;
  download_id: string;
  size: number;
  aws_s3_torrent_url: string;
}
export interface IHurtomInfoResponse {
  id: string;
  name: string;
  year: string;
  uaName: string;
  enName: string;
  href: string;
  size: number;
  downloadId: string;
}
export interface ISearchImdbBody {
  enName: string;
  year: string;
}
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
export interface IError {
  message: string;
  code: string;
}
export interface ISetupBody {
  updateHurtom: boolean;
  updateImdb: boolean;
  uploadTorrentToS3FromMovieDB: boolean;
}
export type TImdbIdDeleteError = "" | "undefined";
export type TImdbIdGetError = "" | "undefined";
export type TImdbIdPutError = "" | "undefined";
export type TImdbGetError = "" | "undefined";
export type TImdbPostError = "" | "undefined";
export type TMovieIdDeleteError = "" | "undefined";
export type TMovieIdGetError = "" | "undefined";
export type TMovieIdPutError = "" | "undefined";
export type TMovieGetError = "" | "undefined";
export type TMoviePostError = "" | "undefined";
export type TMovieGroupSearchIdGetError = "" | "undefined";
export type TMovieGroupSearchGetError = "" | "undefined";
export type TMovieSearchGetError = "" | "undefined";
export type TToolsUploadPostError = "" | "undefined";
export type TToolsGetHurtomAllGetError = "" | "undefined";
export type TToolsSearchImdbInfoPostError = "" | "undefined";
export type TToolsSetupPostError = "" | "undefined";
export type TPartialErrorCodes =
  | TImdbIdDeleteError
  | TImdbIdGetError
  | TImdbIdPutError
  | TImdbGetError
  | TImdbPostError
  | TMovieIdDeleteError
  | TMovieIdGetError
  | TMovieIdPutError
  | TMovieGetError
  | TMoviePostError
  | TMovieGroupSearchIdGetError
  | TMovieGroupSearchGetError
  | TMovieSearchGetError
  | TToolsUploadPostError
  | TToolsGetHurtomAllGetError
  | TToolsSearchImdbInfoPostError
  | TToolsSetupPostError
  | "";

export const createApiRequest = (rs: IRequestService) => ({
  imdbIdDelete: (
    id: string
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdDeleteError>,
    IBEError<TImdbIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/imdb/${id}`)),

  imdbIdGet: (
    id: string
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdGetError>,
    IBEError<TImdbIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/imdb/${id}`)),

  imdbIdPut: (
    id: string,
    body: IPutImdbBody
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdPutError>,
    IBEError<TImdbIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/imdb/${id}`), body),

  imdbGet: (
    query: { page?: number; limit?: number } | undefined
  ): CustomPromise<
    CustomAxiosResponse<Array<IImdbResponse>, TImdbGetError>,
    IBEError<TImdbGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/imdb/`, query)),

  imdbPost: (
    body: IPostImdbBody
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbPostError>,
    IBEError<TImdbPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/imdb/`), body),

  movieIdDelete: (
    id: string
  ): CustomPromise<
    CustomAxiosResponse<Array<IMovieResponse>, TMovieIdDeleteError>,
    IBEError<TMovieIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/movie/${id}`)),

  movieIdGet: (
    id: string
  ): CustomPromise<
    CustomAxiosResponse<IMovieResponse, TMovieIdGetError>,
    IBEError<TMovieIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/movie/${id}`)),

  movieIdPut: (
    id: string,
    body: IPutMovieBody
  ): CustomPromise<
    CustomAxiosResponse<IMovieResponse, TMovieIdPutError>,
    IBEError<TMovieIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/movie/${id}`), body),

  movieGet: (
    query: { page?: number; limit?: number } | undefined
  ): CustomPromise<
    CustomAxiosResponse<Array<IMovieResponse>, TMovieGetError>,
    IBEError<TMovieGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/movie/`, query)),

  moviePost: (
    body: IPostMovieBody
  ): CustomPromise<
    CustomAxiosResponse<Array<IMovieResponse>, TMoviePostError>,
    IBEError<TMoviePostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/movie/`), body),

  movieGroupSearchIdGet: (
    id: string,
    query: { page?: number; limit?: number } | undefined
  ): CustomPromise<
    CustomAxiosResponse<IGroupMovieResponse, TMovieGroupSearchIdGetError>,
    IBEError<TMovieGroupSearchIdGetError>
  > =>
    rs.get(formatUrl(API_SERVER_URL + `api/movie/group-search/${id}`, query)),

  movieGroupSearchGet: (
    query: { page?: number; limit?: number } | undefined
  ): CustomPromise<
    CustomAxiosResponse<Array<IGroupMovieResponse>, TMovieGroupSearchGetError>,
    IBEError<TMovieGroupSearchGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/movie/group-search/`, query)),

  movieSearchGet: (
    query: { page?: number; limit?: number } | undefined
  ): CustomPromise<
    CustomAxiosResponse<Array<ISearchMovieResponse>, TMovieSearchGetError>,
    IBEError<TMovieSearchGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/movie/search/`, query)),

  toolsUploadPost: (): CustomPromise<
    CustomAxiosResponse<void, TToolsUploadPostError>,
    IBEError<TToolsUploadPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/tools/upload/`)),

  toolsGetHurtomAllGet: (
    query: { page?: number; limit?: number } | undefined
  ): CustomPromise<
    CustomAxiosResponse<Array<IHurtomInfoResponse>, TToolsGetHurtomAllGetError>,
    IBEError<TToolsGetHurtomAllGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/tools/get-hurtom-all/`, query)),

  toolsSearchImdbInfoPost: (
    body: ISearchImdbBody
  ): CustomPromise<
    CustomAxiosResponse<IImdbResultResponse, TToolsSearchImdbInfoPostError>,
    IBEError<TToolsSearchImdbInfoPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/tools/search-imdb-info/`), body),

  toolsSetupPost: (
    body: ISetupBody
  ): CustomPromise<
    CustomAxiosResponse<string[], TToolsSetupPostError>,
    IBEError<TToolsSetupPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/tools/setup/`), body),
});

const URL = {
  imdbIdDelete: (id: string): string => `api/imdb/${id}`,
  imdbIdGet: (id: string): string => `api/imdb/${id}`,
  imdbIdPut: (id: string): string => `api/imdb/${id}`,
  imdbGet: (): string => `api/imdb/`,
  imdbPost: (): string => `api/imdb/`,
  movieIdDelete: (id: string): string => `api/movie/${id}`,
  movieIdGet: (id: string): string => `api/movie/${id}`,
  movieIdPut: (id: string): string => `api/movie/${id}`,
  movieGet: (): string => `api/movie/`,
  moviePost: (): string => `api/movie/`,
  movieGroupSearchIdGet: (id: string): string => `api/movie/group-search/${id}`,
  movieGroupSearchGet: (): string => `api/movie/group-search/`,
  movieSearchGet: (): string => `api/movie/search/`,
  toolsUploadPost: (): string => `api/tools/upload/`,
  toolsGetHurtomAllGet: (): string => `api/tools/get-hurtom-all/`,
  toolsSearchImdbInfoPost: (): string => `api/tools/search-imdb-info/`,
  toolsSetupPost: (): string => `api/tools/setup/`,
};
// INSERT END
// DON'T REMOVE THIS COMMENTS!!!

export const API_URL = URL;
export const api = {
  ...createApiRequest(requestService),
};

import { movie } from './movie';
import { imdb } from './imdb';
import { tools } from './tools';
import { s3 } from './s3';
import { cdn } from './cdn';
import { parser } from './parser';
import { groupMovie } from './group-movie';
import { torrent } from './torrent';

export const dbService = {
    movie,
    groupMovie,
    imdb,
    tools,
    s3,
    cdn,
    parser,
    torrent,
};

import { IGroupMovieResponse, api } from './api.generated'

let _movies: IGroupMovieResponse[] | undefined = undefined
export const getMoviesAsync = async () => {
  if (_movies) {
    return _movies
  }
  const data = await api.movieGroupSearchGet({})
  if (data.error) {
    throw data.error
  }
  _movies = data.data.filter(
    movie =>
      !movie.enName.includes('%') &&
      movie.movies.some(subMovie => subMovie.aws_s3_torrent_url),
  )
  return _movies
}

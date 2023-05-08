import { api } from './api.generated'

export const getMoviesAsync = async () => {
  const data = await api.movieGroupSearchGet({})
  if (data.error) {
    throw data.error
  }
  const movies = data.data.filter(
    movie =>
      !movie.enName.includes('%') &&
      movie.movies.some(subMovie => subMovie.aws_s3_torrent_url),
  )
  return movies
}

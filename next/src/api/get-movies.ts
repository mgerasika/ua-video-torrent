import { IGroupMovieResponse, api } from './api.generated'

export const getMoviesAsync = async () => {
  const response = await api.groupMovieGet({})
  if (response.error) {
    throw response.error
  }
  return response.data.filter(groupMovie =>
    groupMovie.movies.some(subMovie => subMovie.aws_s3_torrent_url),
  )
}

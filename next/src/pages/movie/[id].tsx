import {
  IGroupMovieResponse,
  IStreamResponse,
  api,
} from '../../api/api.generated'
import { getMoviesAsync } from '../../api/get-movies'
import { MovieDetailed } from '../../features/movie-detailed/components/movie-detailed.component'

interface IProps {
  movie: IGroupMovieResponse
  streams: IStreamResponse[]
}
export default function Movie({ movie, streams }: IProps) {
  return <MovieDetailed movie={movie} streams={streams} />
}

export async function getStaticProps({
  params,
}: {
  params: { id: string }
}): Promise<{
  props: IProps
}> {
  const groupMovie = await api.groupMovieIdGet(params.id, {})
  const streams = await api.streamGet({
    imdb_id: groupMovie.data.imdb_id,
  })

  return { props: { movie: groupMovie.data, streams: streams.data } }
}

export async function getStaticPaths() {
  const response = await api.groupMovieGet({})
  return {
    paths: response.data.map(groupMovie => {
      return {
        params: { id: groupMovie.imdb_id },
      }
    }),
    fallback: false,
  }
}

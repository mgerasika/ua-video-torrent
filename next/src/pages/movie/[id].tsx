import { IGroupMovieResponse, api } from '../../api/api.generated'
import { MovieDetailed } from '../../features/movie-detailed/components/movie-detailed.component'

interface IProps {
  movie: IGroupMovieResponse
}
export default function Movie({ movie }: IProps) {
  return <MovieDetailed movie={movie} />
}

export async function getStaticProps({
  params,
}: {
  params: { id: string }
}): Promise<{
  props: IProps
}> {
  const groupMovie = await api.groupMovieIdGet(params.id, {})

  return {
    props: {
      movie: groupMovie.data,
    },
  }
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

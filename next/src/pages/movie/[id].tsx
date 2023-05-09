import { IGroupMovieResponse, api } from '../../api/api.generated'
import { getMoviesAsync } from '../../api/get-movies'
import { MovieDetailed } from '../../features/movie-detailed/components/movie-detailed.component'

interface IProps {
  movie: IGroupMovieResponse
}
export default function Movie({ movie }: IProps) {
  return <MovieDetailed movie={movie} />
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const groupMovie = await api.movieGroupSearchIdGet(params.id, {})

  return { props: { movie: groupMovie.data } }
}

export async function getStaticPaths() {
  const response = await api.movieGroupSearchGet({})
  return {
    paths: response.data.map(groupMovie => {
      return {
        params: { id: groupMovie.imdb_original_id },
      }
    }),
    fallback: false,
  }
}

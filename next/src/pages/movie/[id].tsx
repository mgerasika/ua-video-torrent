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
  const data = await api.movieGroupSearchIdGet(
    decodeURIComponent(params.id),
    {},
  )

  return { props: { movie: data.data } }
}

export async function getStaticPaths() {
  const movies = await getMoviesAsync()

  return {
    paths: movies.map(movie => {
      return { params: { id: movie.enName } }
    }),
    fallback: false,
  }
}

import tw from 'twin.macro'
import { IGroupMovieResponse, api } from '../api/api.generated'
import { MoviesComponent } from '../features/movies/components/movies.component'
import { getMoviesAsync } from '../api/get-movies'
import MoviesListByPage, { PAGE_SIZE } from './[page]'

interface IProps {
  movies: IGroupMovieResponse[]
}
const App = ({ movies }: IProps) => {
  return (
    <>
      <MoviesListByPage page={'0'} movies={movies} />
    </>
  )
}

export async function getStaticProps() {
  const movies = await getMoviesAsync()

  return {
    props: {
      movies: movies.slice(0, PAGE_SIZE),
    },
  }
}

export default App

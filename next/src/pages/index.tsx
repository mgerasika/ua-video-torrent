import tw from 'twin.macro'
import {  IGroupMovieResponse, api } from '../api/api.generated'
import { MoviesComponent } from '../features/movies/components/movies.component'

interface IProps {
  movies: IGroupMovieResponse[]
}
const App = ({ movies }: IProps) => <MoviesComponent movies={movies} />

export async function getStaticProps() {
  const data = await api.movieGroupSearchGet({})

  return { props: { movies: data.data } }
}

export default App

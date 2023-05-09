import tw from 'twin.macro'
import { IGroupMovieResponse, api } from '../api/api.generated'
import { MoviesComponent } from '../features/movies/components/movies.component'
import { getMoviesAsync } from '../api/get-movies'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useScrollEnd } from '../use-scroll-end.hook'

interface IProps {
  page: string
  allMovies: IGroupMovieResponse[]
}
const PAGE_SIZE = 20

const App = ({ allMovies }: IProps) => {
  const [page, setPage] = useState(0)

  const movies = useMemo(() => {
    return allMovies.slice(
      0,
      Math.min(allMovies.length, PAGE_SIZE * (page + 1)),
    )
  }, [page])

  const handleScrollEnd = useCallback(() => {
    setPage(prev => prev + 1)
  }, [page])

  useScrollEnd({
    onScrollEnd: handleScrollEnd,
  })

  return (
    <div>
      <MoviesComponent movies={movies} />
      <div tw="p-6 text-center text-2xl">
        <div onClick={() => setPage(prev => prev + 1)} tw="text-white ">
          Next
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const movies = await getMoviesAsync()

  return {
    props: {
      allMovies: movies,
    },
  }
}

export default App

import tw from 'twin.macro'
import { IGroupMovieResponse, api } from '../api/api.generated'
import { MoviesComponent } from '../features/movies/components/movies.component'
import { getMoviesAsync } from '../api/get-movies'
import Link from 'next/link'
import { useScrollEnd } from '../use-scroll-end.hook'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

interface IProps {
  page: string
  movies: IGroupMovieResponse[]
}
const MoviesListByPage = ({ movies, page }: IProps) => {
  const router = useRouter()
  const handleScrollEnd = useCallback(() => {
    const nextPage = +page + 1
    router.push(`/${nextPage}`)
  }, [page])

  useScrollEnd({
    onScrollEnd: handleScrollEnd,
  })
  return (
    <div>
      {/* <div tw="text-white">page = {page}</div> */}
      <MoviesComponent movies={movies} />
      <div tw="p-6 text-center text-2xl">
        <Link href={`/${+page + 1}`} tw="text-white ">
          Next
        </Link>
      </div>
      <div id="page-end" />
    </div>
  )
}

export const PAGE_SIZE = 20
export async function getStaticProps({ params }: { params: { page: string } }) {
  const movies = await getMoviesAsync()
  //params.page
  const startIdx = PAGE_SIZE * +params.page
  const endIdx = Math.min(movies.length, PAGE_SIZE * (+params.page + 1))
  return {
    props: {
      movies: movies.slice(startIdx, endIdx),
      page: params.page,
    },
  }
}

export async function getStaticPaths() {
  const movies = await getMoviesAsync()
  const pages = Math.ceil(movies.length / PAGE_SIZE)
  return {
    paths: Array.from({ length: pages }, (_, idx) => idx).map((_, index) => {
      return { params: { page: index + '' } }
    }),
    fallback: false,
  }
}

export default MoviesListByPage

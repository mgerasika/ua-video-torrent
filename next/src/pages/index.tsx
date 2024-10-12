import tw from 'twin.macro'
import {
  IGroupMovieResponse,
  api,
} from '../api/api.generated'
import { MoviesComponent } from '../features/movies/components/movies.component'
import { getMoviesAsync } from '../api/get-movies'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useScrollEnd } from '../use-scroll-end.hook'

interface IProps {
  page: string
  allMovies: IGroupMovieResponse[]
  allGenres: string[]
  allYears: string[]
}
const PAGE_SIZE = 20

const App = ({ allMovies, allGenres, allYears }: IProps) => {

  return (
      <MoviesComponent allMovies={allMovies}  allGenres={allGenres}
        allYears={allYears} />
     
  )
}

export async function getStaticProps(): Promise<{
  props: Omit<IProps, 'page'>
}> {
  const movies = await getMoviesAsync()
  const genres = movies.slice(0,5).map(movie => movie.genre)
  const currentYear = new Date().getFullYear()
  return {
    props: {
      allGenres: genres
        .join(',')
        .split(',')
        .map(f => f.trim())
        .reduce((acc: string[], it: string) => {
          if (!acc.includes(it)) {
            acc.push(it)
          }
          return acc
        }, []),
      allYears: [
        '1900-1979',
        '1980-1999',
        `2000-${currentYear - 2}`,
        (currentYear - 1).toString(),
        currentYear.toString(),
      ],
      allMovies: movies,
    },
  }
}

export default App

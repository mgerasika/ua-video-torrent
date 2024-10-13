import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MovieCard } from './movie-card.component'
import { IGroupMovieResponse } from '../../../api/api.generated'
import 'twin.macro'
import { IMovieFilter } from '../../../interfaces/movie-filter.interface'
import { useLocalStorageState } from '../../../hooks/use-local-storage-state.hook'
import { useScrollEnd } from '../../../hooks/use-scroll-end.hook'
import { ALL_LANG, MovieFilter } from './movie-filter.component'
import { useRestoreScroll } from '../../../hooks/use-restore-scroll.hook'
import { ArrowUpOutlined } from '@ant-design/icons'

const PAGE_SIZE = 20

interface IProps {
  allMovies: IGroupMovieResponse[]
  allGenres: string[]
  allYears: string[]
}
export const MoviesComponent = ({
  allMovies,
  allGenres,
  allYears,
}: IProps): JSX.Element => {
  const [filter, setFilter] = useLocalStorageState<IMovieFilter>('filter-v3', {
    genres: [],
    years: [],
    languages: [],
    searchText: '',
  })

  const [page, setPage] = useState(0)

  const filteredMovies = useMemo<IGroupMovieResponse[]>(() => {
    let res = [...allMovies]

    if (filter.searchText) {
      const search = filter.searchText.toLowerCase()
      res = res.filter(
        movie =>
          movie.enName.toLowerCase().includes(search) ||
          movie.uaName.toLowerCase().includes(search),
      )
    }

    if (filter?.genres.length) {
      res = res.filter(movie =>
        filter.genres.some(filterGenre => movie.genre.includes(filterGenre)),
      )
    }

    // if (filter?.languages.length) {
    //   res = res.filter(movie => {
    //     if (movie.has_en && filter.languages.includes(ALL_LANG[0])) {
    //       return true
    //     }
    //     if (movie.has_ua && filter.languages.includes(ALL_LANG[1])) {
    //       return true
    // }

    if (filter?.years.length) {
      const YEAR_PAIRS = filter.years.map(year => {
        const yearPair = year.split('-')
        return {
          from: +yearPair[0],
          to: +yearPair[yearPair.length - 1],
        }
      })
      res = res.filter(movie => {
        return YEAR_PAIRS.some(
          yearPair =>
            +movie.year >= yearPair.from && +movie.year <= yearPair.to,
        )
      })
    }
    return res
  }, [allMovies, filter])

  const movies = useMemo(() => {
    return filteredMovies?.slice(
      0,
      Math.min(filteredMovies.length, PAGE_SIZE * (page + 1)),
    )
  }, [page, filteredMovies])

  const hasNext = useMemo(() => {
    return PAGE_SIZE * (page + 1) < filteredMovies.length
  }, [page, filteredMovies])

  const handleScrollEnd = useCallback(() => {
    setPage(prev => {
      const newVal = prev + 1
      sessionStorage.setItem('page', newVal + '')
      return newVal
    })
  }, [page])

  const handleScrollTop = useCallback(() => {
   window.scrollTo(0,0);
  }, [])

  useEffect(() => {
    const newPage = sessionStorage.getItem('page')
    if (newPage) {
      setPage(+newPage)
    }
  }, [])

  const {scrollY} = useScrollEnd({
    onScrollEnd: handleScrollEnd,
  })

  useRestoreScroll()

  const handleFilterChange = useCallback((settings: IMovieFilter) => {
    setPage(0)
    sessionStorage.setItem('page', 0 + '')
    setFilter(settings)
  }, [])

  return (
    <div tw="mx-auto container px-4">
      <h2 tw="text-white text-[30px] text-center  py-4 relative">
        HD Cartoons
        {/* <sup tw="text-sm absolute top-2">
          from <a href="https://toloka.to/" tw="text-blue-300 underline" target="blank">
          toloka.to
        </a>
        </sup> */}
       
      </h2>
      <MovieFilter
        allGenres={allGenres}
        allYears={allYears}
        filter={filter}
        onFilterChange={handleFilterChange}
      />
      <div tw="text-left text-white pb-1 ">&nbsp;
        {filteredMovies.length === allMovies.length ? (
          <>Total - {allMovies.length}</>
        ) : (
          <>
            Found - {filteredMovies.length} / Total - {allMovies.length}
          </>
        )}
      </div>
      <div tw="px-3 grid 2xl:grid-cols-5 md:grid-cols-2 lg:grid-cols-3 grid-cols-1  gap-x-6 gap-y-12  justify-items-center">
        {movies?.map(movie => {
          return <MovieCard key={movie.enName} movie={movie} />
        })}
      </div>
      {scrollY > 0 ? (
          <div onClick={handleScrollTop} tw="opacity-60 text-white fixed right-4 bottom-4 [border: 1px solid white] [border-radius: 50%] [background-color: #5e2750] w-16 h-16 flex items-center justify-between">
            <ArrowUpOutlined tw="mx-auto text-3xl" />
          </div>
        ) : null}
      <div tw="p-6 text-center text-2xl">
        {hasNext ? (
          <div onClick={handleScrollEnd} tw="text-white ">
            Next
          </div>
        ) : null}
      </div>
    </div>
  )
}

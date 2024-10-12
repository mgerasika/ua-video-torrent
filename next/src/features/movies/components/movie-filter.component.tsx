import { useCallback, useEffect, useRef, useState } from 'react'
import { SelectedButton } from '../../../general-ui/selected-button/selected-button.component'
import { IMovieFilter } from '../../../interfaces/movie-filter.interface'
import 'twin.macro'
import { SelectButtonList } from '../../../general-ui/select-button-list/select-button-list.component'
import { useIsMounted } from '../../../use-is-mounted.hook'
import { SearchInput } from '../../../general-ui/search-input/search-input.component'

export const ALL_LANG = ['audio original', 'audio ukrainian']
interface IProps {
  allGenres: string[]
  allYears: string[]
  filter: IMovieFilter
  onFilterChange: (filter: IMovieFilter) => void
}
export const MovieFilter = ({
  allGenres,
  filter,
  allYears,
  onFilterChange,
}: IProps) => {

 

  const isMounted = useIsMounted()
  const handleGenreChange = useCallback(
    (newValues: string[]) => {
      onFilterChange({
        ...filter,
        genres: newValues,
      })
    },
    [filter, onFilterChange],
  )


  const handleYearsChange = useCallback(
    (newValues: string[]) => {
      onFilterChange({
        ...filter,
        years: newValues,
      })
    },
    [filter, onFilterChange],
  )

  const handleLanguageChange = useCallback(
    (newValues: string[]) => {
      onFilterChange({
        ...filter,
        languages: newValues,
      })
    },
    [filter, onFilterChange],
  )

  const handleSearchTextChange = useCallback(
    (text: string) => {
      onFilterChange({
        ...filter,
        searchText: text,
      })
    },
    [filter, onFilterChange],
  )
  return (
    <div tw="text-white">
		  <SearchInput
			  tw="mx-1 mb-2"
        text={filter.searchText}
        onTextChange={handleSearchTextChange}
      />

      <SelectButtonList
        showAll={false}
        allItems={allYears}
        onChange={handleYearsChange}
        value={filter.years}
      />


      {/* <SelectButtonList
        showAll={false}
        allItems={ALL_LANG}
        onChange={handleLanguageChange}
        value={filter.languages}
      /> */}

      <SelectButtonList
        showAll={false}
        allItems={allGenres}
        onChange={handleGenreChange}
        value={filter.genres}
      />
    </div>
  )
}

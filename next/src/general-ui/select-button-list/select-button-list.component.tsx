import { useCallback } from 'react'
import { SelectedButton } from '../selected-button/selected-button.component'
import 'twin.macro'

interface IProps {
  className?: string
  allItems: string[]
  value?: string[]
  showAll?: boolean
  onChange: (data: string[]) => void
}
export const SelectButtonList = ({
  className,
  allItems,
  value = [],
  showAll = true,
  onChange,
}: IProps) => {
  const handleGenreChange = useCallback(
    (name: string, selected: boolean) => {
      if (selected) {
        onChange([...value, name])
      } else {
        onChange([...value.filter(f => f !== name)])
      }
    },
    [value, onChange],
  )

  const handleAllGenreChange = useCallback(
    (name: string, selected: boolean) => {
      if (selected) {
        onChange([...allItems])
      } else {
        onChange([])
      }
    },
    [value, onChange],
  )

  return (
    <div className={className}>
      <div tw="float-left">
        {showAll && (
          <SelectedButton
            name={'all'}
            tw="mr-1 mb-1"
            title={value.length === allItems.length ? 'none' : 'all'}
            onChange={handleAllGenreChange}
            selected={value.length === allItems.length}
          />
        )}
        {allItems.map(item => {
          return (
            <SelectedButton
              tw="mr-1 mb-1"
              key={item}
              name={item}
              title={item}
              onChange={handleGenreChange}
              selected={value?.includes(item)}
            />
          )
        })}
      </div>
      <div tw="clear-both "></div>
    </div>
  )
}

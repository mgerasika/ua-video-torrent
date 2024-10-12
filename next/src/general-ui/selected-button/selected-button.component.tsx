import { useCallback } from 'react'
import tw from 'twin.macro'

interface IProps {
  onChange: (name: string, selected: boolean) => void
  title: string
  name: string
  selected: boolean
  className?: string
}
export const SelectedButton = ({
  name,
  title,
  onChange,
  className,
  selected,
}: IProps): JSX.Element => {
  const handleOnChange = useCallback(() => {
    onChange(name, !selected)
  }, [name, selected, onChange])
  return (
    <button
      className={className}
      type="button"
      onClick={handleOnChange}
      tw="text-white [border-radius: 6px] px-2 py-0   bg-gray-700 lowercase"
      css={styles.root(selected)}
    >
      {title}
    </button>
  )
}

const styles = {
  root: (selected: boolean) => [selected && tw`bg-blue-600`],
}

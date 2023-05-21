import 'twin.macro'
import { IGroupMovieResponse } from '../../../api/api.generated'
import Link from 'next/link'

interface IProps {
  movie: IGroupMovieResponse
  hasStream: boolean
}
export const MovieCard = ({ movie, hasStream }: IProps): JSX.Element => {
  return (
    //   bg-black relative transition duration-200 ease-in transform hover:scale-110
    <Link
      tw="w-full flex flex-col items-center cursor-pointer"
      href={'/movie/' + movie.imdb_id}
    >
      <div tw="relative w-[300px] transition duration-200 ease-in transform hover:scale-110">
        <img
          src={movie.poster || ''}
          tw="w-full h-[429px] [object-fit: cover]"
          alt=""
        />
        <p tw="text-white [font-size: larger] top-2 left-2 absolute bg-black px-2 py-1 border-solid border-white [border-width: 1px]">
          {movie.imdb_rating}
        </p>

        {!hasStream && (
          <p tw="text-red-400 [font-size: larger] top-2 right-2 absolute bg-black px-2 py-1 border-solid border-red-400 [border-width: 1px]">
            ! no stream
          </p>
        )}

        <p tw="text-white [font-size: larger] pt-2 text-center">
          {movie.enName}
        </p>
      </div>
    </Link>
  )
}

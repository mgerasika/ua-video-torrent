import React from 'react'
import 'twin.macro'
import Link from 'next/link'
import { IGroupMovieResponse } from '../../../api/api.generated'

interface IProps {
  movie: IGroupMovieResponse | undefined
}
export const MovieDetailed = ({ movie }: IProps): JSX.Element => {
  return (
    //   bg-black relative transition duration-200 ease-in transform hover:scale-110
    <div tw="container min-h-screen mx-auto lg:px-32">
      <Link href="/">
        <h2 tw="text-white text-[40px] py-4 cursor-pointer">Back</h2>
      </Link>
      <div tw="flex relative">
        <img
          src={movie?.poster || ''}
          tw="w-[300px] h-[429px] [object-fit: cover]"
          alt=""
        />
        <p tw="text-white [font-size: larger] top-2 left-2 absolute bg-black px-2 py-1 border-solid border-white [border-width: 1px]">
          {movie?.imdb_rating}
        </p>
        <div tw="px-4">
          <p tw="text-white [font-size:30px] pt-2 text-center">
            {movie?.enName}
          </p>
        </div>
      </div>
      <div tw="py-2">
        {movie?.movies.map(movie => (
          <div tw="text-white pb-1" key={movie.href}>
            <a
              tw="cursor-pointer"
              target="_blank"
              href={movie.aws_s3_torrent_url}
              rel="noreferrer"
            >
              {' '}
              {movie.title} - ({movie.size} GB)
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

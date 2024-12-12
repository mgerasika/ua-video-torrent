import React, { useMemo, useState } from 'react'
import 'twin.macro'
import Link from 'next/link'
import { IGroupMovieResponse } from '../../../api/api.generated'
import { CloudDownloadOutlined } from '@ant-design/icons'


interface IProps {
  movie: IGroupMovieResponse | undefined
}
export const MovieDetailed = ({ movie }: IProps): JSX.Element => {
  return (
    //   bg-black relative transition duration-200 ease-in transform hover:scale-110
    <div tw="container min-h-screen mx-auto lg:px-32">
      <div tw="flex p-4">
        <Link href="/" tw="cursor-pointer text-white  pt-3 ">
          Back
        </Link>
        <h3 tw="text-white w-full text-center [font-size:30px] ">
          {movie?.enName}
        </h3>
      </div>
      <div tw="flex flex-col lg:flex-row">
        <div tw="relative order-2 lg:order-1 mx-auto min-w-[300px] min-h-[429px] ">
          <img
            src={movie?.poster || ''}
            tw="[object-fit: cover]"
            alt=""
          />
          <p  tw="text-white [font-size: larger] top-2 left-2 absolute [background: #374151 ]  px-2 py-1 border-solid border-white [border-width: 1px]">
            {movie?.imdb_rating}
          </p>
        </div>
        <div tw="py-2 px-4 order-2">
          <h3 tw="text-white text-xl pb-2">Download torrent</h3>
          <ul>
            {movie?.movies.sort((a,b) => b.size - a.size).map(torrent => (
              <li tw="text-white pb-3" key={torrent.torrent_url}>
                <a
                  tw="cursor-pointer"
                  target="_blank"
                  href={encodeURI(torrent.torrent_url)}
                  rel="noreferrer"
                >
                  {' '}
                  <CloudDownloadOutlined /> {torrent.title} - ({torrent.size} GB) 
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

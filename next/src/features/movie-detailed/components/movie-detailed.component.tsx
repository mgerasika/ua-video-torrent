import React from 'react'
import 'twin.macro'
import Link from 'next/link'
import {
  IGroupMovieResponse,
  IStreamResponse,
} from '../../../api/api.generated'
import { VideoPlayer } from './video-player.component'

interface IProps {
  streams: IStreamResponse[]
  movie: IGroupMovieResponse | undefined
}
export const MovieDetailed = ({ movie, streams }: IProps): JSX.Element => {
  const stream = streams.length ? streams[0] : undefined
  return (
    //   bg-black relative transition duration-200 ease-in transform hover:scale-110
    <div tw="container min-h-screen mx-auto lg:px-32">
      <div tw="flex py-4">
        <Link href="/" tw="cursor-pointer text-white pl-4 pt-3 absolute">
          Back
        </Link>
        <h3 tw="text-white w-full text-center [font-size:30px] ">
          {movie?.enName}
        </h3>
      </div>
      <div tw="flex flex-col lg:flex-row">
        <div tw="relative order-2 lg:order-1 mx-auto">
          {stream ? (
            <VideoPlayer imgSrc={movie?.poster || ''} url={stream.stream_url} />
          ) : (
            <img
              src={movie?.poster || ''}
              tw="min-w-[300px] w-[300px] h-[429px] [object-fit: cover]"
              alt=""
            />
          )}

          <p tw="text-white [font-size: larger] top-2 left-2 absolute bg-black px-2 py-1 border-solid border-white [border-width: 1px]">
            {movie?.imdb_rating}
          </p>
        </div>
        <div tw="py-2 px-4 order-2">
          <h3 tw="text-white text-xl">Download torrent:</h3>
          <ul>
            {movie?.movies.map(torrent => (
              <li tw="text-white pb-1" key={torrent.aws_s3_torrent_url}>
                <a
                  tw="cursor-pointer"
                  target="_blank"
                  href={torrent.aws_s3_torrent_url}
                  rel="noreferrer"
                >
                  {' '}
                  - {torrent.title} - ({torrent.size} GB)
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

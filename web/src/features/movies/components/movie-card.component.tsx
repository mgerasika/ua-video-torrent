import { IGroupMovieResponse } from "@src/api/api.generated";
import { SITE_URL } from "@src/constants/site-url.constant";
import React from "react";
import { Link } from "react-router-dom";
import "twin.macro";

interface IProps {
  movie: IGroupMovieResponse;
}
export const MovieCard = ({ movie }: IProps): JSX.Element => {
  return (
    //   bg-black relative transition duration-200 ease-in transform hover:scale-110
    <Link
      tw="w-full flex flex-col items-center cursor-pointer"
      to={"/" + encodeURIComponent(movie.enName)}
    >
      <div tw="relative w-[300px] transition duration-200 ease-in transform hover:scale-110">
        <img
          src={movie.poster || ""}
          tw="w-full h-[429px] [object-fit: cover]"
          alt=""
        />
        <p tw="text-white [font-size: larger] top-2 left-2 absolute bg-black px-2 py-1 border-solid border-white [border-width: 1px]">
          {movie.imdb_rating}
        </p>
        <p tw="text-white [font-size: larger] pt-2 text-center">
          {movie.enName}
        </p>
      </div>
    </Link>
  );
};

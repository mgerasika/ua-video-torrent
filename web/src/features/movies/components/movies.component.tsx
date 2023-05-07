import { IGroupMovieResponse } from "@src/api/api.generated";
import React from "react";
import { MovieCard } from "./movie-card.component";

interface IProps {
  movies: IGroupMovieResponse[] | undefined;
}
export const MoviesComponent = ({ movies }: IProps): JSX.Element => {
  return (
    <div tw="mx-auto container">
      <h2 tw="text-white text-[40px] py-4">HD Cartoons</h2>
      <div tw="grid 2xl:grid-cols-5 md:grid-cols-2 lg:grid-cols-3 grid-cols-1  gap-x-6 gap-y-6  justify-items-center">
        {movies?.map((movie) => {
          return <MovieCard key={movie.enName} movie={movie} />;
        })}
      </div>
    </div>
  );
};

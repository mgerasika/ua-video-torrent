import { api, IGroupMovieResponse } from "@src/api/api.generated";
import { useState, useEffect } from "react";
import { MoviesComponent } from "../components/movies.component";

export const MoviesContainer = () => {
  const [movies, setMovies] = useState<IGroupMovieResponse[]>();

  useEffect(() => {
    api.movieGroupSearchGet({}).then((data) => {
      setMovies(data.data);
    });
  }, []);

  return <MoviesComponent movies={movies} />;
};

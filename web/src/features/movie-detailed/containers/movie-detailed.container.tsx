import { api, IGroupMovieResponse } from "@src/api/api.generated";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { MovieDetailed } from "../components/movie-detailed.component";

export const MovieDetailedContainer = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<IGroupMovieResponse>();

  console.log("id", id);
  useEffect(() => {
    api.movieGroupSearchIdGet(id, {}).then((data) => {
      setMovie(data.data);
    });
  }, [id]);

  return <MovieDetailed movie={movie} />;
};

import { IMovieResponse } from "@src/api/api.generated";
import React, { useState } from "react";
import tw from "twin.macro";

interface IProps {
  movie: IMovieResponse;
  onEditMovie: (movie: IMovieResponse) => void;
}
export const EditMovie = ({
  movie: originalMovie,
  onEditMovie,
}: IProps): JSX.Element => {
  const [movie, setMovie] = useState(originalMovie);
  return (
    <div tw="p-4">
      <input
        css={styles.input}
        type="text"
        placeholder="name"
        value={movie?.en_name}
        onChange={(e) => {
          setMovie({
            ...movie,
            en_name: e.target.value,
          });
        }}
      />
      &nbsp;
      <input
        css={styles.input}
        type="text"
        placeholder="year"
        value={movie?.year || ""}
        onChange={(e) => {
          setMovie({
            ...movie,
            year: +e.target.value,
          });
        }}
      />
      &nbsp;
      <input
        placeholder="imdb original id"
        css={styles.input}
        type="text"
        value={movie?.imdb_original_id || ""}
        onChange={(e) => {
          setMovie({
            ...movie,
            imdb_original_id: e.target.value,
          });
        }}
      />
      &nbsp;
      <button css={styles.button} onClick={() => onEditMovie(movie)}>
        save
      </button>
    </div>
  );
};
const styles = {
  button: tw`border-white border-2 border-solid px-4 py-2 m-2`,
  input: tw`border-white border-2 border-solid px-4 py-2 m-2 text-black min-w-[400px]`,
};

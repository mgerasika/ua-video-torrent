import { IMovieResponse, api } from "@src/api/api.generated";
import React, { useState, useCallback, useEffect } from "react";
import { EditMovie } from "../components/edit-movie.component";
import tw from "twin.macro";
import { css } from "@emotion/react";

export const MovieListContainer = () => {
  const [movies, setMovies] = useState<IMovieResponse[]>();
  const [movieDetailed, setMovieDetailed] = useState<IMovieResponse>();
  const handleGetAll = useCallback(() => {
    api.movieGet({}).then((data) => {
      setMovies(data.data.sort((item1,item2) => {
        if (item1.title < item2.title)
          return 1;
        if ( item1.title > item2.title)
          return -1;
        return 0;
      }));
    });
  }, []);

  const handleSetup = useCallback(() => {
    api
      .toolsSetupPost({
        updateHurtom: false,
        uploadTorrentToS3FromMovieDB: false,
        uploadToCdn: true,
        searchImdb: true,
        searchImdbIdInHurtom: true,
        fixRelationIntoMovieDb: true,
      })
      .then(handleGetAll);
  }, [handleGetAll]);

  useEffect(() => {
    handleGetAll();
  }, [handleGetAll]);

  const handleGetById = useCallback((id: string) => {
    api.movieIdGet(id).then((data) => {
      setMovieDetailed(data.data);
    });
  }, []);

  const handleEdit = useCallback((movie) => {
    api
      .movieIdPut(movie.id, {
        ...movie,
      })
      .then((data) => {
        setMovies((prev) => {
          return prev?.map((p) => {
            if (p.id === data.data.id) {
              return data.data;
            }
            return p;
          });
        });

        setMovieDetailed(undefined);
      });
  }, []);

  return (
    <div tw="m-12 text-white">
      <button onClick={handleGetAll} css={styles.button}>
        get list
      </button>
      <button css={styles.button} onClick={handleSetup}>
        setup
      </button>
      Total movies without IMDB ID = {movies?.filter((movie) => !movie.imdb_id).length}
      {movies
        ?.filter((m) => !m.imdb_id)
        .map((movie) => {
          return (
            <div key={movie.id}>
              <div
                onClick={() => handleGetById(movie.id)}
                tw="cursor-pointer py-4"
              >
                {movie.en_name} ({movie.year})
                <div>
                  <i> ({movie.title}) </i>

                  {movie.hurtom_imdb_id && <span css={css`color:black;background-color:yellow; padding:4px;`}> {movie.hurtom_imdb_id} </span>}
                </div>
              </div>

              {movieDetailed && movieDetailed.id === movie.id && (
                <EditMovie movie={movie} onEditMovie={handleEdit} />
              )}

              <hr />
            </div>
          );
        })}
    </div>
  );
};

const styles = {
  button: tw`border-white border-2 border-solid px-4 py-2 m-2`,
  input: tw`border-white border-2 border-solid px-4 py-2 m-2 text-black min-w-[400px]`,
};

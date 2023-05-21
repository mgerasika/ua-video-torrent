import { ERezkaVideoType, IMovieResponse, api } from "@src/api/api.generated";
import React, { useState, useCallback, useEffect } from "react";
import { EditMovie } from "../components/edit-movie.component";
import tw from "twin.macro";

export const MovieListContainer = () => {
  const [movies, setMovies] = useState<IMovieResponse[]>();
  const [movieDetailed, setMovieDetailed] = useState<IMovieResponse>();
  const handleGetAll = useCallback(() => {
    api.movieGet({}).then((data) => {
      setMovies(data.data);
    });
  }, []);

  const handleSetup = useCallback(() => {
    api
      .toolsSetupPost({
        updateHurtom: false,
        uploadTorrentToS3FromMovieDB: false,
        uploadToCdn: false,
        searchImdb: true,
        searchImdbIdInHurtom: false,
        fixRelationIntoMovieDb: true,
        rezkaType: ERezkaVideoType.cartoon,
        updateRezka: false,
        updateRezkaById: false,
        updateRezkaImdbId: false,
        updateRezkaStreams: false,
      })
      .then(handleGetAll);
  }, [handleGetAll]);

  useEffect(() => {
    api.movieGet({}).then((data) => {
      setMovies(data.data);
    });
  }, []);

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
      Total {movies?.filter((movie) => !movie.imdb_id).length}
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

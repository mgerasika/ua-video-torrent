import { IMovieResponse, api, IPutMovieBody } from "@src/api/api.generated";
import { useState, useCallback, useEffect } from "react";
import { ExampleComponent } from "../components/example.component";

export const ExampleContainer = () => {
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
        updateHurtom: true,
        updateImdb: true,
        uploadTorrentToS3FromMovieDB: true,
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

  const handleEdit = useCallback(
    (id: string) => {
      api
        .movieIdPut(id, {
          ...(movieDetailed as unknown as IPutMovieBody),
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
    },
    [movieDetailed]
  );

  return (
    <div tw="m-12">
      <ExampleComponent />
      <button onClick={handleGetAll}>get list</button>
      <button onClick={handleSetup}>setup</button>
      Total {movies?.filter((movie) => !movie.imdb_id).length}
      {movies
        ?.filter((m) => !m.imdb_id)
        .map((selectedMovie) => {
          return (
            <div key={selectedMovie.id}>
              <div onClick={() => handleGetById(selectedMovie.id)}>
                {selectedMovie.en_name} ({selectedMovie.year})
                <div>
                  <i> ({selectedMovie.title}) </i>
                </div>
              </div>

              {movieDetailed && movieDetailed.id === selectedMovie.id && (
                <>
                  <input
                    type="text"
                    value={movieDetailed?.en_name}
                    onChange={(e) => {
                      setMovieDetailed({
                        ...movieDetailed,
                        en_name: e.target.value,
                      });
                    }}
                  />
                  &nbsp;
                  <input
                    type="text"
                    value={movieDetailed?.year || ""}
                    onChange={(e) => {
                      setMovieDetailed({
                        ...movieDetailed,
                        year: +e.target.value,
                      });
                    }}
                  />
                  &nbsp;
                  <button onClick={() => handleEdit(selectedMovie.id)}>
                    save
                  </button>
                </>
              )}

              <hr />
            </div>
          );
        })}
    </div>
  );
};

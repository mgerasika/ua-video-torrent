import "twin.macro";
import { MoviesContainer } from "./features/movies/containers/movies.container";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SITE_URL } from "./constants/site-url.constant";
import { MovieDetailedContainer } from "./features/movie-detailed/containers/movie-detailed.container";

function App() {
  return (
    <div tw="bg-black">
      <BrowserRouter>
        <Switch>
          <Route path={"/:id"} exact>
            <MovieDetailedContainer />
          </Route>
          <Route path={SITE_URL.index.toString()} exact>
            <MoviesContainer />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

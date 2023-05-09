import "twin.macro";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SITE_URL } from "./constants/site-url.constant";
import { MovieListContainer } from "./features/movie-list/containers/movie-list.container";

function App() {
  return (
    <div tw="bg-black">
      xx
      <BrowserRouter>
        <Switch>
          <Route path={SITE_URL.index.toString()} exact>
            <MovieListContainer />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

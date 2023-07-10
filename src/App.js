import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";

import MovieHeader from "./components/MovieHeader";

import FavoriteMovieList from "./components/FavoriteMovieList";

import axios from "axios";
import EditMovieForm from "./components/EditMovieForm";
import AddMovieForm from "./components/AddMovieForm";
import useAxios, { REQ_TYPES } from "./hooks/useAxios";

const App = (props) => {
  const list = JSON.parse(localStorage.getItem("favliste"));
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState(list ? list : []);
  const { push } = useHistory();
  const [getMovies] = useAxios();
  const [deleteMovies] = useAxios();


  useEffect(() => {
    getMovies({
      endpoint: "movies",
      reqType: REQ_TYPES.GET,
    }).then((res) => {
      setMovies(res);
    });
  }, []);

  const deleteMovie = (id) => {
    deleteMovies({
      endpoint: `movies/${id}`,
      reqType: REQ_TYPES.DELETE,
    }).then((res) => {
      setMovies(res);
      push("/movies");
    });;
  };

  const addToFavorites = (id) => {
    favoriteMovies.find((f) => f.id === id)
      ? setFavoriteMovies([...favoriteMovies])
      : setFavoriteMovies([...favoriteMovies, movies.find((k) => k.id == id)]);
  };
  useEffect(() => {
    localStorage.setItem("favliste", JSON.stringify(favoriteMovies));
  }, [favoriteMovies]);
  return (
    <div>
      <nav className="bg-zinc-800 px-6 py-3">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-3 pb-4">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList favoriteMovies={favoriteMovies} />

          <Switch>
            <Route exact path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>
            <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie
                deleteMovie={deleteMovie}
                addToFavorites={addToFavorites}
              />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies} />
            </Route>

            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
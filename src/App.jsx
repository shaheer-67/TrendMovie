import React, { useEffect, useState } from "react";
import Search from "./componets/Search";
import Spinner from "./componets/Spinner";
import MovieCard from "./componets/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setsearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dedaunceSearchTerm, setdedaunceSearchTerm] = useState("");
  const [TrendingMovies, setTrendingMovies] = useState([]);
  //debaunce the search term  to prevent  making to many apis request ;
  //by waiting for the userfor stop typing  for 500ms

  useDebounce(() => setdedaunceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.response === "False") {
        setErrorMessage(data.response || ` Failed to fetch movies `);
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);

      // updateSearchCount();
      // XX
      if (query && data.results.length > 0) {
  updateSearchCount(query, data.results[0]);
}

      // xx
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const loadTrendingMovies = async ()=>{
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
      
    } catch (error) {
      console.log(`error fetching trending movies ${error}`)
    }
  }

  useEffect(() => {
    fetchMovies(dedaunceSearchTerm);
  }, [dedaunceSearchTerm]);

  useEffect(()=>{
    loadTrendingMovies();
  },[])

  return (
    <main>
      <div className="pattern " />
      <div className="wrapper">
        <header>
          <img src="./src/assets/hero.png" alt="header-image" />
          <h1>
            Find <span className="text-gradient">Movie</span> You'll Enjoy
            Without the Hasslse
          </h1>
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

       {TrendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {TrendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}



        <section className="all movies">
          <h2>All Movies</h2>
          {loading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;

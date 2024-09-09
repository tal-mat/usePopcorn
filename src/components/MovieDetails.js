import { useEffect, useRef, useState } from "react";

import Loader from "./Loader";
import ErrorMessage from "./Message";
import StarRating from "./StarRating";
import useKey from "../hooks/useKey";

// Component that displays detailed information about a selected movie,
// including loading and error states, and allows user rating and adding to watchlist.
export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatch,
  apiKey,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  // Updates the count of rating decisions when userRating changes.
  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current++;
    },
    [userRating],
  );

  // Checks if the movie has already been watched and retrieves the user's rating.
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // Handles adding the movie to the watched list.
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatch(newWatchedMovie);
    onCloseMovie();
  }

  // Fetches movie details from the API and handles loading and error states.
  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${[apiKey]}&i=${selectedId}`,
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movie details.");
        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found.");

        setMovie(data);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  // Adds a key listener for the Escape key to close the movie details.
  useKey("Escape", onCloseMovie);

  // Updates the document title when the movie title is available.
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title],
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <header>
            {/* Back button and movie poster */}
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  {/* Star rating component and button to add the movie to the watchlist */}
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

const apiKey = "66ad9778";

//  Custom hook that fetches movie data from the OMDb API based on a search query.
export default function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`,
            { signal: controller.signal },
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies.");
          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("Movie not found.");
          }

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        // Clear movies and error state if query length is less than 3.
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      // Abort the fetch request on component unmount or query change.
      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return { movies, isLoading, error };
}

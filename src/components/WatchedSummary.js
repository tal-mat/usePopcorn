/**
 * Component that displays a summary of watched movies, including average IMDb rating,
 * average user rating, and average runtime.
 */
export default function WatchedSummary({ watched, average }) {
  // Calculate the average IMDb rating of watched movies.
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));

  // Calculate the average user rating of watched movies.
  const avgUserRating = average(watched.map((movie) => movie.userRating));

  // Calculate the average runtime of watched movies.
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import useKey from "../hooks/useKey";

// Component that renders a search input field and clears the query when Enter is pressed if the input is not focused.
export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  // Exit if the input field of Search movie is currently focused to prevent from deleting the text inside
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

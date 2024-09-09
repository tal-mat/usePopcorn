import { useEffect } from "react";

// A custom hook that triggers the action when the specified keyboard key is pressed.
// e.g., useKey("Escape", closeMovie)
export default function useKey(keyboardKey, action) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === keyboardKey.toLowerCase()) {
          action();
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, keyboardKey],
  );
}

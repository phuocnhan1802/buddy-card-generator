import { useEffect, useState } from "react";

/** Returns `value`, delayed by `delayMs` — resets the timer on every change. */
export function useDebouncedValue(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

import { useCallback, useEffect, useRef, useState } from 'react';

export function useDebounceState<T>(value: T, delay: number): [T, (value: T, instance?: boolean) => void] {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerFlag = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (!!timerFlag.current) {
      clearTimeout(timerFlag.current); 
      timerFlag.current = null;
    }
  };

  // Clear timeout on unmount if necessary
  useEffect(() => () => resetTimer(), []);

  const setValue = useCallback<(value: T, instance?: boolean) => void>((newValue, instance = false) => {
    if (instance) resetTimer();

    if (timerFlag.current === null) {
      setDebouncedValue(newValue);
      timerFlag.current = setTimeout(() => {
        timerFlag.current = null;
      }, delay);
    } else {
      resetTimer();
      timerFlag.current = setTimeout(() => {
        timerFlag.current = null;
        setDebouncedValue(newValue);
      }, delay);
    }
  }, [delay]); // reset all setting if value or delay changed

  return [debouncedValue, setValue];
}

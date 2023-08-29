import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedEffect = (
  effect: () => void,
  deps: unknown[],
  delay?: number,
) => {
  useEffect(() => {
    if (delay) {
      const id = setTimeout(effect, delay);
      return () => clearTimeout(id);
    }
  }, [deps, delay, effect]);
};

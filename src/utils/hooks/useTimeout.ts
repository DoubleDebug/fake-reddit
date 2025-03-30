import { useEffect, useState } from 'react';

/**
 * @returns false until a certain amount of time passes. Then it returns true.
 * @param duration = timeout duration in milliseconds (default: 1000)
 */
export function useTimeout(duration: number = 1000) {
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsOver(true);
    }, duration);
    // eslint-disable-next-line
  }, []);

  return isOver;
}

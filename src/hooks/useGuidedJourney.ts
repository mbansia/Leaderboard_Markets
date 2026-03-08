import { useEffect, useState } from 'react';

export function useGuidedJourney(length: number) {
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(length - 1, i + 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [length]);

  return { index, setIndex, showAll, setShowAll, next: () => setIndex((i) => Math.min(length - 1, i + 1)), prev: () => setIndex((i) => Math.max(0, i - 1)) };
}

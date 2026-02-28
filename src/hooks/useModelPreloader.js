// src/hooks/useModelPreloader.js

// Preloads face-api.js models in the background
// so there is zero delay when user reaches the mirror.
// Called from the Landing screen.

import { useEffect, useRef } from 'react';
import { loadModels, areModelsLoaded } from '../services/emotionDetector';

export function useModelPreloader() {
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current || areModelsLoaded()) return;
    attemptedRef.current = true;

    // Delay slightly so it doesn't compete with initial render
    const timer = setTimeout(() => {
      loadModels().then((success) => {
        if (success) {
          console.log('[NavaraMirror] Models preloaded in background.');
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
}

// src/hooks/useLandingAmbient.js

import { useEffect, useRef, useCallback } from 'react';
import { initializeAudio, startLandingAmbient, stopLandingAmbient, isAudioReady } from '../services/audioEngine';

export function useLandingAmbient() {
  const startedRef = useRef(false);
  const listenerAddedRef = useRef(false);

  const startAmbient = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!isAudioReady()) {
      await initializeAudio();
    }
    startLandingAmbient();
  }, []);

  const stopAmbient = useCallback(() => {
    if (startedRef.current) {
      stopLandingAmbient();
      startedRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (listenerAddedRef.current) return;
    listenerAddedRef.current = true;

    const handler = () => {
      startAmbient();
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };

    document.addEventListener('click', handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });

    return () => {
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [startAmbient]);

  return { stopAmbient };
}

import { useEffect, useRef, useCallback } from 'react';
import { initializeAudio, startTanpura, stopTanpura, setTanpuraVolume } from '../services/audioEngine';

export function useLandingAmbient() {
  const startedRef = useRef(false);
  const listenerAddedRef = useRef(false);

  const startAmbient = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ready = await initializeAudio();
    if (ready) {
      startTanpura(6);
      setTanpuraVolume(0.12, 6);
    }
  }, []);

  const stopAmbient = useCallback(() => {
    if (startedRef.current) {
      stopTanpura(2);
      startedRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (listenerAddedRef.current) return;
    listenerAddedRef.current = true;

    const handleInteraction = () => {
      startAmbient();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [startAmbient]);

  return { stopAmbient };
}

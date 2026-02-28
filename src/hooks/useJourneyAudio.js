import { useEffect, useRef, useCallback } from 'react';
import {
  initializeAudio,
  startJourneyAudio,
  transitionToStageAudio,
  pauseJourneyAudio,
  resumeJourneyAudio,
  stopJourneyAudio,
  toggleMute,
  disposeAll,
  isAudioReady,
} from '../services/audioEngine';

export function useJourneyAudio({ rasaConfig, isAudioEnabled }) {
  const previousStageRef = useRef(null);
  const hasStartedRef = useRef(false);

  const startAudio = useCallback(async () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (!isAudioReady()) {
      await initializeAudio();
    }

    if (isAudioEnabled && rasaConfig) {
      startJourneyAudio(rasaConfig);
    }
  }, [rasaConfig, isAudioEnabled]);

  const onStageChange = useCallback(
    (newStage) => {
      if (!newStage || newStage === previousStageRef.current) return;
      previousStageRef.current = newStage;

      if (isAudioEnabled && rasaConfig) {
        transitionToStageAudio(newStage, rasaConfig);
      }
    },
    [rasaConfig, isAudioEnabled]
  );

  const pause = useCallback(() => {
    pauseJourneyAudio();
  }, []);

  const resume = useCallback(() => {
    if (isAudioEnabled) {
      resumeJourneyAudio();
    }
  }, [isAudioEnabled]);

  const toggle = useCallback(() => {
    toggleMute();
  }, []);

  const stop = useCallback(() => {
    stopJourneyAudio();
    hasStartedRef.current = false;
    previousStageRef.current = null;
  }, []);

  useEffect(() => {
    if (!isAudioEnabled) {
      pauseJourneyAudio();
    } else if (hasStartedRef.current) {
      resumeJourneyAudio();
    }
  }, [isAudioEnabled]);

  useEffect(() => {
    return () => {
      stopJourneyAudio();
      hasStartedRef.current = false;
    };
  }, []);

  return {
    startAudio,
    onStageChange,
    pause,
    resume,
    toggle,
    stop,
  };
}

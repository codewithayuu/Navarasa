import { useState, useCallback, useMemo, useEffect } from 'react';
import { JOURNEY_STAGES } from '../context/AppContext';
import { useJourneyTimer } from './useJourneyTimer';

const STAGE_TIMINGS = {
  [JOURNEY_STAGES.ACKNOWLEDGMENT]: { start: 0, end: 60000, duration: 60000 },
  [JOURNEY_STAGES.STORY]: { start: 60000, end: 150000, duration: 90000 },
  [JOURNEY_STAGES.BREATHING]: { start: 150000, end: 210000, duration: 60000 },
  [JOURNEY_STAGES.TRANSITION]: { start: 210000, end: 270000, duration: 60000 },
  [JOURNEY_STAGES.SHANTA]: { start: 270000, end: 300000, duration: 30000 },
};

const STAGE_ORDER = [
  JOURNEY_STAGES.ACKNOWLEDGMENT,
  JOURNEY_STAGES.STORY,
  JOURNEY_STAGES.BREATHING,
  JOURNEY_STAGES.TRANSITION,
  JOURNEY_STAGES.SHANTA,
];

export function useJourneyOrchestrator({ onJourneyComplete = () => {} } = {}) {
  const [currentStage, setCurrentStage] = useState(null);
  const [stageProgress, setStageProgress] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const getStageFromElapsed = useCallback((elapsedMs) => {
    for (const stage of STAGE_ORDER) {
      const timing = STAGE_TIMINGS[stage];
      if (elapsedMs >= timing.start && elapsedMs < timing.end) {
        return stage;
      }
    }
    return JOURNEY_STAGES.SHANTA;
  }, []);

  const getStageProgress = useCallback((elapsedMs, stage) => {
    if (!stage) return 0;
    const timing = STAGE_TIMINGS[stage];
    if (!timing) return 0;
    const stageElapsed = elapsedMs - timing.start;
    return Math.max(0, Math.min(1, stageElapsed / timing.duration));
  }, []);

  const handleTick = useCallback(
    (elapsedMs) => {
      const stage = getStageFromElapsed(elapsedMs);
      const progress = getStageProgress(elapsedMs, stage);

      setCurrentStage(stage);
      setStageProgress(progress);
    },
    [getStageFromElapsed, getStageProgress]
  );

  const handleComplete = useCallback(() => {
    setCurrentStage(JOURNEY_STAGES.SHANTA);
    setStageProgress(1);
    onJourneyComplete();
  }, [onJourneyComplete]);

  const timer = useJourneyTimer({
    totalDurationMs: 300000,
    onTick: handleTick,
    onComplete: handleComplete,
    autoStart: false,
  });

  const startJourney = useCallback(() => {
    setIsStarted(true);
    setCurrentStage(JOURNEY_STAGES.ACKNOWLEDGMENT);
    setStageProgress(0);
    timer.start();
  }, [timer]);

  const pauseJourney = useCallback(() => {
    timer.pause();
  }, [timer]);

  const resumeJourney = useCallback(() => {
    timer.start();
  }, [timer]);

  const skipToNextStage = useCallback(() => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    if (currentIndex < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIndex + 1];
      const nextTiming = STAGE_TIMINGS[nextStage];
      timer.seekTo(nextTiming.start);
      setCurrentStage(nextStage);
      setStageProgress(0);
    }
  }, [currentStage, timer]);

  const exitJourney = useCallback(() => {
    timer.reset();
    setCurrentStage(null);
    setStageProgress(0);
    setIsStarted(false);
  }, [timer]);

  const currentStageIndex = STAGE_ORDER.indexOf(currentStage);

  const currentStageTiming = currentStage ? STAGE_TIMINGS[currentStage] : null;
  const stageElapsedMs = currentStageTiming
    ? timer.elapsedMs - currentStageTiming.start
    : 0;
  const stageRemainingMs = currentStageTiming
    ? currentStageTiming.end - timer.elapsedMs
    : 0;

  return {
    isStarted,
    currentStage,
    stageProgress,
    currentStageIndex,
    totalProgress: timer.progress,
    totalElapsedMs: timer.elapsedMs,
    totalRemainingMs: timer.remainingMs,
    totalElapsedSeconds: timer.elapsedSeconds,
    totalRemainingSeconds: timer.remainingSeconds,
    isRunning: timer.isRunning,
    isComplete: timer.isComplete,
    stageElapsedMs: Math.max(0, stageElapsedMs),
    stageRemainingMs: Math.max(0, stageRemainingMs),
    startJourney,
    pauseJourney,
    resumeJourney,
    skipToNextStage,
    exitJourney,
    STAGE_TIMINGS,
    STAGE_ORDER,
  };
}

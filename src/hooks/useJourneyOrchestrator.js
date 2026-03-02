import { useState, useCallback, useMemo, useEffect } from 'react';
import { JOURNEY_STAGES } from '../context/AppContext';
import { useJourneyTimer } from './useJourneyTimer';

// The THERAPIST_DIALOGUE stage is UN-TIMED — it pauses
// the timer and transitions when the user/therapist finishes.
// All other stages remain timed as before.

const STAGE_TIMINGS = {
  [JOURNEY_STAGES.ACKNOWLEDGMENT]: { start: 0, end: 60000, duration: 60000 },
  [JOURNEY_STAGES.STORY]: { start: 60000, end: 150000, duration: 90000 },
  // THERAPIST_DIALOGUE: inserted dynamically (no fixed timing)
  [JOURNEY_STAGES.BREATHING]: { start: 150000, end: 210000, duration: 60000 },
  [JOURNEY_STAGES.TRANSITION]: { start: 210000, end: 270000, duration: 60000 },
  [JOURNEY_STAGES.SHANTA]: { start: 270000, end: 300000, duration: 30000 },
};

const STAGE_ORDER = [
  JOURNEY_STAGES.ACKNOWLEDGMENT,
  JOURNEY_STAGES.STORY,
  JOURNEY_STAGES.THERAPIST_DIALOGUE, // NEW — un-timed
  JOURNEY_STAGES.BREATHING,
  JOURNEY_STAGES.TRANSITION,
  JOURNEY_STAGES.SHANTA,
];

export function useJourneyOrchestrator({ onJourneyComplete = () => { } } = {}) {
  const [currentStage, setCurrentStage] = useState(null);
  const [stageProgress, setStageProgress] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isInTherapist, setIsInTherapist] = useState(false);

  const getStageFromElapsed = useCallback((elapsedMs) => {
    // During therapist stage, don't auto-advance based on time
    if (isInTherapist) return JOURNEY_STAGES.THERAPIST_DIALOGUE;

    for (const stage of STAGE_ORDER) {
      if (stage === JOURNEY_STAGES.THERAPIST_DIALOGUE) continue; // skip — not timed
      const timing = STAGE_TIMINGS[stage];
      if (timing && elapsedMs >= timing.start && elapsedMs < timing.end) {
        return stage;
      }
    }
    return JOURNEY_STAGES.SHANTA;
  }, [isInTherapist]);

  const getStageProgress = useCallback((elapsedMs, stage) => {
    if (!stage) return 0;
    if (stage === JOURNEY_STAGES.THERAPIST_DIALOGUE) return 0; // un-timed
    const timing = STAGE_TIMINGS[stage];
    if (!timing) return 0;
    const stageElapsed = elapsedMs - timing.start;
    return Math.max(0, Math.min(1, stageElapsed / timing.duration));
  }, []);

  const handleTick = useCallback(
    (elapsedMs) => {
      if (isInTherapist) return; // Don't update during therapist

      const stage = getStageFromElapsed(elapsedMs);
      const progress = getStageProgress(elapsedMs, stage);

      // Intercept: if we're about to move past STORY, enter THERAPIST instead
      if (stage === JOURNEY_STAGES.BREATHING && currentStage === JOURNEY_STAGES.STORY) {
        setCurrentStage(JOURNEY_STAGES.THERAPIST_DIALOGUE);
        setStageProgress(0);
        setIsInTherapist(true);
        return;
      }

      setCurrentStage(stage);
      setStageProgress(progress);
    },
    [getStageFromElapsed, getStageProgress, isInTherapist, currentStage]
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

  // Called when therapist dialogue is complete
  const completeTherapistStage = useCallback(() => {
    setIsInTherapist(false);
    setCurrentStage(JOURNEY_STAGES.BREATHING);
    setStageProgress(0);
    // Seek the timer to breath stage start
    timer.seekTo(STAGE_TIMINGS[JOURNEY_STAGES.BREATHING].start);
    timer.start();
  }, [timer]);

  const skipToNextStage = useCallback(() => {
    // If in therapist, complete it
    if (isInTherapist) {
      completeTherapistStage();
      return;
    }

    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    if (currentIndex < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIndex + 1];

      // If next is therapist, enter therapist mode
      if (nextStage === JOURNEY_STAGES.THERAPIST_DIALOGUE) {
        setCurrentStage(JOURNEY_STAGES.THERAPIST_DIALOGUE);
        setStageProgress(0);
        setIsInTherapist(true);
        timer.pause();
        return;
      }

      const nextTiming = STAGE_TIMINGS[nextStage];
      if (nextTiming) {
        timer.seekTo(nextTiming.start);
        setCurrentStage(nextStage);
        setStageProgress(0);
      }
    }
  }, [currentStage, timer, isInTherapist, completeTherapistStage]);

  const exitJourney = useCallback(() => {
    timer.reset();
    setCurrentStage(null);
    setStageProgress(0);
    setIsStarted(false);
    setIsInTherapist(false);
  }, [timer]);

  const currentStageIndex = STAGE_ORDER.indexOf(currentStage);

  const currentStageTiming = (currentStage && currentStage !== JOURNEY_STAGES.THERAPIST_DIALOGUE)
    ? STAGE_TIMINGS[currentStage]
    : null;
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
    isInTherapist,
    stageElapsedMs: Math.max(0, stageElapsedMs),
    stageRemainingMs: Math.max(0, stageRemainingMs),
    startJourney,
    pauseJourney,
    resumeJourney,
    skipToNextStage,
    exitJourney,
    completeTherapistStage,
    STAGE_TIMINGS,
    STAGE_ORDER,
  };
}

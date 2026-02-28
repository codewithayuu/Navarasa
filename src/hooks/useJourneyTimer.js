import { useState, useEffect, useCallback, useRef } from 'react';

export function useJourneyTimer({
  totalDurationMs = 300000,
  onTick = () => {},
  onComplete = () => {},
  autoStart = false,
}) {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const pausedAtRef = useRef(0);

  const progress = Math.min(elapsedMs / totalDurationMs, 1);
  const remainingMs = Math.max(totalDurationMs - elapsedMs, 0);
  const isComplete = elapsedMs >= totalDurationMs;

  const tick = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = performance.now();
    const elapsed = pausedAtRef.current + (now - startTimeRef.current);
    const clampedElapsed = Math.min(elapsed, totalDurationMs);

    setElapsedMs(clampedElapsed);
    onTick(clampedElapsed, clampedElapsed / totalDurationMs);

    if (clampedElapsed >= totalDurationMs) {
      setIsRunning(false);
      onComplete();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [totalDurationMs, onTick, onComplete]);

  const start = useCallback(() => {
    if (isComplete) return;
    startTimeRef.current = performance.now();
    setIsRunning(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    pausedAtRef.current = elapsedMs;
    startTimeRef.current = null;
    setIsRunning(false);
  }, [elapsedMs]);

  const reset = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    setElapsedMs(0);
    setIsRunning(false);
  }, []);

  const seekTo = useCallback((ms) => {
    const clamped = Math.max(0, Math.min(ms, totalDurationMs));
    pausedAtRef.current = clamped;
    setElapsedMs(clamped);
    if (isRunning) {
      startTimeRef.current = performance.now();
    }
  }, [totalDurationMs, isRunning]);

  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isRunning, tick]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    isRunning,
    isComplete,
    elapsedMs,
    progress,
    remainingMs,
    elapsedSeconds: Math.floor(elapsedMs / 1000),
    remainingSeconds: Math.ceil(remainingMs / 1000),
    start,
    pause,
    reset,
    seekTo,
  };
}

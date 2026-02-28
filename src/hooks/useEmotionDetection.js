// src/hooks/useEmotionDetection.js

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  loadModels,
  areModelsLoaded,
  runDetectionSequence,
  cancelDetection,
} from '../services/emotionDetector';

// ===== DETECTION STATES =====
export const DETECTION_STATUS = {
  IDLE: 'idle',
  LOADING_MODELS: 'loading_models',
  MODELS_READY: 'models_ready',
  DETECTING: 'detecting',
  COMPLETE: 'complete',
  NO_FACE: 'no_face',
  ERROR: 'error',
};

export function useEmotionDetection() {
  const [status, setStatus] = useState(DETECTION_STATUS.IDLE);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [frameResults, setFrameResults] = useState([]);
  const [modelsReady, setModelsReady] = useState(areModelsLoaded());
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cancelDetection();
    };
  }, []);

  // ===== PRELOAD MODELS =====
  const preloadModels = useCallback(async () => {
    if (areModelsLoaded()) {
      setModelsReady(true);
      setStatus(DETECTION_STATUS.MODELS_READY);
      return true;
    }

    setStatus(DETECTION_STATUS.LOADING_MODELS);

    const success = await loadModels();

    if (mountedRef.current) {
      setModelsReady(success);
      setStatus(success ? DETECTION_STATUS.MODELS_READY : DETECTION_STATUS.ERROR);
    }

    return success;
  }, []);

  // ===== START DETECTION =====
  const startDetection = useCallback(async (getVideoElement) => {
    const videoElement = getVideoElement();
    if (!videoElement) {
      setStatus(DETECTION_STATUS.ERROR);
      return null;
    }

    // Ensure models are loaded
    if (!areModelsLoaded()) {
      const loaded = await preloadModels();
      if (!loaded) return null;
    }

    setStatus(DETECTION_STATUS.DETECTING);
    setProgress(0);
    setFrameResults([]);
    setResult(null);

    const detectionResult = await runDetectionSequence(getVideoElement, {
      framesToCapture: 8,
      intervalMs: 500,
      onProgress: (p) => {
        if (mountedRef.current) setProgress(p);
      },
      onFrameResult: (frame) => {
        if (mountedRef.current) {
          setFrameResults((prev) => [...prev, frame]);
        }
      },
    });

    if (!mountedRef.current) return null;

    if (detectionResult && detectionResult.success) {
      setResult(detectionResult);
      setStatus(DETECTION_STATUS.COMPLETE);
    } else {
      setResult(null);
      setStatus(DETECTION_STATUS.NO_FACE);
    }

    return detectionResult;
  }, [preloadModels]);

  // ===== CANCEL =====
  const cancel = useCallback(() => {
    cancelDetection();
    setStatus(DETECTION_STATUS.IDLE);
    setProgress(0);
  }, []);

  // ===== RESET =====
  const reset = useCallback(() => {
    cancelDetection();
    setStatus(modelsReady ? DETECTION_STATUS.MODELS_READY : DETECTION_STATUS.IDLE);
    setProgress(0);
    setResult(null);
    setFrameResults([]);
  }, [modelsReady]);

  return {
    status,
    progress,
    result,
    frameResults,
    modelsReady,
    preloadModels,
    startDetection,
    cancel,
    reset,
  };
}

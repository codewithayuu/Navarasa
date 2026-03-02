// src/hooks/useEmotionDetection.js

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  loadModels,
  areModelsLoaded,
  runDetectionSequence,
  cancelDetection,
} from '../services/emotionDetector';
import { detectEmotionWithVision } from '../services/visionEmotionDetector';
import { initializeGemini, isGeminiReady } from '../services/llmService';
import { getRasaByEmotion } from '../data/rasaConfig';

// ===== DETECTION STATES =====
export const DETECTION_STATUS = {
  IDLE: 'idle',
  LOADING_MODELS: 'loading_models',
  MODELS_READY: 'models_ready',
  DETECTING: 'detecting',
  VISION_REFINING: 'vision_refining',   // NEW — Gemini Vision is analyzing
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
  const [visionInsight, setVisionInsight] = useState(null); // Nuance from Gemini Vision
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
      // Also try to initialize Gemini in the background
      initializeGemini();
      return true;
    }

    setStatus(DETECTION_STATUS.LOADING_MODELS);

    // Load face-api models AND initialize Gemini in parallel
    const [faceApiSuccess] = await Promise.all([
      loadModels(),
      initializeGemini(), // non-blocking — OK if it fails
    ]);

    if (mountedRef.current) {
      setModelsReady(faceApiSuccess);
      setStatus(faceApiSuccess ? DETECTION_STATUS.MODELS_READY : DETECTION_STATUS.ERROR);
    }

    return faceApiSuccess;
  }, []);

  // ===== START DETECTION — HYBRID =====
  const startDetection = useCallback(async (getVideoElement) => {
    if (typeof getVideoElement !== 'function') {
      console.error('[useEmotionDetection] startDetection expects a function, got:', getVideoElement);
      setStatus(DETECTION_STATUS.ERROR);
      return null;
    }

    const videoElement = getVideoElement();
    if (!videoElement) {
      setStatus(DETECTION_STATUS.ERROR);
      return null;
    }

    // Ensure face-api models are loaded
    if (!areModelsLoaded()) {
      const loaded = await preloadModels();
      if (!loaded) return null;
    }

    setStatus(DETECTION_STATUS.DETECTING);
    setProgress(0);
    setFrameResults([]);
    setResult(null);
    setVisionInsight(null);

    // ===== Run BOTH in parallel =====
    // 1. face-api.js — fast, local
    const faceApiPromise = runDetectionSequence(getVideoElement, {
      framesToCapture: 8,
      intervalMs: 500,
      onProgress: (p) => {
        if (!mountedRef.current) return;
        const pct = p <= 1 ? Math.round(p * 100) : Math.round(p);
        setProgress(pct);
      },
      onFrameResult: (frame) => {
        if (!mountedRef.current) return;
        setFrameResults((prev) => [...prev, frame]);
      },
    });

    // 2. Gemini Vision — slower, more nuanced
    const visionPromise = isGeminiReady()
      ? detectEmotionWithVision(getVideoElement, 10000)
      : Promise.resolve(null);

    // Wait for face-api first (faster)
    const faceApiResult = await faceApiPromise;

    if (!mountedRef.current) return null;

    // If face-api found nothing, report early
    if (!faceApiResult || !faceApiResult.success) {
      setResult(null);
      setStatus(DETECTION_STATUS.NO_FACE);
      return null;
    }

    // We have a face-api result — show "refining" state while waiting for Vision
    setStatus(DETECTION_STATUS.VISION_REFINING);

    // Wait for vision result (with short extra timeout)
    const visionResult = await visionPromise;

    if (!mountedRef.current) return null;

    // ===== MERGE RESULTS =====
    let finalEmotion = faceApiResult.emotion;
    let finalConfidence = faceApiResult.confidence;
    let finalRasa = faceApiResult.rasa;
    let emotionNuance = '';

    if (visionResult) {
      // Vision model gives us nuance and a Rasa suggestion
      emotionNuance = visionResult.nuance || '';
      setVisionInsight(visionResult);

      // Trust Vision's Rasa suggestion if confidence is decent
      if (visionResult.confidence > 0.4) {
        // Use vision's rasa suggestion but fall back to getRasaByEmotion
        const visionRasa = getRasaByEmotion(visionResult.emotion, visionResult.confidence);
        if (visionRasa) {
          finalRasa = visionRasa;
          finalEmotion = visionResult.emotion;
          finalConfidence = visionResult.confidence;
        }
      }

      console.log('[Hybrid] face-api:', faceApiResult.emotion, '| Vision:', visionResult.emotion,
        '| Final:', finalEmotion, '| Nuance:', emotionNuance);
    } else {
      console.log('[Hybrid] Vision unavailable, using face-api only:', finalEmotion);
    }

    const mergedResult = {
      success: true,
      emotion: finalEmotion,
      confidence: finalConfidence,
      allExpressions: faceApiResult.allExpressions,
      rasa: finalRasa,
      readingCount: faceApiResult.readingCount || 0,
      // New AI fields
      visionData: visionResult,
      emotionNuance,
      isVisionEnhanced: !!visionResult,
    };

    setResult(mergedResult);
    setStatus(DETECTION_STATUS.COMPLETE);
    return mergedResult;
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
    setVisionInsight(null);
  }, [modelsReady]);

  return {
    status,
    progress,
    result,
    frameResults,
    modelsReady,
    visionInsight,
    preloadModels,
    startDetection,
    cancel,
    reset,
  };
}

// src/services/emotionDetector.js

import * as faceapi from 'face-api.js';
import { getRasaByEmotion } from '../data/rasaConfig';

let modelsLoaded = false;
let isDetecting = false;

// ===== LOAD MODELS =====
export async function loadModels() {
  if (modelsLoaded) return true;
  try {
    const MODEL_URL = '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
    console.log('[Detector] Models loaded.');
    return true;
  } catch (error) {
    console.error('[Detector] Model load failed:', error);
    return false;
  }
}

export function areModelsLoaded() { return modelsLoaded; }

// ===== SINGLE FRAME =====
async function detectSingleFrame(input) {
  if (!modelsLoaded || !input) return null;

  // Resolve getter if input is a function
  const videoElement = typeof input === 'function' ? input() : input;
  if (!videoElement) return null;

  try {
    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.5,
      }))
      .withFaceExpressions();
    if (!detection) return null;
    return {
      expressions: detection.expressions,
      faceScore: detection.detection.score,
    };
  } catch (e) {
    return null;
  }
}

// ===== AGGREGATE =====
function aggregateExpressions(readings) {
  if (readings.length === 0) return null;
  const keys = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
  const averaged = {};
  keys.forEach((key) => {
    const sum = readings.reduce((acc, r) => acc + (r.expressions[key] || 0), 0);
    averaged[key] = sum / readings.length;
  });
  return averaged;
}

// ===== FIND DOMINANT — IMPROVED ALGORITHM =====
function findDominantEmotion(averaged) {
  if (!averaged) return { emotion: 'neutral', confidence: 0 };

  // Clone and remove neutral from competition initially
  const { neutral: neutralScore, ...emotionalScores } = averaged;

  // Find the strongest non-neutral emotion
  let maxEmotion = null;
  let maxConfidence = 0;

  Object.entries(emotionalScores).forEach(([emotion, confidence]) => {
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      maxEmotion = emotion;
    }
  });

  // Decision logic:
  // 1. If a non-neutral emotion is above 0.35, use it (face-api thresholds are relative)
  // 2. If neutral is dominant AND no other emotion above 0.2, then truly neutral
  // 3. If happy is between 0.3-0.55, could be mild contentment (Shringara)
  // 4. If happy is above 0.55, strong joy (Hasya)
  // 5. If nothing clear, use the highest non-neutral

  // Strong non-neutral emotion
  if (maxEmotion && maxConfidence > 0.35) {
    return {
      emotion: maxEmotion,
      confidence: maxConfidence,
      allExpressions: averaged,
    };
  }

  // Moderate non-neutral emotion (still more meaningful than neutral)
  if (maxEmotion && maxConfidence > 0.2 && neutralScore < 0.6) {
    return {
      emotion: maxEmotion,
      confidence: maxConfidence,
      allExpressions: averaged,
    };
  }

  // Truly neutral — no significant emotional expression
  if (neutralScore > 0.6 && maxConfidence < 0.2) {
    return {
      emotion: 'neutral',
      confidence: neutralScore,
      allExpressions: averaged,
    };
  }

  // Ambiguous — use highest non-neutral as a gentle guess
  if (maxEmotion && maxConfidence > 0.12) {
    return {
      emotion: maxEmotion,
      confidence: maxConfidence,
      allExpressions: averaged,
    };
  }

  // Absolute fallback
  return {
    emotion: 'neutral',
    confidence: neutralScore || 0.5,
    allExpressions: averaged,
  };
}

// ===== MAIN DETECTION SEQUENCE =====
export async function runDetectionSequence(input, {
  framesToCapture = 10,
  intervalMs = 400,
  onProgress = () => { },
  onFrameResult = () => { },
} = {}) {
  if (isDetecting) {
    console.warn('[Detector] Already running — blocked.');
    return null;
  }

  if (!input) return null;

  // Resolve once for initial readiness checks
  const videoElement = typeof input === 'function' ? input() : input;
  if (!videoElement) return null;

  // Wait for video readiness
  if (videoElement.readyState < 2) {
    await new Promise((resolve) => {
      const check = () => {
        // Re-resolve to be safe (ref might have updated)
        const currentEl = typeof input === 'function' ? input() : input;
        if (currentEl && currentEl.readyState >= 2) resolve();
        else setTimeout(check, 200);
      };
      check();
    });
  }

  if (!modelsLoaded) {
    const loaded = await loadModels();
    if (!loaded) return null;
  }

  isDetecting = true;
  const readings = [];

  return new Promise((resolve) => {
    let frameCount = 0;

    const captureFrame = async () => {
      if (!isDetecting) {
        resolve({ success: false, reason: 'cancelled', rasa: null });
        return;
      }

      if (frameCount >= framesToCapture) {
        isDetecting = false;

        if (readings.length === 0) {
          resolve({ success: false, reason: 'no_face_detected', rasa: null });
          return;
        }

        const averaged = aggregateExpressions(readings);
        const dominant = findDominantEmotion(averaged);

        console.log('[Detector] Averaged expressions:', averaged);
        console.log('[Detector] Dominant:', dominant.emotion, dominant.confidence);

        const rasa = getRasaByEmotion(dominant.emotion, dominant.confidence);

        resolve({
          success: true,
          emotion: dominant.emotion,
          confidence: dominant.confidence,
          allExpressions: averaged,
          rasa,
          readingCount: readings.length,
        });
        return;
      }

      try {
        const result = await detectSingleFrame(input);
        if (result && result.faceScore > 0.5) {
          readings.push(result);
          onFrameResult({ frameIndex: frameCount, hasFace: true, expressions: result.expressions });
        } else {
          onFrameResult({ frameIndex: frameCount, hasFace: false });
        }
      } catch (err) {
        onFrameResult({ frameIndex: frameCount, hasFace: false });
      }

      frameCount++;
      onProgress(frameCount / framesToCapture);

      if (isDetecting) {
        setTimeout(captureFrame, intervalMs);
      }
    };

    captureFrame();
  });
}

export function cancelDetection() { isDetecting = false; }

export async function quickEmotionCheck(input) {
  if (!modelsLoaded) return null;
  const result = await detectSingleFrame(input);
  if (!result) return null;
  return findDominantEmotion(result.expressions);
}

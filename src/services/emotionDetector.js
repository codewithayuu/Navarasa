// src/services/emotionDetector.js

// ============================================
// NAVARASA MIRROR — EMOTION DETECTION ENGINE
// Handles face-api.js model loading, face
// detection, emotion extraction, and Rasa mapping.
// Everything runs client-side. Zero server calls.
// ============================================

import * as faceapi from 'face-api.js';
import { getRasaByEmotion } from '../data/rasaConfig';

// ===== STATE =====
let modelsLoaded = false;
let isDetecting = false;

// ===== MODEL LOADING =====
export async function loadModels() {
  if (modelsLoaded) return true;

  try {
    const MODEL_URL = '/models';

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);

    modelsLoaded = true;
    console.log('[NavaraMirror] Emotion detection models loaded.');
    return true;
  } catch (error) {
    console.error('[NavaraMirror] Failed to load models:', error);
    return false;
  }
}

export function areModelsLoaded() {
  return modelsLoaded;
}

// ===== SINGLE FRAME DETECTION =====
// Detects face + expressions from a single video frame
async function detectSingleFrame(videoElement) {
  if (!modelsLoaded || !videoElement) return null;

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
  } catch (error) {
    console.error('[NavaraMirror] Detection frame error:', error);
    return null;
  }
}

// ===== EXPRESSION AGGREGATION =====
// Averages multiple readings for stability
function aggregateExpressions(readings) {
  if (readings.length === 0) return null;

  const emotionKeys = [
    'neutral', 'happy', 'sad', 'angry',
    'fearful', 'disgusted', 'surprised',
  ];

  const averaged = {};
  emotionKeys.forEach((key) => {
    const sum = readings.reduce((acc, r) => acc + (r.expressions[key] || 0), 0);
    averaged[key] = sum / readings.length;
  });

  return averaged;
}

// ===== FIND DOMINANT EMOTION =====
function findDominantEmotion(averagedExpressions) {
  if (!averagedExpressions) return { emotion: 'neutral', confidence: 0 };

  let maxEmotion = 'neutral';
  let maxConfidence = 0;

  Object.entries(averagedExpressions).forEach(([emotion, confidence]) => {
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      maxEmotion = emotion;
    }
  });

  return {
    emotion: maxEmotion,
    confidence: Math.round(maxConfidence * 100) / 100,
    allExpressions: averagedExpressions,
  };
}

// ===== HAPPY INTENSITY DISCRIMINATOR =====
// Distinguishes between mild happy (Shringara) and strong happy (Hasya)
function refineHappyIntensity(expressions) {
  if (!expressions) return null;

  const happyScore = expressions.happy || 0;
  const neutralScore = expressions.neutral || 0;

  // If happy is dominant but moderate, and neutral is also present
  // → more likely gentle contentment (Shringara)
  if (happyScore > 0.6 && happyScore < 0.75 && neutralScore > 0.1) {
    return { emotion: 'happy', confidence: happyScore, intensityVariant: 'mild' };
  }

  // Strong, unambiguous happiness → Hasya
  if (happyScore >= 0.75) {
    return { emotion: 'happy', confidence: happyScore, intensityVariant: 'high' };
  }

  return null;
}

// ===== MAIN DETECTION SEQUENCE =====
export async function runDetectionSequence(getVideoElement, {
  framesToCapture = 8,
  intervalMs = 500,
  onProgress = () => {},
  onFrameResult = () => {},
} = {}) {
  // Hard guard against double runs
  if (isDetecting) {
    console.warn('[NavaraMirror] Detection already in progress — blocking duplicate.');
    return null;
  }

  const initialVideoElement = getVideoElement();
  if (!initialVideoElement) {
    console.warn('[NavaraMirror] No initial video element provided.');
    return null;
  }

  // Verify video is actually playing
  if (initialVideoElement.readyState < 2) {
    console.log('[NavaraMirror] Video not ready yet, waiting...');
    await new Promise((resolve) => {
      const checkReady = () => {
        const currentVideo = getVideoElement();
        if (currentVideo && currentVideo.readyState >= 2) {
          resolve();
        } else {
          setTimeout(checkReady, 200);
        }
      };
      checkReady();
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
      // Safety check — if detection was cancelled
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

        let finalEmotion = dominant.emotion;
        let finalConfidence = dominant.confidence;

        if (dominant.emotion === 'happy') {
          const refined = refineHappyIntensity(averaged);
          if (refined) {
            finalEmotion = refined.emotion;
            finalConfidence = refined.confidence;
          }
        }

        const rasa = getRasaByEmotion(finalEmotion, finalConfidence);

        resolve({
          success: true,
          emotion: finalEmotion,
          confidence: finalConfidence,
          allExpressions: averaged,
          rasa,
          readingCount: readings.length,
        });
        return;
      }

      try {
        const currentVideo = getVideoElement();
        if (!currentVideo) {
          console.warn('[NavaraMirror] Video element not available');
          onFrameResult({ frameIndex: frameCount, hasFace: false });
        } else {
          const result = await detectSingleFrame(currentVideo);

          if (result && result.faceScore > 0.6) {
            readings.push(result);
            onFrameResult({ frameIndex: frameCount, hasFace: true, expressions: result.expressions });
          } else {
            onFrameResult({ frameIndex: frameCount, hasFace: false });
          }
        }
      } catch (err) {
        console.warn('[NavaraMirror] Frame detection error:', err);
        onFrameResult({ frameIndex: frameCount, hasFace: false });
      }

      frameCount++;
      const prog = frameCount / framesToCapture;
      onProgress(prog);

      // Schedule next frame
      if (isDetecting) {
        setTimeout(captureFrame, intervalMs);
      }
    };

    // Start first frame
    captureFrame();
  });
}

// ===== CANCEL DETECTION =====
export function cancelDetection() {
  isDetecting = false;
}

// ===== QUICK SINGLE CHECK =====
// For real-time preview (not the full sequence)
export async function quickEmotionCheck(videoElement) {
  if (!modelsLoaded) return null;
  const result = await detectSingleFrame(videoElement);
  if (!result) return null;
  return findDominantEmotion(result.expressions);
}

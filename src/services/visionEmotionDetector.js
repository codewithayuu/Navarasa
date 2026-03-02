// src/services/visionEmotionDetector.js
// ============================================
// Captures a video frame as base64,
// sends to Gemini Vision for nuanced analysis,
// returns structured emotion + Rasa data.
// ============================================

import { analyzeEmotionFromFrame, isGeminiReady } from './llmService';

/**
 * Capture a single frame from a video element as a base64 data URL.
 */
export function captureFrame(videoElement) {
    if (!videoElement || videoElement.readyState < 2) return null;

    const canvas = document.createElement('canvas');
    // Use smaller dimensions for faster API transfer
    const scale = 0.5;
    canvas.width = videoElement.videoWidth * scale;
    canvas.height = videoElement.videoHeight * scale;

    if (canvas.width === 0 || canvas.height === 0) return null;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.7);
}

/**
 * Run Gemini Vision emotion analysis on a video element.
 * Returns { emotion, confidence, nuance, rasaSuggestion, rasaReasoning } or null.
 * Has a timeout fallback to prevent blocking.
 */
export async function detectEmotionWithVision(videoElement, timeoutMs = 8000) {
    if (!isGeminiReady()) {
        console.log('[VisionDetector] Gemini not ready, skipping.');
        return null;
    }

    // Resolve getter function if needed
    const el = typeof videoElement === 'function' ? videoElement() : videoElement;
    if (!el) return null;

    const frameDataUrl = captureFrame(el);
    if (!frameDataUrl) {
        console.log('[VisionDetector] Could not capture frame.');
        return null;
    }

    // Race between API call and timeout
    const apiPromise = analyzeEmotionFromFrame(frameDataUrl);
    const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve(null), timeoutMs)
    );

    try {
        const result = await Promise.race([apiPromise, timeoutPromise]);
        if (result) {
            console.log('[VisionDetector] Result:', result);
        } else {
            console.log('[VisionDetector] Timed out or failed.');
        }
        return result;
    } catch (error) {
        console.error('[VisionDetector] Error:', error);
        return null;
    }
}

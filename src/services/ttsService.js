// src/services/ttsService.js
// ============================================
// NAVARASA MIRROR — SARVAM AI TTS SERVICE
// Uses Sarvam AI's Bulbul v1 model for
// high-quality Hindi/Sanskrit voice narration.
// Female voice (Meera) for a warm, pleasant feel.
// ============================================

const SARVAM_API_URL = "https://api.sarvam.ai/text-to-speech";
const SARVAM_API_KEY = "sk_zzgj8goj_IGdDtvPTcgmg0YfWAUIUYmX6";

let currentAudio = null;
let isSpeaking = false;

// Sarvam voice mapping per Rasa mood — ALL female (Meera)
const RASA_VOICES = {
    shanta: { speaker: "meera", pace: 0.85, pitch: 0 },
    karuna: { speaker: "meera", pace: 0.8, pitch: -2 },
    shringara: { speaker: "meera", pace: 0.9, pitch: 1 },
    hasya: { speaker: "meera", pace: 1.05, pitch: 2 },
    adbhuta: { speaker: "meera", pace: 0.95, pitch: 1 },
    raudra: { speaker: "meera", pace: 0.9, pitch: -1 },
    veera: { speaker: "meera", pace: 0.95, pitch: 0 },
    bhayanaka: { speaker: "meera", pace: 0.8, pitch: -2 },
    bibhatsa: { speaker: "meera", pace: 0.85, pitch: -1 },
};

/**
 * Speak text using Sarvam AI TTS.
 * @param {string} text - Text to speak (Hindi, Sanskrit, or English)
 * @param {string} rasaId - Current rasa for voice styling
 */
export async function speak(text, rasaId = 'shanta') {
    if (!text || text.length < 3) return;
    stopSpeaking();

    const voiceConfig = RASA_VOICES[rasaId] || RASA_VOICES.shanta;

    // Truncate very long text to avoid API limits
    const truncated = text.length > 500 ? text.substring(0, 497) + '...' : text;

    try {
        console.log('[Sarvam TTS] Speaking:', truncated.substring(0, 60) + '...');

        const response = await fetch(SARVAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': SARVAM_API_KEY,
            },
            body: JSON.stringify({
                inputs: [truncated],
                target_language_code: 'hi-IN',
                speaker: voiceConfig.speaker,
                pace: voiceConfig.pace,
                pitch: voiceConfig.pitch,
                model: "bulbul:v1",
                enable_preprocessing: true,
            })
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            console.warn('[Sarvam TTS] API error:', response.status, errText);
            return fallbackSpeak(truncated);
        }

        const data = await response.json();

        if (data.audios && data.audios[0]) {
            const audioBase64 = data.audios[0];
            currentAudio = new Audio(`data:audio/wav;base64,${audioBase64}`);
            currentAudio.volume = 0.9;
            isSpeaking = true;
            currentAudio.play().catch(e => {
                console.warn('[Sarvam TTS] Playback error:', e);
                isSpeaking = false;
            });
            return new Promise((resolve) => {
                currentAudio.onended = () => { isSpeaking = false; resolve(); };
                currentAudio.onerror = () => { isSpeaking = false; resolve(); };
            });
        } else {
            console.warn('[Sarvam TTS] No audio in response');
            return fallbackSpeak(truncated);
        }
    } catch (error) {
        console.error('[Sarvam TTS] Failed:', error);
        return fallbackSpeak(truncated);
    }
}

/**
 * Fallback to browser's Web Speech API.
 */
function fallbackSpeak(text) {
    return new Promise((resolve) => {
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'hi-IN';
            utterance.rate = 0.85;
            utterance.pitch = 1.1;
            utterance.onend = resolve;
            utterance.onerror = resolve;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            resolve();
        }
    });
}

/**
 * Stop any ongoing speech.
 */
export function stopSpeaking() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    isSpeaking = false;
    try { window.speechSynthesis.cancel(); } catch (e) { }
}

export function getIsSpeaking() { return isSpeaking; }

// src/hooks/useTherapistChat.js
// ============================================
// Chat state manager for the AI Therapist stage.
// Manages conversation with Gemini acting as
// an ancient Rasa-aware therapeutic guide.
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    getTherapistGreeting,
    getTherapistResponse,
    isGeminiReady,
} from '../services/llmService';

const MAX_TURNS = 8;

const FALLBACK_GREETING = {
    shringara: 'I see the warmth of Shringara in you — a heart that recognizes beauty even in stillness. Tell me… what is it that your heart is reaching toward right now?',
    hasya: 'There is a lightness in your eyes that speaks of Hasya — the joy that dances without reason. What brings this quiet delight to your spirit today?',
    karuna: 'I see Karuna resting in your gaze — a tenderness that comes from truly seeing the world. What is it that your heart is holding so gently right now?',
    raudra: 'I sense Raudra stirring within you — not destruction, but the sacred fire of truth. What has awakened this flame? Where does this intensity live in your body?',
    veera: 'There is Veera in your bearing — the quiet courage of one who has chosen to face something. What is the battle you are carrying, seen or unseen?',
    bhayanaka: 'I see Bhayanaka touching you — not weakness, but the soul\'s honest trembling before something vast. What is it that feels too large to hold right now?',
    bibhatsa: 'Bibhatsa has sharpened your sight — the discernment that says "this does not belong." What is it that your deepest self is pushing away?',
    adbhuta: 'I see Adbhuta in your eyes — the wonder of a mind encountering something beyond its maps. What has left you speechless recently?',
    shanta: 'You carry the stillness of Shanta — a peace that has witnessed everything and chosen to rest. What brought you to this quiet place?',
};

const SUGGESTED_PROMPTS = [
    'Tell me more…',
    'What does this feel like in my body?',
    'Why do I feel this way?',
    'I want to understand this emotion',
    'Help me find peace with this',
    'What would the ancient sages say?',
    'I want to let go',
    'I feel stuck',
];

export function useTherapistChat({ rasaId }) {
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => { mountedRef.current = false; };
    }, []);

    // ===== INITIALIZE — Get therapist greeting =====
    const initialize = useCallback(async () => {
        if (isInitialized) return;
        setIsInitialized(true);
        setIsThinking(true);

        let greeting = null;

        if (isGeminiReady()) {
            greeting = await getTherapistGreeting(rasaId);
        }

        if (!mountedRef.current) return;

        // Fallback greeting if API fails
        if (!greeting) {
            greeting = FALLBACK_GREETING[rasaId] || FALLBACK_GREETING.shanta;
        }

        setMessages([{ role: 'therapist', text: greeting }]);
        setIsThinking(false);
        setTurnCount(1);
    }, [rasaId, isInitialized]);

    // ===== SEND MESSAGE =====
    const sendMessage = useCallback(async (userText) => {
        if (!userText.trim() || isThinking || isComplete) return;

        const newUserMsg = { role: 'user', text: userText.trim() };
        const updatedMessages = [...messages, newUserMsg];
        setMessages(updatedMessages);
        setIsThinking(true);

        const newTurnCount = turnCount + 1;
        setTurnCount(newTurnCount);

        let response = null;

        if (isGeminiReady()) {
            // Convert to the format llmService expects
            const chatHistory = updatedMessages.map((m) => ({
                role: m.role === 'therapist' ? 'model' : 'user',
                text: m.text,
            }));

            response = await getTherapistResponse(chatHistory, rasaId, userText.trim());
        }

        if (!mountedRef.current) return;

        if (!response) {
            // Gentle fallback responses
            const fallbacks = [
                'I hear you. Sit with that for a moment… What else arises when you hold this feeling quietly?',
                'That is worth honoring. The sages called this Sthiti — simply being with what is. Can you breathe into it?',
                'There is courage in naming what you feel. In the Natyashastra, every Rasa is sacred. What does this one teach you?',
                'Let that settle, like sediment in still water. Clarity follows patience. What becomes visible when you wait?',
            ];
            response = fallbacks[Math.min(newTurnCount - 1, fallbacks.length - 1)];
        }

        const therapistMsg = { role: 'therapist', text: response };
        setMessages((prev) => [...prev, therapistMsg]);
        setIsThinking(false);

        // Check if we should conclude
        if (newTurnCount >= MAX_TURNS) {
            setIsComplete(true);
        }
    }, [messages, isThinking, isComplete, turnCount, rasaId]);

    // ===== GET SUGGESTED PROMPTS =====
    const getSuggestedPrompts = useCallback(() => {
        if (turnCount <= 1) {
            return SUGGESTED_PROMPTS.slice(0, 4);
        }
        if (turnCount >= MAX_TURNS - 2) {
            return ['I feel ready to move on', 'Let us breathe together', 'Thank you'];
        }
        // Rotate through suggestions
        const startIdx = ((turnCount - 1) * 2) % SUGGESTED_PROMPTS.length;
        return [
            SUGGESTED_PROMPTS[startIdx % SUGGESTED_PROMPTS.length],
            SUGGESTED_PROMPTS[(startIdx + 1) % SUGGESTED_PROMPTS.length],
            SUGGESTED_PROMPTS[(startIdx + 2) % SUGGESTED_PROMPTS.length],
        ];
    }, [turnCount]);

    // ===== GET CONVERSATION HIGHLIGHTS (for reflection) =====
    const getHighlights = useCallback(() => {
        return messages
            .filter((m) => m.role === 'therapist')
            .map((m) => m.text)
            .join('\n\n');
    }, [messages]);

    return {
        messages,
        isThinking,
        isComplete,
        isInitialized,
        turnCount,
        maxTurns: MAX_TURNS,
        initialize,
        sendMessage,
        getSuggestedPrompts,
        getHighlights,
    };
}

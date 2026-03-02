// src/hooks/useAIStory.js
// ============================================
// Hook that generates a personalized mythological
// story using Gemini LLM, with fallback to
// hardcoded rasaConfig stories.
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { streamRasaStory, isGeminiReady } from '../services/llmService';

export function useAIStory({ rasaConfig, userContext = {} }) {
    const [paragraphs, setParagraphs] = useState([]);
    const [streamedText, setStreamedText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isAIGenerated, setIsAIGenerated] = useState(false);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);
    const startedRef = useRef(false);

    useEffect(() => {
        return () => { mountedRef.current = false; };
    }, []);

    const generateStory = useCallback(async () => {
        if (startedRef.current) return;
        startedRef.current = true;

        if (!rasaConfig) return;

        // If Gemini isn't available, use hardcoded story
        if (!isGeminiReady()) {
            console.log('[AIStory] Gemini not ready, using hardcoded story.');
            const hardcodedPanels = rasaConfig.story?.panels?.map(p => p.text) || [];
            setParagraphs(hardcodedPanels);
            setIsAIGenerated(false);
            setIsComplete(true);
            return;
        }

        // Try AI-generated story
        setIsStreaming(true);
        setError(null);

        try {
            const result = await streamRasaStory(
                rasaConfig.id,
                {
                    emotionNuance: userContext.emotionNuance || '',
                    previousRasas: userContext.previousRasas || [],
                },
                // onChunk callback
                (chunk, fullText) => {
                    if (!mountedRef.current) return;
                    setStreamedText(fullText);

                    // Parse paragraphs as they come
                    const paras = fullText
                        .split(/\n\n+/)
                        .map(p => p.trim())
                        .filter(p => p.length > 20);
                    setParagraphs(paras);
                }
            );

            if (!mountedRef.current) return;

            if (result && result.paragraphs.length > 0) {
                setParagraphs(result.paragraphs);
                setIsAIGenerated(true);
                setIsStreaming(false);
                setIsComplete(true);
                console.log('[AIStory] AI story complete:', result.paragraphs.length, 'paragraphs');
            } else {
                // Fallback to hardcoded
                console.log('[AIStory] AI returned empty, falling back to hardcoded.');
                const hardcodedPanels = rasaConfig.story?.panels?.map(p => p.text) || [];
                setParagraphs(hardcodedPanels);
                setIsAIGenerated(false);
                setIsStreaming(false);
                setIsComplete(true);
            }
        } catch (err) {
            console.error('[AIStory] Generation failed:', err);
            if (!mountedRef.current) return;

            // Fallback to hardcoded
            const hardcodedPanels = rasaConfig.story?.panels?.map(p => p.text) || [];
            setParagraphs(hardcodedPanels);
            setIsAIGenerated(false);
            setIsStreaming(false);
            setIsComplete(true);
            setError(err.message);
        }
    }, [rasaConfig, userContext.emotionNuance, userContext.previousRasas]);

    return {
        paragraphs,
        streamedText,
        isStreaming,
        isComplete,
        isAIGenerated,
        error,
        generateStory,
    };
}

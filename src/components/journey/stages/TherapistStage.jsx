// src/components/journey/stages/TherapistStage.jsx
// ============================================
// Interactive AI Therapist — a conversational
// stage where Gemini acts as an ancient
// Rasa-aware therapeutic guide.
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useTherapistChat } from '../../../hooks/useTherapistChat';
import OrnamentalDivider from '../../ui/OrnamentalDivider';
import { colors, typography, spacing, layout } from '../../../theme/tokens';
import { speak, stopSpeaking } from '../../../services/ttsService';
import { isGeminiReady } from '../../../services/llmService';

const TherapistStage = ({ rasaConfig, onComplete }) => {
    const rClr = rasaConfig.colors;
    const [inputText, setInputText] = useState('');
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(isGeminiReady());
    const messagesEndRef = useRef(null);
    const lastSpokenIndexRef = useRef(-1);
    const inputRef = useRef(null);

    const {
        messages,
        isThinking,
        isComplete,
        turnCount,
        maxTurns,
        initialize,
        sendMessage,
        getSuggestedPrompts,
    } = useTherapistChat({ rasaId: rasaConfig.id });

    // Initialize on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Auto-scroll to bottom + Trigger TTS
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Speak latest therapist message if voice is enabled
        const lastMsgIndex = messages.length - 1;
        if (isVoiceEnabled && lastMsgIndex >= 0 && lastMsgIndex > lastSpokenIndexRef.current) {
            const lastMsg = messages[lastMsgIndex];
            if (lastMsg.role === 'therapist') {
                lastSpokenIndexRef.current = lastMsgIndex;
                speak(lastMsg.text, rasaConfig.id);
            }
        }
    }, [messages, isThinking, isVoiceEnabled]);

    // Handle initial greeting voice
    useEffect(() => {
        return () => stopSpeaking();
    }, []);

    const handleSend = () => {
        if (!inputText.trim() || isThinking) return;
        stopSpeaking(); // Stop current speech when user replies
        sendMessage(inputText);
        setInputText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestion = (text) => {
        sendMessage(text);
        setInputText('');
    };

    const suggestedPrompts = getSuggestedPrompts();

    return (
        <div
            style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                maxHeight: '100vh',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    textAlign: 'center',
                    padding: `${spacing.lg} ${spacing.md} ${spacing.sm}`,
                    flexShrink: 0,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
                    <Sparkles size={16} color={rClr.primary} style={{ opacity: 0.7 }} />
                    <p style={{
                        fontFamily: typography.fonts.body,
                        fontSize: '0.9rem',
                        color: '#f0e6d3',
                        letterSpacing: typography.letterSpacing.ultra,
                        textTransform: 'uppercase',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }}>
                        Rasa Guide · रस गुरु
                    </p>
                    <Sparkles size={16} color={rClr.primary} style={{ opacity: 0.7 }} />
                </div>
                <OrnamentalDivider width={80} color={rClr.primary} />

                {/* Voice Toggle */}
                <div style={{ position: 'absolute', top: spacing.md, right: spacing.md }}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            if (isVoiceEnabled) stopSpeaking();
                            setIsVoiceEnabled(!isVoiceEnabled);
                        }}
                        style={{
                            background: isVoiceEnabled ? `${rClr.primary}15` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isVoiceEnabled ? `${rClr.primary}30` : colors.borderSubtle}`,
                            borderRadius: '50%',
                            width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                        title={isVoiceEnabled ? "Mute Ancient Voice" : "Enable Ancient Voice"}
                    >
                        {isVoiceEnabled ? (
                            <Volume2 size={14} color={rClr.primary} />
                        ) : (
                            <VolumeX size={14} color={colors.textMuted} />
                        )}
                    </motion.button>
                </div>
            </motion.div>

            {/* Chat Messages */}
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: `0 ${spacing.md}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                    scrollBehavior: 'smooth',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)',
                }}
            >
                <div style={{ minHeight: spacing.md }} /> {/* Top spacer */}

                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 16, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '100%',
                            }}
                        >
                            {msg.role === 'therapist' ? (
                                <TherapistMessage text={msg.text} color={rClr.primary} />
                            ) : (
                                <UserMessage text={msg.text} />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Thinking indicator */}
                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                        <div style={{
                            padding: `${spacing.sm} ${spacing.md}`,
                            borderRadius: layout.borderRadius.lg,
                            background: `${rClr.primary}08`,
                            border: `1px solid ${rClr.primary}15`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.xs,
                        }}>
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.1, 0.8] }}
                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                    style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: rClr.primary,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} style={{ minHeight: spacing.xs }} />
            </div>

            {/* Input Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                style={{
                    flexShrink: 0,
                    padding: `${spacing.sm} ${spacing.md} ${spacing.lg}`,
                    borderTop: `1px solid ${colors.borderSubtle}`,
                    background: 'rgba(10, 10, 15, 0.8)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                {/* Suggested Prompts */}
                {!isComplete && !isThinking && suggestedPrompts.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: spacing.xs,
                        paddingBottom: spacing.sm,
                    }}>
                        {suggestedPrompts.map((prompt, i) => (
                            <motion.button
                                key={`${prompt}-${turnCount}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleSuggestion(prompt)}
                                whileHover={{ scale: 1.03, borderColor: `${rClr.primary}50` }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: `${rClr.primary}10`,
                                    border: `1px solid ${rClr.primary}30`,
                                    borderRadius: layout.borderRadius.full,
                                    padding: `8px ${spacing.md}`,
                                    fontFamily: typography.fonts.body,
                                    fontSize: '0.95rem',
                                    color: '#d4c8b0',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {prompt}
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Text Input + Send */}
                {!isComplete ? (
                    <div style={{
                        display: 'flex',
                        gap: spacing.xs,
                        alignItems: 'flex-end',
                    }}>
                        <div style={{
                            flex: 1,
                            position: 'relative',
                        }}>
                            <textarea
                                ref={inputRef}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Share what you're feeling..."
                                rows={1}
                                disabled={isThinking}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${colors.borderSubtle}`,
                                    borderRadius: layout.borderRadius.lg,
                                    padding: `${spacing.sm} ${spacing.md}`,
                                    color: colors.textPrimary,
                                    fontFamily: typography.fonts.body,
                                    fontSize: typography.sizes.body,
                                    lineHeight: typography.lineHeights.normal,
                                    resize: 'none',
                                    outline: 'none',
                                    opacity: isThinking ? 0.5 : 1,
                                    transition: 'border-color 0.3s, opacity 0.3s',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = `${rClr.primary}40`; }}
                                onBlur={(e) => { e.target.style.borderColor = colors.borderSubtle; }}
                            />
                        </div>
                        <motion.button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isThinking}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: '50%',
                                background: inputText.trim() ? `${rClr.primary}25` : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${inputText.trim() ? `${rClr.primary}40` : colors.borderSubtle}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: inputText.trim() ? 'pointer' : 'default',
                                flexShrink: 0,
                                transition: 'all 0.3s',
                            }}
                        >
                            <Send
                                size={16}
                                color={inputText.trim() ? rClr.primary : colors.textMuted}
                                style={{ opacity: inputText.trim() ? 1 : 0.3, marginLeft: 2 }}
                            />
                        </motion.button>
                    </div>
                ) : (
                    /* Completion — Continue button */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: spacing.sm,
                            padding: spacing.md,
                        }}
                    >
                        <p style={{
                            fontFamily: typography.fonts.heading,
                            fontSize: typography.sizes.bodySmall,
                            color: colors.textMuted,
                            fontStyle: 'italic',
                            textAlign: 'center',
                        }}>
                            Let us carry this awareness into breath…
                        </p>
                        <motion.button
                            onClick={onComplete}
                            whileHover={{ scale: 1.03, borderColor: `${rClr.primary}60` }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                background: `${rClr.primary}10`,
                                border: `1px solid ${rClr.primary}30`,
                                borderRadius: layout.borderRadius.full,
                                padding: `${spacing.sm} ${spacing.xl}`,
                                fontFamily: typography.fonts.heading,
                                fontSize: typography.sizes.body,
                                color: rClr.primary,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing.xs,
                            }}
                        >
                            <MessageCircle size={16} />
                            Continue to Breathing
                        </motion.button>
                    </motion.div>
                )}

                {/* Turn counter */}
                {!isComplete && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: spacing.xs,
                    }}>
                        <span style={{
                            fontFamily: typography.fonts.body,
                            fontSize: '0.6rem',
                            color: colors.textMuted,
                            opacity: 0.3,
                        }}>
                            {turnCount} / {maxTurns}
                        </span>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// ===== Therapist Message Bubble =====
const TherapistMessage = ({ text, color }) => (
    <div style={{
        maxWidth: '85%',
        display: 'flex',
        gap: spacing.sm,
        alignItems: 'flex-start',
    }}>
        <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `${color}20`,
            border: `1px solid ${color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 2,
        }}>
            <Sparkles size={14} color={color} style={{ opacity: 0.8 }} />
        </div>
        <div style={{
            padding: `${spacing.md} ${spacing.lg}`,
            borderRadius: `4px ${layout.borderRadius.lg} ${layout.borderRadius.lg} ${layout.borderRadius.lg}`,
            background: `${color}12`,
            border: `1px solid ${color}25`,
        }}>
            <p style={{
                fontFamily: typography.fonts.heading,
                fontSize: '1.15rem',
                fontWeight: typography.weights.regular,
                color: '#e8dcc8',
                lineHeight: 1.8,
                fontStyle: 'italic',
                margin: 0,
                textShadow: '0 1px 6px rgba(0,0,0,0.3)',
            }}>
                {text}
            </p>
        </div>
    </div>
);

// ===== User Message Bubble =====
const UserMessage = ({ text }) => (
    <div style={{
        maxWidth: '80%',
        padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: `${layout.borderRadius.lg} 4px ${layout.borderRadius.lg} ${layout.borderRadius.lg}`,
        background: 'rgba(255,255,255,0.08)',
        border: `1px solid rgba(255,255,255,0.15)`,
    }}>
        <p style={{
            fontFamily: typography.fonts.body,
            fontSize: '1.1rem',
            color: '#f0e6d3',
            lineHeight: 1.7,
            margin: 0,
        }}>
            {text}
        </p>
    </div>
);

export default TherapistStage;

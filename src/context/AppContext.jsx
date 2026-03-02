// src/context/AppContext.jsx

import React, { createContext, useContext, useReducer } from 'react';

// ===== SCREENS =====
export const SCREENS = {
  LANDING: 'LANDING',
  MIRROR: 'MIRROR',
  RASA_REVEAL: 'RASA_REVEAL',
  JOURNEY: 'JOURNEY',
  REFLECTION: 'REFLECTION',
  MANUAL_SELECT: 'MANUAL_SELECT',
};

// ===== JOURNEY STAGES =====
export const JOURNEY_STAGES = {
  ACKNOWLEDGMENT: 'ACKNOWLEDGMENT',
  STORY: 'STORY',
  THERAPIST_DIALOGUE: 'THERAPIST_DIALOGUE',  // NEW — AI therapist conversation
  BREATHING: 'BREATHING',
  TRANSITION: 'TRANSITION',
  SHANTA: 'SHANTA',
};

// ===== INITIAL STATE =====
const initialState = {
  currentScreen: SCREENS.LANDING,
  detectedEmotion: null,
  detectedConfidence: 0,
  selectedRasa: null,
  journeyStage: null,
  journeyStartTime: null,
  isAudioEnabled: true,
  isCameraActive: false,
  hasCompletedJourney: false,
  journalEntry: '',
  // ===== AI-POWERED FIELDS =====
  emotionNuance: '',              // Poetic nuance from Gemini Vision
  visionEmotionData: null,        // Full vision analysis result
  therapistMessages: [],          // Chat history from therapist stage
  aiInsight: null,                // Post-journey AI insight
};

// ===== ACTIONS =====
const ACTIONS = {
  SET_SCREEN: 'SET_SCREEN',
  SET_DETECTED_EMOTION: 'SET_DETECTED_EMOTION',
  SET_SELECTED_RASA: 'SET_SELECTED_RASA',
  SET_JOURNEY_STAGE: 'SET_JOURNEY_STAGE',
  START_JOURNEY: 'START_JOURNEY',
  COMPLETE_JOURNEY: 'COMPLETE_JOURNEY',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  SET_CAMERA_ACTIVE: 'SET_CAMERA_ACTIVE',
  SET_JOURNAL_ENTRY: 'SET_JOURNAL_ENTRY',
  SET_EMOTION_NUANCE: 'SET_EMOTION_NUANCE',
  SET_VISION_DATA: 'SET_VISION_DATA',
  SET_THERAPIST_MESSAGES: 'SET_THERAPIST_MESSAGES',
  SET_AI_INSIGHT: 'SET_AI_INSIGHT',
  RESET: 'RESET',
};

// ===== REDUCER =====
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCREEN:
      if (state.currentScreen === action.payload) return state;
      return { ...state, currentScreen: action.payload };

    case ACTIONS.SET_DETECTED_EMOTION:
      if (state.detectedEmotion === action.payload.emotion && state.detectedConfidence === action.payload.confidence) return state;
      return {
        ...state,
        detectedEmotion: action.payload.emotion,
        detectedConfidence: action.payload.confidence,
      };

    case ACTIONS.SET_SELECTED_RASA:
      if (state.selectedRasa === action.payload) return state;
      return { ...state, selectedRasa: action.payload };

    case ACTIONS.SET_JOURNEY_STAGE:
      if (state.journeyStage === action.payload) return state;
      return { ...state, journeyStage: action.payload };

    case ACTIONS.START_JOURNEY:
      return {
        ...state,
        currentScreen: SCREENS.JOURNEY,
        journeyStage: JOURNEY_STAGES.ACKNOWLEDGMENT,
        journeyStartTime: Date.now(),
        hasCompletedJourney: false,
      };

    case ACTIONS.COMPLETE_JOURNEY:
      return {
        ...state,
        hasCompletedJourney: true,
        journeyStage: null,
        currentScreen: SCREENS.REFLECTION,
      };

    case ACTIONS.TOGGLE_AUDIO:
      return { ...state, isAudioEnabled: !state.isAudioEnabled };

    case ACTIONS.SET_CAMERA_ACTIVE:
      return { ...state, isCameraActive: action.payload };

    case ACTIONS.SET_JOURNAL_ENTRY:
      return { ...state, journalEntry: action.payload };

    case ACTIONS.SET_EMOTION_NUANCE:
      return { ...state, emotionNuance: action.payload };

    case ACTIONS.SET_VISION_DATA:
      return { ...state, visionEmotionData: action.payload };

    case ACTIONS.SET_THERAPIST_MESSAGES:
      return { ...state, therapistMessages: action.payload };

    case ACTIONS.SET_AI_INSIGHT:
      return { ...state, aiInsight: action.payload };

    case ACTIONS.RESET:
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

// ===== CONTEXT =====
const AppContext = createContext(null);

// ===== PROVIDER =====
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ===== ACTION CREATORS =====
  const actions = React.useMemo(() => ({
    setScreen: (screen) =>
      dispatch({ type: ACTIONS.SET_SCREEN, payload: screen }),

    setDetectedEmotion: (emotion, confidence) =>
      dispatch({
        type: ACTIONS.SET_DETECTED_EMOTION,
        payload: { emotion, confidence },
      }),

    setSelectedRasa: (rasaId) =>
      dispatch({ type: ACTIONS.SET_SELECTED_RASA, payload: rasaId }),

    setJourneyStage: (stage) =>
      dispatch({ type: ACTIONS.SET_JOURNEY_STAGE, payload: stage }),

    startJourney: () =>
      dispatch({ type: ACTIONS.START_JOURNEY }),

    completeJourney: () =>
      dispatch({ type: ACTIONS.COMPLETE_JOURNEY }),

    toggleAudio: () =>
      dispatch({ type: ACTIONS.TOGGLE_AUDIO }),

    setCameraActive: (active) =>
      dispatch({ type: ACTIONS.SET_CAMERA_ACTIVE, payload: active }),

    setJournalEntry: (text) =>
      dispatch({ type: ACTIONS.SET_JOURNAL_ENTRY, payload: text }),

    setEmotionNuance: (nuance) =>
      dispatch({ type: ACTIONS.SET_EMOTION_NUANCE, payload: nuance }),

    setVisionData: (data) =>
      dispatch({ type: ACTIONS.SET_VISION_DATA, payload: data }),

    setTherapistMessages: (messages) =>
      dispatch({ type: ACTIONS.SET_THERAPIST_MESSAGES, payload: messages }),

    setAIInsight: (insight) =>
      dispatch({ type: ACTIONS.SET_AI_INSIGHT, payload: insight }),

    reset: () =>
      dispatch({ type: ACTIONS.RESET }),
  }), []);

  const value = React.useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ===== HOOK =====
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;

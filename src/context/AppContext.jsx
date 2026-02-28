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
  BREATHING: 'BREATHING',
  TRANSITION: 'TRANSITION',
  SHANTA: 'SHANTA',
};

// ===== INITIAL STATE =====
const initialState = {
  currentScreen: SCREENS.LANDING,
  detectedEmotion: null,        // raw emotion from face-api.js
  detectedConfidence: 0,        // confidence score
  selectedRasa: null,           // the Rasa ID string (e.g., 'karuna')
  journeyStage: null,           // current stage within the journey
  journeyStartTime: null,       // timestamp when journey began
  isAudioEnabled: true,         // user can mute
  isCameraActive: false,        // camera stream status
  hasCompletedJourney: false,   // post-journey flag
  journalEntry: '',             // optional journal text
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
  RESET: 'RESET',
};

// ===== REDUCER =====
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCREEN:
      return { ...state, currentScreen: action.payload };

    case ACTIONS.SET_DETECTED_EMOTION:
      return {
        ...state,
        detectedEmotion: action.payload.emotion,
        detectedConfidence: action.payload.confidence,
      };

    case ACTIONS.SET_SELECTED_RASA:
      return { ...state, selectedRasa: action.payload };

    case ACTIONS.SET_JOURNEY_STAGE:
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
  const actions = {
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

    reset: () =>
      dispatch({ type: ACTIONS.RESET }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
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

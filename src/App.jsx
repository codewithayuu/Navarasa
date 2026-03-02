// src/App.jsx

import React, { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp, SCREENS } from './context/AppContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import MobileOptimizer from './components/ui/MobileOptimizer';
import LoadingScreen from './components/ui/LoadingScreen';

import LandingScreen from './screens/LandingScreen';
import MirrorScreen from './screens/MirrorScreen';
import RasaRevealScreen from './screens/RasaRevealScreen';
import ManualSelectScreen from './screens/ManualSelectScreen';
import JourneyScreen from './screens/JourneyScreen';
import ReflectionScreen from './screens/ReflectionScreen';

// Import font packages
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';

function ScreenRouter() {
  const { state } = useApp();

  return (
    <AnimatePresence mode="wait">
      {state.currentScreen === SCREENS.LANDING && (
        <LandingScreen key="landing" />
      )}
      {state.currentScreen === SCREENS.MIRROR && (
        <MirrorScreen key="mirror" />
      )}
      {state.currentScreen === SCREENS.RASA_REVEAL && (
        <RasaRevealScreen key="rasa-reveal" />
      )}
      {state.currentScreen === SCREENS.MANUAL_SELECT && (
        <ManualSelectScreen key="manual-select" />
      )}
      {state.currentScreen === SCREENS.JOURNEY && (
        <JourneyScreen key="journey" />
      )}
      {state.currentScreen === SCREENS.REFLECTION && (
        <ReflectionScreen key="reflection" />
      )}
      {/* Remaining screens for future phases:
        REFLECTION — Phase 12
      */}
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MobileOptimizer>
          <Suspense fallback={<LoadingScreen />}>
            <ScreenRouter />
          </Suspense>
        </MobileOptimizer>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

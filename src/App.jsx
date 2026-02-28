// src/App.jsx

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp, SCREENS } from './context/AppContext';
import LandingScreen from './screens/LandingScreen';
import MirrorScreen from './screens/MirrorScreen';

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
      {/* Future screens:
        RASA_REVEAL — Phase 5-6
        JOURNEY — Phase 7-10
        REFLECTION — Phase 12
        MANUAL_SELECT — Phase 12
      */}
    </AnimatePresence>
  );
}

function App() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}

export default App;

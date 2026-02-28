// src/App.jsx

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp, SCREENS } from './context/AppContext';
import LandingScreen from './screens/LandingScreen';

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
      {/* Future screens will be added here in subsequent phases:
        MIRROR, RASA_REVEAL, JOURNEY, REFLECTION, MANUAL_SELECT
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

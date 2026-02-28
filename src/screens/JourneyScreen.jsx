import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp, SCREENS, JOURNEY_STAGES } from '../context/AppContext';
import { getRasaById } from '../data/rasaConfig';
import { useJourneyOrchestrator } from '../hooks/useJourneyOrchestrator';
import JourneyShell from '../components/journey/JourneyShell';
import JourneyBackground from '../components/journey/JourneyBackground';
import AcknowledgmentStage from '../components/journey/stages/AcknowledgmentStage';
import StoryStage from '../components/journey/stages/StoryStage';
import BreathingStage from '../components/journey/stages/BreathingStage';
import TransitionStage from '../components/journey/stages/TransitionStage';
import ShantaStage from '../components/journey/stages/ShantaStage';
import { layout } from '../theme/tokens';

const JourneyScreen = () => {
  const { state, actions } = useApp();
  const rasaConfig = getRasaById(state.selectedRasa);

  const orchestrator = useJourneyOrchestrator({
    onJourneyComplete: () => {
      setTimeout(() => {
        actions.completeJourney();
      }, 3000);
    },
  });

  useEffect(() => {
    if (!orchestrator.isStarted) {
      const timer = setTimeout(() => {
        orchestrator.startJourney();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (orchestrator.currentStage) {
      actions.setJourneyStage(orchestrator.currentStage);
    }
  }, [orchestrator.currentStage, actions]);

  if (!rasaConfig) {
    actions.setScreen(SCREENS.LANDING);
    return null;
  }

  const handleExit = () => {
    orchestrator.exitJourney();
    actions.setScreen(SCREENS.RASA_REVEAL);
  };

  const handleContinueToReflection = () => {
    actions.completeJourney();
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <JourneyBackground
        rasaColors={rasaConfig.colors}
        currentStage={orchestrator.currentStage}
        totalProgress={orchestrator.totalProgress}
        stageProgress={orchestrator.stageProgress}
      />

      <JourneyShell
        currentStage={orchestrator.currentStage}
        stageProgress={orchestrator.stageProgress}
        totalProgress={orchestrator.totalProgress}
        currentStageIndex={orchestrator.currentStageIndex}
        isRunning={orchestrator.isRunning}
        totalRemainingSeconds={orchestrator.totalRemainingSeconds}
        onPause={orchestrator.pauseJourney}
        onResume={orchestrator.resumeJourney}
        onSkip={orchestrator.skipToNextStage}
        onExit={handleExit}
        isAudioEnabled={state.isAudioEnabled}
        onToggleAudio={actions.toggleAudio}
        rasaColors={rasaConfig.colors}
        stageOrder={orchestrator.STAGE_ORDER}
      >
        <AnimatePresence mode="wait">
          {orchestrator.currentStage === JOURNEY_STAGES.ACKNOWLEDGMENT && (
            <motion.div
              key="acknowledgment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'relative', zIndex: layout.zIndex.content }}
            >
              <AcknowledgmentStage
                rasaConfig={rasaConfig}
                stageProgress={orchestrator.stageProgress}
              />
            </motion.div>
          )}

          {orchestrator.currentStage === JOURNEY_STAGES.STORY && (
            <motion.div
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'relative', zIndex: layout.zIndex.content }}
            >
              <StoryStage
                rasaConfig={rasaConfig}
                stageProgress={orchestrator.stageProgress}
                stageElapsedMs={orchestrator.stageElapsedMs}
              />
            </motion.div>
          )}

          {orchestrator.currentStage === JOURNEY_STAGES.BREATHING && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'relative', zIndex: layout.zIndex.content }}
            >
              <BreathingStage
                rasaConfig={rasaConfig}
                stageProgress={orchestrator.stageProgress}
                stageElapsedMs={orchestrator.stageElapsedMs}
              />
            </motion.div>
          )}

          {orchestrator.currentStage === JOURNEY_STAGES.TRANSITION && (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'relative', zIndex: layout.zIndex.content }}
            >
              <TransitionStage
                rasaConfig={rasaConfig}
                stageProgress={orchestrator.stageProgress}
                stageElapsedMs={orchestrator.stageElapsedMs}
              />
            </motion.div>
          )}

          {orchestrator.currentStage === JOURNEY_STAGES.SHANTA && (
            <motion.div
              key="shanta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'relative', zIndex: layout.zIndex.content }}
            >
              <ShantaStage
                stageProgress={orchestrator.stageProgress}
                onContinue={handleContinueToReflection}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </JourneyShell>
    </div>
  );
};

export default JourneyScreen;

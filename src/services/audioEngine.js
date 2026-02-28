import * as Tone from 'tone';

let isInitialized = false;
let isMuted = false;
let masterGain = null;
let tanpuraSynths = [];
let tanpuraGain = null;
let raagaPlayer = null;
let raagaGain = null;
let crossfadePlayer = null;
let currentRaagaFile = null;
let journeyAudioState = 'idle';

const TANPURA_CONFIG = {
  sa: { note: 'C3', detune: 0 },
  saOctave: { note: 'C2', detune: 0 },
  pa: { note: 'G2', detune: 0 },
  mandra: { note: 'C2', detune: -5 },
};

export async function initializeAudio() {
  if (isInitialized) return true;

  try {
    await Tone.start();
    console.log('[NavaraMirror Audio] Tone.js context started.');

    masterGain = new Tone.Gain(0.7).toDestination();

    tanpuraGain = new Tone.Gain(0).connect(masterGain);

    raagaGain = new Tone.Gain(0).connect(masterGain);

    createTanpuraSynths();

    isInitialized = true;
    return true;
  } catch (error) {
    console.error('[NavaraMirror Audio] Init failed:', error);
    return false;
  }
}

function createTanpuraSynths() {
  tanpuraSynths.forEach((s) => {
    try { s.dispose(); } catch (e) { /* ignore */ }
  });
  tanpuraSynths = [];

  const saDrone = new Tone.FMSynth({
    harmonicity: 1.5,
    modulationIndex: 0.5,
    oscillator: { type: 'sine' },
    modulation: { type: 'triangle' },
    envelope: {
      attack: 4,
      decay: 0.1,
      sustain: 1,
      release: 8,
    },
    modulationEnvelope: {
      attack: 3,
      decay: 0.1,
      sustain: 1,
      release: 6,
    },
    volume: -18,
  }).connect(tanpuraGain);

  const paDrone = new Tone.FMSynth({
    harmonicity: 2,
    modulationIndex: 0.3,
    oscillator: { type: 'sine' },
    modulation: { type: 'sine' },
    envelope: {
      attack: 5,
      decay: 0.1,
      sustain: 1,
      release: 8,
    },
    modulationEnvelope: {
      attack: 4,
      decay: 0.1,
      sustain: 1,
      release: 6,
    },
    volume: -22,
  }).connect(tanpuraGain);

  const lowSaDrone = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 6,
      decay: 0.1,
      sustain: 1,
      release: 10,
    },
    volume: -26,
  }).connect(tanpuraGain);

  const shimmer = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 8,
      decay: 0.1,
      sustain: 1,
      release: 12,
    },
    volume: -34,
  }).connect(tanpuraGain);

  tanpuraSynths = [saDrone, paDrone, lowSaDrone, shimmer];
}

export function startTanpura(fadeInDuration = 4) {
  if (!isInitialized || isMuted) return;

  try {
    tanpuraSynths[0]?.triggerAttack(TANPURA_CONFIG.sa.note, Tone.now());
    tanpuraSynths[1]?.triggerAttack(TANPURA_CONFIG.pa.note, Tone.now() + 0.5);
    tanpuraSynths[2]?.triggerAttack(TANPURA_CONFIG.saOctave.note, Tone.now() + 1);
    tanpuraSynths[3]?.triggerAttack('C5', Tone.now() + 2);

    tanpuraGain?.gain.cancelScheduledValues(Tone.now());
    tanpuraGain?.gain.setValueAtTime(0, Tone.now());
    tanpuraGain?.gain.linearRampToValueAtTime(0.6, Tone.now() + fadeInDuration);
  } catch (e) {
    console.warn('[NavaraMirror Audio] Tanpura start warning:', e);
  }
}

export function stopTanpura(fadeOutDuration = 3) {
  if (!isInitialized) return;

  try {
    tanpuraGain?.gain.cancelScheduledValues(Tone.now());
    tanpuraGain?.gain.linearRampToValueAtTime(0, Tone.now() + fadeOutDuration);

    setTimeout(() => {
      tanpuraSynths.forEach((s) => {
        try { s.triggerRelease(Tone.now()); } catch (e) { /* ignore */ }
      });
    }, (fadeOutDuration + 1) * 1000);
  } catch (e) {
    console.warn('[NavaraMirror Audio] Tanpura stop warning:', e);
  }
}

export function setTanpuraVolume(volume, rampDuration = 2) {
  if (!isInitialized || !tanpuraGain) return;
  const clamped = Math.max(0, Math.min(1, volume));
  tanpuraGain.gain.cancelScheduledValues(Tone.now());
  tanpuraGain.gain.linearRampToValueAtTime(clamped, Tone.now() + rampDuration);
}

export async function playRaagaFile(url, fadeInDuration = 2) {
  if (!isInitialized || isMuted) return null;

  try {
    if (raagaPlayer) {
      await fadeOutPlayer(raagaPlayer, 1.5);
      raagaPlayer.dispose();
      raagaPlayer = null;
    }

    const player = new Tone.Player({
      url,
      loop: false,
      fadeIn: fadeInDuration,
      fadeOut: 2,
      volume: -6,
      onload: () => {
        console.log(`[NavaraMirror Audio] Loaded: ${url}`);
      },
      onerror: (err) => {
        console.warn(`[NavaraMirror Audio] Failed to load: ${url}`, err);
      },
    }).connect(raagaGain);

    await Tone.loaded();

    raagaGain?.gain.cancelScheduledValues(Tone.now());
    raagaGain?.gain.setValueAtTime(0, Tone.now());
    raagaGain?.gain.linearRampToValueAtTime(0.8, Tone.now() + fadeInDuration);

    player.start();
    raagaPlayer = player;
    currentRaagaFile = url;

    return player;
  } catch (e) {
    console.warn('[NavaraMirror Audio] Raaga playback error:', e);
    return null;
  }
}

export async function crossfadeToTrack(newUrl, crossfadeDuration = 3) {
  if (!isInitialized || isMuted) return;

  try {
    const newPlayer = new Tone.Player({
      url: newUrl,
      loop: false,
      fadeIn: crossfadeDuration,
      fadeOut: 2,
      volume: -6,
    }).connect(raagaGain);

    await Tone.loaded();

    if (raagaPlayer) {
      const oldPlayer = raagaPlayer;
      fadeOutPlayer(oldPlayer, crossfadeDuration).then(() => {
        oldPlayer.dispose();
      });
    }

    newPlayer.start();
    raagaPlayer = newPlayer;
    currentRaagaFile = newUrl;
  } catch (e) {
    console.warn('[NavaraMirror Audio] Crossfade error:', e);
  }
}

function fadeOutPlayer(player, duration) {
  return new Promise((resolve) => {
    try {
      if (player && player.state === 'started') {
        player.volume.cancelScheduledValues(Tone.now());
        player.volume.linearRampToValueAtTime(-60, Tone.now() + duration);
        setTimeout(() => {
          try { player.stop(); } catch (e) { /* ignore */ }
          resolve();
        }, duration * 1000 + 200);
      } else {
        resolve();
      }
    } catch (e) {
      resolve();
    }
  });
}

export function stopRaaga(fadeOutDuration = 2) {
  if (!isInitialized) return;

  try {
    raagaGain?.gain.cancelScheduledValues(Tone.now());
    raagaGain?.gain.linearRampToValueAtTime(0, Tone.now() + fadeOutDuration);

    setTimeout(() => {
      if (raagaPlayer) {
        try { raagaPlayer.stop(); raagaPlayer.dispose(); } catch (e) { /* ignore */ }
        raagaPlayer = null;
      }
    }, (fadeOutDuration + 0.5) * 1000);
  } catch (e) {
    console.warn('[NavaraMirror Audio] Stop raaga warning:', e);
  }
}

export function setMasterVolume(volume, rampDuration = 1) {
  if (!masterGain) return;
  const clamped = Math.max(0, Math.min(1, volume));
  masterGain.gain.cancelScheduledValues(Tone.now());
  masterGain.gain.linearRampToValueAtTime(clamped, Tone.now() + rampDuration);
}

export function muteAll() {
  isMuted = true;
  setMasterVolume(0, 0.5);
}

export function unmuteAll() {
  isMuted = false;
  setMasterVolume(0.7, 0.5);
}

export function toggleMute() {
  if (isMuted) {
    unmuteAll();
  } else {
    muteAll();
  }
  return !isMuted;
}

export function getIsMuted() {
  return isMuted;
}

export async function startJourneyAudio(rasaConfig) {
  if (!isInitialized) {
    const success = await initializeAudio();
    if (!success) return;
  }

  journeyAudioState = 'playing';

  startTanpura(3);

  const alapFile = rasaConfig.audio.files.alap;
  if (alapFile) {
    setTimeout(() => {
      if (journeyAudioState === 'playing') {
        playRaagaFile(alapFile, 3);
      }
    }, 3000);
  }
}

export function transitionToStageAudio(stageName, rasaConfig) {
  if (!isInitialized || isMuted || journeyAudioState !== 'playing') return;

  const files = rasaConfig.audio.files;

  switch (stageName) {
    case 'STORY':
      if (files.development) {
        crossfadeToTrack(files.development, 3);
      }
      setTanpuraVolume(0.45, 2);
      break;

    case 'BREATHING':
      if (raagaPlayer) {
        raagaGain?.gain.linearRampToValueAtTime(0.3, Tone.now() + 3);
      }
      setTanpuraVolume(0.55, 2);
      break;

    case 'TRANSITION':
      if (files.transition) {
        crossfadeToTrack(files.transition, 4);
      }
      setTanpuraVolume(0.5, 2);
      break;

    case 'SHANTA':
      stopRaaga(6);
      setTanpuraVolume(0.6, 2);
      setTimeout(() => {
        if (journeyAudioState === 'playing') {
          setTanpuraVolume(0.3, 5);
          setTimeout(() => {
            if (journeyAudioState === 'playing') {
              stopTanpura(8);
            }
          }, 8000);
        }
      }, 5000);
      break;

    default:
      break;
  }
}

export function pauseJourneyAudio() {
  journeyAudioState = 'paused';
  setMasterVolume(0, 1);
}

export function resumeJourneyAudio() {
  journeyAudioState = 'playing';
  setMasterVolume(0.7, 1);
}

export function stopJourneyAudio() {
  journeyAudioState = 'stopped';
  stopRaaga(2);
  stopTanpura(2);
  setTimeout(() => {
    setMasterVolume(0, 0.5);
  }, 500);
}

export function disposeAll() {
  stopJourneyAudio();
  setTimeout(() => {
    tanpuraSynths.forEach((s) => {
      try { s.dispose(); } catch (e) { /* ignore */ }
    });
    tanpuraSynths = [];
    if (raagaPlayer) {
      try { raagaPlayer.dispose(); } catch (e) { /* ignore */ }
      raagaPlayer = null;
    }
    if (tanpuraGain) {
      try { tanpuraGain.dispose(); } catch (e) { /* ignore */ }
      tanpuraGain = null;
    }
    if (raagaGain) {
      try { raagaGain.dispose(); } catch (e) { /* ignore */ }
      raagaGain = null;
    }
    if (masterGain) {
      try { masterGain.dispose(); } catch (e) { /* ignore */ }
      masterGain = null;
    }
    isInitialized = false;
    journeyAudioState = 'idle';
  }, 3000);
}

export function isAudioReady() {
  return isInitialized;
}

export function getJourneyAudioState() {
  return journeyAudioState;
}

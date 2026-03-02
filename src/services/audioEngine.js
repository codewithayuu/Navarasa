// src/services/audioEngine.js

// ============================================
// NAVARASA MIRROR — SYNTHESIZED AUDIO ENGINE
// Uses Tone.js to synthesize Indian Instruments
// Tanpura, Tabla, Sitar, Flute
// ============================================

import * as Tone from 'tone';

let isInitialized = false;
let isMuted = false;
let isPlaying = false;
let currentRasaId = null;

// Audio Nodes
let masterGain = null;
let reverb = null;
let delay = null;

// Instruments
const instruments = {};
let activeInstruments = new Set();
let currentTempo = 60;

// Scale Frequencies
const scales = {
  'C': { Sa: 'C3', Pa: 'G3', SaHigh: 'C4', Ma: 'F3' },
  'D': { Sa: 'D3', Pa: 'A3', SaHigh: 'D4', Ma: 'G3' },
  'E': { Sa: 'E3', Pa: 'B3', SaHigh: 'E4', Ma: 'A3' },
  'G': { Sa: 'G2', Pa: 'D3', SaHigh: 'G3', Ma: 'C3' },
  'A': { Sa: 'A2', Pa: 'E3', SaHigh: 'A3', Ma: 'D3' },
};

function getScale() {
  return scales['C']; // Currently defaulting to C for simplicity
}

// =====================
// TANPURA (Drone)
// =====================
function createTanpura() {
  const tanpuraSynth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3,
    modulationIndex: 0.5,
    envelope: { attack: 0.8, decay: 2, sustain: 0.6, release: 3 },
    modulation: { type: 'sine' },
    volume: -8
  }).connect(reverb);

  const droneSynth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 2, decay: 1, sustain: 0.8, release: 4 },
    volume: -12
  }).connect(reverb);

  let stringIndex = 0;
  const pattern = ['Pa', 'Sa', 'Sa', 'SaHigh'];

  const loop = new Tone.Loop((time) => {
    const scale = getScale();
    const note = scale[pattern[stringIndex % pattern.length]];

    tanpuraSynth.triggerAttackRelease(note, '2n', time);

    if (stringIndex % 2 === 0) {
      droneSynth.triggerAttackRelease(scale.Sa, '1m', time, 0.3);
    }
    stringIndex++;
  }, '2n');

  return { tanpuraSynth, droneSynth, loop };
}

// =====================
// TABLA (Rhythm)
// =====================
function createTabla() {
  const dayan = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 },
    volume: -10
  }).connect(delay);

  const bayan = new Tone.MembraneSynth({
    pitchDecay: 0.08,
    octaves: 4,
    envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.5 },
    volume: -12
  }).connect(reverb);

  const pattern = [
    { drum: 'dayan', note: 'G4', vel: 0.8 },
    { drum: 'dayan', note: 'A4', vel: 0.5 },
    { drum: 'dayan', note: 'A4', vel: 0.5 },
    { drum: 'dayan', note: 'G4', vel: 0.6 },
    { drum: 'dayan', note: 'G4', vel: 0.7 },
    { drum: 'dayan', note: 'A4', vel: 0.5 },
    { drum: 'dayan', note: 'A4', vel: 0.5 },
    { drum: 'dayan', note: 'G4', vel: 0.6 },
    { drum: 'bayan', note: 'C3', vel: 0.7 },
    { drum: 'dayan', note: 'B4', vel: 0.5 },
    { drum: 'dayan', note: 'B4', vel: 0.5 },
    { drum: 'bayan', note: 'C3', vel: 0.6 },
    { drum: 'dayan', note: 'G4', vel: 0.8 },
    { drum: 'dayan', note: 'A4', vel: 0.5 },
    { drum: 'dayan', note: 'A4', vel: 0.5 },
    { drum: 'dayan', note: 'G4', vel: 0.6 },
  ];

  let step = 0;
  const loop = new Tone.Loop((time) => {
    const hit = pattern[step % pattern.length];
    if (hit.drum === 'dayan') {
      dayan.triggerAttackRelease(hit.note, '16n', time, hit.vel);
    } else {
      bayan.triggerAttackRelease(hit.note, '8n', time, hit.vel);
    }
    step++;
  }, '8n');

  return { dayan, bayan, loop };
}

// =====================
// SITAR (Melodic)
// =====================
function createSitar() {
  const sitar = new Tone.PluckSynth({
    attackNoise: 2,
    dampening: 3000,
    resonance: 0.98,
    volume: -8
  }).connect(delay);

  const raagNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5', 'A4', 'G4', 'F4', 'E4', 'D4'];
  let noteIndex = 0;

  const loop = new Tone.Loop((time) => {
    const note = raagNotes[noteIndex % raagNotes.length];
    if (Math.random() > 0.7) {
      sitar.triggerAttackRelease(note, '4n', time);
    } else {
      sitar.triggerAttackRelease(note, '8n', time);
    }
    if (Math.random() > 0.3) {
      noteIndex++;
    }
  }, '4n');

  return { sitar, loop };
}

// =====================
// FLUTE (Bansuri)
// =====================
function createFlute() {
  const flute = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.3, decay: 0.2, sustain: 0.7, release: 1 },
    volume: -14
  }).connect(reverb);

  const vibrato = new Tone.Vibrato({ frequency: 5, depth: 0.15 }).connect(reverb);
  flute.connect(vibrato);

  const fluteNotes = ['G4', 'A4', 'B4', 'D5', 'E5', 'D5', 'B4', 'A4', 'G4', 'E4'];
  let noteIdx = 0;

  const loop = new Tone.Loop((time) => {
    if (Math.random() > 0.2) {
      const note = fluteNotes[noteIdx % fluteNotes.length];
      const duration = Math.random() > 0.5 ? '4n' : '2n';
      flute.triggerAttackRelease(note, duration, time);
      noteIdx++;
    }
  }, '2n');

  return { flute, vibrato, loop };
}

// =====================
// CORE FUNCTIONS
// =====================
export async function initializeAudio() {
  if (isInitialized) return true;

  try {
    await Tone.start();

    masterGain = new Tone.Gain(0.5).toDestination();
    reverb = new Tone.Reverb({ decay: 4, wet: 0.3 }).connect(masterGain);
    delay = new Tone.FeedbackDelay("8n", 0.2).connect(reverb);

    // Ensure reverb is ready
    await reverb.generate();

    isInitialized = true;
    console.log('[AudioEngine] Tone.js initialized with Indian Instruments');
    return true;
  } catch (error) {
    console.error('[AudioEngine] Init failed:', error);
    return false;
  }
}

function initInstrument(name) {
  if (instruments[name]) return;
  switch (name) {
    case 'tanpura': instruments.tanpura = createTanpura(); break;
    case 'tabla': instruments.tabla = createTabla(); break;
    case 'sitar': instruments.sitar = createSitar(); break;
    case 'flute': instruments.flute = createFlute(); break;
  }
}

export function switchRasaMode(rasaId) {
  if (!isInitialized) return;
  if (currentRasaId === rasaId) return;
  currentRasaId = rasaId;

  // Different instruments for different moods
  activeInstruments.clear();

  if (['shanta', 'karuna', 'bhayanaka', 'bibhatsa'].includes(rasaId)) {
    activeInstruments.add('tanpura');
    activeInstruments.add('flute');
    currentTempo = 50;
  } else if (['shringara', 'hasya', 'adbhuta'].includes(rasaId)) {
    activeInstruments.add('tanpura');
    activeInstruments.add('sitar');
    activeInstruments.add('tabla');
    currentTempo = 70;
  } else {
    // veera, raudra
    activeInstruments.add('tabla');
    activeInstruments.add('tanpura');
    currentTempo = 85;
  }

  if (isPlaying) {
    applyActiveInstruments();
  } else {
    if (!isMuted) startPlayback();
  }
}

function applyActiveInstruments() {
  // Stop all loops first
  Object.values(instruments).forEach(inst => {
    if (inst.loop) inst.loop.stop();
  });

  // Start needed ones
  Tone.Transport.bpm.rampTo(currentTempo, 1);

  activeInstruments.forEach(name => {
    initInstrument(name);
    if (instruments[name]) {
      instruments[name].loop.start(0);
    }
  });
}

function startPlayback() {
  if (isPlaying) return;
  Tone.Transport.bpm.value = currentTempo;
  Tone.Transport.start();
  applyActiveInstruments();
  isPlaying = true;
}

function stopPlayback() {
  if (!isPlaying) return;
  Tone.Transport.stop();
  Object.values(instruments).forEach(inst => {
    if (inst.loop) inst.loop.stop();
  });
  isPlaying = false;
}

export function setVolume(volumeValueZeroToOne) {
  if (!isInitialized || !masterGain) return;
  if (!isMuted) {
    masterGain.gain.rampTo(volumeValueZeroToOne, 0.1);
  }
}

export function mute() {
  isMuted = true;
  if (masterGain) masterGain.gain.rampTo(0, 0.5);
}

export function unmute() {
  isMuted = false;
  if (masterGain) masterGain.gain.rampTo(0.5, 0.5);
  if (!isPlaying && currentRasaId) startPlayback();
}

export function toggleMute() {
  isMuted ? unmute() : mute();
  return isMuted;
}

export function stopAll() {
  stopPlayback();
  currentRasaId = null;
}

export function getAudioState() {
  return {
    isInitialized,
    isMuted,
    currentRasaId
  };
}

// =====================
// HOOK COMPATIBILITY WRAPPERS
// =====================
export function isAudioReady() {
  return isInitialized;
}

export function startJourneyAudio(rasaConfig) {
  if (rasaConfig) switchRasaMode(rasaConfig.id);
}

export function transitionToStageAudio(stage, rasaConfig) {
  if (stage === 'SHANTA') {
    switchRasaMode('shanta');
  } else if (rasaConfig) {
    switchRasaMode(rasaConfig.id);
  }
}

export function pauseJourneyAudio() {
  stopPlayback();
}

export function resumeJourneyAudio() {
  if (!isMuted && currentRasaId) {
    startPlayback();
  }
}

export function stopJourneyAudio() {
  stopAll();
}

export function startLandingAmbient() {
  switchRasaMode('shanta'); // Use peaceful default
}

export function stopLandingAmbient() {
  stopAll();
}

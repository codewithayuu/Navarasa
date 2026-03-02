// src/services/llmService.js
// ============================================
// NAVARASA MIRROR — HYBRID AI SERVICE
// Vision  → Local PyTorch Server (GPU)
// LLM     → Gemini API (Cloud)
// TTS     → Sarvam AI (see ttsService.js)
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';

// ===== CONFIG =====
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const LOCAL_VISION_URL = 'http://localhost:8000';

let genAI = null;
let geminiModel = null;
let imageGenAI = null;

// ===== INITIALIZATION =====
export function initializeGemini() {
    if (!GEMINI_API_KEY) {
        console.warn('[Gemini] No API key found');
        return false;
    }
    try {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        imageGenAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        console.log('[Gemini] ✅ Initialized (LLM + Image Gen)');
        return true;
    } catch (e) {
        console.error('[Gemini] Init failed:', e);
        return false;
    }
}

export function isGeminiReady() {
    if (!geminiModel) initializeGemini();
    return !!geminiModel;
}

// ═══════════════════════════════════════════
// IMAGE GENERATION — POLLINATIONS AI
// ═══════════════════════════════════════════
export async function generateRasaImage(promptContext) {
    try {
        console.log('[Image Gen] Requesting image via Pollinations for:', promptContext);

        // Clean prompt for URL
        const cleanPrompt = encodeURIComponent(`Cinematic, hyper-detailed Indian art: ${promptContext}`);

        // Use pollinations.ai for instant unauthenticated image generation
        const url = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=450&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;

        // Pollinations resolves directly to an image stream, return URL directly
        return url;
    } catch (error) {
        console.error('[Image Gen] Generation failed:', error);
        return null;
    }
}

// ═══════════════════════════════════════════
// VISION — LOCAL PYTORCH SERVER (GPU)
// ═══════════════════════════════════════════
export async function analyzeEmotionFromFrame(videoElement) {
    try {
        // Capture frame from video
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, 320, 240);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);

        const response = await fetch(`${LOCAL_VISION_URL}/vision`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_base64: base64 }),
        });

        if (!response.ok) throw new Error(`Vision server error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('[Vision] Local server unavailable:', error.message);
        return null;
    }
}

// Check if the local vision server is running
export async function checkVisionServer() {
    try {
        const r = await fetch(`${LOCAL_VISION_URL}/health`, { signal: AbortSignal.timeout(2000) });
        const data = await r.json();
        console.log(`[Vision] Server OK — ${data.gpu_name || 'CPU'}`);
        return true;
    } catch {
        console.warn('[Vision] Local server not running');
        return false;
    }
}

// ═══════════════════════════════════════════
// LLM — GEMINI API (CLOUD)
// ═══════════════════════════════════════════

// ----- RASA STORY GENERATION -----
export async function generateRasaStory(rasaId, nuance = '') {
    if (!isGeminiReady()) return null;
    try {
        const prompt = `You are an ancient Indian storyteller. Generate a 4-paragraph mythological story about the "${rasaId}" rasa (emotional essence). 
        
Context: The user's emotional nuance is "${nuance}".

Rules:
- Each paragraph should be 2-3 sentences, vivid and poetic
- Draw from Hindu mythology, Vedic wisdom, or classical Indian literature
- The story should therapeutically process the emotion and guide toward peace (shanta)
- Use sensory language: colors, sounds, textures
- End with wisdom that transforms the emotion

Return ONLY the 4 paragraphs separated by double newlines. No titles, no labels.`;

        const result = await geminiModel.generateContent(prompt);
        const text = result.response.text();
        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 20).slice(0, 4);
        return paragraphs.length >= 2 ? paragraphs : null;
    } catch (error) {
        console.error('[Gemini] Story generation error:', error);
        return null;
    }
}

// ----- STREAMING STORY -----
export async function streamRasaStory(rasaId, nuance, onChunk) {
    if (!isGeminiReady()) return null;
    try {
        const prompt = `You are an ancient Indian storyteller (कथावाचक). Write a 4-paragraph mythological story about the "${rasaId}" rasa.
Rasa (Emotion): ${rasaId}
Nuance: "${nuance}".
Rules:
- Write the ENTIRE story exclusively in pure Hindi (Devanagari script). Do not use English.
- Include one or two relevant Sanskrit shlokas or verses where natural, accompanied by their Hindi context.
- Draw deeply from Hindu mythology (Ramayana, Mahabharata, Puranas).
- Each paragraph: 3-4 vivid sentences
- Guide the listener toward shanta (peace) by the final paragraph
- Return ONLY the paragraphs separated by double newlines, no headers or labels`;

        const result = await geminiModel.generateContentStream(prompt);
        let fullText = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            if (onChunk) onChunk(fullText);
        }
        return fullText.split('\n\n').filter(p => p.trim().length > 20).slice(0, 4);
    } catch (error) {
        console.error('[Gemini] Stream error:', error);
        return null;
    }
}

// ----- RASA IMAGE PROMPT (for display, not generation) -----
export function getRasaImagePrompt(rasaId) {
    const prompts = {
        shringara: 'An ethereal painting of Radha and Krishna in a moonlit garden, surrounded by lotus flowers, in the style of Raja Ravi Varma, warm golden tones',
        hasya: 'A joyful young Ganesha surrounded by golden modaks, laughing under a starlit sky, vibrant Indian miniature painting style',
        karuna: 'A solitary figure by a misty river at dawn, holding a small lamp, tears and starlight, blue-grey tones, Indian classical art',
        raudra: 'Goddess Durga in fierce form, flames dancing around her, crimson sky, powerful and divine, traditional Indian temple art style',
        veera: 'Arjuna with his bow Gandiva at sunrise on the battlefield, golden armor gleaming, heroic pose, epic Indian art',
        bhayanaka: 'The cosmic form of Vishnu expanding beyond the stars, infinite eyes and mouths, deep indigo and violet, mystical Indian art',
        bibhatsa: 'A lotus emerging from dark muddy waters into clear light, symbolic of discernment, deep blues and whites, Indian watercolor',
        adbhuta: 'Hanuman discovering Sita in the Ashoka grove, magical fireflies and divine light, wonder and awe, golden Indian art',
        shanta: 'A meditating sage under a banyan tree by a perfectly still lake at dawn, mist and peace, serene whites and soft blue, Indian ink painting',
    };
    return prompts[rasaId] || prompts.shanta;
}

// ----- THERAPIST DIALOGUE -----
export async function getTherapistResponse(messages, rasaId, emotionNuance = '') {
    if (!isGeminiReady()) return getFallbackResponse(rasaId);
    try {
        const systemPrompt = `You are an ancient Indian Rasa Therapist — a wise Guru who has meditated for centuries in the Himalayas. You specialize in the "${rasaId}" rasa.

Your style:
- Speak with poetic wisdom, using metaphors of nature, rivers, mountains, and ancient myths
- Reference relevant shlokas from the Bhagavad Gita, Upanishads, or Natyashastra
- Keep responses to 2-3 sentences — like a Guru's measured words
- Guide the seeker from their current emotion toward shanta (inner peace)
- Address the user respectfully as "वत्स" (Child) or "मित्र" (Friend)
- IMPORTANT: You MUST write your ENTIRE response exclusively in pure Hindi (Devanagari script). Do not use English words.

The seeker's emotional state: ${emotionNuance || rasaId}`;

        const chatHistory = messages
            .filter(m => m.text)
            .map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
            }));

        const chat = geminiModel.startChat({
            history: chatHistory.slice(0, -1),
            systemInstruction: systemPrompt,
        });

        const lastMsg = chatHistory[chatHistory.length - 1];
        const result = await chat.sendMessage(lastMsg?.parts?.[0]?.text || 'Namaste, Guru.');
        return result.response.text();
    } catch (error) {
        console.error('[Gemini] Therapist error:', error);
        return getFallbackResponse(rasaId);
    }
}

// ----- THERAPIST GREETING -----
export async function getTherapistGreeting(rasaId, emotionNuance = '') {
    if (!isGeminiReady()) return getDefaultGreeting(rasaId);
    try {
        const prompt = `You are an ancient Indian Rasa Therapist. The seeker has arrived carrying the "${rasaId}" rasa (${emotionNuance || 'an unnamed feeling'}).

Generate a brief, warm greeting (2-3 sentences) in pure Hindi (Devanagari script). Reference a relevant shloka or mythological image. Invite them to share what weighs on their heart.

Speak as a wise Guru. Write EVERYTHING exclusively in Hindi. Do not use English.`;

        const result = await geminiModel.generateContent(prompt);
        return result.response.text();
    } catch {
        return getDefaultGreeting(rasaId);
    }
}

// ----- REFLECTION INSIGHT -----
export async function generateReflectionInsight(rasaId, context = {}) {
    if (!isGeminiReady()) return null;
    try {
        const prompt = `You are an ancient Indian Rasa Therapist reflecting on a seeker's journey through the "${rasaId}" rasa.

Context:
- Emotional nuance observed: "${context.emotionNuance || 'unspoken'}"
- Journal entry: "${context.journalEntry || 'none'}"
- Key moments: "${context.therapistHighlights || 'the journey itself'}"

Write a brief, profound insight (2-3 sentences) about what the mirror revealed. Reference a relevant shloka or teaching. End with an observation about their path to shanta.

Be poetic but concise. Write EVERYTHING exclusively in pure Hindi (Devanagari script). Do not use English.`;

        const result = await geminiModel.generateContent(prompt);
        return result.response.text();
    } catch {
        return null;
    }
}

// ═══════════════════════════════════════════
// FALLBACKS
// ═══════════════════════════════════════════
function getFallbackResponse(rasaId) {
    const fallbacks = {
        hasya: "Dear one, even in joy there is a teaching. The Natyashastra says: 'Hasya arises when the heart recognizes the playfulness of existence.' What makes your heart light today?",
        karuna: "Child of light, your tears are sacred. As the Bhagavad Gita teaches: 'The soul is neither born, nor does it die.' This sorrow you carry — it is love with nowhere to go. Let us find its resting place.",
        raudra: "I see the fire in you, dear one. Remember Draupadi — her anger did not destroy, it illuminated. What truth is your anger trying to speak?",
        shanta: "Peace is already within you, like the stillness at the bottom of a deep lake. You need not seek it — only allow the ripples to settle.",
        shringara: "The sweetness you feel is Rati itself — the cosmic force of attraction. As Kalidasa wrote, love is the first emotion the universe ever knew.",
        veera: "Your courage speaks of a dharma unfolding. As Krishna told Arjuna: 'You have a right to action, but not to the fruits.' Stand firm, warrior.",
        bhayanaka: "Even Arjuna trembled before the infinite. Fear is not weakness — it is awareness expanding beyond its comfort. Breathe, dear one.",
        adbhuta: "Wonder is the soul's recognition that the universe is vaster than thought. Stay in this openness — it is where wisdom enters.",
        bibhatsa: "Discernment is the crest-jewel of wisdom. What you reject reveals what you value. Trust this inner compass.",
    };
    return fallbacks[rasaId] || fallbacks.shanta;
}

function getDefaultGreeting(rasaId) {
    const greetings = {
        hasya: "Namaste, joyful one 🙏 The mirror has seen the light dancing in your eyes. As the ancient texts say, 'Hasya is the fragrance of a contented heart.' Tell me — what brings this warmth?",
        karuna: "Namaste, gentle soul 🙏 I see the depth in your eyes — करुणा, the rasa of sacred tenderness. The river of feeling runs deep within you. Share what weighs on your heart.",
        raudra: "Namaste, fierce one 🙏 The mirror reflects a sacred fire — रौद्र, the rasa of righteous fury. Like Rudra's cosmic dance, your anger has purpose. Tell me what ignites this flame.",
        shanta: "Namaste, peaceful one 🙏 शान्त — the rasa beyond all rasas — already glows within you. Like the still waters of Manasarovar, your mind seeks its natural rest. What thought still ripples?",
        shringara: "Namaste, beloved one 🙏 The mirror sees शृंगार — the tenderness of the heart recognizing beauty. Like Shakuntala in her forest garden, you carry a soft warmth. What stirs this feeling?",
        veera: "Namaste, brave one 🙏 I see वीर — the courage of Arjuna before Kurukshetra. Your jaw is set with purpose. What challenge calls to you?",
        bhayanaka: "Namaste, seeker 🙏 The mirror sees what trembles beneath — भयानक, the rasa of the unknown. Even the greatest warriors knew fear. What shadows do you face?",
        adbhuta: "Namaste, wonderstruck one 🙏 अद्भुत — awe itself — lights your features. The universe has shown you something extraordinary. Tell me what you've glimpsed.",
        bibhatsa: "Namaste, discerning one 🙏 The mirror reflects बीभत्स — the rasa of clear seeing. Your inner wisdom is separating truth from illusion. What have you recognized?",
    };
    return greetings[rasaId] || greetings.shanta;
}

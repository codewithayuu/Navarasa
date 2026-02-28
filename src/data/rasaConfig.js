// src/data/rasaConfig.js

// ============================================
// NAVARASA MIRROR — COMPLETE RASA CONFIGURATION
// The single source of truth for all 9 Rasas.
// Every feature traces back to this file.
// ============================================

const rasaConfig = {
  // ═══════════════════════════════════════════
  // RASA 1: SHRINGARA — Love / Beauty
  // ═══════════════════════════════════════════
  shringara: {
    id: 'shringara',
    nameEnglish: 'Love',
    nameExpanded: 'Love · Beauty · Attraction',
    nameSanskrit: 'शृंगार',
    nameTransliterated: 'Shringara',
    deity: 'Vishnu',
    sthayibhava: 'Rati (Romantic Love)',

    colors: {
      primary: '#0A6E5C',
      secondary: '#1B4D3E',
      gradient: ['#0A6E5C', '#12593E', '#1B4D3E'],
      glow: 'rgba(10, 110, 92, 0.4)',
      glowStrong: 'rgba(10, 110, 92, 0.7)',
      textOnBg: '#E0FFF6',
      bgGradient: 'linear-gradient(135deg, #0A6E5C 0%, #1B4D3E 100%)',
      shantaTransition: ['#0A6E5C', '#4A9E8E', '#A0CEC0', '#E2E8F0', '#F0F4F8'],
    },

    description:
      'Shringara is the Rasa of deep attraction — not merely physical, but the soul recognizing beauty in another. It is the magnetic pull that Radha felt toward Krishna, the longing that Shakuntala carried through seasons.',

    emotionMapping: {
      faceApiEmotion: 'happy',
      confidenceThreshold: 0.6,
      intensityVariant: 'mild',
      description: 'Mild happiness, gentle contentment, soft warmth',
    },

    audio: {
      raaga: 'Raag Yaman',
      raagaAlternates: ['Raag Khamaj', 'Raag Tilak Kamod'],
      raagaDescription:
        'Yaman is the raaga of twilight romance — its ascending scale creates yearning and beauty.',
      files: {
        alap: '/audio/shringara-yaman-alap.mp3',
        development: '/audio/shringara-yaman-jod.mp3',
        transition: '/audio/shringara-to-bhairavi.mp3',
        conclusion: '/audio/bhairavi-conclusion.mp3',
      },
    },

    story: {
      title: "Shakuntala's Garden",
      source: 'Abhijnana Shakuntalam by Kalidasa (from Mahabharata)',
      character: 'Shakuntala',
      panels: [
        {
          text: 'In a forest untouched by time, where the trees whispered prayers and the rivers sang in ragas, a young woman named Shakuntala tended to the wild deer as if they were her own children.',
          illustration: '/illustrations/shringara-1.webp',
        },
        {
          text: "A king named Dushyanta wandered into this forest, drawn by something he could not name. When their eyes met across the grove of ashoka trees, the world held its breath. It was not desire alone — it was recognition. The soul saying: 'There you are. I have been looking for you across lifetimes.'",
          illustration: '/illustrations/shringara-2.webp',
        },
        {
          text: 'They loved deeply, completely. But a sage\'s curse made the king forget — forget her face, her name, the garland of forest flowers she wore. Shakuntala wandered through seasons carrying a love that the beloved could not remember.',
          illustration: '/illustrations/shringara-3.webp',
        },
        {
          text: 'Yet love, the ancient texts tell us, is the one force that outlasts even forgetting. When the king finally remembered — triggered by a lost ring surfacing from a river — the pain of separation became the sweetness of reunion. Love had waited, as it always does.',
          illustration: '/illustrations/shringara-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Heart-Opening Breath',
      pattern: '4-7-8',
      inhaleCount: 4,
      holdCount: 7,
      exhaleCount: 8,
      cycles: 5,
      style: 'Relaxing, parasympathetic activation',
      instructions: [
        'Breathe in through your nose, slowly... 2... 3... 4...',
        'Hold gently, feeling your heart space expand... 2... 3... 4... 5... 6... 7...',
        'Release through your mouth, softly... 2... 3... 4... 5... 6... 7... 8...',
      ],
    },

    transitionWisdom: {
      lines: [
        'Love, when it stops grasping,',
        'simply witnesses.',
        'Witnessing becomes devotion.',
        'And devotion, at its deepest,',
        'is peace.',
      ],
    },
  },

  // ═══════════════════════════════════════════
  // RASA 2: HASYA — Joy / Laughter
  // ═══════════════════════════════════════════
  hasya: {
    id: 'hasya',
    nameEnglish: 'Joy',
    nameExpanded: 'Joy · Laughter · Delight',
    nameSanskrit: 'हास्य',
    nameTransliterated: 'Hasya',
    deity: 'Pramatha (Shiva\'s Ganas)',
    sthayibhava: 'Hasa (Mirth)',

    colors: {
      primary: '#E6B422',
      secondary: '#CC9900',
      gradient: ['#FFF8E7', '#FFE44D', '#E6B422'],
      glow: 'rgba(230, 180, 34, 0.4)',
      glowStrong: 'rgba(230, 180, 34, 0.7)',
      textOnBg: '#3D2E00',
      bgGradient: 'linear-gradient(135deg, #FFF8E7 0%, #E6B422 100%)',
      shantaTransition: ['#E6B422', '#F0D060', '#FFF3C4', '#F0F4F8', '#FFFFFF'],
    },

    description:
      'Hasya is the golden light of pure delight — the laughter of a child discovering something impossible, the mirth that Krishna brought wherever he went stealing butter and charming the gopis.',

    emotionMapping: {
      faceApiEmotion: 'happy',
      confidenceThreshold: 0.7,
      intensityVariant: 'high',
      description: 'Broad smile, bright eyes, high-intensity happiness',
    },

    audio: {
      raaga: 'Raag Bilawal',
      raagaAlternates: ['Raag Kafi', 'Raag Pahadi'],
      raagaDescription:
        'Bilawal is the morning raaga of pure joy — it uses the natural scale and feels like sunlight.',
      files: {
        alap: '/audio/hasya-bilawal-alap.mp3',
        development: '/audio/hasya-bilawal-jod.mp3',
        transition: '/audio/hasya-to-bhairavi.mp3',
        conclusion: '/audio/bhairavi-conclusion.mp3',
      },
    },

    story: {
      title: "Ganesha and the Moon's Laughter",
      source: 'Shiva Purana / Popular Mythology',
      character: 'Ganesha',
      panels: [
        {
          text: 'On a night bathed in silver, young Ganesha — the elephant-headed son of Shiva and Parvati — sat beneath the stars with a mountain of modaks before him. Sweet dumplings, each one lovingly prepared by his mother.',
          illustration: '/illustrations/hasya-1.webp',
        },
        {
          text: 'He ate with such innocent abandon that his round belly grew rounder still. When he tried to stand, he stumbled — and the Moon, watching from above, burst into laughter. Cold, mocking laughter that rang across the sky.',
          illustration: '/illustrations/hasya-2.webp',
        },
        {
          text: 'Ganesha looked up, not with anger, but with the quiet dignity of one who knows the difference between joyful laughter and cruel mockery. He spoke a single curse: "You who laugh at innocence — you shall wane." And so the Moon began its eternal cycle of diminishing.',
          illustration: '/illustrations/hasya-3.webp',
        },
        {
          text: 'The lesson rippled through the cosmos: true joy laughs with the universe, never at it. The purest humor finds delight in existence itself — in a child\'s stumble, in one\'s own imperfection — and holds it all with tenderness.',
          illustration: '/illustrations/hasya-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Joy Breath',
      pattern: 'rhythmic-bursts',
      inhaleCount: 3,
      holdCount: 0,
      exhaleCount: 3,
      cycles: 6,
      style: 'Short, rhythmic, energizing',
      instructions: [
        'Quick breath in... 1... 2... 3...',
        'And out with a soft "ha"... 1... 2... 3...',
        'Feel the warmth spreading across your chest...',
      ],
    },

    transitionWisdom: {
      lines: [
        'When laughter softens into a smile,',
        'and the smile softens into silence,',
        'that silence still holds all the warmth.',
        'That warm silence',
        'is peace.',
      ],
    },
  },

  // ═══════════════════════════════════════════
  // RASA 3: KARUNA — Compassion / Sorrow
  // ═══════════════════════════════════════════
  karuna: {
    id: 'karuna',
    nameEnglish: 'Compassion',
    nameExpanded: 'Compassion · Sorrow · Tenderness',
    nameSanskrit: 'करुण',
    nameTransliterated: 'Karuna',
    deity: 'Yama',
    sthayibhava: 'Shoka (Grief)',

    colors: {
      primary: '#708090',
      secondary: '#4A5568',
      gradient: ['#8899AA', '#708090', '#4A5568'],
      glow: 'rgba(112, 128, 144, 0.4)',
      glowStrong: 'rgba(112, 128, 144, 0.7)',
      textOnBg: '#E8EDF2',
      bgGradient: 'linear-gradient(135deg, #708090 0%, #4A5568 100%)',
      shantaTransition: ['#708090', '#95A5B5', '#C0CDD8', '#E2E8F0', '#F0F4F8'],
    },

    description:
      'Karuna is not mere sadness — it is the deep tenderness that arises when the heart fully witnesses suffering. It is the Rasa that transforms private grief into universal compassion.',

    emotionMapping: {
      faceApiEmotion: 'sad',
      confidenceThreshold: 0.6,
      intensityVariant: 'any',
      description: 'Downturned features, lowered gaze, weight of feeling',
    },

    audio: {
      raaga: 'Raag Darbari Kanada',
      raagaAlternates: ['Raag Malkauns', 'Raag Todi'],
      raagaDescription:
        'Darbari is the king of pathos — its slow, heavy meend between notes carries the weight of centuries of witnessed sorrow.',
      files: {
        alap: '/audio/karuna-darbari-alap.mp3',
        development: '/audio/karuna-darbari-jod.mp3',
        transition: '/audio/karuna-to-bhairavi.mp3',
        conclusion: '/audio/bhairavi-conclusion.mp3',
      },
    },

    story: {
      title: "Kunti's Silence",
      source: 'Mahabharata',
      character: 'Kunti',
      panels: [
        {
          text: 'Before she was a queen, before she was a mother, Kunti was a frightened young woman holding a newborn she was not allowed to keep. The sun-god\'s child — radiant, golden, born with divine armor — and the world would call him illegitimate.',
          illustration: '/illustrations/karuna-1.webp',
        },
        {
          text: 'With tears that no prayer could stop, she wove a basket, lined it with her own shawl, and placed her son — her firstborn, her Karna — upon the waters of the river Ashwa. She watched the current take him until the basket became a speck, then nothing.',
          illustration: '/illustrations/karuna-2.webp',
        },
        {
          text: 'Decades passed. Kunti became queen. She bore five more sons — the Pandavas. But in every crowd, at every festival, her eyes searched for a face she had only seen once. When she finally found Karna, he stood on the opposite side of a war, armor gleaming, fighting against his own brothers.',
          illustration: '/illustrations/karuna-3.webp',
        },
        {
          text: 'She could not speak. To reveal the truth would destroy both sides. So she carried her sorrow in silence — not because she was weak, but because some loves are too vast for any single lifetime to hold without breaking.',
          illustration: '/illustrations/karuna-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Vagal Toning Breath',
      pattern: '4-4-8',
      inhaleCount: 4,
      holdCount: 4,
      exhaleCount: 8,
      cycles: 5,
      style: 'Long sighing exhales, calming the grief response',
      instructions: [
        'Breathe in gently... 2... 3... 4...',
        'Hold with softness... 2... 3... 4...',
        'Let it all flow out, slowly... 2... 3... 4... 5... 6... 7... 8...',
      ],
    },

    transitionWisdom: {
      lines: [
        'Sorrow is the heart\'s way',
        'of honoring what it loved.',
        'When the tears have been fully witnessed,',
        'what remains is a vast, quiet tenderness.',
        'That tenderness is peace.',
      ],
    },
  },

  // ═══════════════════════════════════════════
  // RASA 4: RAUDRA — Fury / Anger
  // ═══════════════════════════════════════════
  raudra: {
    id: 'raudra',
    nameEnglish: 'Fury',
    nameExpanded: 'Fury · Anger · Righteous Wrath',
    nameSanskrit: 'रौद्र',
    nameTransliterated: 'Raudra',
    deity: 'Rudra',
    sthayibhava: 'Krodha (Anger)',

    colors: {
      primary: '#8B0000',
      secondary: '#DC143C',
      gradient: ['#DC143C', '#B01030', '#8B0000'],
      glow: 'rgba(139, 0, 0, 0.5)',
      glowStrong: 'rgba(220, 20, 60, 0.7)',
      textOnBg: '#FFE0E0',
      bgGradient: 'linear-gradient(135deg, #8B0000 0%, #DC143C 100%)',
      shantaTransition: ['#8B0000', '#C04040', '#D09090', '#E8D0D0', '#F0F4F8'],
    },

    description:
      'Raudra is sacred fire — the fierce force that arises when injustice crosses a threshold. It is not blind rage. It is Draupadi\'s vow in the court of shame, Rudra\'s cosmic dance of dissolution.',

    emotionMapping: {
      faceApiEmotion: 'angry',
      confidenceThreshold: 0.6,
      intensityVariant: 'any',
      description: 'Compressed features, tension, intensity',
    },

    audio: {
      raaga: 'Raag Marwa',
      raagaAlternates: ['Raag Puriya', 'Raag Bhairav'],
      raagaDescription:
        'Marwa avoids the Pancham — the note of resolution — creating perpetual tension that mirrors anger\'s restlessness.',
      files: {
        alap: '/audio/raudra-marwa-alap.mp3',
        development: '/audio/raudra-marwa-jod.mp3',
        transition: '/audio/raudra-to-bhairavi.mp3',
        conclusion: '/audio/bhairavi-conclusion.mp3',
      },
    },

    story: {
      title: "Draupadi's Vow",
      source: 'Mahabharata — Sabha Parva',
      character: 'Draupadi',
      panels: [
        {
          text: 'The court of Hastinapura was full — kings, elders, warriors, scholars. And in the center of this grand assembly, a woman was being dragged by her hair. Draupadi, princess of Panchala, wife of five mighty Pandavas, pulled across marble floors like an object.',
          illustration: '/illustrations/raudra-1.webp',
        },
        {
          text: 'The Kauravas laughed. Duryodhana slapped his thigh in mockery. Dushasana pulled at her garment. And the elders — Bhishma, Drona, Vidura — those towers of dharma, sat with lowered eyes, paralyzed by protocol.',
          illustration: '/illustrations/raudra-2.webp',
        },
        {
          text: 'But Draupadi did not crumble. She stood, hair unbound, eyes blazing with a fire that the sun would envy, and spoke to that assembly of cowards with words that cracked the foundations of their silence: "If these elders cannot answer whether a wife can be wagered — then dharma itself is dead in this hall."',
          illustration: '/illustrations/raudra-3.webp',
        },
        {
          text: 'Her anger did not destroy. It illuminated. It became the spark that ignited the war of Kurukshetra — not a war of revenge, but of reckoning. Anger is fire. Fire that burns the house destroys. Fire that lights the lamp illuminates.',
          illustration: '/illustrations/raudra-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Fire Release Breath',
      pattern: 'kapalabhati-then-cool',
      inhaleCount: 2,
      holdCount: 0,
      exhaleCount: 2,
      cycles: 8,
      style: 'Forceful exhales then cooling Sheetali breaths',
      instructions: [
        'Sharp breath in through your nose...',
        'Forceful breath out — push...',
        'Again — in... out... in... out...',
        'Now slow... cool breath in through your mouth...',
        'Gentle exhale... let the fire become light...',
      ],
    },

    transitionWisdom: {
      lines: [
        'Anger is fire.',
        'Fire that burns the house destroys.',
        'Fire that lights the lamp illuminates.',
        'Let the fire complete its burning.',
        'What remains in the ash is peace.',
      ],
    },
  },

  // ═══════════════════════════════════════════
  // RASA 5: VEERA — Courage / Valor
  // ═══════════════════════════════════════════
  veera: {
    id: 'veera',
    nameEnglish: 'Courage',
    nameExpanded: 'Courage · Valor · Determination',
    nameSanskrit: 'वीर',
    nameTransliterated: 'Veera',
    deity: 'Indra',
    sthayibhava: 'Utsaha (Vigor)',

    colors: {
      primary: '#DAA520',
      secondary: '#B8860B',
      gradient: ['#F0C850', '#DAA520', '#B8860B'],
      glow: 'rgba(218, 165, 32, 0.4)',
      glowStrong: 'rgba(218, 165, 32, 0.7)',
      textOnBg: '#FFF8E0',
      bgGradient: 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)',
      shantaTransition: ['#DAA520', '#E0C060', '#EDE0A0', '#F0F0E0', '#F0F4F8'],
    },

    description:
      'Veera is not the absence of fear — it is purpose burning so bright that fear becomes irrelevant. It is Arjuna picking up his bow after despair, Abhimanyu entering the Chakravyuha knowing he may never exit.',

    emotionMapping: {
      faceApiEmotion: 'neutral',
      confidenceThreshold: 0.5,
      intensityVariant: 'determined',
      description: 'Focused, set jaw, forward energy, determination',
    },

    audio: {
      raaga: 'Raag Desh',
      raagaAlternates: ['Raag Kedar', 'Raag Hansadhwani'],
      raagaDescription:
        'Desh means "homeland" — it carries a march-like uplift. Hansadhwani ascends with unshakable confidence.',
      files: {
        alap: '/audio/veera-desh-alap.mp3',
        development: '/audio/veera-desh-jod.mp3',
        transition: '/audio/veera-to-bhairavi.mp3',
        conclusion: '/audio/bhairavi-conclusion.mp3',
      },
    },

    story: {
      title: "Arjuna's Bow",
      source: 'Bhagavad Gita — Mahabharata',
      character: 'Arjuna',
      panels: [
        {
          text: 'The greatest archer the world had ever known stood at the edge of a battlefield stretching to the horizon. On both sides: his family. Teachers who taught him to draw his first arrow. Cousins who shared his childhood laughter. An entire lineage, ready to die.',
          illustration: '/illustrations/veera-1.webp',
        },
        {
          text: 'Arjuna\'s hands trembled. The bow — Gandiva, gifted by the gods — slipped from his fingers. "I cannot do this," he whispered. "I would rather be killed unarmed than kill those I love." This was not cowardice. This was a soul breaking under the weight of impossible duty.',
          illustration: '/illustrations/veera-2.webp',
        },
        {
          text: 'Krishna, his charioteer, did not command him to fight. Instead, he spoke of something deeper: "You grieve for those who should not be grieved for. The wise grieve neither for the living nor the dead. You were never born. You will never die. You are not the doer. You are the witness."',
          illustration: '/illustrations/veera-3.webp',
        },
        {
          text: 'Arjuna picked up his bow. Not because the fear had gone — it hadn\'t. But because he understood: true courage is not fighting without fear. It is acting from dharma despite the fear. The warrior\'s greatest victory is over the need to fight at all.',
          illustration: '/illustrations/veera-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Warrior\'s Breath',
      pattern: '2-0-2',
      inhaleCount: 2,
      holdCount: 0,
      exhaleCount: 2,
      cycles: 10,
      style: 'Sharp, energizing, building rhythm like a drum',
      instructions: [
        'Sharp inhale through your nose...',
        'Powerful exhale through your mouth...',
        'Build the rhythm... in... OUT... in... OUT...',
        'Feel the energy rising in your chest...',
      ],
    },

    transitionWisdom: {
      lines: [
        'The warrior\'s greatest victory',
        'is not over the enemy.',
        'It is over the need to fight.',
        'When purpose is fulfilled, the sword is sheathed,',
        'and the warrior rests in peace.',
      ],
    },
  },

  // ═══════════════════════════════════════════
  // RASA 6: BHAYANAKA — Fear / Terror
  // ═══════════════════════════════════════════
  bhayanaka: {
    id: 'bhayanaka',
    nameEnglish: 'Fear',
    nameExpanded: 'Fear · Awe · The Unknown',
    nameSanskrit: 'भयानक',
    nameTransliterated: 'Bhayanaka',
    deity: 'Kala (Time)',
    sthayibhava: 'Bhaya (Fear)',

    colors: {
      primary: '#1A1A2E',
      secondary: '#16213E',
      gradient: ['#2A2A4E', '#1A1A2E', '#16213E'],
      glow: 'rgba(26, 26, 46, 0.6)',
      glowStrong: 'rgba(40, 40, 80, 0.7)',
      textOnBg: '#C0C0E0',
      bgGradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
      shantaTransition: ['#1A1A2E', '#3A3A5E', '#7070A0', '#B0B0D0', '#F0F4F8'],
    },

    description:
      'Bhayanaka is the trembling that arises when consciousness meets the infinite. Even Arjuna, the greatest warrior, trembled before Krishna\'s cosmic form. Fear is not weakness — it is the ego recognizing its own smallness.',

    emotionMapping: {
      faceApiEmotion: 'fearful',
      confidenceThreshold: 0.6,
      intensityVariant: 'any',
      description: 'Widened eyes, raised brows, frozen quality',
    },

    audio: {
      raaga: 'Raag Asavari',
      raagaAlternates: ['Raag Shree', 'Raag Bhairavi'],
      raagaDescription:
        'Asavari carries an anxious, unresolved quality — its komal notes create a sense of shadows and things left unknown.',
      files: {
        alap: '/audio/bhayanaka-asavari-alap.mp3',
        development: '/audio/bhayanaka-asavari-jod.mp3',
        transition: '/audio/bhayanaka-to-bhairavi.mp3',
        conclusion: '/audio/bhairavi-conclusion.mp3',
      },
    },

    story: {
      title: 'The Cosmic Mouth',
      source: 'Bhagavad Gita — Chapter 11',
      character: 'Arjuna',
      panels: [
        {
          text: '"Show me your true form," Arjuna asked Krishna. It was a simple request from a friend to a friend, a warrior to his charioteer. He expected radiance, perhaps. Beauty. He was not prepared for what came.',
          illustration: '/illustrations/bhayanaka-1.webp',
        },
        {
          text: 'The sky split open. Krishna\'s body expanded beyond all horizons. Arjuna saw a thousand suns rising simultaneously. He saw every being that had ever lived — and every being that would ever die — streaming into a cosmic mouth that devoured time itself.',
          illustration: '/illustrations/bhayanaka-2.webp',
        },
        {
          text: 'Warriors, kings, mountains, oceans — all flowing like rivers into that infinite maw. Arjuna fell to his knees. His divine sight burned. "I see your mouths with terrible teeth," he whispered, "blazing like the fires at the end of time. I am confused. I am afraid. Have mercy."',
          illustration: '/illustrations/bhayanaka-3.webp',
        },
        {
          text: 'Krishna returned to his gentle form and spoke: "What you saw is what always is. Time devours all things. But you — the awareness witnessing even this — you are beyond time." Fear is the doorway. What waits beyond it is understanding.',
          illustration: '/illustrations/bhayanaka-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Grounding Breath',
      pattern: '4-4-8-4',
      inhaleCount: 4,
      holdCount: 4,
      exhaleCount: 8,
      cycles: 4,
      style: 'Extended exhale, vagus nerve activation, signals safety',
      instructions: [
        'Breathe in, feeling your feet on the ground... 2... 3... 4...',
        'Hold — you are safe in this moment... 2... 3... 4...',
        'Long, slow release... 2... 3... 4... 5... 6... 7... 8...',
        'Hold empty, gently... 2... 3... 4...',
      ],
    },

    transitionWisdom: {
      lines: [
        'Fear is the mind\'s alarm',
        'when it meets the unknown.',
        'But the unknown is simply',
        'what you haven\'t yet understood.',
        'When understanding arrives, fear becomes reverence.',
        'And reverence is the doorway to peace.',
      ],
    },
  },

  // ═══════════════════════════════════════════
  // RASA 7: BIBHATSA — Disgust / Aversion
  // ═══════════════════════════════════════════
  bibhatsa: {
    id: 'bibhatsa',
    nameEnglish: 'Disgust',
    nameExpanded: 'Disgust · Aversion · Discernment',
    nameSanskrit: 'बीभत्स',
    nameTransliterated: 'Bibhatsa',
    deity: 'Varuna',
    sthayibhava: 'Jugupsa (Revulsion)',

    colors: {
      primary: '#1B1464',
      secondary: '#0D0D3B',
      gradient: ['#2B2484', '#1B1464', '#0D0D3B'],
      glow: 'rgba(27, 20, 100, 0.5)',
      glowStrong: 'rgba(43, 36, 132, 0.7)',
      textOnBg: '#D0D0FF',
      bgGradient: 'linear-gradient(135deg, #1B1464 0%, #0D0D3B 100%)',
      shantaTransition: ['#1B1464', '#4040A0', '#8080C0', '#C0C0E0', '#F0F4F8'],
    },

    description:
      'Bibhatsa is the discernment that arises when we encounter something fundamentally incompatible with our values. It is not mere dislike. It is the clarity that separates poison from medicine.',

    emotionMapping: {
      faceApiEmotion: 'disgusted',
      confidenceThreshold: 0.6,
      intensityVariant: 'any',
      description: 'Furrowed brow, narrowed eyes, turned away',
    },

    audio: {
      raaga: 'Raag Bhairavi',
      raagaAlternates: ['Raag Ahir Bhairav', 'Raag Bilaskhani Todi'],
      raagaDescription:
        'Bhairavi is the raaga of dawn and dusk — it carries the weight of discernment, the clarity that comes from seeing things as they truly are.',
      files: {
        alap: '/audio/bibhatsa-bhairavi-alap.mp3',
        development: '/audio/bibhatsa-bhairavi-jod.mp3',
        transition: '/audio/bibhatsa-to-shanta.mp3',
        conclusion: '/audio/shanta-conclusion.mp3',
      },
    },

    story: {
      title: "The Poisoned Feast",
      source: 'Mahabharata — Adi Parva',
      character: 'Bhima',
      panels: [
        {
          text: 'In the house of lac, where the Kauravas tried to burn the Pandavas alive, a feast was prepared. Poisoned food, laced with deadly herbs. The Kauravas watched with cruel anticipation as their cousins ate.',
          illustration: '/illustrations/bibhatsa-1.webp',
        },
        {
          text: 'Bhima, the mighty son of Kunti, ate with abandon. His enormous appetite was legendary. But as the poison coursed through his veins, he recognized its bitter taste. Not just bitterness — a fundamental wrongness, an incompatibility with life itself.',
          illustration: '/illustrations/bibhatsa-2.webp',
        },
        {
          text: 'With superhuman strength, Bhima carried his poisoned brothers and mother through the night, fleeing to the safety of the forest. The poison did not kill him — it clarified him. He learned discernment: to recognize what nourishes and what destroys.',
          illustration: '/illustrations/bibhatsa-3.webp',
        },
        {
          text: 'Disgust is not rejection. It is protection. It is the soul saying: "This does not belong in me." When we discern clearly, we can choose what to ingest — physically, emotionally, spiritually. Discernment is the foundation of wisdom.',
          illustration: '/illustrations/bibhatsa-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Clarity Breath',
      pattern: 'alternate-nostril',
      inhaleCount: 4,
      holdCount: 4,
      exhaleCount: 4,
      cycles: 6,
      style: 'Balancing, clearing the mental fog',
      instructions: [
        'Close right nostril, breathe in through left... 2... 3... 4...',
        'Hold... 2... 3... 4...',
        'Open right, close left, exhale through right... 2... 3... 4...',
        'Now reverse: inhale right, exhale left...',
      ],
    },

    transitionWisdom: {
      lines: [
        'Disgust is the soul\'s discernment.',
        'It separates what nourishes',
        'from what destroys.',
        'When clarity arises,',
        'choice becomes possible.',
        'And choice is freedom.',
      ],
    },
  },

  // ═══════════════════════════════════════════
  // RASA 8: ADBHUTA — Wonder / Awe
  // ═══════════════════════════════════════════
  adbhuta: {
    id: 'adbhuta',
    nameEnglish: 'Wonder',
    nameExpanded: 'Wonder · Awe · Amazement',
    nameSanskrit: 'अद्भुत',
    nameTransliterated: 'Adbhuta',
    deity: 'Brahma',
    sthayibhava: 'Vismaya (Astonishment)',

    colors: {
      primary: '#FFD700',
      secondary: '#FFA500',
      gradient: ['#FFD700', '#FFBF00', '#FFA500'],
      glow: 'rgba(255, 191, 0, 0.4)',
      glowStrong: 'rgba(255, 165, 0, 0.7)',
      textOnBg: '#3D2E00',
      bgGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      shantaTransition: ['#FFA500', '#FFC860', '#FFE8A0', '#FFF5E0', '#F0F4F8'],
    },

    description:
      'Adbhuta is the childlike wonder that arises when we encounter something truly extraordinary. It is the cosmic astonishment that opens the heart to the mystery of existence itself.',

    emotionMapping: {
      faceApiEmotion: 'surprised',
      confidenceThreshold: 0.7,
      intensityVariant: 'high',
      description: 'Wide eyes, open mouth, raised brows, intense surprise',
    },

    audio: {
      raaga: 'Raag Bhatiyar',
      raagaAlternates: ['Raag Jaunpuri', 'Raag Jog'],
      raagaDescription:
        'Bhatiyar carries the expansive quality of wonder — its notes create space for astonishment to unfold.',
      files: {
        alap: '/audio/adbhuta-bhatiyar-alap.mp3',
        development: '/audio/adbhuta-bhatiyar-jod.mp3',
        transition: '/audio/adbhuta-to-bhairavi.mp3',
        conclusion: '/audio/bhairavi-conclusion.mp3',
      },
    },

    story: {
      title: "The Divine Architect",
      source: 'Ramayana / Popular Mythology',
      character: 'Hanuman',
      panels: [
        {
          text: 'In the golden city of Lanka, Hanuman searched for Sita. He leapt across oceans, shrunk to the size of a mosquito, and explored the palace of Ravana. But nothing prepared him for what he found in the gardens.',
          illustration: '/illustrations/adbhuta-1.webp',
        },
        {
          text: 'Sita sat beneath an ashoka tree, her beauty so radiant it seemed to illuminate the entire grove. But around her was a ring of fire — magical flames that danced and hissed, protecting her from all who approached.',
          illustration: '/illustrations/adbhuta-2.webp',
        },
        {
          text: 'Hanuman gazed at this wonder. A woman of unimaginable grace, surrounded by flames that obeyed some divine command. He sat on a branch, his monkey mind overwhelmed. "Who created this?" he wondered. "What force could make fire bend to will?"',
          illustration: '/illustrations/adbhuta-3.webp',
        },
        {
          text: 'Wonder is the doorway to understanding. When we encounter something beyond our comprehension, we don\'t turn away. We lean in. We ask. We seek. Wonder is the spark that ignites the quest for knowledge, the recognition that the universe is far more mysterious than we could ever imagine.',
          illustration: '/illustrations/adbhuta-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Expansion Breath',
      pattern: 'full-expansion',
      inhaleCount: 4,
      holdCount: 0,
      exhaleCount: 6,
      cycles: 5,
      style: 'Opening the chest, creating space for wonder',
      instructions: [
        'Breathe in deeply, expanding your chest... 2... 3... 4...',
        'Hold for a moment... feel the space...',
        'Exhale slowly, letting go... 2... 3... 4... 5... 6...',
        'Feel yourself expanding into the mystery...',
      ],
    },

    transitionWisdom: {
      lines: [
        'Wonder is the soul\'s recognition',
        'that the universe is larger',
        'than we can comprehend.',
        'In that recognition,',
        'our small self dissolves.',
        'What remains is vast awareness.',
      ],
    },
  },

  // ═══════════════════════════════════════════
  // RASA 9: SHANTA — Peace / Serenity
  // ═══════════════════════════════════════════
  shanta: {
    id: 'shanta',
    nameEnglish: 'Peace',
    nameExpanded: 'Peace · Serenity · Tranquility',
    nameSanskrit: 'शान्त',
    nameTransliterated: 'Shanta',
    deity: 'Vishnu (in Yoga Nidra)',
    sthayibhava: 'Shama (Calm)',

    colors: {
      primary: '#F0F4F8',
      secondary: '#FFFFFF',
      gradient: ['#E2E8F0', '#F0F4F8', '#FFFFFF'],
      glow: 'rgba(240, 244, 248, 0.3)',
      glowStrong: 'rgba(255, 255, 255, 0.5)',
      textOnBg: '#2D3748',
      bgGradient: 'linear-gradient(135deg, #F0F4F8 0%, #FFFFFF 100%)',
      shantaTransition: ['#F0F4F8', '#F5F7FA', '#FAFBFC', '#FFFFFF'],
    },

    description:
      'Shanta is the ultimate Rasa — the peace that remains when all other emotions have been fully experienced and released. It is not the absence of feeling, but the presence of complete acceptance.',

    emotionMapping: {
      faceApiEmotion: 'neutral',
      confidenceThreshold: 0.4,
      intensityVariant: 'calm',
      description: 'Relaxed features, soft gaze, inner stillness',
    },

    audio: {
      raaga: 'Raag Malkauns',
      raagaAlternates: ['Raag Dhrupad', 'Raag Yaman (slow alap)'],
      raagaDescription:
        'Malkauns is the raaga of deep meditation — its notes create a space of infinite stillness.',
      files: {
        alap: '/audio/shanta-malkauns-alap.mp3',
        development: '/audio/shanta-malkauns-jod.mp3',
        transition: '/audio/shanta-sustain.mp3',
        conclusion: '/audio/shanta-conclusion.mp3',
      },
    },

    story: {
      title: "The Final Rest",
      source: 'Mahabharata — Svargarohana Parva',
      character: 'Yudhishthira',
      panels: [
        {
          text: 'After eighteen days of war, the battlefield of Kurukshetra was silent. Mountains of the dead lay everywhere. Yudhishthira, the righteous king, walked among them with heavy steps. His brothers, his teachers, his sons — all gone.',
          illustration: '/illustrations/shanta-1.webp',
        },
        {
          text: 'The gods appeared before him: "Come to heaven, righteous one. Your dharma has been fulfilled." But Yudhishthira shook his head. "I cannot leave my dog behind." The dog had followed him through all trials, and loyalty demanded he honor this final companion.',
          illustration: '/illustrations/shanta-2.webp',
        },
        {
          text: 'The gods revealed themselves: Indra, Yama, Varuna. "No dog enters heaven," they said. But when Yudhishthira refused to abandon his friend, the dog transformed into Dharma himself — the god of righteousness. "You have passed the final test," Dharma said.',
          illustration: '/illustrations/shanta-3.webp',
        },
        {
          text: 'Peace is not the end of the journey. It is the understanding that every step was necessary. Every joy, every sorrow, every battle — all led to this moment of complete acceptance. In peace, we see that the universe is exactly as it should be, and we are exactly who we should be.',
          illustration: '/illustrations/shanta-4.webp',
        },
      ],
    },

    breathing: {
      name: 'Complete Surrender Breath',
      pattern: 'natural-rhythm',
      inhaleCount: 0,
      holdCount: 0,
      exhaleCount: 0,
      cycles: 0,
      style: 'No counting, just being with the breath',
      instructions: [
        'Let go of control...',
        'Simply watch the breath...',
        'In... out...',
        'No need to count... no need to do...',
        'Just be...',
      ],
    },

    transitionWisdom: {
      lines: [
        'Peace is not the absence of emotion.',
        'It is the presence of complete acceptance.',
        'When every feeling has been honored,',
        'what remains is pure awareness.',
        'And awareness is freedom.',
      ],
    },
  },
};

// ─── UTILITY FUNCTIONS ───
export const getRasaById = (id) => rasaConfig[id];
export const getRasaByEmotion = (emotion, confidence = 0.5) => {
  // This will be expanded in Phase 5 with face-api.js integration
  const rasa = Object.values(rasaConfig).find(r =>
    r.emotionMapping.faceApiEmotion === emotion &&
    confidence >= r.emotionMapping.confidenceThreshold
  );
  return rasa || rasaConfig.shanta; // Default to shanta if no match
};
export const getAllRasaIds = () => Object.keys(rasaConfig);
export const getAllRasas = () => Object.values(rasaConfig);

export default rasaConfig;

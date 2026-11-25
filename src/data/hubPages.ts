import type { GameFaqItem, GameId } from '../types/neurofit';

export type HubSlug = 'brain-games' | 'mind-games' | 'memory-games' | 'focus-games';

export interface HubPageConfig {
  slug: HubSlug;
  navLabel: string;
  eyebrow: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  introHeading: string;
  introParagraphs: string[];
  strategyHeading: string;
  strategyPoints: string[];
  gameIds: GameId[];
  relatedArticles: string[];
  faqs: GameFaqItem[];
}

export const HUB_PAGES: Record<HubSlug, HubPageConfig> = {
  'brain-games': {
    slug: 'brain-games',
    navLabel: 'Brain Games',
    eyebrow: 'Adaptive Cognitive Library',
    h1: 'Free Brain Training Games Online',
    seoTitle: 'Free Brain Training Games Online — Play Brain Puzzles | MindGame Arena',
    seoDescription:
      'Play free brain training games and brain puzzles online at MindGame Arena. Practice visual memory, digit span, focus precision, pattern logic, and reaction speed.',
    lead: 'Structured browser-based brain games designed to challenge working memory, visual attention, logical deduction, and reaction consistency without registration.',
    introHeading: 'How Multi-Domain Brain Training Works',
    introParagraphs: [
      'A well-rounded brain game routine mixes different cognitive demands instead of repeating one puzzle style endlessly. When you alternate between visuospatial sequences, numerical digit spans, selective visual scanning, and rule-based pattern logic, each module stresses a distinct aspect of attention and recall.',
      'MindGame Arena runs directly in your browser with adaptive levels and zero account walls. Every completed session records your local score, accuracy, and personal best so you can observe how rest, pacing, and strategy affect your consistency across the week.',
    ],
    strategyHeading: 'Building a Balanced Brain Training Routine',
    strategyPoints: [
      'Pair one memory game with one focus or pattern puzzle in a 5-minute warm-up.',
      'Prioritize clean accuracy before pushing raw speed on timed grids.',
      'Use Guided Circuits to rotate seamlessly across multiple cognitive domains.',
      'Review rule explanations in Pattern Master to refine deductive habits.',
    ],
    gameIds: [
      'visual-memory',
      'number-memory',
      'focus-attention',
      'pattern-recognition',
      'reaction-speed',
      'word-memory',
      'spatial-memory',
    ],
    relatedArticles: [
      'what-are-brain-training-games',
      'best-free-mind-games-online',
      'how-to-build-a-daily-brain-training-routine',
    ],
    faqs: [
      {
        question: 'Are all brain training games on MindGame Arena free to play?',
        answer:
          'Yes. All seven interactive games, guided training circuits, and daily challenges are completely free with no subscription or sign-up required.',
      },
      {
        question: 'Which brain game should I start with as a beginner?',
        answer:
          'Visual Memory and Pattern Master are ideal starting points because they begin at approachable 3-step patterns and scale gradually as you succeed.',
      },
      {
        question: 'Do brain games require downloading an app?',
        answer:
          'No. Every game loads immediately inside modern desktop, tablet, and mobile web browsers.',
      },
    ],
  },
  'mind-games': {
    slug: 'mind-games',
    navLabel: 'Mind Games',
    eyebrow: 'Instant Browser Play',
    h1: 'Free Mind Games Online – Play Without Registration',
    seoTitle: 'Free Mind Games Online — Play Mind Puzzles Instantly | MindGame Arena',
    seoDescription:
      'Play mind games free online at MindGame Arena. Enjoy memory tests, logic sequences, focus grids, and reflex challenges right in your browser.',
    lead: 'Jump straight into responsive mind games covering pattern deduction, verbal recognition, spatial mapping, and millisecond speed tests.',
    introHeading: 'Why Instant-Play Mind Games Fit Everyday Schedules',
    introParagraphs: [
      'The best mind games respect your time: clear rules, zero cluttered menus, and crisp rounds that take one to three minutes from start to finish. Whether you want a brief morning warm-up or an afternoon mental reset between work blocks, MindGame Arena launches each board in full-screen focus mode.',
      'Instead of random luck or repetitive tapping, every game in MindGame Arena relies on deliberate mental effort—chunking numbers, spotting subtle letter distractors, verifying geometric rotations, or mapping spatial constellations.',
    ],
    strategyHeading: 'Tips to Get More From Online Mind Games',
    strategyPoints: [
      'Read the brief rules panel before launching so you know how accuracy is scored.',
      'Eliminate background tabs and notifications during timed rounds.',
      'Compare your daily results on My Stats to spot which time of day suits sharp focus.',
      'Switch to Pattern Master when you want unhurried analytical problem solving.',
    ],
    gameIds: [
      'pattern-recognition',
      'visual-memory',
      'word-memory',
      'number-memory',
      'spatial-memory',
      'focus-attention',
      'reaction-speed',
    ],
    relatedArticles: [
      'best-free-mind-games-online',
      'pattern-recognition-exercises',
      'benefits-and-limitations-of-brain-training',
    ],
    faqs: [
      {
        question: 'Can I play mind games on my phone or tablet?',
        answer:
          'Yes. Every game board, keypad, and sequence matrix automatically adapts to touchscreens as well as desktop mouse and keyboard controls.',
      },
      {
        question: 'Are my scores saved if I close the browser tab?',
        answer:
          'Yes. Personal bests, virtual XP, and recent session logs are stored locally in your browser via LocalStorage.',
      },
      {
        question: 'How does MindGame Arena choose Daily Missions?',
        answer:
          'Daily Missions use a date-seeded rotation pairing a Memory game, Focus Grid, and either Pattern Master or Reaction Speed each day.',
      },
    ],
  },
  'memory-games': {
    slug: 'memory-games',
    navLabel: 'Memory Games',
    eyebrow: 'Memory Arena Collection',
    h1: 'Free Memory Games Online for Adults & Students',
    seoTitle: 'Free Memory Games Online — Visual, Number, Word & Spatial | MindGame Arena',
    seoDescription:
      'Play free memory games online at MindGame Arena. Practice visual sequence recall, number digit span, word recognition, and spatial grid memory.',
    lead: 'Four distinct memory challenges targeting visuospatial sequences, numerical digit spans, verbal recognition, and simultaneous coordinate layouts.',
    introHeading: 'Four Complementary Ways to Practice Memory',
    introParagraphs: [
      'Memory is not a single uniform skill. Recalling an expanding string of digits engages silent phonological rehearsal, whereas reconstructing geometric markers on a 6×6 grid relies on spatial imagery and landmark anchoring. Word Memory adds another dimension by asking you to separate recently studied terms from plausible distractors.',
      'Practicing all four memory formats in MindGame Arena encourages flexible encoding habits—like rhythmic chunking for numbers, mental storytelling for words, and polygon silhouettes for spatial boards.',
    ],
    strategyHeading: 'Practical Memory Encoding Strategies',
    strategyPoints: [
      'Visual Memory: Connect illuminated squares into one continuous directional path.',
      'Number Memory: Split long strings into consistent two- or three-digit blocks.',
      'Word Memory: Picture each study word interacting inside a quick mental scene.',
      'Spatial Memory: Group markers into triangles or perimeter shapes anchored to grid corners.',
    ],
    gameIds: ['visual-memory', 'number-memory', 'word-memory', 'spatial-memory'],
    relatedArticles: [
      'how-to-practice-memory-with-games',
      'free-memory-games-for-adults',
      'visual-memory-exercises',
      'number-memory-training',
    ],
    faqs: [
      {
        question: 'Which memory game is best for practicing digit chunking?',
        answer:
          'Number Memory Game is built specifically for digit span chunking, letting you test 3-digit strings all the way past 10+ digits with keyboard or keypad entry.',
      },
      {
        question: 'What separates Visual Memory from Spatial Memory?',
        answer:
          'Visual Memory tests sequential order—you must tap cells in the exact order they flashed. Spatial Memory displays all markers together and scores exact grid coordinates regardless of click order.',
      },
      {
        question: 'Are these memory games suitable for adults and older learners?',
        answer:
          'Yes. Clean typography, adjustable light and dark modes, and unhurried difficulty progression make all four memory games accessible for adults and students alike.',
      },
    ],
  },
  'focus-games': {
    slug: 'focus-games',
    navLabel: 'Focus Games',
    eyebrow: 'Concentration & Vigilance',
    h1: 'Focus & Concentration Games Online',
    seoTitle: 'Focus & Concentration Games Online — Free Attention Tests | MindGame Arena',
    seoDescription:
      'Play free focus games and concentration challenges online at MindGame Arena. Sharpen selective attention on Focus Grid and measure response speed in milliseconds.',
    lead: 'Test selective visual filtering under time pressure, resist distractor traps, and measure millisecond alertness without clutter.',
    introHeading: 'Practicing Selective Attention and Vigilance',
    introParagraphs: [
      'Concentration breaks down when your eyes skim too quickly or react impulsively before verifying details. Focus Grid counters hurried skimming by hiding target characters inside dense matrices of look-alike distractors such as Q vs. O or E vs. F, penalizing careless clicks.',
      'Pairing Focus Grid with Reaction Time Test and Pattern Master gives you both sides of attentional control: disciplined visual discrimination under a clock and steady readiness across unpredictable wait intervals.',
    ],
    strategyHeading: 'How to Improve Focus Accuracy',
    strategyPoints: [
      'Sweep rows methodically from left to right instead of darting randomly.',
      'Identify the unique visual cue of each target letter before clicking.',
      'Keep your hand relaxed and gaze centered during Reaction Time Test waits.',
      'Use a 5-minute focus circuit right before study or deep-work sessions.',
    ],
    gameIds: ['focus-attention', 'reaction-speed', 'pattern-recognition'],
    relatedArticles: [
      'how-to-improve-concentration',
      'focus-games-for-students',
      'how-reaction-time-tests-work',
    ],
    faqs: [
      {
        question: 'Why does Focus Grid deduct points for wrong clicks?',
        answer:
          'Error penalties reward genuine visual verification instead of rapid random clicking, helping you monitor real precision.',
      },
      {
        question: 'How does Reaction Time Test relate to focus?',
        answer:
          'Sustained readiness during unpredictable 1.5- to 4.3-second wait windows exposes momentary attention lapses and false-start anticipation.',
      },
      {
        question: 'Can students use Focus Games before studying?',
        answer:
          'Yes. A brief two-minute Focus Grid or 5-minute Guided Circuit works well as a calm warm-up ritual before opening textbooks.',
      },
    ],
  },
};

export const HUB_LIST: HubPageConfig[] = [
  HUB_PAGES['mind-games'],
  HUB_PAGES['brain-games'],
  HUB_PAGES['memory-games'],
  HUB_PAGES['focus-games'],
];

import type { GameId, GameMeta } from '../types/neurofit';

export const GAMES: GameMeta[] = [
  {
    id: 'visual-memory',
    slug: 'visual-memory',
    seoSlug: 'visual-memory-game',
    title: 'Visual Memory Game',
    arenaTitle: 'VISUAL MEMORY',
    domain: 'Memory',
    difficulty: 'Adaptive',
    shortDescription:
      'Observe an expanding grid sequence of illuminated cells and reproduce it in exact order.',
    purpose: 'Practice short-term visuospatial sequence recall.',
    seoTitle: 'Visual Memory Game Online — Free Grid Sequence Test | MindGame Arena',
    seoDescription:
      'Play the free Visual Memory game online at MindGame Arena. Memorize illuminated grid sequences, practice visuospatial recall, and beat your highest level.',
    introParagraphs: [
      'Visual Memory Game challenges your ability to encode spatial locations alongside the exact order in which each square appeared. Each round displays a clean matrix and highlights a brief sequence of cells before clearing the board for recall.',
      'Inspired by classic Corsi block-tapping tasks used in cognitive science, this browser mind game helps you practice structured scanning and geometric path chunking across expanding 3×3 through 6×6 grids without registration.',
    ],
    estimatedMinutes: 2,
    metricLabel: 'Highest Level',
    metricUnit: 'lvl',
    higherIsBetter: true,
    instructions: [
      'A square grid illuminates a sequence of cells one by one.',
      'Wait until the playback phase finishes before selecting any tiles.',
      'Click or tap the cells in the exact order they were illuminated.',
      'You have three lives per run; clearing a sequence advances you to the next level.',
    ],
    rules: [
      'Each cell can appear at most once within a single round sequence.',
      'Selecting an out-of-order cell deducts one life and replays the current level with a fresh pattern.',
      'Grid dimensions start at 3×3 and expand through 4×4, 5×5, and 6×6 matrices.',
      'Your session ends when all three lives are exhausted, recording your highest level and click accuracy.',
    ],
    tips: [
      'Connect illuminated cells mentally as a continuous geometric path rather than isolated coordinates.',
      'Divide 5×5 and 6×6 boards into four visual quadrants to anchor corners and edges.',
      'Keep your cursor or thumb still during sequence playback so movement does not break visual tracking.',
    ],
    difficultyExplanation:
      'Difficulty scales along two axes: sequence length grows by one cell each level (starting at 3), while grid density expands from 9 cells (3×3) at Level 1–2 up to 36 cells (6×6) from Level 9 onward.',
    faqs: [
      {
        question: 'Does order matter in the Visual Memory game?',
        answer:
          'Yes. You must tap the illuminated tiles in the exact chronological sequence in which they appeared.',
      },
      {
        question: 'How is my Visual Memory score calculated?',
        answer:
          'Points increase with each completed level based on the current level number and sequence length. Your highest level reached and click accuracy are saved locally in your browser.',
      },
      {
        question: 'Can I play Visual Memory on mobile devices?',
        answer:
          'Yes. The grid scales proportionally to mobile portrait and tablet viewports with touch-friendly square tiles.',
      },
    ],
    relatedArticles: [
      'visual-memory-exercises',
      'what-is-working-memory',
      'how-to-practice-memory-with-games',
    ],
  },
  {
    id: 'number-memory',
    slug: 'number-memory',
    seoSlug: 'number-memory-game',
    title: 'Number Memory Game',
    arenaTitle: 'NUMBER MEMORY',
    domain: 'Memory',
    difficulty: 'Adaptive',
    shortDescription:
      'Hold increasingly long numerical strings in working memory before entering them from recall.',
    purpose: 'Practice digit span retention and numerical recall.',
    seoTitle: 'Number Memory Game — Free Online Digit Span Test | MindGame Arena',
    seoDescription:
      'Play the free Number Memory game online at MindGame Arena. Memorize multi-digit strings, practice rhythmic chunking, and test your digit span.',
    introParagraphs: [
      'Number Memory Game measures how many sequential digits you can hold accurately in short-term working memory after brief visual exposure. Every round begins at three digits and adds one more digit whenever you enter an exact match.',
      'Digit span puzzles are one of the clearest ways to practice numerical chunking—grouping long numbers into memorable two- or three-digit blocks rather than rehearsing single digits.',
    ],
    estimatedMinutes: 2,
    metricLabel: 'Digit Span',
    metricUnit: 'digits',
    higherIsBetter: true,
    instructions: [
      'A multi-digit number appears briefly above a countdown progress bar.',
      'Once the digits disappear, enter the exact number using your keyboard or the on-screen keypad.',
      'Submit your answer to verify whether every digit matches in order.',
      'Three incorrect submissions end the run and save your longest verified digit span.',
    ],
    rules: [
      'Numbers never start with zero, and every digit in the target string must match in exact order.',
      'Display time adjusts automatically based on string length so longer spans give proportional study time.',
      'Entering an incorrect digit deducts one life and presents a new number at the same digit length.',
    ],
    tips: [
      'Group digits into pairs or triplets (for example, 48-291-73) to reduce rehearsal load.',
      'Subvocalize rhythmic clusters quietly in your head while the countdown bar is active.',
      'Avoid rushing on the keypad; verify the first and last pairs before submitting.',
    ],
    difficultyExplanation:
      'Starting at 3 digits, every verified match adds +1 digit to the sequence. While display duration increases modestly per digit, strings of 7 or more digits exceed typical unchunked short-term span.',
    faqs: [
      {
        question: 'What is a typical digit span in Number Memory?',
        answer:
          'Many adults recall 6 to 8 digits reliably without practice. Using rhythmic chunking strategies often extends recall to 9 or more digits.',
      },
      {
        question: 'Can I use a keyboard instead of clicking the keypad?',
        answer:
          'Yes. The input field accepts direct numeric typing and Enter-key submission on desktop, while the large tactile keypad supports phones and tablets.',
      },
      {
        question: 'Are my Number Memory scores saved?',
        answer:
          'Yes. Your longest digit span, total score, and accuracy are stored locally in your browser without requiring an account.',
      },
    ],
    relatedArticles: [
      'number-memory-training',
      'what-is-working-memory',
      'free-memory-games-for-adults',
    ],
  },
  {
    id: 'focus-attention',
    slug: 'focus-attention',
    seoSlug: 'focus-grid',
    title: 'Focus Grid Challenge',
    arenaTitle: 'FOCUS GRID',
    domain: 'Focus',
    difficulty: 'Timed Precision',
    shortDescription:
      'Scan high-density character matrices under time pressure to isolate specific targets.',
    purpose: 'Practice selective visual attention and distractor filtering.',
    seoTitle: 'Focus Grid Game — Free Selective Attention Challenge | MindGame Arena',
    seoDescription:
      'Play Focus Grid free at MindGame Arena. Train selective visual attention and concentration by spotting target letters among near-identical distractors.',
    introParagraphs: [
      'Focus Grid trains selective visual attention—the ability to spot a specific character inside a field of near-identical distractors while resisting impulsive clicks.',
      'Pairs such as Q vs. O, E vs. F, and b vs. d force your eyes to verify subtle feature differences rather than skimming carelessly under a 45-second timer.',
    ],
    estimatedMinutes: 1,
    metricLabel: 'Focus Accuracy',
    metricUnit: '%',
    higherIsBetter: true,
    instructions: [
      'Check the designated target symbol displayed prominently above the matrix.',
      'Tap or click every matching cell in the grid while ignoring distractor characters.',
      'Clearing all targets on a board immediately loads a fresh matrix within your timer.',
      'Accuracy and speed together determine your final score.',
    ],
    rules: [
      'Practice runs last 45 seconds; guided circuit rounds run for 35 seconds.',
      'Each verified hit awards +35 points, and clearing an entire board grants a +100 point bonus.',
      'Selecting a distractor symbol deducts 25 points and lowers your overall focus accuracy percentage.',
    ],
    tips: [
      'Scan systematically row by row from left to right rather than jumping randomly across the grid.',
      'Focus on the distinguishing feature of the target (for example, the tail on Q or crossbar on E).',
      'Slowing down slightly to eliminate false clicks usually yields a higher net score and accuracy.',
    ],
    difficultyExplanation:
      'Boards 1 and 2 use a 5×5 matrix (25 symbols). From Board 3 onward, density increases to a 6×6 matrix (36 symbols) with more target instances per board.',
    faqs: [
      {
        question: 'Why does Focus Grid use similar-looking letters?',
        answer:
          'Visually similar distractors prevent passive peripheral guessing and require deliberate feature-level visual verification.',
      },
      {
        question: 'What counts toward Focus Accuracy?',
        answer:
          'Focus Accuracy is the percentage of your total clicks that landed on valid target symbols rather than distractors.',
      },
      {
        question: 'Does the timer pause if I open the Pause menu?',
        answer:
          'Yes. Pausing halts the countdown clock and conceals the board until you resume.',
      },
    ],
    relatedArticles: [
      'how-to-improve-concentration',
      'focus-games-for-students',
      'attention-training-exercises',
    ],
  },
  {
    id: 'pattern-recognition',
    slug: 'pattern-recognition',
    seoSlug: 'pattern-recognition-games',
    title: 'Pattern Recognition Games',
    arenaTitle: 'PATTERN MASTER',
    domain: 'Reasoning',
    difficulty: 'Progressive Tiers',
    shortDescription:
      'Deduce the underlying rule across numerical progressions and visual geometry sequences.',
    purpose: 'Practice logical rule induction and relational reasoning.',
    seoTitle: 'Pattern Recognition Games Online — Free Logic Puzzles | MindGame Arena',
    seoDescription:
      'Play free Pattern Recognition games online at MindGame Arena. Solve progressive number sequences and visual geometry puzzles with rule explanations.',
    introParagraphs: [
      'Pattern Master presents curated numerical progressions and geometric visual sequences across three escalating difficulty tiers. Rather than relying on speed alone, each puzzle invites careful inspection of differences, ratios, rotations, and alternating rules.',
      'Immediate rule explanations after every selection help you sharpen how you spot second-order differences, alternating operations, and multi-attribute visual transformations.',
    ],
    estimatedMinutes: 3,
    metricLabel: 'Best Score',
    metricUnit: 'pts',
    higherIsBetter: true,
    instructions: [
      'Inspect the displayed sequence of numbers or geometric figures.',
      'Identify the rule governing how each step transforms into the next.',
      'Choose one of the four candidate answers to complete the missing position.',
      'Review the rule explanation and advance through all nine puzzles in the set.',
    ],
    rules: [
      'Each standard set draws 9 puzzles balanced across Foundation, Intermediate, and Advanced tiers.',
      'Correct answers award 90 points (Foundation), 120 points (Intermediate), or 160 points (Advanced).',
      'There is no penalty clock forcing rushed guesses, allowing deliberate analytical verification.',
    ],
    tips: [
      'For number sequences, compute the first differences between consecutive terms immediately.',
      'If first differences vary, check whether the differences themselves grow steadily or alternate signs.',
      'For visual sequences, track one attribute at a time: shape, fill state, rotation angle, and element count.',
    ],
    difficultyExplanation:
      'Foundation puzzles test single-step arithmetic or single-attribute rotation. Intermediate items introduce squares, primes, and alternating rules. Advanced items combine multi-step operations or simultaneous changes across three visual attributes.',
    faqs: [
      {
        question: 'Are the puzzles randomly generated or curated?',
        answer:
          'Pattern Master uses an original curated bank of validated numerical and geometric puzzles so every question has a single unambiguous rule and clear explanation.',
      },
      {
        question: 'Can I see why an answer is right or wrong?',
        answer:
          'Yes. Immediately after choosing an option, the review panel highlights the correct answer and explains the exact mathematical or visual rule.',
      },
      {
        question: 'How does Pattern Recognition relate to Daily Missions?',
        answer:
          'Pattern Master rotates into the Speed & Logic Daily Mission slot alongside Reaction Speed.',
      },
    ],
    relatedArticles: [
      'pattern-recognition-exercises',
      'what-are-brain-training-games',
      'best-free-mind-games-online',
    ],
  },
  {
    id: 'reaction-speed',
    slug: 'reaction-speed',
    seoSlug: 'reaction-time-test',
    title: 'Reaction Time Test',
    arenaTitle: 'REACTION SPEED',
    domain: 'Speed',
    difficulty: 'Latency Trial',
    shortDescription:
      'Measure visual-motor response latency in milliseconds across five randomized trials.',
    purpose: 'Measure visual signal detection and response consistency.',
    seoTitle: 'Reaction Time Test — Free Millisecond Speed Check | MindGame Arena',
    seoDescription:
      'Take a free Reaction Time Test online at MindGame Arena. Measure visual-motor response speed in milliseconds across five randomized trials.',
    introParagraphs: [
      'Reaction Time Test measures simple visual-motor response latency—the interval in milliseconds between a sudden visual color transition and your physical click or tap.',
      'Using your browser’s high-resolution performance timer across five randomized delay windows, the test prevents anticipation rhythm and reports both your fastest single trial and five-trial average.',
    ],
    estimatedMinutes: 1,
    metricLabel: 'Best Average',
    metricUnit: 'ms',
    higherIsBetter: false,
    instructions: [
      'Keep your focus on the response panel while it remains in the waiting state.',
      'Click or tap immediately once the surface illuminates in bright orange.',
      'Avoid anticipating the signal; clicking early registers a premature attempt and restarts the trial.',
      'Complete five valid trials to record your mean reaction time in milliseconds.',
    ],
    rules: [
      'Each session requires 5 valid reaction measurements.',
      'Randomized wait intervals vary between 1.5 and 4.3 seconds so timing cannot be predicted.',
      'Premature clicks do not count toward your millisecond average, though they reduce trial accuracy.',
    ],
    tips: [
      'Rest your finger lightly on the mouse button or screen edge without tensing your wrist.',
      'Look at the center of the response panel rather than tracking the top HUD.',
      'Note that hardware display refresh rates and wireless input devices add slight baseline latency.',
    ],
    difficultyExplanation:
      'All five trials use unpredictable delay windows. True consistency means keeping all five measurements tightly clustered without triggering false-start retries.',
    faqs: [
      {
        question: 'What is a normal visual reaction time in a browser test?',
        answer:
          'Typical human visual reaction times on desktop or mobile browsers range from roughly 200 ms to 320 ms, depending on alertness, screen refresh rate, and input hardware.',
      },
      {
        question: 'Why does the test use five trials instead of one?',
        answer:
          'Averaging five randomized trials smooths out lucky guesses and single-trial attention lapses to give a much steadier baseline.',
      },
      {
        question: 'Does my phone screen or Bluetooth mouse affect the result?',
        answer:
          'Yes. Wired mice and high-refresh monitors typically register slightly lower device input latency than touchscreens or Bluetooth peripherals.',
      },
    ],
    relatedArticles: [
      'how-reaction-time-tests-work',
      'how-to-improve-concentration',
      'how-to-build-a-daily-brain-training-routine',
    ],
  },
  {
    id: 'word-memory',
    slug: 'word-memory',
    seoSlug: 'word-memory-games',
    title: 'Word Memory Games',
    arenaTitle: 'WORD MEMORY',
    domain: 'Memory',
    difficulty: 'Adaptive',
    shortDescription:
      'Study a curated set of words, then separate previously seen terms from novel distractors.',
    purpose: 'Practice verbal recognition and lexical encoding.',
    seoTitle: 'Word Memory Games Online — Free Verbal Recall Test | MindGame Arena',
    seoDescription:
      'Play free Word Memory games online at MindGame Arena. Practice verbal recognition, study expanding word lists, and filter distractors across four rounds.',
    introParagraphs: [
      'Word Memory exercises verbal recognition under time limits. During each study phase, you inspect a set of concrete words before they vanish and reappear mixed alongside unfamiliar distractor terms.',
      'Because recognition traps often occur when a word merely feels vaguely familiar, linking study words into a brief visual scene dramatically lowers false-positive errors.',
    ],
    estimatedMinutes: 2,
    metricLabel: 'Word Recall',
    metricUnit: '%',
    higherIsBetter: true,
    instructions: [
      'Memorize the displayed study words before the countdown reaches zero (or click Ready early).',
      'In the recall matrix, select every word that appeared on your study screen.',
      'Leave unfamiliar distractor words unselected, then verify your choices.',
      'Complete all four escalating rounds to log your verbal recall accuracy.',
    ],
    rules: [
      'Round 1 presents 6 target words mixed with 6 distractors; each subsequent round adds 2 targets and 2 distractors.',
      'Each correctly identified study word adds +45 points, while false positives subtract 30 points.',
      'After verifying a round, missed words, false picks, and correct hits are color-coded for review.',
    ],
    tips: [
      'Link consecutive study words into a quick mental story or physical sequence instead of repeating them mechanically.',
      'During recall, trust deliberate exclusion: if a word does not connect to your mental scene, skip it.',
      'Use the "Ready for Recall" button if you finish encoding early to test brisk retrieval.',
    ],
    difficultyExplanation:
      'Word list length expands from 6 words in Round 1 to 12 words in Round 4 (24 total words in the recognition grid), testing verbal capacity as interference grows.',
    faqs: [
      {
        question: 'How is Word Memory different from Number Memory?',
        answer:
          'Number Memory tests exact ordered serial recall of digits, whereas Word Memory tests semantic encoding and recognition among lexical distractors.',
      },
      {
        question: 'Why did my score drop when I guessed extra words?',
        answer:
          'False positives carry a point and accuracy penalty to discourage selecting every plausible word in the matrix.',
      },
      {
        question: 'Are words repeated across rounds in the same game?',
        answer:
          'Each round draws a freshly shuffled sample from a 140-word vocabulary bank.',
      },
    ],
    relatedArticles: [
      'how-to-practice-memory-with-games',
      'free-memory-games-for-adults',
      'what-is-working-memory',
    ],
  },
  {
    id: 'spatial-memory',
    slug: 'spatial-memory',
    seoSlug: 'spatial-memory-games',
    title: 'Spatial Memory Games',
    arenaTitle: 'SPATIAL MEMORY',
    domain: 'Memory',
    difficulty: 'Adaptive',
    shortDescription:
      'Encode geometric marker coordinates across an expanding spatial grid and reconstruct their positions.',
    purpose: 'Practice spatial working memory and coordinate mapping.',
    seoTitle: 'Spatial Memory Games Online — Free Grid Position Test | MindGame Arena',
    seoDescription:
      'Play free Spatial Memory games online at MindGame Arena. Memorize geometric marker positions on expanding grids and reconstruct exact coordinate layouts.',
    introParagraphs: [
      'Spatial Memory focuses on simultaneous coordinate mapping rather than sequential order. Multiple geometric nodes appear across a grid at once; once hidden, you reconstruct their exact positions.',
      'Visualizing the constellation formed by the markers as a triangle, L-shape, or perimeter frame turns isolated square positions into a single memorable spatial pattern.',
    ],
    estimatedMinutes: 2,
    metricLabel: 'Highest Level',
    metricUnit: 'lvl',
    higherIsBetter: true,
    instructions: [
      'Observe the positions of all geometric markers displayed across the coordinate grid.',
      'Once the markers disappear, click the exact cells where they were located.',
      'Tap a selected cell again if you want to unmark it before confirming.',
      'Click Confirm Coordinates once you have placed the required number of markers.',
    ],
    rules: [
      'All coordinates in a round must match exactly to advance to the next level.',
      'Grid size starts at 4×4 and expands to 5×5 at Level 3 and 6×6 from Level 6 onward.',
      'Three missed rounds end the session and record your highest cleared level.',
    ],
    tips: [
      'Mentally connect the markers into a polygon or constellation silhouette.',
      'Anchor clusters relative to grid corners, centerlines, or empty rows.',
      'Double-check symmetric mirror positions before clicking Confirm Coordinates.',
    ],
    difficultyExplanation:
      'Marker count begins at 3 on a 4×4 board and scales by +1 per level up to 10 markers on a 6×6 grid, increasing spatial crowding.',
    faqs: [
      {
        question: 'Does click order matter in Spatial Memory?',
        answer:
          'No. Unlike Visual Memory, Spatial Memory evaluates whether the final set of selected coordinates matches all target positions regardless of selection order.',
      },
      {
        question: 'Can I change a selected square before submitting?',
        answer:
          'Yes. Clicking a marked square unselects it so you can adjust your layout prior to pressing Confirm Coordinates.',
      },
      {
        question: 'What happens when I miss a coordinate?',
        answer:
          'Feedback highlights exact hits, missed markers, and false picks before deducting one life and presenting a fresh pattern at that level.',
      },
    ],
    relatedArticles: [
      'visual-memory-exercises',
      'what-is-working-memory',
      'what-are-brain-training-games',
    ],
  },
];

export const GAMES_BY_ID: Record<GameId, GameMeta> = GAMES.reduce(
  (acc, game) => {
    acc[game.id] = game;
    return acc;
  },
  {} as Record<GameId, GameMeta>
);

const LEGACY_SEO_SLUG_MAP: Record<string, GameId> = {
  'visual-memory': 'visual-memory',
  'number-memory': 'number-memory',
  'focus-grid': 'focus-attention',
  'focus-attention': 'focus-attention',
  'pattern-recognition': 'pattern-recognition',
  'reaction-speed': 'reaction-speed',
  'word-memory': 'word-memory',
  'spatial-memory': 'spatial-memory',
};

export function findGameByAnySlug(slug?: string): GameMeta | undefined {
  if (!slug) return undefined;
  const direct = GAMES.find((g) => g.seoSlug === slug || g.slug === slug || g.id === slug);
  if (direct) return direct;
  const legacyId = LEGACY_SEO_SLUG_MAP[slug];
  return legacyId ? GAMES_BY_ID[legacyId] : undefined;
}

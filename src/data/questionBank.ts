export interface VisualSequenceGlyph {
  shape: 'circle' | 'square' | 'triangle' | 'diamond';
  fill: 'solid' | 'outline' | 'half';
  rotation: 0 | 90 | 180 | 270;
  count: 1 | 2 | 3 | 4;
}

export interface PatternQuestion {
  id: string;
  tier: 'Foundation' | 'Intermediate' | 'Advanced';
  kind: 'numerical' | 'visual';
  prompt: string;
  sequenceText?: string[];
  visualSequence?: VisualSequenceGlyph[];
  options: {
    id: string;
    label?: string;
    glyph?: VisualSequenceGlyph;
  }[];
  correctOptionId: string;
  explanation: string;
}

export const PATTERN_QUESTIONS: PatternQuestion[] = [
  {
    id: 'num-f-1',
    tier: 'Foundation',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['4', '9', '14', '19', '?'],
    options: [
      { id: 'a', label: '23' },
      { id: 'b', label: '24' },
      { id: 'c', label: '25' },
      { id: 'd', label: '26' },
    ],
    correctOptionId: 'b',
    explanation: 'Each consecutive term increases by a constant step of +5 (19 + 5 = 24).',
  },
  {
    id: 'num-f-2',
    tier: 'Foundation',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['3', '6', '12', '24', '?'],
    options: [
      { id: 'a', label: '36' },
      { id: 'b', label: '42' },
      { id: 'c', label: '48' },
      { id: 'd', label: '54' },
    ],
    correctOptionId: 'c',
    explanation: 'Each term doubles the previous value (24 × 2 = 48).',
  },
  {
    id: 'num-f-3',
    tier: 'Foundation',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['81', '72', '63', '54', '?'],
    options: [
      { id: 'a', label: '45' },
      { id: 'b', label: '46' },
      { id: 'c', label: '44' },
      { id: 'd', label: '42' },
    ],
    correctOptionId: 'a',
    explanation: 'The sequence subtracts 9 at every step (54 − 9 = 45).',
  },
  {
    id: 'num-f-4',
    tier: 'Foundation',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['2', '5', '9', '14', '20', '?'],
    options: [
      { id: 'a', label: '25' },
      { id: 'b', label: '26' },
      { id: 'c', label: '27' },
      { id: 'd', label: '28' },
    ],
    correctOptionId: 'c',
    explanation: 'The increment grows by +1 each step (+3, +4, +5, +6, +7 → 20 + 7 = 27).',
  },
  {
    id: 'vis-f-1',
    tier: 'Foundation',
    kind: 'visual',
    prompt: 'Select the figure that completes the rotation and count rule.',
    visualSequence: [
      { shape: 'triangle', fill: 'solid', rotation: 0, count: 1 },
      { shape: 'triangle', fill: 'solid', rotation: 90, count: 1 },
      { shape: 'triangle', fill: 'solid', rotation: 180, count: 1 },
    ],
    options: [
      { id: 'a', glyph: { shape: 'triangle', fill: 'solid', rotation: 270, count: 1 } },
      { id: 'b', glyph: { shape: 'triangle', fill: 'outline', rotation: 270, count: 1 } },
      { id: 'c', glyph: { shape: 'triangle', fill: 'solid', rotation: 0, count: 1 } },
      { id: 'd', glyph: { shape: 'square', fill: 'solid', rotation: 270, count: 1 } },
    ],
    correctOptionId: 'a',
    explanation: 'The solid triangle rotates clockwise by 90 degrees at each step.',
  },
  {
    id: 'vis-f-2',
    tier: 'Foundation',
    kind: 'visual',
    prompt: 'Select the figure that completes the progression.',
    visualSequence: [
      { shape: 'circle', fill: 'outline', rotation: 0, count: 1 },
      { shape: 'circle', fill: 'outline', rotation: 0, count: 2 },
      { shape: 'circle', fill: 'outline', rotation: 0, count: 3 },
    ],
    options: [
      { id: 'a', glyph: { shape: 'circle', fill: 'solid', rotation: 0, count: 4 } },
      { id: 'b', glyph: { shape: 'circle', fill: 'outline', rotation: 0, count: 4 } },
      { id: 'c', glyph: { shape: 'square', fill: 'outline', rotation: 0, count: 4 } },
      { id: 'd', glyph: { shape: 'circle', fill: 'outline', rotation: 0, count: 2 } },
    ],
    correctOptionId: 'b',
    explanation: 'Shape and outline remain constant while element count increases by 1.',
  },
  {
    id: 'num-i-1',
    tier: 'Intermediate',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['1', '4', '9', '16', '25', '?'],
    options: [
      { id: 'a', label: '34' },
      { id: 'b', label: '35' },
      { id: 'c', label: '36' },
      { id: 'd', label: '49' },
    ],
    correctOptionId: 'c',
    explanation: 'These are consecutive perfect squares: 1², 2², 3², 4², 5², 6² = 36.',
  },
  {
    id: 'num-i-2',
    tier: 'Intermediate',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['5', '11', '23', '47', '?'],
    options: [
      { id: 'a', label: '94' },
      { id: 'b', label: '95' },
      { id: 'c', label: '96' },
      { id: 'd', label: '99' },
    ],
    correctOptionId: 'b',
    explanation: 'Each term follows the rule (previous × 2) + 1: 47 × 2 + 1 = 95.',
  },
  {
    id: 'num-i-3',
    tier: 'Intermediate',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['18', '21', '19', '22', '20', '?'],
    options: [
      { id: 'a', label: '18' },
      { id: 'b', label: '21' },
      { id: 'c', label: '23' },
      { id: 'd', label: '24' },
    ],
    correctOptionId: 'c',
    explanation: 'Operations alternate between +3 and −2 (20 + 3 = 23).',
  },
  {
    id: 'num-i-4',
    tier: 'Intermediate',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['2', '3', '5', '8', '13', '?'],
    options: [
      { id: 'a', label: '18' },
      { id: 'b', label: '20' },
      { id: 'c', label: '21' },
      { id: 'd', label: '22' },
    ],
    correctOptionId: 'c',
    explanation: 'Each number equals the sum of the two preceding terms (8 + 13 = 21).',
  },
  {
    id: 'vis-i-1',
    tier: 'Intermediate',
    kind: 'visual',
    prompt: 'Select the figure that completes the alternating sequence.',
    visualSequence: [
      { shape: 'square', fill: 'solid', rotation: 0, count: 1 },
      { shape: 'diamond', fill: 'outline', rotation: 0, count: 2 },
      { shape: 'square', fill: 'solid', rotation: 0, count: 3 },
    ],
    options: [
      { id: 'a', glyph: { shape: 'diamond', fill: 'outline', rotation: 0, count: 4 } },
      { id: 'b', glyph: { shape: 'diamond', fill: 'solid', rotation: 0, count: 4 } },
      { id: 'c', glyph: { shape: 'square', fill: 'outline', rotation: 0, count: 4 } },
      { id: 'd', glyph: { shape: 'diamond', fill: 'outline', rotation: 0, count: 2 } },
    ],
    correctOptionId: 'a',
    explanation: 'Count increases by +1 each step while shape and fill alternate (solid square / outline diamond).',
  },
  {
    id: 'vis-i-2',
    tier: 'Intermediate',
    kind: 'visual',
    prompt: 'Select the figure that completes the multi-attribute progression.',
    visualSequence: [
      { shape: 'triangle', fill: 'outline', rotation: 0, count: 1 },
      { shape: 'triangle', fill: 'half', rotation: 90, count: 2 },
      { shape: 'triangle', fill: 'solid', rotation: 180, count: 3 },
    ],
    options: [
      { id: 'a', glyph: { shape: 'triangle', fill: 'outline', rotation: 270, count: 4 } },
      { id: 'b', glyph: { shape: 'triangle', fill: 'solid', rotation: 270, count: 4 } },
      { id: 'c', glyph: { shape: 'triangle', fill: 'half', rotation: 270, count: 4 } },
      { id: 'd', glyph: { shape: 'triangle', fill: 'outline', rotation: 180, count: 4 } },
    ],
    correctOptionId: 'a',
    explanation: 'Rotation adds 90°, count increases by +1, and fill cycles outline → half → solid → outline.',
  },
  {
    id: 'num-a-1',
    tier: 'Advanced',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['3', '7', '15', '31', '63', '?'],
    options: [
      { id: 'a', label: '125' },
      { id: 'b', label: '126' },
      { id: 'c', label: '127' },
      { id: 'd', label: '129' },
    ],
    correctOptionId: 'c',
    explanation: 'Each step doubles and adds 1 (or 2ⁿ − 1 starting at n=2): 63 × 2 + 1 = 127.',
  },
  {
    id: 'num-a-2',
    tier: 'Advanced',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['6', '10', '18', '34', '66', '?'],
    options: [
      { id: 'a', label: '128' },
      { id: 'b', label: '130' },
      { id: 'c', label: '132' },
      { id: 'd', label: '134' },
    ],
    correctOptionId: 'b',
    explanation: 'Differences double each step: +4, +8, +16, +32, +64 → 66 + 64 = 130.',
  },
  {
    id: 'num-a-3',
    tier: 'Advanced',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['2', '6', '12', '20', '30', '?'],
    options: [
      { id: 'a', label: '40' },
      { id: 'b', label: '42' },
      { id: 'c', label: '44' },
      { id: 'd', label: '46' },
    ],
    correctOptionId: 'b',
    explanation: 'Pronic numbers n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.',
  },
  {
    id: 'num-a-4',
    tier: 'Advanced',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['7', '10', '16', '25', '37', '?'],
    options: [
      { id: 'a', label: '49' },
      { id: 'b', label: '51' },
      { id: 'c', label: '52' },
      { id: 'd', label: '55' },
    ],
    correctOptionId: 'c',
    explanation: 'Differences increase by +3 each step (+3, +6, +9, +12, +15 → 37 + 15 = 52).',
  },
  {
    id: 'vis-a-1',
    tier: 'Advanced',
    kind: 'visual',
    prompt: 'Select the figure that completes the cyclical shape and fill rule.',
    visualSequence: [
      { shape: 'circle', fill: 'solid', rotation: 0, count: 4 },
      { shape: 'square', fill: 'half', rotation: 0, count: 3 },
      { shape: 'triangle', fill: 'outline', rotation: 180, count: 2 },
    ],
    options: [
      { id: 'a', glyph: { shape: 'diamond', fill: 'solid', rotation: 0, count: 1 } },
      { id: 'b', glyph: { shape: 'diamond', fill: 'outline', rotation: 0, count: 1 } },
      { id: 'c', glyph: { shape: 'circle', fill: 'solid', rotation: 0, count: 1 } },
      { id: 'd', glyph: { shape: 'diamond', fill: 'solid', rotation: 0, count: 2 } },
    ],
    correctOptionId: 'a',
    explanation: 'Count descends (4, 3, 2, 1), fill cycles (solid, half, outline, solid), and shape advances through circle → square → triangle → diamond.',
  },
  {
    id: 'num-a-5',
    tier: 'Advanced',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['120', '60', '20', '5', '?'],
    options: [
      { id: 'a', label: '1' },
      { id: 'b', label: '2' },
      { id: 'c', label: '0' },
      { id: 'd', label: '2.5' },
    ],
    correctOptionId: 'a',
    explanation: 'Divide successively by 2, 3, 4, and 5 (5 ÷ 5 = 1).',
  },
  {
    id: 'num-i-5',
    tier: 'Intermediate',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['11', '13', '17', '19', '23', '?'],
    options: [
      { id: 'a', label: '25' },
      { id: 'b', label: '27' },
      { id: 'c', label: '29' },
      { id: 'd', label: '31' },
    ],
    correctOptionId: 'c',
    explanation: 'Consecutive prime numbers starting from 11: the prime after 23 is 29.',
  },
  {
    id: 'num-f-5',
    tier: 'Foundation',
    kind: 'numerical',
    prompt: 'Identify the number that logically continues the sequence.',
    sequenceText: ['100', '93', '86', '79', '?'],
    options: [
      { id: 'a', label: '71' },
      { id: 'b', label: '72' },
      { id: 'c', label: '73' },
      { id: 'd', label: '74' },
    ],
    correctOptionId: 'b',
    explanation: 'Each term subtracts 7 from the preceding number (79 − 7 = 72).',
  },
];

export const WORD_MEMORY_BANK: string[] = [
  'anchor', 'beacon', 'canyon', 'delta', 'ember', 'falcon', 'glacier', 'harbor',
  'ivory', 'jasper', 'kettle', 'lantern', 'marble', 'nectar', 'obsidian', 'prism',
  'quartz', 'river', 'summit', 'timber', 'umbra', 'valley', 'willow', 'zenith',
  'archive', 'balance', 'compass', 'diagram', 'eclipse', 'formula', 'gravity', 'horizon',
  'impulse', 'journal', 'kinetic', 'lattice', 'mercury', 'nucleus', 'orbital', 'pendulum',
  'quotient', 'radian', 'spectrum', 'theorem', 'velocity', 'waveform', 'axis', 'bridge',
  'cabinet', 'desk', 'enamel', 'fountain', 'garden', 'hammer', 'island', 'jacket',
  'keyboard', 'ladder', 'meadow', 'notebook', 'orchard', 'pavilion', 'quiver', 'ribbon',
  'sandstone', 'terrace', 'umbrella', 'vessel', 'window', 'yardarm', 'acorn', 'birch',
  'cedar', 'daisy', 'elm', 'fern', 'granite', 'heather', 'indigo', 'juniper',
  'kelp', 'lichen', 'maple', 'nettle', 'olive', 'pine', 'reed', 'spruce',
  'thistle', 'violet', 'walnut', 'yarrow', 'almond', 'barley', 'citrus', 'dill',
  'espresso', 'fennel', 'ginger', 'hazelnut', 'jamb', 'kiln', 'ledge', 'mortar',
  'newel', 'parapet', 'rafter', 'sill', 'trestle', 'vault', 'weir', 'plinth',
  'cipher', 'draft', 'etching', 'folio', 'glyph', 'index', 'ledger', 'margin',
  'offset', 'proof', 'quill', 'script', 'typeface', 'vellum', 'canvas', 'easel',
  'chisel', 'anvil', 'bellows', 'crucible', 'foundry', 'lathe', 'spindle', 'turbine',
];

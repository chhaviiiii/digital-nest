export const P = {
  cream:  'oklch(96% 0.018 60)',
  ink:    'oklch(24% 0.04 45)',
  terra:  'oklch(58% 0.11 42)',
  muted:  'oklch(50% 0.04 50)',
  white:  '#fffdf9',
  bg:     'oklch(95% 0.018 58)',
};

export const MOODS = {
  golden: { label: '☀️', name: 'Sunny',  skyA: 'oklch(62% 0.16 52)', skyB: 'oklch(82% 0.13 78)', wallLight: 'rgba(255,190,80,0.07)' },
  cloudy: { label: '⛅', name: 'Cloudy', skyA: 'oklch(56% 0.05 220)', skyB: 'oklch(70% 0.04 215)', wallLight: 'rgba(180,195,220,0.05)' },
  rainy:  { label: '🌧', name: 'Rainy',  skyA: 'oklch(46% 0.05 232)', skyB: 'oklch(60% 0.05 222)', wallLight: 'rgba(140,170,210,0.05)' },
  night:  { label: '🌙', name: 'Night',  skyA: 'oklch(17% 0.09 272)', skyB: 'oklch(27% 0.11 258)', wallLight: 'rgba(255,190,100,0.10)' },
};

export const BODY_COLORS = [
  'oklch(60% 0.11 42)',
  'oklch(72% 0.10 68)',
  'oklch(78% 0.08 20)',
  'oklch(62% 0.10 155)',
  'oklch(65% 0.09 280)',
  'oklch(60% 0.10 240)',
  'oklch(40% 0.06 40)',
  'oklch(86% 0.04 60)',
];

export const BLUSH_COLORS = [
  'oklch(82% 0.09 20)',
  'oklch(80% 0.09 45)',
  'oklch(78% 0.10 12)',
  'oklch(80% 0.07 310)',
  'oklch(82% 0.08 200)',
];

export const WALL_PRESETS   = ['oklch(93% 0.022 55)', 'oklch(91% 0.025 20)', 'oklch(88% 0.025 140)', 'oklch(90% 0.020 290)', 'oklch(90% 0.025 225)', 'oklch(92% 0.025 65)', 'oklch(89% 0.022 0)'];
export const FLOOR_PRESETS  = ['oklch(65% 0.08 54)', 'oklch(40% 0.07 48)', 'oklch(78% 0.05 58)', 'oklch(60% 0.10 40)', 'oklch(55% 0.06 80)', 'oklch(70% 0.06 50)'];
export const ACCENT_PRESETS = ['oklch(58% 0.11 42)', 'oklch(55% 0.12 20)', 'oklch(52% 0.10 155)', 'oklch(55% 0.10 280)', 'oklch(55% 0.10 240)', 'oklch(58% 0.12 68)', 'oklch(48% 0.09 310)'];

export const DEFAULT_TASKS = [
  { id: 1, text: 'Good morning text',    coins: 3,  done: false },
  { id: 2, text: 'Make coffee together', coins: 5,  done: false },
  { id: 3, text: 'Watch a movie',        coins: 10, done: false },
  { id: 4, text: 'Cook dinner together', coins: 15, done: false },
  { id: 5, text: 'Go for a walk',        coins: 8,  done: false },
  { id: 6, text: 'Send a voice note',    coins: 4,  done: false },
];

export const DEFAULT_SHOP = [
  { id: 'plant',  label: 'Monstera',     icon: '🌿', cost: 30,  owned: true,  placed: true  },
  { id: 'lamp',   label: 'Floor Lamp',   icon: '🏮', cost: 40,  owned: true,  placed: true  },
  { id: 'rug',    label: 'Woven Rug',    icon: '🪹', cost: 20,  owned: true,  placed: true  },
  { id: 'cat',    label: 'Little Cat',   icon: '🐱', cost: 80,  owned: false, placed: false },
  { id: 'candles',label: 'Candles',      icon: '🕯',  cost: 15,  owned: false, placed: false },
  { id: 'books',  label: 'Book Stack',   icon: '📚', cost: 20,  owned: false, placed: false },
  { id: 'lights', label: 'Fairy Lights', icon: '✨', cost: 60,  owned: false, placed: false },
  { id: 'cactus', label: 'Cactus',       icon: '🌵', cost: 25,  owned: false, placed: false },
];

export const CAT_COLORS = [
  'oklch(64% 0.08 56)',   // sandy (default)
  'oklch(58% 0.13 48)',   // ginger tabby
  'oklch(54% 0.04 240)',  // grey
  'oklch(26% 0.02 40)',   // midnight black
  'oklch(88% 0.02 60)',   // cream
];

export const DEFAULT_ROOM = {
  wallColor:    'oklch(93% 0.022 55)',
  floorColor:   'oklch(65% 0.08 54)',
  accentColor:  'oklch(58% 0.11 42)',
  mood:         'golden',
  coins:        240,
  catColorIdx:  0,
  tasks:        DEFAULT_TASKS,
  shopItems:    DEFAULT_SHOP,
  note:         "can't wait to see you 🌙",
  avatarA:      { bodyColor: 'oklch(60% 0.11 42)', blushColor: 'oklch(82% 0.09 20)', name: 'River' },
  avatarB:     { bodyColor: 'oklch(78% 0.08 20)', blushColor: 'oklch(80% 0.09 45)', name: 'Quinn' },
};

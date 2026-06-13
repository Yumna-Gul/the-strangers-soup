// theme.js — The Stranger's Soup design tokens
// One source of truth. Import and use everywhere.

export const T = {
  // backgrounds
  bg:        '#FDF6EE',
  bgCard:    '#FFFCF7',
  bgSurface: '#F5EAD8',

  // text
  ink:       '#2C1A0E',
  inkMid:    '#7A5C42',
  inkMute:   '#B4926F',

  // borders
  border:    '#E4D0BC',
  borderMid: '#C9A87C',

  // accent — deep amber / burnt orange
  accent:    '#C07810',
  accentBg:  '#FFF0D6',
  accentDark:'#7A4A06',

  // green (for veggie badge, success)
  green:     '#3B6D11',
  greenBg:   '#EAF3DE',

  // danger / safety
  danger:    '#B23A48',
  dangerBg:  '#FDEDEE',
  dangerBorder:'#E86A75',

  // font
  fontSerif: 'Georgia, "Times New Roman", serif',
  fontSans:  '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

// veggie: the emoji shown on the pill
// meaning: why this veggie represents this emotion (shown as tooltip / caption)
export const FLAVORS = [
  { name: 'Burnout',        color: '#854F0B', bg: '#FFF0E0', border: '#EF9F27', veggie: '🌶️', meaning: 'burned too bright, too long' },
  { name: 'Heartbreak',     color: '#993556', bg: '#FBEAF0', border: '#ED93B1', veggie: '🍓', meaning: 'sweet things that bruise easily' },
  { name: 'Loneliness',     color: '#185FA5', bg: '#E6F1FB', border: '#85B7EB', veggie: '🫐', meaning: 'small and quietly forgotten' },
  { name: 'Grief',          color: '#534AB7', bg: '#EEEDFE', border: '#AFA9EC', veggie: '🍆', meaning: 'heavy and full of what was' },
  { name: 'Anxiety',        color: '#3B6D11', bg: '#EAF3DE', border: '#97C459', veggie: '🫛', meaning: 'coiled tight, always bracing' },
  { name: 'Lost',           color: '#5F5E5A', bg: '#F1EFE8', border: '#B4B2A9', veggie: '🍄', meaning: 'grows in the dark, unseen' },
  { name: 'Overwhelmed',    color: '#B23A48', bg: '#FDEDEE', border: '#E86A75', veggie: '🍅', meaning: 'too much ripening at once' },
  { name: 'Exhausted',      color: '#8B6E5A', bg: '#FDF8F2', border: '#C8B89A', veggie: '🥔', meaning: 'buried deep, all energy spent' },
  { name: 'Hopeless',       color: '#2E4057', bg: '#EBEFF3', border: '#6B7B8C', veggie: '🫚', meaning: 'wrung dry, nothing left to give' },
  { name: 'Insecure',       color: '#7E6651', bg: '#F9F4EF', border: '#C1A68D', veggie: '🥜', meaning: 'hiding inside a hard shell' },
  { name: 'Resentment',     color: '#A63A50', bg: '#FDEDEE', border: '#E86A75', veggie: '🫑', meaning: 'bitter when left to sit too long' },
  { name: 'Guilt',          color: '#4A3F55', bg: '#F5F0F8', border: '#BFA1C9', veggie: '🪻', meaning: 'delicate but leaves a stain' },
  { name: 'Shame',          color: '#6D597A', bg: '#F3E9F5', border: '#C9AEDB', veggie: '🧅', meaning: 'layers and layers, tears to peel' },
  { name: 'Frustration',    color: '#D85A30', bg: '#FDECE7', border: '#EFA28B', veggie: '🥕', meaning: 'rigid, snaps under too much pressure' },
  { name: 'Disappointment', color: '#6B3A2A', bg: '#FDF6F2', border: '#D4A090', veggie: '🍂', meaning: 'what bloomed, and then fell' },
  { name: 'Confusion',      color: '#5F5E5A', bg: '#F1EFE8', border: '#B4B2A9', veggie: '🥦', meaning: 'tangled, no clear way through' },
  { name: 'Jealousy',       color: '#1B998B', bg: '#E0F7F4', border: '#76C7B7', veggie: '🥒', meaning: 'cool on the outside, simmering inside' },
  { name: 'Regret',         color: '#7E6651', bg: '#F9F4EF', border: '#C1A68D', veggie: '🍵', meaning: 'steeped too long, now bitter' },
]

export const FLAVOR_MAP = Object.fromEntries(
  FLAVORS.map(f => [f.name, f])
)

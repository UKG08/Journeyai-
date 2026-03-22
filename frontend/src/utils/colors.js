// ─────────────────────────────────────────────────────
// colors.js
// Single source of truth for every color in the app
// Import C from here — never hardcode hex anywhere else
// ─────────────────────────────────────────────────────

export const C = {

  // ── BASE ──────────────────────────────────────────
  bg:          '#080c14',   // page background
  bgDeep:      '#050810',   // deeper background for contrast
  card:        'rgba(15,21,32,0.85)',   // card surface
  cardHover:   'rgba(20,28,44,0.9)',    // card on hover
  border:      'rgba(30,42,58,0.8)',    // default border
  borderHover: 'rgba(245,158,11,0.3)', // border on hover

  // ── TEXT ──────────────────────────────────────────
  text:        '#f8f4ec',   // primary text — warm white
  textMuted:   '#8896a5',   // secondary text — muted
  textDim:     '#4a5568',   // very muted — disabled states

  // ── ACCENT — amber ────────────────────────────────
  amber:       '#f59e0b',
  amberDim:    '#ba7505',
  amberGlow:   'rgba(245,158,11,0.15)',
  amberGlowSm: 'rgba(245,158,11,0.08)',
  amberBorder: 'rgba(245,158,11,0.3)',
  amberText:   'rgba(245,158,11,0.9)',

  // ── SUCCESS — teal ────────────────────────────────
  teal:        '#14b8a6',
  tealDim:     '#0d9488',
  tealGlow:    'rgba(20,184,166,0.15)',
  tealGlowSm:  'rgba(20,184,166,0.08)',
  tealBorder:  'rgba(20,184,166,0.3)',
  tealText:    'rgba(20,184,166,0.9)',

  // ── DANGER — red ──────────────────────────────────
  red:         '#ef4444',
  redDim:      '#dc2626',
  redGlow:     'rgba(239,68,68,0.12)',
  redGlowSm:   'rgba(239,68,68,0.06)',
  redBorder:   'rgba(239,68,68,0.3)',
  redText:     'rgba(239,68,68,0.9)',

  // ── INFO — blue ───────────────────────────────────
  blue:        '#3b82f6',
  blueGlow:    'rgba(59,130,246,0.15)',
  blueBorder:  'rgba(59,130,246,0.3)',

  // ── SKILL LEVELS ──────────────────────────────────
  skillStrong:  {
    text:   '#14b8a6',
    bg:     'rgba(20,184,166,0.1)',
    border: 'rgba(20,184,166,0.3)',
    glow:   '#14b8a6',
  },
  skillBasic: {
    text:   '#f59e0b',
    bg:     'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    glow:   '#f59e0b',
  },
  skillMissing: {
    text:   '#ef4444',
    bg:     'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    glow:   '#ef4444',
  },
  skillLearning: {
    text:   '#3b82f6',
    bg:     'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.3)',
    glow:   '#3b82f6',
  },

  // ── SCORE COLORS ──────────────────────────────────
  // pass a score 0-100, get the right color
  scoreColor(score) {
    if (score >= 70) return C.teal
    if (score >= 50) return C.amber
    return C.red
  },

  scoreGlow(score) {
    if (score >= 70) return C.tealGlow
    if (score >= 50) return C.amberGlow
    return C.redGlow
  },

  // ── GRADE COLORS ──────────────────────────────────
  gradeColor(grade) {
    const map = {
      'A': { text: '#14b8a6', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.3)'  },
      'B': { text: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)'  },
      'C': { text: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
      'D': { text: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)'  },
      'F': { text: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)'   },
    }
    return map[grade] || map['C']
  },

  // ── MATCH COLORS ──────────────────────────────────
  matchColor(pct) {
    if (pct >= 70) return C.teal
    if (pct >= 50) return C.amber
    return C.red
  },

  // ── GLASS SURFACES ────────────────────────────────
  glass: {
    surface:  'rgba(15,21,32,0.85)',
    backdrop: 'blur(12px)',
    border:   '1px solid rgba(30,42,58,0.8)',
    shadow:   '0 4px 24px rgba(0,0,0,0.3)',
    shadowLg: '0 8px 40px rgba(0,0,0,0.4)',
  },

  // ── HERO GLOW ─────────────────────────────────────
  heroGlow: {
    amber: '0 0 40px rgba(245,158,11,0.15), 0 0 80px rgba(245,158,11,0.05)',
    teal:  '0 0 40px rgba(20,184,166,0.15), 0 0 80px rgba(20,184,166,0.05)',
    red:   '0 0 40px rgba(239,68,68,0.12),  0 0 80px rgba(239,68,68,0.04)',
  },

  // ── ACT THEMES ────────────────────────────────────
  // each act has its own accent color
  act: {
    1: { accent: '#f59e0b', glow: 'rgba(245,158,11,0.15)' }, // awakening — amber
    2: { accent: '#14b8a6', glow: 'rgba(20,184,166,0.15)' }, // mirror    — teal
    3: { accent: '#ef4444', glow: 'rgba(239,68,68,0.12)'  }, // wound     — red
    4: { accent: '#f59e0b', glow: 'rgba(245,158,11,0.15)' }, // path      — amber
    5: { accent: '#3b82f6', glow: 'rgba(59,130,246,0.15)' }, // verdict   — blue
  },
}
// ─────────────────────────────────────────────────────
// transitions.js
// Reusable transition configs and easing curves
// Import these instead of writing duration/ease inline
// These are the physics that make animations feel real
// ─────────────────────────────────────────────────────

// ── EASING CURVES ─────────────────────────────────────
// Custom cubic bezier curves
// Visualize at: https://cubic-bezier.com

export const ease = {
  // smooth deceleration — most natural feeling
  out:        [0.22, 1, 0.36, 1],

  // sharp acceleration then smooth stop — snappy
  inOut:      [0.4, 0, 0.2, 1],

  // overshoot slightly then settle — satisfying
  bounce:     [0.34, 1.56, 0.64, 1],

  // slow start, fast end — building momentum
  in:         [0.4, 0, 1, 1],

  // cinematic — slow at both ends
  cinematic:  [0.76, 0, 0.24, 1],

  // snap — instant start, gradual end
  snap:       [0, 0, 0.2, 1],
}

// ── DURATIONS ─────────────────────────────────────────
export const dur = {
  instant:  0.1,   // button press feedback
  fast:     0.2,   // hover states
  normal:   0.4,   // most transitions
  medium:   0.6,   // card entries
  slow:     0.8,   // section transitions
  cinematic: 1.2,  // hero reveals
  dramatic:  2.0,  // completion sequence
}

// ── SPRING CONFIGS ────────────────────────────────────
// Spring physics — stiffness = speed, damping = wobble
// Higher stiffness = faster. Lower damping = more bounce.

export const spring = {
  // snappy — fast with no bounce. buttons, toggles
  snappy: {
    type:      'spring',
    stiffness: 400,
    damping:   30,
  },

  // responsive — fast with tiny bounce. skill badges
  responsive: {
    type:      'spring',
    stiffness: 300,
    damping:   22,
  },

  // bouncy — medium speed with noticeable bounce. cards
  bouncy: {
    type:      'spring',
    stiffness: 200,
    damping:   16,
  },

  // wobbly — slow with big bounce. hero elements
  wobbly: {
    type:      'spring',
    stiffness: 120,
    damping:   10,
  },

  // gentle — slow and smooth. no bounce. subtle elements
  gentle: {
    type:      'spring',
    stiffness: 80,
    damping:   20,
  },

  // stamp — like a rubber stamp hitting paper
  stamp: {
    type:      'spring',
    stiffness: 500,
    damping:   25,
    mass:      0.8,
  },
}

// ── PRESET TRANSITIONS ────────────────────────────────
// Complete transition objects ready to use directly

export const t = {
  // instant feedback — button clicks
  instant: {
    duration: dur.instant,
    ease:     ease.snap,
  },

  // hover state change
  hover: {
    duration: dur.fast,
    ease:     ease.out,
  },

  // standard UI transition — most things
  normal: {
    duration: dur.normal,
    ease:     ease.out,
  },

  // card entering viewport
  card: {
    duration: dur.medium,
    ease:     ease.out,
  },

  // section revealing
  section: {
    duration: dur.slow,
    ease:     ease.out,
  },

  // cinematic hero reveal
  hero: {
    duration: dur.cinematic,
    ease:     ease.cinematic,
  },

  // number counting up
  count: {
    duration: 1.5,
    ease:     ease.out,
  },

  // draw a path or line
  draw: {
    duration: 1.2,
    ease:     ease.inOut,
  },

  // progress bar filling
  bar: {
    duration: 1.0,
    ease:     ease.out,
    delay:    0.2,
  },

  // globe rotation
  globe: {
    duration: 0,  // driven by requestAnimationFrame
  },
}

// ── STAGGER CONFIGS ───────────────────────────────────
// Used inside Framer Motion parent variants

export const stagger = {
  fast: {
    staggerChildren:  0.05,
    delayChildren:    0.1,
  },
  medium: {
    staggerChildren:  0.1,
    delayChildren:    0.1,
  },
  slow: {
    staggerChildren:  0.15,
    delayChildren:    0.2,
  },
  cascade: {
    staggerChildren:  0.08,
    delayChildren:    0.3,
  },
}

// ── DELAY PRESETS ─────────────────────────────────────
// Standard delays for orchestrating sequences

export const delay = {
  none:    0,
  short:   0.1,
  medium:  0.2,
  long:    0.4,
  section: 0.6,
}

// ── REPEAT CONFIGS ────────────────────────────────────
// For continuous animations

export const repeat = {
  // continuous spin
  spin: {
    repeat:   Infinity,
    ease:     'linear',
  },

  // pulse breathe
  breathe: {
    repeat:      Infinity,
    repeatType:  'reverse',
    ease:        ease.inOut,
  },

  // ping radar
  ping: {
    repeat:   Infinity,
    ease:     ease.out,
    duration: 1.5,
  },

  // particle flow
  flow: {
    repeat:   Infinity,
    ease:     'linear',
    duration: 2,
  },

  // shimmer sweep
  shimmer: {
    repeat:      Infinity,
    repeatDelay: 6,
    ease:        ease.inOut,
    duration:    1.5,
  },
}

// ── CSS TRANSITION STRINGS ────────────────────────────
// For inline style transitions — not Framer Motion

export const css = {
  fast:   'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow:   'all 0.4s ease',
  color:  'color 0.2s ease, background 0.2s ease',
  border: 'border-color 0.2s ease, box-shadow 0.2s ease',
  transform: 'transform 0.15s ease',
}

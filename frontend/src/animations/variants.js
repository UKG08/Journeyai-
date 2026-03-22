// ─────────────────────────────────────────────────────
// variants.js
// Every Framer Motion animation variant lives here
// Import by name — never write animation props inline
// ─────────────────────────────────────────────────────

// ── PAGE TRANSITIONS ──────────────────────────────────
export const pageEnter = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

// ── CARD ENTRIES ──────────────────────────────────────

// standard card — fades up from below
export const cardFadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

// card assembles from 4 corners — used for next step hero card
export const cardAssemble = {
  hidden:  { opacity: 0, scale: 0.92, rotate: -1 },
  visible: {
    opacity: 1, scale: 1, rotate: 0,
    transition: { type: 'spring', stiffness: 180, damping: 22 }
  }
}

// card materializes — used for cinematic reveals
export const cardMaterialize = {
  hidden:  { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
  visible: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

// card slams in from left — used for resume issues
export const cardSlideLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: {
    opacity: 1, x: 0,
    transition: { type: 'spring', stiffness: 200, damping: 24 }
  }
}

// card slams in from right
export const cardSlideRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: {
    opacity: 1, x: 0,
    transition: { type: 'spring', stiffness: 200, damping: 24 }
  }
}

// card drops from above — used for stat board
export const cardDropDown = {
  hidden:  { opacity: 0, y: -40 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 28 }
  }
}

// holographic flicker — used for portfolio card
export const cardFlicker = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: [0, 0.3, 0, 0.7, 0.4, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] }
  }
}

// ── STAGGER CONTAINERS ────────────────────────────────
// wrap children in this to stagger their entry

export const staggerFast = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } }
}

export const staggerMed = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } }
}

export const staggerSlow = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } }
}

// ── CHILD ITEMS ───────────────────────────────────────
// use these as children inside stagger containers

export const itemFadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

export const itemFadeLeft = {
  hidden:  { opacity: 0, x: -20 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
}

export const itemPop = {
  hidden:  { opacity: 0, scale: 0 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 20 }
  }
}

export const itemStamp = {
  hidden:  { opacity: 0, scale: 1.4, rotate: -3 },
  visible: {
    opacity: 1, scale: 1, rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 18 }
  }
}

// ── TEXT ANIMATIONS ───────────────────────────────────

// word by word reveal
export const wordReveal = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

// glitch settle — text glitches then snaps clean
export const glitchSettle = {
  hidden:  { opacity: 0, x: 0 },
  visible: {
    opacity: [0, 1, 1, 1, 1],
    x:       [0, -4, 4, -2, 0],
    filter:  ['blur(0px)', 'blur(2px)', 'blur(0px)', 'blur(1px)', 'blur(0px)'],
    transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.7, 1] }
  }
}

// flip number — airport departure board
export const flipNumber = {
  hidden:  { rotateX: -90, opacity: 0 },
  visible: {
    rotateX: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
}

// ── BUTTON ANIMATIONS ─────────────────────────────────

export const buttonHover = {
  scale:      1.04,
  transition: { duration: 0.15 }
}

export const buttonTap = {
  scale:      0.96,
  transition: { duration: 0.1 }
}

export const buttonGlowHover = {
  scale:      1.05,
  boxShadow:  '0 0 40px rgba(245,158,11,0.4)',
  transition: { duration: 0.2 }
}

// ── PROGRESS / DRAW ANIMATIONS ────────────────────────

// draw a line — used for timeline, connectors
export const drawLine = {
  hidden:  { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1, opacity: 1,
    transition: { duration: 1.2, ease: 'easeInOut' }
  }
}

// fill a bar from left
export const fillBar = {
  hidden:  { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  }
}

// ── ICON / SYMBOL ANIMATIONS ──────────────────────────

// continuous spin
export const spinSlow = {
  animate: {
    rotate: 360,
    transition: { duration: 8, repeat: Infinity, ease: 'linear' }
  }
}

export const spinMed = {
  animate: {
    rotate: 360,
    transition: { duration: 4, repeat: Infinity, ease: 'linear' }
  }
}

// pulse scale
export const pulseSlow = {
  animate: {
    scale:      [1, 1.08, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
}

export const pulseFast = {
  animate: {
    scale:      [1, 1.15, 1],
    opacity:    [1, 0.7, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  }
}

// radar ping — expands and fades
export const radarPing = {
  animate: {
    scale:   [1, 2.5],
    opacity: [0.6, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeOut' }
  }
}

// ── CONNECTOR LINES ───────────────────────────────────

// particles flowing down a connector
export const particleFlow = {
  animate: {
    y:       ['0%', '100%'],
    opacity: [0, 1, 1, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'linear' }
  }
}

// ── SCAN LINE ─────────────────────────────────────────

export const scanLine = {
  animate: {
    y:       ['-100%', '100%'],
    opacity: [0, 0.6, 0.6, 0],
    transition: {
      duration:   8,
      repeat:     Infinity,
      ease:       'linear',
      repeatDelay: 4
    }
  }
}

// ── GLOW PULSE ────────────────────────────────────────

export const glowPulseAmber = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(245,158,11,0)',
      '0 0 30px rgba(245,158,11,0.4)',
      '0 0 0px rgba(245,158,11,0)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
}

export const glowPulseTeal = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(20,184,166,0)',
      '0 0 30px rgba(20,184,166,0.4)',
      '0 0 0px rgba(20,184,166,0)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
}

// ── COMPLETION SEQUENCE ───────────────────────────────

export const completionReveal = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1, scale: 1,
    transition: {
      duration: 1.2,
      ease:     [0.22, 1, 0.36, 1],
      staggerChildren: 0.2
    }
  }
}

export const completionItem = {
  hidden:  { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}
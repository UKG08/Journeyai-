// ─────────────────────────────────────────────────────
// StatFlipBoard.jsx
// Airport departure board style stat display
// Four stats flip simultaneously on mount
// Each digit column flips independently
// Used between hero cards at top of output page
// ─────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion }                      from 'framer-motion'
import { C }                           from '../../utils/colors'

// ── SINGLE DIGIT FLIPPER ──────────────────────────────
function FlipDigit({ char, delay = 0, color = C.text }) {
  const [current,  setCurrent]  = useState('?')
  const [flipping, setFlipping] = useState(false)
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ%/'

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iterations = 0
      const maxIter  = 10 + Math.floor(Math.random() * 8)

      const interval = setInterval(() => {
        setFlipping(true)
        setCurrent(CHARS[Math.floor(Math.random() * CHARS.length)])
        iterations++

        if (iterations >= maxIter) {
          clearInterval(interval)
          setCurrent(char)
          setFlipping(false)
        }
      }, 60)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [char, delay])

  return (
    <motion.div
      animate={flipping ? { rotateX: [-90, 0] } : {}}
      transition={{ duration: 0.06 }}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          '28px',
        height:         '40px',
        background:     '#0a0f1a',
        border:         `1px solid ${C.border}`,
        borderRadius:   '4px',
        fontFamily:     'monospace',
        fontSize:       '22px',
        fontWeight:     '700',
        color:          flipping ? C.textMuted : color,
        position:       'relative',
        overflow:       'hidden',
        boxShadow:      flipping
          ? `0 0 8px ${C.amberGlow}`
          : 'inset 0 2px 4px rgba(0,0,0,0.4)',
        transition:     'color 0.1s, box-shadow 0.1s',
      }}
    >
      {/* horizontal split line */}
      <div style={{
        position:   'absolute',
        left:       0,
        right:      0,
        top:        '50%',
        height:     '1px',
        background: 'rgba(0,0,0,0.5)',
        zIndex:     2,
      }} />

      {/* top half */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     '50%',
        background: 'rgba(0,0,0,0.15)',
        zIndex:     1,
      }} />

      {current}
    </motion.div>
  )
}

// ── FLIP STRING ───────────────────────────────────────
function FlipString({ value, color, delay = 0 }) {
  const chars  = String(value).split('')

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {chars.map((char, i) => (
        <FlipDigit
          key={i}
          char={char}
          color={color}
          delay={delay + i * 40}
        />
      ))}
    </div>
  )
}

// ── STAT ITEM ─────────────────────────────────────────
function StatItem({ label, value, unit = '', color, delay = 0, icon }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '8px',
        padding:       '16px 20px',
        background:    'rgba(10,15,26,0.8)',
        border:        `1px solid ${C.border}`,
        borderTop:     `2px solid ${color}`,
        borderRadius:  '0 0 8px 8px',
        minWidth:      '140px',
      }}
    >
      {/* label row */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '6px',
      }}>
        {icon && (
          <span style={{ fontSize: '12px', color }}>{icon}</span>
        )}
        <p style={{
          fontSize:      '9px',
          fontWeight:    '600',
          color:         C.textMuted,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          {label}
        </p>
      </div>

      {/* flip board value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <FlipString
          value={value}
          color={color}
          delay={delay + 200}
        />
        {unit && (
          <span style={{
            fontSize:   '14px',
            color:      C.textMuted,
            fontFamily: 'monospace',
            fontWeight: '600',
          }}>
            {unit}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ── MAIN STAT FLIP BOARD ──────────────────────────────
export default function StatFlipBoard({ data }) {
  const stats = data?.stats || {}

  const items = [
    {
      label: 'Skills analyzed',
      value: String(stats.totalSkills   || 0),
      unit:  '',
      color: C.amber,
      icon:  '◎',
      delay: 0,
    },
    {
      label: 'Gaps found',
      value: String(stats.skillsMissing || 0),
      unit:  '',
      color: C.red,
      icon:  '•',
      delay: 150,
    },
    {
      label: 'Readiness',
      value: String(stats.readiness     || 0),
      unit:  '%',
      color: C.scoreColor(stats.readiness || 0),
      icon:  '◉',
      delay: 300,
    },
    {
      label: 'Portfolio',
      value: stats.portfolioScore !== null
        ? String(stats.portfolioScore || 0)
        : '--',
      unit:  stats.portfolioScore !== null ? '/100' : '',
      color: stats.portfolioScore !== null
        ? C.scoreColor(stats.portfolioScore || 0)
        : C.textMuted,
      icon:  '⬡',
      delay: 450,
    },
  ]

  return (
    <div style={{
      display:        'flex',
      justifyContent: 'center',
      gap:            '2px',
      padding:        '0 0 24px',
      flexWrap:       'wrap',
    }}>

      {/* board header */}
      <div style={{
        width:          '100%',
        textAlign:      'center',
        marginBottom:   '12px',
      }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize:      '9px',
            fontWeight:    '600',
            color:         C.textMuted,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          ◈ — Analysis complete — ◈
        </motion.p>
      </div>

      {items.map((item, i) => (
        <StatItem key={i} {...item} />
      ))}
    </div>
  )
}
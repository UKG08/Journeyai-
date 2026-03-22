// ─────────────────────────────────────────────────────
// HeroCard.jsx
// Act 1 — The Awakening
// First section users see on output page
// Contains:
//   - Readiness ring (full size, animated)
//   - Level badge with glitch effect
//   - Stat flip board
//   - Position summary
//   - Strengths + gaps grid
//   - Hidden advantage highlight
// ─────────────────────────────────────────────────────

import { useState, useEffect }     from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C }                       from '../../utils/colors'
import { css }                     from '../../animations/transitions'
import {
  cardMaterialize,
  staggerMed,
  itemFadeUp,
  glitchSettle,
  glowPulseAmber,
}                                  from '../../animations/variants'
import ReadinessRing               from '../visual/ReadinessRing'
import StatFlipBoard               from '../ui/StatFlipBoard'
import useTilt, { tiltIntensity }  from '../../hooks/useTilt'
import useInView                   from '../../hooks/useInView'
import { useScrambleText }         from '../../hooks/useCountUp'

// ── GLITCH BADGE ──────────────────────────────────────
function GlitchBadge({ text, color }) {
  const { display, start } = useScrambleText(text, { duration: 700, delay: 400 })
  const { ref, inView }    = useInView(0.3)

  useEffect(() => { if (inView) start() }, [inView])

  return (
    <motion.div
      ref={ref}
      variants={glitchSettle}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '8px',
        background:   `${color}15`,
        border:       `1px solid ${color}44`,
        borderRadius: '8px',
        padding:      '8px 16px',
      }}
    >
      <motion.div
        animate={{
          boxShadow: [`0 0 0px ${color}`, `0 0 12px ${color}`, `0 0 0px ${color}`],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width:        '8px',
          height:       '8px',
          borderRadius: '50%',
          background:   color,
          flexShrink:   0,
        }}
      />
      <span style={{
        fontSize:      '13px',
        fontWeight:    '700',
        color,
        fontFamily:    'monospace',
        letterSpacing: '0.08em',
      }}>
        {display}
      </span>
    </motion.div>
  )
}

// ── STRENGTH / GAP ITEM ───────────────────────────────
function BulletItem({ text, color, prefix, delay = 0 }) {
  const { ref, inView } = useInView(0.2)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}
    >
      <motion.span
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
        style={{ color, fontSize: '12px', marginTop: '3px', flexShrink: 0 }}
      >
        {prefix}
      </motion.span>
      <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6' }}>
        {typeof text === 'string' ? text : ''}
      </p>
    </motion.div>
  )
}

// ── HIDDEN ADVANTAGE ──────────────────────────────────
function HiddenAdvantage({ text }) {
  const { ref, inView } = useInView(0.3)

  if (!text) return null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        background:   `linear-gradient(135deg, ${C.amberGlowSm}, rgba(20,184,166,0.06))`,
        border:       `1px solid ${C.amberBorder}`,
        borderRadius: '12px',
        padding:      '16px',
        marginTop:    '16px',
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      {/* shimmer sweep */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
        style={{
          position:   'absolute',
          inset:      0,
          background: `linear-gradient(90deg, transparent, ${C.amberGlowSm}, transparent)`,
          pointerEvents: 'none',
        }}
      />
      <p style={{
        fontSize:      '9px',
        fontWeight:    '600',
        color:         C.amber,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom:  '8px',
        display:       'flex',
        alignItems:    'center',
        gap:           '6px',
      }}>
        <span>◈</span> Hidden advantage
      </p>
      <p style={{ fontSize: '13px', color: C.text, lineHeight: '1.6' }}>
        {text}
      </p>
    </motion.div>
  )
}

// ── SECTION LABEL ─────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize:      '9px',
      fontWeight:    '600',
      letterSpacing: '0.15em',
      color:         C.amber,
      textTransform: 'uppercase',
      marginBottom:  '12px',
      display:       'flex',
      alignItems:    'center',
      gap:           '8px',
    }}>
      <span style={{
        display:    'inline-block',
        width:      '14px',
        height:     '1px',
        background: C.amber,
      }} />
      {children}
    </p>
  )
}

// ── GLASS CARD ────────────────────────────────────────
function GlassCard({ children, style = {}, delay = 0, glowColor }) {
  const tilt            = useTilt(tiltIntensity.subtle)
  const { ref, inView } = useInView(0.1)

  return (
    <motion.div
      ref={ref}
      variants={cardMaterialize}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseEnter={tilt.onMouseEnter}
        onMouseLeave={tilt.onMouseLeave}
        style={{
          background:     C.card,
          backdropFilter: 'blur(12px)',
          border:         `1px solid ${glowColor ? glowColor + '33' : C.border}`,
          borderRadius:   '16px',
          padding:        '22px',
          boxShadow:      glowColor
            ? `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${glowColor}11`
            : '0 4px 24px rgba(0,0,0,0.3)',
          transition:     css.normal,
          ...style,
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

// ── MAIN HERO CARD ────────────────────────────────────
export default function HeroCard({ data }) {
  const summary = data?.summary || {}
  const score   = data?.score   || 0
  const level   = data?.level   || 'Unknown'

  return (
    <div id="act1" style={{ paddingTop: '32px' }}>

      {/* act label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '24px', textAlign: 'center' }}
      >
        <p style={{
          fontSize:      '9px',
          fontWeight:    '600',
          color:         C.textMuted,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          ◈ — Act I — The Awakening — ◈
        </p>
      </motion.div>

      {/* top row — ring + level */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 '12px',
        marginBottom:        '12px',
      }}>

        {/* readiness ring card */}
        <GlassCard delay={0.1} glowColor={C.scoreColor(score)}>
          <SectionLabel>Readiness</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <ReadinessRing score={score} size={180} />
          </div>
        </GlassCard>

        {/* level + summary card */}
        <GlassCard delay={0.2}>
          <SectionLabel>Current level</SectionLabel>

          <GlitchBadge
            text={level.toUpperCase()}
            color={C.scoreColor(score)}
          />

          {summary.overview && (
            <p style={{
              fontSize:   '13px',
              color:      C.textMuted,
              lineHeight: '1.7',
              marginTop:  '14px',
            }}>
              {summary.overview}
            </p>
          )}

          <HiddenAdvantage text={summary.hidden_advantage} />
        </GlassCard>

      </div>

      {/* stat flip board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <StatFlipBoard data={data} />
      </motion.div>

      {/* strengths + gaps grid */}
      {((summary.strengths?.length > 0) || (summary.honest_gaps?.length > 0)) && (
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 '12px',
          marginTop:           '4px',
        }}>

          {summary.strengths?.length > 0 && (
            <GlassCard
              delay={0.5}
              style={{ borderLeft: `2px solid ${C.teal}66` }}
            >
              <SectionLabel>Strengths</SectionLabel>
              {summary.strengths.map((s, i) => (
                <BulletItem
                  key={i}
                  text={s}
                  color={C.teal}
                  prefix="→"
                  delay={i * 0.08}
                />
              ))}
            </GlassCard>
          )}

          {summary.honest_gaps?.length > 0 && (
            <GlassCard
              delay={0.6}
              style={{ borderLeft: `2px solid ${C.red}66` }}
            >
              <SectionLabel>Gaps</SectionLabel>
              {summary.honest_gaps.map((g, i) => (
                <BulletItem
                  key={i}
                  text={g}
                  color={C.red}
                  prefix="•"
                  delay={i * 0.08}
                />
              ))}
            </GlassCard>
          )}

        </div>
      )}

    </div>
  )
}
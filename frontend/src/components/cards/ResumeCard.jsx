// ─────────────────────────────────────────────────────
// ResumeCard.jsx
// Act 3 — The Wound
// Newspaper two-column grid layout
// Each issue revealed by red scan line top to bottom
// Before/after example animates as live diff
// Red text struck through, green types in below
// Quick wins bounce in one by one
// ─────────────────────────────────────────────────────

import { useState, useEffect }     from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C }                       from '../../utils/colors'
import { css }                     from '../../animations/transitions'
import useTilt, { tiltIntensity }  from '../../hooks/useTilt'
import useInView                   from '../../hooks/useInView'

function SectionLabel({ children, color = C.amber }) {
  return (
    <p style={{
      fontSize:      '9px',
      fontWeight:    '600',
      letterSpacing: '0.15em',
      color,
      textTransform: 'uppercase',
      marginBottom:  '14px',
      display:       'flex',
      alignItems:    'center',
      gap:           '8px',
    }}>
      <span style={{
        display:    'inline-block',
        width:      '14px',
        height:     '1px',
        background: color,
      }} />
      {children}
    </p>
  )
}

// ── ANIMATED DIFF ─────────────────────────────────────
function AnimatedDiff({ example, inView }) {
  const [phase, setPhase] = useState(0)
  // phase 0 = nothing, 1 = before shows, 2 = before strikes, 3 = after types

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPhase(1), 300)
    const t2 = setTimeout(() => setPhase(2), 900)
    const t3 = setTimeout(() => setPhase(3), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView])

  if (!example) return null

  const parts  = example.split('→')
  const before = parts[0]?.replace('before:', '').trim() || ''
  const after  = parts[1]?.trim() || ''

  return (
    <div style={{
      background:   'rgba(8,12,20,0.9)',
      border:       `1px solid ${C.border}`,
      borderRadius: '8px',
      padding:      '12px',
      fontFamily:   'monospace',
      fontSize:     '11px',
      marginBottom: '8px',
      overflow:     'hidden',
    }}>
      {/* before line */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1,  x: 0   }}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '8px',
              marginBottom:   '6px',
            }}
          >
            <span style={{ color: C.red, fontSize: '10px' }}>−</span>
            <span style={{
              color:          C.textMuted,
              textDecoration: phase >= 2 ? 'line-through' : 'none',
              opacity:        phase >= 2 ? 0.5 : 1,
              transition:     'all 0.4s ease',
            }}>
              {before}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* after line — types itself */}
      {phase >= 3 && after && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
        >
          <span style={{ color: C.teal, fontSize: '10px', marginTop: '1px' }}>+</span>
          <TypewriterDiff text={after} />
        </motion.div>
      )}
    </div>
  )
}

function TypewriterDiff({ text, speed = 20 }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef                  = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span style={{ color: C.teal }}>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{ color: C.teal }}
        >
          |
        </motion.span>
      )}
    </span>
  )
}

// ── ISSUE CARD ────────────────────────────────────────
function IssueCard({ spot, delay = 0 }) {
  const tilt            = useTilt(tiltIntensity.subtle)
  const { ref, inView } = useInView(0.2)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseEnter={tilt.onMouseEnter}
        onMouseLeave={tilt.onMouseLeave}
        style={{
          background:   'rgba(10,15,26,0.8)',
          border:       `1px solid ${C.border}`,
          borderLeft:   `2px solid ${C.red}55`,
          borderRadius: '10px',
          padding:      '16px',
          position:     'relative',
          overflow:     'hidden',
          height:       '100%',
          transition:   css.normal,
        }}
      >
        {/* scan line reveal */}
        <motion.div
          initial={{ y: '-105%' }}
          animate={inView ? { y: '105%' } : {}}
          transition={{ delay: delay + 0.1, duration: 0.7, ease: 'easeIn' }}
          style={{
            position:   'absolute',
            left:       0,
            right:      0,
            height:     '100%',
            background: `linear-gradient(to bottom, transparent, ${C.redGlow}, transparent)`,
            pointerEvents: 'none',
            zIndex:     1,
          }}
        />

        {/* content */}
        <div style={{ position: 'relative', zIndex: 2 }}>

          {/* section tag */}
          {spot.section && (
            <span style={{
              fontSize:     '9px',
              fontWeight:   '600',
              color:        C.textMuted,
              background:   'rgba(30,42,58,0.8)',
              border:       `1px solid ${C.border}`,
              borderRadius: '4px',
              padding:      '2px 8px',
              display:      'inline-block',
              marginBottom: '10px',
              letterSpacing:'0.06em',
              textTransform:'uppercase',
            }}>
              {spot.section}
            </span>
          )}

          {/* issue */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <span style={{ color: C.red, fontSize: '11px', marginTop: '2px', flexShrink: 0 }}>•</span>
            <p style={{ fontSize: '13px', fontWeight: '600', color: C.text, lineHeight: '1.4' }}>
              {spot.issue}
            </p>
          </div>

          {/* why it hurts */}
          {spot.why_it_hurts && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={{ color: '#f97316', fontSize: '11px', marginTop: '2px', flexShrink: 0 }}>•</span>
              <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.5' }}>
                {spot.why_it_hurts}
              </p>
            </div>
          )}

          {/* animated diff */}
          {spot.example && (
            <AnimatedDiff example={spot.example} inView={inView} />
          )}

          {/* fix */}
          {spot.fix && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: C.teal, fontSize: '11px', marginTop: '2px', flexShrink: 0 }}
              >
                →
              </motion.span>
              <p style={{ fontSize: '12px', color: C.teal, fontWeight: '500', lineHeight: '1.5' }}>
                {spot.fix}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── QUICK WIN ─────────────────────────────────────────
function QuickWin({ text, index }) {
  const { ref, inView } = useInView(0.3)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{
        delay:     index * 0.1,
        type:      'spring',
        stiffness: 280,
        damping:   22,
      }}
      style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
    >
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.2 }}
        style={{ color: C.teal, fontSize: '12px', marginTop: '2px', flexShrink: 0 }}
      >
        →
      </motion.span>
      <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6' }}>
        {typeof text === 'string' ? text : ''}
      </p>
    </motion.div>
  )
}

// ── MAIN RESUME CARD ──────────────────────────────────
export default function ResumeCard({ data }) {
  const spots           = data?.weakSpots    || []
  const quickWins       = data?.quickWins    || []
  const resumeSummary   = data?.resumeSummary|| {}
  const { ref, inView } = useInView(0.1)

  if (!spots.length) return null

  return (
    <div id="act3-resume" ref={ref}>

      {/* act label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        <p style={{
          fontSize:      '9px',
          fontWeight:    '600',
          color:         C.textMuted,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          ◈ — Act III — The Wound — ◈
        </p>
      </motion.div>

      <div style={{
        background:   C.card,
        border:       `1px solid ${C.redBorder}`,
        borderTop:    `2px solid ${C.red}`,
        borderRadius: '16px',
        padding:      '24px',
      }}>

        <SectionLabel color={C.red}>Resume review</SectionLabel>

        {/* first impression */}
        {resumeSummary.overall_impression && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              background:   'rgba(10,15,26,0.6)',
              border:       `1px solid ${C.border}`,
              borderRadius: '10px',
              padding:      '14px',
              marginBottom: '20px',
            }}
          >
            <p style={{
              fontSize:      '9px',
              color:         C.textMuted,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom:  '8px',
            }}>
              First impression
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: C.textMuted, fontSize: '11px', marginTop: '2px' }}>◎</span>
              <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6' }}>
                {resumeSummary.overall_impression}
              </p>
            </div>

            {(resumeSummary.biggest_strength || resumeSummary.biggest_problem) && (
              <div style={{
                display:             'grid',
                gridTemplateColumns: '1fr 1fr',
                gap:                 '12px',
                marginTop:           '12px',
              }}>
                {resumeSummary.biggest_strength && (
                  <div>
                    <p style={{ fontSize: '9px', color: C.teal, fontWeight: '600', marginBottom: '4px' }}>
                      BEST PART
                    </p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ color: C.teal, fontSize: '11px' }}>→</span>
                      <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.5' }}>
                        {resumeSummary.biggest_strength}
                      </p>
                    </div>
                  </div>
                )}
                {resumeSummary.biggest_problem && (
                  <div>
                    <p style={{ fontSize: '9px', color: C.red, fontWeight: '600', marginBottom: '4px' }}>
                      BIGGEST PROBLEM
                    </p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ color: C.red, fontSize: '11px' }}>•</span>
                      <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.5' }}>
                        {resumeSummary.biggest_problem}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* newspaper grid — issues */}
        <p style={{
          fontSize:      '9px',
          fontWeight:    '600',
          color:         C.red,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom:  '12px',
        }}>
          Issues to fix
        </p>

        <div style={{
          display:             'grid',
          gridTemplateColumns: spots.length === 1 ? '1fr' : '1fr 1fr',
          gap:                 '10px',
          marginBottom:        '20px',
          alignItems:          'start',
        }}>
          {spots.map((spot, i) => (
            <IssueCard key={i} spot={spot} delay={i * 0.1} />
          ))}
        </div>

        {/* quick wins */}
        {quickWins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              background:   'rgba(20,184,166,0.05)',
              border:       `1px solid ${C.tealBorder}`,
              borderRadius: '10px',
              padding:      '16px',
            }}
          >
            <p style={{
              fontSize:      '9px',
              fontWeight:    '600',
              color:         C.teal,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom:  '12px',
            }}>
              Quick wins — do these today
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quickWins.map((win, i) => (
                <QuickWin key={i} text={win} index={i} />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}

// need useRef for TypewriterDiff
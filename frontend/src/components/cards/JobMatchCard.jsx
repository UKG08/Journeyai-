// ─────────────────────────────────────────────────────
// JobMatchCard.jsx
// Act 5b — Job match analysis
// Two forces collide animation on entry
// Job requirements slide from right
// Your skills slide from left
// They meet in center — match % explodes outward
// Matched requirements glow green
// Gaps show importance badge + how to close
// ─────────────────────────────────────────────────────

import { useState, useEffect }     from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C }                       from '../../utils/colors'
import { css }                     from '../../animations/transitions'
import useInView                   from '../../hooks/useInView'
import { useSlotMachine }          from '../../hooks/useCountUp'
import useTilt, { tiltIntensity }  from '../../hooks/useTilt'

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize:      '9px',
      fontWeight:    '600',
      letterSpacing: '0.15em',
      color:         C.amber,
      textTransform: 'uppercase',
      marginBottom:  '16px',
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

// ── COLLISION ANIMATION ───────────────────────────────
function CollisionDisplay({ matchPercent, inView, color }) {
  const [exploded, setExploded] = useState(false)
  const { display, settled, start } = useSlotMachine(matchPercent, {
    scrambleDuration: 800,
    delay:            600,
  })

  useEffect(() => {
    if (inView) {
      start()
      setTimeout(() => setExploded(true), 1000)
    }
  }, [inView])

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '0',
      marginBottom:   '24px',
      position:       'relative',
      height:         '80px',
      overflow:       'hidden',
    }}>

      {/* left force — your skills */}
      <motion.div
        initial={{ x: -120, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:   C.tealGlow,
          border:       `1px solid ${C.tealBorder}`,
          borderRadius: '8px 0 0 8px',
          padding:      '10px 16px',
          fontSize:     '11px',
          fontWeight:   '600',
          color:        C.teal,
          whiteSpace:   'nowrap',
        }}
      >
        Your skills →
      </motion.div>

      {/* collision center — match % */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={exploded ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        {/* explosion rings */}
        {exploded && [0, 1, 2].map(i => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 3 + i, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay:    i * 0.12,
              ease:     'easeOut',
            }}
            style={{
              position:     'absolute',
              inset:        '-4px',
              borderRadius: '50%',
              border:       `1px solid ${color}`,
              pointerEvents:'none',
            }}
          />
        ))}

        <div style={{
          background:   `${color}15`,
          border:       `2px solid ${color}`,
          borderRadius: '50%',
          width:        '72px',
          height:       '72px',
          display:      'flex',
          flexDirection:'column',
          alignItems:   'center',
          justifyContent:'center',
          position:     'relative',
          boxShadow:    `0 0 20px ${color}44`,
        }}>
          <motion.p
            animate={settled ? {
              textShadow: [
                `0 0 0px ${color}`,
                `0 0 16px ${color}`,
                `0 0 0px ${color}`,
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontSize:   '20px',
              fontWeight: '700',
              color,
              lineHeight: '1',
              fontFamily: 'monospace',
            }}
          >
            {display}
          </motion.p>
          <p style={{ fontSize: '9px', color: C.textMuted }}>%</p>
        </div>
      </motion.div>

      {/* right force — job requirements */}
      <motion.div
        initial={{ x: 120, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:   C.amberGlowSm,
          border:       `1px solid ${C.amberBorder}`,
          borderRadius: '0 8px 8px 0',
          padding:      '10px 16px',
          fontSize:     '11px',
          fontWeight:   '600',
          color:        C.amber,
          whiteSpace:   'nowrap',
        }}
      >
        ← Job needs
      </motion.div>
    </div>
  )
}

// ── MATCH BAR ─────────────────────────────────────────
function MatchBar({ pct, color, inView }) {
  return (
    <div style={{
      width:        '100%',
      height:       '6px',
      background:   'rgba(30,42,58,0.8)',
      borderRadius: '3px',
      overflow:     'hidden',
      marginBottom: '20px',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
        style={{
          height:       '100%',
          background:   color,
          borderRadius: '3px',
          boxShadow:    `0 0 8px ${color}`,
        }}
      />
    </div>
  )
}

// ── REQUIREMENT ITEM ──────────────────────────────────
function MatchedItem({ req, index }) {
  const { ref, inView } = useInView(0.2)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{
        borderLeft:   `2px solid ${C.teal}55`,
        paddingLeft:  '12px',
        marginBottom: '10px',
      }}
    >
      <div style={{ display: 'flex', gap: '6px', marginBottom: '3px' }}>
        <motion.span
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
          style={{ color: C.teal, fontSize: '11px', marginTop: '2px', flexShrink: 0 }}
        >
          →
        </motion.span>
        <p style={{ fontSize: '12px', fontWeight: '600', color: C.text, lineHeight: '1.4' }}>
          {typeof req.requirement === 'string' ? req.requirement : ''}
        </p>
      </div>
      {req.how_they_match && (
        <p style={{ fontSize: '11px', color: C.textMuted, lineHeight: '1.5', paddingLeft: '17px' }}>
          {req.how_they_match}
        </p>
      )}
    </motion.div>
  )
}

function GapItem({ req, index }) {
  const { ref, inView } = useInView(0.2)

  const importanceColor = {
    'critical':     C.red,
    'important':    C.amber,
    'nice to have': C.textMuted,
  }[req.importance] || C.textMuted

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      style={{
        borderLeft:   `2px solid ${C.red}44`,
        paddingLeft:  '12px',
        marginBottom: '12px',
      }}
    >
      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         '8px',
        marginBottom:'4px',
        flexWrap:    'wrap',
      }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: C.text }}>
          {typeof req.requirement === 'string' ? req.requirement : ''}
        </p>
        {req.importance && (
          <span style={{
            fontSize:     '9px',
            fontWeight:   '600',
            color:        importanceColor,
            background:   `${importanceColor}15`,
            border:       `1px solid ${importanceColor}33`,
            borderRadius: '4px',
            padding:      '1px 7px',
            letterSpacing:'0.06em',
            textTransform:'uppercase',
          }}>
            {req.importance}
          </span>
        )}
      </div>
      {req.time_to_close && (
        <p style={{ fontSize: '10px', color: C.textMuted, marginBottom: '3px' }}>
          Time to close: {req.time_to_close}
        </p>
      )}
      {req.how_to_close && (
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ color: C.teal, fontSize: '11px', marginTop: '1px' }}>→</span>
          <p style={{ fontSize: '11px', color: C.teal, lineHeight: '1.5' }}>
            {req.how_to_close}
          </p>
        </div>
      )}
    </motion.div>
  )
}

// ── APPLY RECOMMENDATION ──────────────────────────────
function ApplyBadge({ recommendation }) {
  const config = {
    yes:    { text: '◎ Apply now',           color: C.teal,  bg: C.tealGlow,   border: C.tealBorder  },
    almost: { text: '◎ Almost ready',        color: C.amber, bg: C.amberGlow,  border: C.amberBorder },
    no:     { text: '◎ Build skills first',  color: C.red,   bg: C.redGlow,    border: C.redBorder   },
  }[recommendation] || {
    text: '◎ See verdict below', color: C.textMuted, bg: 'transparent', border: C.border,
  }

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.4, type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        display:      'inline-block',
        fontSize:     '12px',
        fontWeight:   '600',
        color:        config.color,
        background:   config.bg,
        border:       `1px solid ${config.border}`,
        borderRadius: '20px',
        padding:      '6px 16px',
        marginBottom: '20px',
      }}
    >
      {config.text}
    </motion.span>
  )
}

// ── MAIN JOB MATCH CARD ───────────────────────────────
export default function JobMatchCard({ data }) {
  const jobMatch        = data?.jobMatch || null
  const { ref, inView } = useInView(0.15)

  if (!jobMatch) return null

  const pct   = jobMatch.match_percentage || 0
  const color = C.matchColor(pct)

  return (
    <div id="act5-jobmatch" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:   C.card,
          border:       `1px solid ${C.border}`,
          borderRadius: '16px',
          padding:      '24px',
          overflow:     'hidden',
        }}
      >
        <SectionLabel>Job match analysis</SectionLabel>

        {/* collision animation */}
        <CollisionDisplay
          matchPercent={pct}
          inView={inView}
          color={color}
        />

        {/* summary + recommendation */}
        {jobMatch.summary && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
            style={{
              fontSize:     '13px',
              color:        C.textMuted,
              lineHeight:   '1.6',
              marginBottom: '12px',
            }}
          >
            {jobMatch.summary}
          </motion.p>
        )}

        {jobMatch.apply_recommendation && (
          <ApplyBadge recommendation={jobMatch.apply_recommendation} />
        )}

        {/* match bar */}
        <MatchBar pct={pct} color={color} inView={inView} />

        {/* two column requirements grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 '16px',
          marginBottom:        '16px',
        }}>

          {/* matched */}
          {jobMatch.matched_requirements?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                background:   'rgba(20,184,166,0.04)',
                border:       `1px solid ${C.tealBorder}`,
                borderRadius: '10px',
                padding:      '14px',
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
                You meet these
              </p>
              {jobMatch.matched_requirements.map((req, i) => (
                <MatchedItem key={i} req={req} index={i} />
              ))}
            </motion.div>
          )}

          {/* gaps */}
          {jobMatch.missing_requirements?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                background:   C.redGlowSm,
                border:       `1px solid ${C.redBorder}`,
                borderRadius: '10px',
                padding:      '14px',
              }}
            >
              <p style={{
                fontSize:      '9px',
                fontWeight:    '600',
                color:         C.red,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom:  '12px',
              }}>
                Gaps to close
              </p>
              {jobMatch.missing_requirements.map((req, i) => (
                <GapItem key={i} req={req} index={i} />
              ))}
            </motion.div>
          )}
        </div>

        {/* verdict */}
        {jobMatch.verdict && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{
              background:   'rgba(10,15,26,0.6)',
              border:       `1px solid ${C.border}`,
              borderRadius: '10px',
              padding:      '14px',
            }}
          >
            <p style={{
              fontSize:      '9px',
              fontWeight:    '600',
              color:         C.textMuted,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom:  '8px',
            }}>
              Verdict
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: C.textMuted, fontSize: '11px', marginTop: '2px' }}>◎</span>
              <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6' }}>
                {jobMatch.verdict}
              </p>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}
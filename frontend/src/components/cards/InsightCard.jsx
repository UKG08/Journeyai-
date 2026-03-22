// ─────────────────────────────────────────────────────
// InsightCard.jsx
// Act 2a — Key insights from meta analysis
// Three insight cards in a grid
// Numbers 01 02 03 flip like departure board
// Headline types itself
// Timeline and risk side by side
// ─────────────────────────────────────────────────────

import { useEffect }               from 'react'
import { motion }                  from 'framer-motion'
import { C }                       from '../../utils/colors'
import { css }                     from '../../animations/transitions'
import {
  staggerMed,
  itemFadeUp,
  cardFadeUp,
}                                  from '../../animations/variants'
import useTilt, { tiltIntensity }  from '../../hooks/useTilt'
import useInView                   from '../../hooks/useInView'
import { useScrambleText }         from '../../hooks/useCountUp'

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
      <span style={{ display: 'inline-block', width: '14px', height: '1px', background: C.amber }} />
      {children}
    </p>
  )
}

function FlipNumber({ num, delay = 0 }) {
  const text              = `0${num}`
  const { display, start } = useScrambleText(text, {
    duration: 500,
    delay,
    chars:    '0123456789',
  })
  const { ref, inView }   = useInView(0.3)

  useEffect(() => { if (inView) start() }, [inView])

  return (
    <span
      ref={ref}
      style={{
        fontFamily:    'monospace',
        fontSize:      '11px',
        fontWeight:    '700',
        color:         C.amber,
        letterSpacing: '0.1em',
      }}
    >
      {display}
    </span>
  )
}

function InsightItem({ item, index, delay = 0 }) {
  const tilt            = useTilt(tiltIntensity.subtle)
  const { ref, inView } = useInView(0.2)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
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
          borderRadius: '12px',
          padding:      '18px',
          height:       '100%',
          transition:   css.normal,
          position:     'relative',
          overflow:     'hidden',
        }}
      >
        {/* scan line on entry */}
        <motion.div
          initial={{ y: '-100%' }}
          animate={inView ? { y: '200%' } : {}}
          transition={{ delay: delay + 0.2, duration: 0.6, ease: 'easeIn' }}
          style={{
            position:   'absolute',
            left:       0,
            right:      0,
            height:     '2px',
            background: `linear-gradient(90deg, transparent, ${C.amber}44, transparent)`,
            pointerEvents: 'none',
          }}
        />

        {/* number */}
        <div style={{ marginBottom: '12px' }}>
          <FlipNumber num={index + 1} delay={delay * 1000} />
        </div>

        {/* insight text */}
        <p style={{
          fontSize:     '13px',
          fontWeight:   '600',
          color:        C.text,
          marginBottom: '8px',
          lineHeight:   '1.4',
        }}>
          {item.insight}
        </p>

        {item.why_it_matters && (
          <p style={{
            fontSize:     '12px',
            color:        C.textMuted,
            marginBottom: '10px',
            lineHeight:   '1.6',
          }}>
            {item.why_it_matters}
          </p>
        )}

        {item.action && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              style={{ color: C.teal, fontSize: '12px', flexShrink: 0, marginTop: '1px' }}
            >
              →
            </motion.span>
            <p style={{ fontSize: '12px', color: C.teal, fontWeight: '500', lineHeight: '1.5' }}>
              {item.action}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function InsightCard({ data }) {
  const meta            = data?.meta || {}
  const { ref, inView } = useInView(0.15)

  if (!meta.headline && !meta.top_3_insights?.length) return null

  return (
    <div id="act2-insights" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          background:   C.card,
          border:       `1px solid ${C.border}`,
          borderTop:    `2px solid ${C.amber}`,
          borderRadius: '16px',
          padding:      '24px',
        }}
      >
        <SectionLabel>Key insights</SectionLabel>

        {/* headline */}
        {meta.headline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              background:   C.amberGlowSm,
              border:       `1px solid ${C.amberBorder}`,
              borderRadius: '10px',
              padding:      '14px 18px',
              marginBottom: '20px',
            }}
          >
            <p style={{
              fontSize:   '17px',
              fontWeight: '600',
              color:      C.text,
              lineHeight: '1.4',
            }}>
              {meta.headline}
            </p>
          </motion.div>
        )}

        {/* three insight grid */}
        {meta.top_3_insights?.length > 0 && (
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '10px',
            marginBottom:        '16px',
          }}>
            {meta.top_3_insights.map((item, i) => (
              <InsightItem key={i} item={item} index={i} delay={i * 0.12} />
            ))}
          </div>
        )}

        {/* timeline + risk row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

          {meta.realistic_timeline && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                background:   'rgba(20,184,166,0.06)',
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
                marginBottom:  '8px',
              }}>
                Realistic timeline
              </p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ color: C.teal, fontSize: '12px' }}>◎</span>
                <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.6' }}>
                  {meta.realistic_timeline}
                </p>
              </div>
            </motion.div>
          )}

          {meta.biggest_risk && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
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
                marginBottom:  '8px',
              }}>
                Biggest risk
              </p>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <span style={{ color: C.red, fontSize: '12px' }}>•</span>
                <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.6' }}>
                  {meta.biggest_risk}
                </p>
              </div>
              {meta.biggest_risk_solution && (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ color: C.teal, fontSize: '12px' }}>→</span>
                  <p style={{ fontSize: '12px', color: C.teal, lineHeight: '1.5' }}>
                    {meta.biggest_risk_solution}
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  )
}
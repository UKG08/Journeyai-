// ─────────────────────────────────────────────────────
// NextStepCard.jsx
// Act 4a — The Path — Major next step
// Assembles from 4 corners on entry
// Title reveals word by word with velocity
// Why grid slides in from 3 directions
// Week plan timeline draws itself
// Day badges stamp in with bounce
// Resources typewriter URL reveal
// Breathing amber glow — continuous idle
// ─────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence }     from 'framer-motion'
import { C }                           from '../../utils/colors'
import { css }                         from '../../animations/transitions'
import useTilt, { tiltIntensity }      from '../../hooks/useTilt'
import useInView                       from '../../hooks/useInView'

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

// ── WORD BY WORD TITLE ────────────────────────────────
function VelocityTitle({ text }) {
  const words           = text.split(' ')
  const { ref, inView } = useInView(0.3)

  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            delay:    i * 0.06,
            duration: 0.5,
            ease:     [0.22, 1, 0.36, 1],
          }}
          style={{
            fontSize:      '22px',
            fontWeight:    '700',
            color:         C.text,
            letterSpacing: '-0.01em',
            lineHeight:    '1.2',
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

// ── WHY BOX ───────────────────────────────────────────
function WhyBox({ label, value, direction, delay }) {
  const { ref, inView } = useInView(0.2)
  if (!value) return null

  const initial = {
    left:  { opacity: 0, x: -30 },
    right: { opacity: 0, x:  30 },
    up:    { opacity: 0, y:  30 },
  }[direction] || { opacity: 0, y: 30 }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:   'rgba(10,15,26,0.8)',
        border:       `1px solid ${C.border}`,
        borderRadius: '10px',
        padding:      '14px',
      }}
    >
      <p style={{
        fontSize:      '9px',
        fontWeight:    '600',
        color:         C.amber,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom:  '6px',
      }}>
        {label}
      </p>
      <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.6' }}>
        {value}
      </p>
    </motion.div>
  )
}

// ── WEEK PLAN TIMELINE ────────────────────────────────
function WeekPlan({ plan }) {
  const { ref, inView } = useInView(0.2)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (inView) setTimeout(() => setDrawn(true), 300)
  }, [inView])

  return (
    <div ref={ref} style={{ position: 'relative', paddingLeft: '28px' }}>

      {/* timeline line — draws itself */}
      <div style={{
        position:   'absolute',
        left:       '7px',
        top:        '6px',
        width:      '1px',
        background: C.border,
        overflow:   'hidden',
        bottom:     '6px',
      }}>
        <motion.div
          initial={{ height: 0 }}
          animate={drawn ? { height: '100%' } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width:      '100%',
            background: `linear-gradient(to bottom, ${C.amber}, ${C.amber}22)`,
            boxShadow:  `0 0 4px ${C.amber}`,
          }}
        />
      </div>

      {plan.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={drawn ? { opacity: 1, x: 0 } : {}}
          transition={{
            delay:     0.3 + i * 0.12,
            type:      'spring',
            stiffness: 260,
            damping:   22,
          }}
          style={{
            display:      'flex',
            gap:          '14px',
            marginBottom: '16px',
            position:     'relative',
            alignItems:   'flex-start',
          }}
        >
          {/* waypoint dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={drawn ? { scale: 1 } : {}}
            transition={{
              delay:     0.4 + i * 0.12,
              type:      'spring',
              stiffness: 400,
              damping:   20,
            }}
            style={{
              position:     'absolute',
              left:         '-24px',
              top:          '8px',
              width:        '10px',
              height:       '10px',
              borderRadius: '50%',
              background:   i === 0 ? C.amber : 'rgba(30,42,58,0.8)',
              border:       `1px solid ${i === 0 ? C.amber : C.border}`,
              boxShadow:    i === 0 ? `0 0 8px ${C.amber}` : 'none',
              zIndex:       1,
            }}
          />

          {/* day stamp badge */}
          <motion.span
            initial={{ scale: 1.4, rotate: -3 }}
            animate={drawn ? { scale: 1, rotate: 0 } : {}}
            transition={{
              delay:     0.5 + i * 0.12,
              type:      'spring',
              stiffness: 500,
              damping:   25,
            }}
            style={{
              fontSize:     '9px',
              fontWeight:   '700',
              color:        C.amber,
              background:   C.amberGlowSm,
              border:       `1px solid ${C.amberBorder}`,
              borderRadius: '6px',
              padding:      '3px 8px',
              whiteSpace:   'nowrap',
              flexShrink:   0,
              fontFamily:   'monospace',
              letterSpacing:'0.04em',
            }}
          >
            {item.day}
          </motion.span>

          {/* task content */}
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize:   '13px',
              color:      C.text,
              lineHeight: '1.5',
              marginBottom: item.goal ? '3px' : 0,
            }}>
              {item.task}
            </p>
            {item.goal && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={drawn ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.12 }}
                style={{ fontSize: '11px', color: C.textMuted }}
              >
                → {item.goal}
              </motion.p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── RESOURCE ITEM ─────────────────────────────────────
function ResourceItem({ resource, index }) {
  const { ref, inView } = useInView(0.2)
  const [showUrl, setShowUrl] = useState(false)
  const [typedUrl, setTypedUrl] = useState('')

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => {
      setShowUrl(true)
      let i = 0
      const url = resource.url || ''
      const interval = setInterval(() => {
        if (i < url.length) {
          setTypedUrl(url.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
        }
      }, 18)
      return () => clearInterval(interval)
    }, index * 200 + 400)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{
        borderLeft:   `2px solid ${C.tealBorder}`,
        paddingLeft:  '12px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize:       '13px',
            color:          C.teal,
            textDecoration: 'none',
            fontWeight:     '500',
          }}
        >
          {resource.title}
        </a>
        {resource.type && (
          <span style={{
            fontSize:     '9px',
            color:        C.textMuted,
            background:   'rgba(30,42,58,0.8)',
            border:       `1px solid ${C.border}`,
            borderRadius: '4px',
            padding:      '1px 6px',
            letterSpacing:'0.06em',
          }}>
            {resource.type}
          </span>
        )}
      </div>

      {showUrl && (
        <p style={{
          fontSize:   '10px',
          color:      C.textDim,
          fontFamily: 'monospace',
          marginBottom: '2px',
        }}>
          {typedUrl}
          {typedUrl.length < (resource.url?.length || 0) && (
            <span style={{ color: C.teal }}>|</span>
          )}
        </p>
      )}

      {resource.use_on && (
        <p style={{ fontSize: '10px', color: C.textMuted }}>
          Use on: {resource.use_on}
        </p>
      )}
      {resource.why_this_one && (
        <p style={{ fontSize: '11px', color: C.textMuted, lineHeight: '1.5' }}>
          {resource.why_this_one}
        </p>
      )}
    </motion.div>
  )
}

// ── MAIN NEXT STEP CARD ───────────────────────────────
export default function NextStepCard({ data }) {
  const nextStep        = data?.nextStep || {}
  const why             = nextStep.why   || {}
  const { ref, inView } = useInView(0.1)

  if (!nextStep.title) return null

  return (
    <div id="act4-nextstep" ref={ref}>

      {/* act label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        <p style={{
          fontSize:      '9px',
          fontWeight:    '600',
          color:         C.textMuted,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          ◈ — Act IV — The Path — ◈
        </p>
      </motion.div>

      {/* card assembles from corners */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotate: -0.5 }}
        animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* breathing amber glow */}
        <motion.div
          animate={{
            boxShadow: [
              `0 0 0px ${C.amber}00`,
              `0 0 40px ${C.amber}22, inset 0 0 40px ${C.amber}05`,
              `0 0 0px ${C.amber}00`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:   C.card,
            border:       `1px solid ${C.amberBorder}`,
            borderRadius: '16px',
            padding:      '24px',
            position:     'relative',
            overflow:     'hidden',
          }}
        >
          {/* corner accent lines */}
          {[
            { top: 0, left: 0,  borderTop: `2px solid ${C.amber}`, borderLeft:  `2px solid ${C.amber}`, borderRadius: '16px 0 0 0'  },
            { top: 0, right: 0, borderTop: `2px solid ${C.amber}`, borderRight: `2px solid ${C.amber}`, borderRadius: '0 16px 0 0'  },
            { bottom: 0, left:  0, borderBottom: `2px solid ${C.amber}`, borderLeft:  `2px solid ${C.amber}`, borderRadius: '0 0 0 16px' },
            { bottom: 0, right: 0, borderBottom: `2px solid ${C.amber}`, borderRight: `2px solid ${C.amber}`, borderRadius: '0 0 16px 0' },
          ].map((style, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              style={{
                position: 'absolute',
                width:    '20px',
                height:   '20px',
                ...style,
              }}
            />
          ))}

          <SectionLabel>Your major next step</SectionLabel>

          {/* title — word by word */}
          <VelocityTitle text={nextStep.title} />

          {/* why grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '8px',
            marginBottom:        '20px',
          }}>
            <WhyBox label="Why now"       value={why.main_reason}   direction="left"  delay={0.2} />
            <WhyBox label="Career impact" value={why.career_impact} direction="up"    delay={0.3} />
            <WhyBox label="Builds on"     value={why.builds_on}     direction="right" delay={0.4} />
          </div>

          {/* outcome + time */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 '10px',
            marginBottom:        '24px',
          }}>
            {nextStep.what_you_will_have_after && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                style={{
                  background:   'rgba(20,184,166,0.06)',
                  border:       `1px solid ${C.tealBorder}`,
                  borderRadius: '10px',
                  padding:      '14px',
                }}
              >
                <p style={{ fontSize: '9px', color: C.teal, fontWeight: '600', marginBottom: '6px', letterSpacing: '0.1em' }}>
                  YOU WILL HAVE
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ color: C.teal, fontSize: '11px' }}>•</span>
                  <p style={{ fontSize: '13px', color: C.text, fontWeight: '500', lineHeight: '1.5' }}>
                    {nextStep.what_you_will_have_after}
                  </p>
                </div>
              </motion.div>
            )}

            {nextStep.time_estimate && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                style={{
                  background:   C.amberGlowSm,
                  border:       `1px solid ${C.amberBorder}`,
                  borderRadius: '10px',
                  padding:      '14px',
                }}
              >
                <p style={{ fontSize: '9px', color: C.amber, fontWeight: '600', marginBottom: '6px', letterSpacing: '0.1em' }}>
                  TIME NEEDED
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ color: C.amber, fontSize: '11px' }}>◎</span>
                  <p style={{ fontSize: '13px', color: C.text, fontWeight: '500', lineHeight: '1.5' }}>
                    {nextStep.time_estimate}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* week plan */}
          {nextStep.week_plan?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize:      '9px',
                fontWeight:    '600',
                color:         C.textMuted,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom:  '16px',
              }}>
                Day by day plan
              </p>
              <WeekPlan plan={nextStep.week_plan} />
            </div>
          )}

          {/* resources */}
          {nextStep.resources?.length > 0 && (
            <div style={{
              borderTop:  `1px solid ${C.border}`,
              paddingTop: '20px',
            }}>
              <p style={{
                fontSize:      '9px',
                fontWeight:    '600',
                color:         C.textMuted,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom:  '14px',
              }}>
                Resources for this step
              </p>
              {nextStep.resources.map((r, i) => (
                <ResourceItem key={i} resource={r} index={i} />
              ))}
            </div>
          )}

        </motion.div>
      </motion.div>
    </div>
  )
}
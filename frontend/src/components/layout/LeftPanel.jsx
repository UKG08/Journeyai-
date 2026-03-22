// ─────────────────────────────────────────────────────
// LeftPanel.jsx
// Sticky left panel — always visible while scrolling
// Shows: Journey logo, profile summary, top skills
// Reacts to scroll — highlights current section
// ─────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C }                   from '../../utils/colors'
import { useActiveSection }    from '../../hooks/useInView'
import { useAutoCountUp }      from '../../hooks/useCountUp'
import { css }                 from '../../animations/transitions'

const SECTION_IDS = [
  'act1', 'act2-insights', 'act2-skills',
  'act3-graph', 'act3-resume',
  'act4-nextstep', 'act4-roadmap',
  'act5-portfolio', 'act5-jobmatch',
  'completion'
]

const SECTION_LABELS = {
  'act1':           'Overview',
  'act2-insights':  'Insights',
  'act2-skills':    'Skills',
  'act3-graph':     'Skill map',
  'act3-resume':    'Resume',
  'act4-nextstep':  'Next step',
  'act4-roadmap':   'Roadmap',
  'act5-portfolio': 'Portfolio',
  'act5-jobmatch':  'Job match',
  'completion':     'Summary',
}

export default function LeftPanel({ data }) {
  const activeId   = useActiveSection(SECTION_IDS)
  const scoreCount = useAutoCountUp(data?.score || 0, 1500)

  const strongSkills = (data?.skills || [])
    .filter(s => s.level === 'strong')
    .slice(0, 4)

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      height:         '100%',
      gap:            '0',
    }}>

      {/* logo */}
      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         '8px',
        marginBottom: '32px',
        padding:     '8px 0',
      }}>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ color: C.amber, fontSize: '18px', display: 'block' }}
        >
          ◎
        </motion.span>
        <span style={{
          fontSize:      '15px',
          fontWeight:    '600',
          color:         C.text,
          letterSpacing: '0.05em',
        }}>
          Journey
        </span>
      </div>

      {/* profile mini card */}
      <div style={{
        background:   C.amberGlowSm,
        border:       `1px solid ${C.amberBorder}`,
        borderRadius: '12px',
        padding:      '14px',
        marginBottom: '24px',
      }}>
        <p style={{
          fontSize:      '10px',
          fontWeight:    '600',
          color:         C.amber,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom:  '8px',
        }}>
          Your profile
        </p>

        {/* level badge */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '8px',
          marginBottom: '10px',
        }}>
          <div style={{
            width:        '8px',
            height:       '8px',
            borderRadius: '50%',
            background:   C.teal,
            boxShadow:    `0 0 6px ${C.teal}`,
          }} />
          <p style={{ fontSize: '13px', fontWeight: '600', color: C.text }}>
            {data?.level || 'Unknown'}
          </p>
        </div>

        {/* mini readiness ring */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '10px',
          marginBottom:   '10px',
        }}>
          <MiniRing score={data?.score || 0} />
          <div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: C.scoreColor(data?.score || 0) }}>
              {scoreCount}%
            </p>
            <p style={{ fontSize: '10px', color: C.textMuted }}>of the way there</p>
          </div>
        </div>

        {/* top skills */}
        {strongSkills.length > 0 && (
          <div>
            <p style={{
              fontSize:      '10px',
              color:         C.textMuted,
              marginBottom:  '6px',
              letterSpacing: '0.08em',
            }}>
              TOP SKILLS
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {strongSkills.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                  style={{
                    fontSize:     '10px',
                    color:        C.skillStrong.text,
                    background:   C.skillStrong.bg,
                    border:       `1px solid ${C.skillStrong.border}`,
                    borderRadius: '4px',
                    padding:      '2px 7px',
                  }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* section navigation */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize:      '10px',
          fontWeight:    '600',
          color:         C.textMuted,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom:  '12px',
          paddingLeft:   '8px',
        }}>
          Sections
        </p>

        <div style={{ position: 'relative' }}>
          {/* vertical progress line */}
          <div style={{
            position:   'absolute',
            left:       '7px',
            top:        '6px',
            bottom:     '6px',
            width:      '1px',
            background: C.border,
          }} />

          {SECTION_IDS.map((id, i) => {
            const isActive = activeId === id
            const isPast   = SECTION_IDS.indexOf(activeId) > i

            return (
              <motion.div
                key={id}
                onClick={() => scrollTo(id)}
                animate={{
                  opacity: isPast ? 0.5 : 1,
                }}
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         '10px',
                  padding:     '5px 8px',
                  cursor:      'pointer',
                  borderRadius: '6px',
                  transition:  css.normal,
                  background:  isActive ? C.amberGlowSm : 'transparent',
                }}
              >
                {/* dot */}
                <motion.div
                  animate={{
                    width:      isActive ? '10px' : '6px',
                    height:     isActive ? '10px' : '6px',
                    background: isActive ? C.amber : isPast ? C.amberDim : C.border,
                    boxShadow:  isActive ? `0 0 8px ${C.amber}` : 'none',
                  }}
                  style={{
                    borderRadius: '50%',
                    flexShrink:   0,
                    zIndex:       1,
                    transition:   css.fast,
                  }}
                />

                {/* label */}
                <motion.span
                  animate={{
                    color:      isActive ? C.amber : isPast ? C.textMuted : C.textDim,
                    fontWeight: isActive ? '600' : '400',
                  }}
                  style={{
                    fontSize:   '12px',
                    transition: css.fast,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {SECTION_LABELS[id]}
                </motion.span>

                {/* active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{   opacity: 0, scale: 0 }}
                      style={{
                        width:        '4px',
                        height:       '4px',
                        borderRadius: '50%',
                        background:   C.amber,
                        marginLeft:   'auto',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* bottom — new journey button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{  scale: 0.97 }}
        style={{
          marginTop:    '24px',
          background:   'transparent',
          border:       `1px solid ${C.border}`,
          borderRadius: '8px',
          padding:      '10px',
          color:        C.textMuted,
          fontSize:     '12px',
          cursor:       'pointer',
          width:        '100%',
          transition:   css.fast,
        }}
      >
        ← New journey
      </motion.button>

    </div>
  )
}

// ── MINI RING ─────────────────────────────────────────
function MiniRing({ score }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx  = canvas.getContext('2d')
    const SIZE = 44
    const dpr  = window.devicePixelRatio || 1

    canvas.width  = SIZE * dpr
    canvas.height = SIZE * dpr
    canvas.style.width  = `${SIZE}px`
    canvas.style.height = `${SIZE}px`
    ctx.scale(dpr, dpr)

    const cx    = SIZE / 2
    const cy    = SIZE / 2
    const r     = SIZE / 2 - 5
    const color = score >= 70 ? C.teal : score >= 50 ? C.amber : C.red

    let progress = 0
    let raf

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // background ring
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = C.border
      ctx.lineWidth   = 3
      ctx.stroke()

      // progress arc
      ctx.save()
      ctx.shadowBlur  = 8
      ctx.shadowColor = color
      ctx.beginPath()
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress)
      ctx.strokeStyle = color
      ctx.lineWidth   = 3
      ctx.lineCap     = 'round'
      ctx.stroke()
      ctx.restore()

      if (progress < score / 100) {
        progress += 0.015
        raf = requestAnimationFrame(draw)
      }
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [score])

  return <canvas ref={canvasRef} style={{ flexShrink: 0 }} />
}
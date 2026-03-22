import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence }     from 'framer-motion'
import { C }                           from '../../utils/colors'
import { css }                         from '../../animations/transitions'

export default function RoadMap3D({ roadmap = [], title, totalTime }) {
  const containerRef              = useRef(null)
  const [camProgress, setCamProgress] = useState(0)
  const [hoveredStep, setHoveredStep] = useState(null)
  const currentIdx = roadmap.findIndex(s => s.is_current)

  useEffect(() => {
    function onScroll() {
      const el = containerRef.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const winH  = window.innerHeight
      const start = winH
      const end   = -rect.height
      const prog  = 1 - (rect.top - end) / (start - end)
      setCamProgress(Math.max(0, Math.min(1, prog)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cameraZ = camProgress * 180

  return (
    <div ref={containerRef} style={{ padding: '24px 0' }}>

      {/* header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'flex-start',
        marginBottom:   '32px',
      }}>
        <div>
          <p style={{
            fontSize:      '9px',
            fontWeight:    '600',
            color:         C.amber,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom:  '6px',
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
            Your roadmap
          </p>
          <p style={{ fontSize: '17px', fontWeight: '600', color: C.text }}>
            {title || 'Your path forward'}
          </p>
        </div>
        {totalTime && (
          <span style={{
            fontSize:     '11px',
            color:        C.amber,
            background:   C.amberGlowSm,
            border:       `1px solid ${C.amberBorder}`,
            padding:      '5px 12px',
            borderRadius: '20px',
            whiteSpace:   'nowrap',
          }}>
            {totalTime}
          </span>
        )}
      </div>

      {/* 3D road container */}
      <div style={{
        perspective:       '900px',
        perspectiveOrigin: '50% 0%',
        overflow:          'hidden',
        position:          'relative',
        minHeight:         `${roadmap.length * 150 + 100}px`,
      }}>
        <div style={{
          position:        'relative',
          transformStyle:  'preserve-3d',
          transform:       `translateZ(${cameraZ}px) rotateX(10deg)`,
          transformOrigin: '50% 0%',
          willChange:      'transform',
        }}>

          {/* center road line */}
          <div style={{
            position:   'absolute',
            left:       '50%',
            top:        0,
            width:      '2px',
            height:     `${roadmap.length * 150}px`,
            background: `linear-gradient(to bottom, ${C.amber}88, ${C.amber}11)`,
            transform:  'translateX(-50%)',
          }} />

          {roadmap.map((step, i) => {
            const isCurrent = step.is_current
            const isPast    = i < currentIdx
            const isHovered = hoveredStep === i
            const side      = i % 2 === 0 ? -1 : 1
            const depth     = i / Math.max(roadmap.length - 1, 1)
            const scale     = isCurrent ? 1 : Math.max(0.6, 1 - depth * 0.4)
            const opacity   = isCurrent ? 1 : Math.max(0.35, 1 - depth * 0.55)
            const xOffset   = side * (isCurrent ? 190 : 165)
            const yOffset   = i * 150

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: side * 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay:    i * 0.1,
                  duration: 0.6,
                  ease:     [0.22, 1, 0.36, 1],
                }}
                onHoverStart={() => setHoveredStep(i)}
                onHoverEnd={()  => setHoveredStep(null)}
                style={{
                  position:        'absolute',
                  top:             `${yOffset}px`,
                  left:            `calc(50% + ${xOffset}px)`,
                  width:           '210px',
                  marginLeft:      side > 0 ? 0 : '-210px',
                  transform:       `scale(${scale})`,
                  transformOrigin: side > 0 ? 'left center' : 'right center',
                  opacity,
                  zIndex:          roadmap.length - i,
                  cursor:          'pointer',
                }}
              >
                {/* connector line to center */}
                <div style={{
                  position:   'absolute',
                  top:        '50%',
                  [side > 0 ? 'right' : 'left']: '100%',
                  width:      `${Math.abs(xOffset) - 100}px`,
                  height:     '1px',
                  background: isCurrent
                    ? `linear-gradient(${side > 0 ? 'to right' : 'to left'}, transparent, ${C.amber})`
                    : `linear-gradient(${side > 0 ? 'to right' : 'to left'}, transparent, ${C.border})`,
                  transform:  'translateY(-50%)',
                }} />

                {/* waypoint dot */}
                <div style={{
                  position:  'absolute',
                  top:       '50%',
                  [side > 0 ? 'right' : 'left']: `${Math.abs(xOffset) - 105}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex:    2,
                }}>
                  {isCurrent ? (
                    <div style={{ position: 'relative', width: '16px', height: '16px' }}>
                      {[0, 1, 2].map(ring => (
                        <motion.div
                          key={ring}
                          animate={{
                            scale:   [1, 2.4 + ring * 0.4],
                            opacity: [0.6, 0],
                          }}
                          transition={{
                            duration: 1.8,
                            repeat:   Infinity,
                            delay:    ring * 0.4,
                            ease:     'easeOut',
                          }}
                          style={{
                            position:     'absolute',
                            inset:        0,
                            borderRadius: '50%',
                            border:       `1px solid ${C.amber}`,
                          }}
                        />
                      ))}
                      <div style={{
                        position:     'absolute',
                        inset:        '3px',
                        borderRadius: '50%',
                        background:   C.amber,
                        boxShadow:    `0 0 10px ${C.amber}`,
                      }} />
                    </div>
                  ) : (
                    <motion.div
                      animate={!isPast ? {
                        boxShadow: [
                          `0 0 0px ${C.border}`,
                          `0 0 6px ${C.amber}44`,
                          `0 0 0px ${C.border}`,
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                      style={{
                        width:        '10px',
                        height:       '10px',
                        borderRadius: '50%',
                        background:   isPast ? C.amberDim : '#1e2a3a',
                        border:       `1px solid ${isPast ? C.amber : C.border}`,
                      }}
                    />
                  )}
                </div>

                {/* step card */}
                <motion.div
                  animate={{
                    borderColor: isHovered
                      ? C.amberBorder
                      : isCurrent
                      ? `${C.amber}44`
                      : C.border,
                    boxShadow: isHovered
                      ? `0 0 30px ${C.amberGlow}`
                      : isCurrent
                      ? `0 0 20px ${C.amberGlowSm}`
                      : 'none',
                  }}
                  style={{
                    background:   C.card,
                    border:       '1px solid',
                    borderRadius: '12px',
                    padding:      isCurrent ? '18px' : '12px 14px',
                    transition:   css.normal,
                  }}
                >
                  {/* step number + NOW badge */}
                  <p style={{
                    fontSize:      '9px',
                    fontWeight:    '600',
                    color:         isCurrent ? C.amber : C.textDim,
                    letterSpacing: '0.1em',
                    marginBottom:  '6px',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '6px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                    {isCurrent && (
                      <span style={{
                        background:   C.amber,
                        color:        '#080c14',
                        padding:      '1px 6px',
                        borderRadius: '10px',
                        fontSize:     '8px',
                        fontWeight:   '700',
                      }}>
                        NOW
                      </span>
                    )}
                  </p>

                  {/* step title */}
                  <p style={{
                    fontSize:     isCurrent ? '14px' : '12px',
                    fontWeight:   '600',
                    color:        isCurrent ? C.text : C.textMuted,
                    lineHeight:   '1.3',
                    marginBottom: '6px',
                  }}>
                    {step.step}
                  </p>

                  {/* time */}
                  {step.time && (
                    <span style={{
                      fontSize:     '10px',
                      color:        C.textMuted,
                      background:   'rgba(30,42,58,0.6)',
                      padding:      '2px 8px',
                      borderRadius: '10px',
                      display:      'inline-block',
                      marginBottom: isHovered || isCurrent ? '10px' : 0,
                    }}>
                      {step.time}
                    </span>
                  )}

                  {/* expanded on hover or current */}
                  <AnimatePresence>
                    {(isHovered || isCurrent) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{   opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {step.why_now && (
                          <p style={{
                            fontSize:     '11px',
                            color:        C.textMuted,
                            lineHeight:   '1.6',
                            marginBottom: '8px',
                          }}>
                            {step.why_now}
                          </p>
                        )}

                        {step.what_to_learn?.length > 0 && (
                          <div style={{
                            display:      'flex',
                            flexWrap:     'wrap',
                            gap:          '4px',
                            marginBottom: '8px',
                          }}>
                            {step.what_to_learn.slice(0, 4).map((topic, j) => (
                              <motion.span
                                key={j}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: j * 0.04, type: 'spring', stiffness: 300 }}
                                style={{
                                  fontSize:     '9px',
                                  color:        C.textMuted,
                                  background:   'rgba(30,42,58,0.6)',
                                  border:       `1px solid ${C.border}`,
                                  borderRadius: '4px',
                                  padding:      '2px 6px',
                                }}
                              >
                                {topic}
                              </motion.span>
                            ))}
                          </div>
                        )}

                        {step.milestone && (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <span style={{ color: C.teal, fontSize: '11px' }}>→</span>
                            <p style={{
                              fontSize:   '11px',
                              color:      C.teal,
                              fontWeight: '500',
                              lineHeight: '1.4',
                            }}>
                              {step.milestone}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}

          {/* spacer */}
          <div style={{ height: `${roadmap.length * 150 + 80}px` }} />
        </div>

        {/* horizon fade */}
        <div style={{
          position:      'absolute',
          bottom:        0,
          left:          0,
          right:         0,
          height:        '100px',
          background:    `linear-gradient(to top, ${C.bg}, transparent)`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* bottom stats */}
      <div style={{
        display:        'flex',
        justifyContent: 'center',
        gap:            '32px',
        marginTop:      '24px',
        paddingTop:     '16px',
        borderTop:      `1px solid ${C.border}`,
      }}>
        <StatPill
          value={`${currentIdx + 1} of ${roadmap.length}`}
          label="Current step"
          color={C.amber}
        />
        <StatPill
          value={`${roadmap.length - currentIdx - 1} left`}
          label="Remaining"
          color={C.textMuted}
        />
        {totalTime && (
          <StatPill
            value={totalTime}
            label="Total time"
            color={C.teal}
          />
        )}
      </div>
    </div>
  )
}

function StatPill({ value, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '14px', fontWeight: '600', color }}>{value}</p>
      <p style={{ fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>{label}</p>
    </div>
  )
}
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence }     from 'framer-motion'
import { C }                           from '../../utils/colors'
import { css }                         from '../../animations/transitions'
import useInView                       from '../../hooks/useInView'

export default function RoadMap3D({ roadmap = [], title, totalTime }) {
  const currentIdx = roadmap.findIndex(s => s.is_current)

  return (
    <div style={{ padding: '8px 0' }}>

      {/* header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   '36px',
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
            padding:      '5px 14px',
            borderRadius: '20px',
          }}>
            {totalTime}
          </span>
        )}
      </div>

      {/* steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {roadmap.map((step, i) => (
          <RoadmapStep
            key={i}
            step={step}
            index={i}
            total={roadmap.length}
            currentIdx={currentIdx}
          />
        ))}
      </div>

      {/* bottom stats */}
      <div style={{
        display:        'flex',
        justifyContent: 'center',
        gap:            '32px',
        marginTop:      '32px',
        paddingTop:     '20px',
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
          <StatPill value={totalTime} label="Total time" color={C.teal} />
        )}
      </div>
    </div>
  )
}

// ── SINGLE ROADMAP STEP ───────────────────────────────
function RoadmapStep({ step, index, total, currentIdx }) {
  const { ref, inView }   = useInView(0.2)
  const [open, setOpen]   = useState(step.is_current)
  const isCurrent         = step.is_current
  const isPast            = index < currentIdx
  const isFuture          = index > currentIdx
  const isLast            = index === total - 1

  const dotColor = isCurrent
    ? C.amber
    : isPast
    ? C.amberDim
    : C.border

  const lineColor = isPast || isCurrent
    ? C.amber
    : C.border

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay:    index * 0.1,
        duration: 0.5,
        ease:     [0.22, 1, 0.36, 1],
      }}
      style={{ display: 'flex', gap: '0', position: 'relative' }}
    >
      {/* left column — dot + line */}
      <div style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        width:         '40px',
        flexShrink:    0,
      }}>

        {/* dot */}
        <div style={{ position: 'relative', marginTop: '18px' }}>
          {isCurrent ? (
            <>
              {/* pulse rings */}
              {[0, 1].map(r => (
                <motion.div
                  key={r}
                  animate={{
                    scale:   [1, 2.2 + r * 0.4],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat:   Infinity,
                    delay:    r * 0.5,
                    ease:     'easeOut',
                  }}
                  style={{
                    position:     'absolute',
                    inset:        '-2px',
                    borderRadius: '50%',
                    border:       `1px solid ${C.amber}`,
                    pointerEvents:'none',
                  }}
                />
              ))}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 0px ${C.amber}`,
                    `0 0 16px ${C.amber}`,
                    `0 0 0px ${C.amber}`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width:        '14px',
                  height:       '14px',
                  borderRadius: '50%',
                  background:   C.amber,
                  position:     'relative',
                  zIndex:       1,
                }}
              />
            </>
          ) : (
            <div style={{
              width:        '10px',
              height:       '10px',
              borderRadius: '50%',
              background:   isPast ? C.amberDim : 'transparent',
              border:       `2px solid ${dotColor}`,
              position:     'relative',
              zIndex:       1,
            }} />
          )}
        </div>

        {/* line below dot */}
        {!isLast && (
          <div style={{
            flex:         1,
            width:        '2px',
            marginTop:    '6px',
            minHeight:    '40px',
            background:   isPast
              ? C.amber
              : `linear-gradient(to bottom, ${C.border}, ${C.border})`,
            position:     'relative',
            overflow:     'hidden',
          }}>
            {/* animated fill for current */}
            {isCurrent && (
              <motion.div
                initial={{ height: 0 }}
                animate={inView ? { height: '100%' } : {}}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                style={{
                  width:      '100%',
                  background: `linear-gradient(to bottom, ${C.amber}, ${C.border})`,
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* right column — card content */}
      <div style={{
        flex:           1,
        paddingBottom:  isLast ? '0' : '24px',
        paddingLeft:    '16px',
        minWidth:       0,
      }}>

        {/* clickable header */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '10px',
            cursor:     'pointer',
            paddingTop: '12px',
          }}
        >
          {/* step number */}
          <span style={{
            fontSize:      '9px',
            fontWeight:    '700',
            color:         isCurrent ? C.amber : C.textDim,
            fontFamily:    'monospace',
            letterSpacing: '0.1em',
            flexShrink:    0,
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* title */}
          <p style={{
            fontSize:   isCurrent ? '15px' : '13px',
            fontWeight: isCurrent ? '700' : '500',
            color:      isCurrent ? C.text : isPast ? C.textMuted : C.textDim,
            flex:       1,
            lineHeight: '1.3',
          }}>
            {step.step}
          </p>

          {/* badges */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {isCurrent && (
              <span style={{
                fontSize:     '8px',
                fontWeight:   '700',
                background:   C.amber,
                color:        '#080c14',
                padding:      '2px 8px',
                borderRadius: '10px',
              }}>
                NOW
              </span>
            )}
            {step.time && (
              <span style={{
                fontSize:     '9px',
                color:        C.textMuted,
                background:   'rgba(30,42,58,0.6)',
                border:       `1px solid ${C.border}`,
                padding:      '2px 8px',
                borderRadius: '10px',
              }}>
                {step.time}
              </span>
            )}
            {/* expand arrow */}
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                color:    C.textMuted,
                fontSize: '10px',
                display:  'flex',
                alignItems:'center',
              }}
            >
              ↓
            </motion.span>
          </div>
        </div>

        {/* expanded content */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{   opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                background:   isCurrent
                  ? `linear-gradient(135deg, ${C.amberGlowSm}, rgba(15,21,32,0.6))`
                  : 'rgba(15,21,32,0.4)',
                border:       `1px solid ${isCurrent ? C.amberBorder : C.border}`,
                borderRadius: '10px',
                padding:      '14px',
                marginTop:    '10px',
              }}>

                {step.why_now && (
                  <p style={{
                    fontSize:     '12px',
                    color:        C.textMuted,
                    lineHeight:   '1.7',
                    marginBottom: step.what_to_learn?.length ? '12px' : 0,
                  }}>
                    {step.why_now}
                  </p>
                )}

                {step.what_to_learn?.length > 0 && (
                  <div style={{
                    display:      'flex',
                    flexWrap:     'wrap',
                    gap:          '5px',
                    marginBottom: step.milestone ? '12px' : 0,
                  }}>
                    {step.what_to_learn.map((topic, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: j * 0.04, type: 'spring', stiffness: 300 }}
                        style={{
                          fontSize:     '10px',
                          color:        isCurrent ? C.amber : C.textMuted,
                          background:   isCurrent ? C.amberGlowSm : 'rgba(30,42,58,0.6)',
                          border:       `1px solid ${isCurrent ? C.amberBorder : C.border}`,
                          borderRadius: '5px',
                          padding:      '3px 8px',
                        }}
                      >
                        {topic}
                      </motion.span>
                    ))}
                  </div>
                )}

                {step.milestone && (
                  <div style={{
                    display:    'flex',
                    gap:        '8px',
                    alignItems: 'flex-start',
                    marginTop:  step.why_now || step.what_to_learn?.length ? '10px' : 0,
                    paddingTop: step.why_now || step.what_to_learn?.length ? '10px' : 0,
                    borderTop:  step.why_now || step.what_to_learn?.length
                      ? `1px solid ${C.border}`
                      : 'none',
                  }}>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ color: C.teal, fontSize: '12px', flexShrink: 0, marginTop: '1px' }}
                    >
                      →
                    </motion.span>
                    <p style={{
                      fontSize:   '12px',
                      color:      C.teal,
                      fontWeight: '600',
                      lineHeight: '1.4',
                    }}>
                      {step.milestone}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── STAT PILL ─────────────────────────────────────────
function StatPill({ value, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '14px', fontWeight: '600', color }}>{value}</p>
      <p style={{ fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>{label}</p>
    </div>
  )
}
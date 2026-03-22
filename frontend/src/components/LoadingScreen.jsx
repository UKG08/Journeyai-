import { useState, useEffect }     from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C }                       from '../utils/colors'

const STEPS = [
  { label: 'Reading your story...',      icon: '◎' },
  { label: 'Mapping your skills...',     icon: '◈' },
  { label: 'Reviewing your resume...',   icon: '◐' },
  { label: 'Finding your next step...',  icon: '→' },
  { label: 'Drawing your roadmap...',    icon: '◉' },
  { label: 'Scoring your portfolio...',  icon: '⬡' },
  { label: 'Final analysis...',          icon: '◎' },
]

const QUOTES = [
  '"A journey of a thousand miles begins with a single step."',
  '"The secret of getting ahead is getting started."',
  '"You don\'t have to see the whole staircase, just the first step."',
  '"Every expert was once a beginner."',
  '"The road to success is always under construction."',
]

export default function LoadingScreen() {
  const [currentStep,    setCurrentStep]    = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [quoteIndex,     setQuoteIndex]     = useState(0)

  useEffect(() => {
    let step = 0
    const interval = setInterval(() => {
      if (step < STEPS.length - 1) {
        setCompletedSteps(prev => [...prev, step])
        step++
        setCurrentStep(step)
      }
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{   opacity: 0 }}
      style={{
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '40px',
        position:       'relative',
        overflow:       'hidden',
        background:     C.bg,
      }}
    >
      {/* background grid */}
      <div style={{
        position:        'fixed',
        inset:           0,
        backgroundImage: `
          linear-gradient(rgba(245,158,11,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,158,11,0.02) 1px, transparent 1px)
        `,
        backgroundSize:  '56px 56px',
        pointerEvents:   'none',
      }} />

      {/* ripple background */}
      <div style={{
        position:           'fixed',
        inset:              0,
        backgroundImage:    `repeating-radial-gradient(
          circle at 50% 50%,
          transparent 0px,
          transparent 40px,
          rgba(245,158,11,0.025) 40px,
          rgba(245,158,11,0.025) 41px
        )`,
        pointerEvents:      'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}>

        {/* title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          style={{ textAlign: 'center', marginBottom: '52px' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '40px', display: 'inline-block', marginBottom: '16px' }}
          >
            ◎
          </motion.div>
          <p style={{
            fontSize:     '22px',
            fontWeight:   '700',
            color:        C.text,
            marginBottom: '6px',
          }}>
            Charting your path...
          </p>
          <p style={{ fontSize: '13px', color: C.textMuted }}>
            This takes about 20 seconds
          </p>
        </motion.div>

        {/* steps */}
        <div style={{ marginBottom: '52px' }}>
          {STEPS.map((s, i) => {
            const isDone    = completedSteps.includes(i)
            const isCurrent = currentStep === i
            const isPending = i > currentStep

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '14px',
                  padding:      '11px 0',
                  borderBottom: i < STEPS.length - 1
                    ? `1px solid rgba(30,42,58,0.4)`
                    : 'none',
                }}
              >
                {/* status icon */}
                <div style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{
                        width:          '32px',
                        height:         '32px',
                        borderRadius:   '50%',
                        background:     C.tealGlow,
                        border:         `1px solid ${C.tealBorder}`,
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        color:          C.teal,
                        fontSize:       '14px',
                      }}
                    >
                      ✓
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      style={{
                        width:          '32px',
                        height:         '32px',
                        borderRadius:   '50%',
                        background:     C.amberGlowSm,
                        border:         `1px solid ${C.amberBorder}`,
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        color:          C.amber,
                        fontSize:       '14px',
                      }}
                    >
                      {s.icon}
                    </motion.div>
                  ) : (
                    <div style={{
                      width:          '32px',
                      height:         '32px',
                      borderRadius:   '50%',
                      background:     'rgba(30,42,58,0.4)',
                      border:         `1px solid ${C.border}`,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      color:          C.textMuted,
                      fontSize:       '14px',
                    }}>
                      {s.icon}
                    </div>
                  )}
                </div>

                {/* label */}
                <p style={{
                  fontSize:   '14px',
                  color:      isDone ? C.teal : isCurrent ? C.text : C.textMuted,
                  fontWeight: isCurrent ? '600' : '400',
                  flex:       1,
                }}>
                  {s.label}
                </p>

                {/* progress bar on current step */}
                {isCurrent && (
                  <div style={{
                    width:        '56px',
                    height:       '3px',
                    background:   C.border,
                    borderRadius: '2px',
                    overflow:     'hidden',
                  }}>
                    <motion.div
                      initial={{ width: '0%'   }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.4, ease: 'linear' }}
                      style={{
                        height:       '100%',
                        background:   C.amber,
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* rotating quote */}
        <div style={{ textAlign: 'center', minHeight: '52px' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 8  }}
              animate={{ opacity: 1, y: 0  }}
              exit={{   opacity: 0, y: -8  }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize:   '12px',
                color:      C.textMuted,
                fontStyle:  'italic',
                lineHeight: '1.7',
                padding:    '0 16px',
              }}
            >
              {QUOTES[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  )
}
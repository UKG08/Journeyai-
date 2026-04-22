// ─────────────────────────────────────────────────────
// PortfolioCard.jsx — RESPONSIVE
// Act 5a — The Verdict — Portfolio score
// ─────────────────────────────────────────────────────

import { useState, useEffect }     from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { C }                       from '../../utils/colors'
import { css }                     from '../../animations/transitions'
import useInView                   from '../../hooks/useInView'
import { useSlotMachine }          from '../../hooks/useCountUp'
import useTilt, { tiltIntensity }  from '../../hooks/useTilt'
import RadarChart                  from '../visual/RadarChart'
import useBreakpoint               from '../../hooks/useBreakpoint'

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: '9px', fontWeight: '600', letterSpacing: '0.15em',
      color: C.amber, textTransform: 'uppercase', marginBottom: '16px',
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      <span style={{ display: 'inline-block', width: '14px', height: '1px', background: C.amber }} />
      {children}
    </p>
  )
}

function AnimBar({ value, max = 10, color, delay = 0 }) {
  const { ref, inView } = useInView(0.3)
  const pct             = Math.round((value / max) * 100)

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '6px', background: 'rgba(30,42,58,0.8)', borderRadius: '3px', overflow: 'hidden' }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
        style={{ height: '100%', background: color, borderRadius: '3px', boxShadow: `0 0 8px ${color}88` }}
      />
    </div>
  )
}

function GradeBadge({ grade, inView }) {
  const colors = C.gradeColor(grade)
  return (
    <motion.div
      initial={{ rotateY: -90, opacity: 0 }}
      animate={inView ? { rotateY: 0, opacity: 1 } : {}}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '400px' }}
    >
      <div style={{
        fontSize: '32px', fontWeight: '700', color: colors.text,
        background: colors.bg, border: `1px solid ${colors.border}`,
        borderRadius: '10px', padding: '10px 18px', fontFamily: 'monospace',
      }}>
        {grade}
      </div>
    </motion.div>
  )
}

function StrongestProject({ text }) {
  const { ref, inView } = useInView(0.3)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{
        background: 'rgba(20,184,166,0.06)', border: `1px solid ${C.tealBorder}`,
        borderRadius: '10px', padding: '14px', marginBottom: '10px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(90deg, transparent, ${C.amberGlowSm}, transparent)`,
          pointerEvents: 'none',
        }}
      />
      <p style={{ fontSize: '9px', fontWeight: '600', color: C.teal, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
        Strongest project
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <span style={{ color: C.teal, fontSize: '11px', marginTop: '2px' }}>→</span>
        <p style={{ fontSize: '13px', color: C.text, lineHeight: '1.5' }}>{text}</p>
      </div>
    </motion.div>
  )
}

export default function PortfolioCard({ data }) {
  const portfolio           = data?.portfolio || {}
  const [opened, setOpened] = useState(false)
  const { ref, inView }     = useInView(0.15)
  const { isMobile }        = useBreakpoint()

  const { display: scoreDisplay, settled, start } = useSlotMachine(
    portfolio.score || 0,
    { scrambleDuration: 1000, delay: 800 }
  )

  useEffect(() => {
    if (inView) {
      setTimeout(() => setOpened(true), 200)
      start()
    }
  }, [inView])

  if (!portfolio.score) return null

  const scoreColor = C.scoreColor(portfolio.score)
  // Radar shrinks on mobile to avoid overflow
  const radarSize  = isMobile ? 180 : 240

  return (
    <div id="act5-portfolio" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        <p style={{ fontSize: '9px', fontWeight: '600', color: C.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          ◈ — Act V — The Verdict — ◈
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 0.4, 0.1, 0.8, 0.5, 1] } : {}}
        transition={{ duration: 0.8, times: [0, 0.2, 0.35, 0.5, 0.7, 1] }}
        style={{
          background: C.card, border: `1px solid ${C.amberBorder}`,
          borderRadius: '16px', padding: isMobile ? '16px' : '24px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 6, ease: 'linear' }}
          style={{
            position: 'absolute', left: 0, right: 0, height: '40px',
            background: `linear-gradient(to bottom, transparent, ${C.amberGlowSm}, transparent)`,
            pointerEvents: 'none', zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <SectionLabel>Portfolio score</SectionLabel>

          {/* score + grade — wrap on mobile */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div>
              <motion.p
                animate={settled ? {
                  textShadow: [`0 0 0px ${scoreColor}`, `0 0 20px ${scoreColor}`, `0 0 0px ${scoreColor}`],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: isMobile ? '40px' : '52px', fontWeight: '700', color: scoreColor, lineHeight: '1', fontFamily: 'monospace' }}
              >
                {scoreDisplay}
                <span style={{ fontSize: '20px', color: C.textMuted }}>/100</span>
              </motion.p>
            </div>
            {portfolio.grade && <GradeBadge grade={portfolio.grade} inView={inView} />}
            <div style={{ flex: 1, minWidth: '120px' }}>
              <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6' }}>{portfolio.summary}</p>
            </div>
          </div>

          {/* radar + bars — stack on mobile */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '24px', marginBottom: '20px',
          }}>
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <RadarChart breakdown={portfolio.breakdown || []} size={radarSize} />
            </motion.div>

            <div>
              {portfolio.breakdown?.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  style={{ marginBottom: '12px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '11px', color: C.textMuted }}>{item.category}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: '600', fontFamily: 'monospace',
                      color: item.score >= 7 ? C.teal : item.score >= 5 ? C.amber : C.red,
                    }}>
                      {item.score}/10
                    </span>
                  </div>
                  <AnimBar
                    value={item.score} max={10}
                    color={item.score >= 7 ? C.teal : item.score >= 5 ? C.amber : C.red}
                    delay={0.4 + i * 0.08}
                  />
                  {item.comment && (
                    <p style={{ fontSize: '10px', color: C.textDim, marginTop: '3px', lineHeight: '1.4' }}>
                      {item.comment}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {portfolio.strongest_project && <StrongestProject text={portfolio.strongest_project} />}

          {portfolio.missing_projects?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                background: C.redGlowSm, border: `1px solid ${C.redBorder}`,
                borderRadius: '10px', padding: '14px',
              }}
            >
              <p style={{ fontSize: '9px', fontWeight: '600', color: C.red, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Build these next
              </p>
              {portfolio.missing_projects.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ color: C.red, fontSize: '11px', marginTop: '2px' }}>•</span>
                  <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.5' }}>
                    {typeof p === 'string' ? p : ''}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
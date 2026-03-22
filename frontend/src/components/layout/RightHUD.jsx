// ─────────────────────────────────────────────────────
// RightHUD.jsx
// Sticky right panel — live stats dashboard
// Shows: readiness ring, skill counts, portfolio score
// roadmap position, job match if available
// All numbers animate on mount
// Feels like a fighter jet cockpit HUD
// ─────────────────────────────────────────────────────

import { useRef, useEffect } from 'react'
import { motion }            from 'framer-motion'
import { C }                 from '../../utils/colors'
import { useAutoCountUp }    from '../../hooks/useCountUp'
import { css }               from '../../animations/transitions'
import { glowPulseAmber }    from '../../animations/variants'

export default function RightHUD({ data }) {
  const stats    = data?.stats || {}
  const readiness = useAutoCountUp(stats.readiness     || 0, 1800)
  const portfolio = useAutoCountUp(stats.portfolioScore || 0, 2000)
  const strong    = useAutoCountUp(stats.skillsStrong   || 0, 1200)
  const missing   = useAutoCountUp(stats.skillsMissing  || 0, 1200)

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      gap:           '10px',
      height:        '100%',
      paddingTop:    '8px',
    }}>

      {/* HUD label */}
      <p style={{
        fontSize:      '10px',
        fontWeight:    '600',
        color:         C.textMuted,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom:  '4px',
      }}>
        Live stats
      </p>

      {/* readiness */}
      <HUDCard
        label="Readiness"
        color={C.scoreColor(stats.readiness || 0)}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{
            fontSize:   '32px',
            fontWeight: '700',
            color:      C.scoreColor(stats.readiness || 0),
            fontFamily: 'monospace',
          }}>
            {readiness}
          </span>
          <span style={{ fontSize: '14px', color: C.textMuted }}>%</span>
        </div>
        <AnimBar value={stats.readiness || 0} max={100} color={C.scoreColor(stats.readiness || 0)} />
      </HUDCard>

      {/* skill counts */}
      <HUDCard label="Skills">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <MiniStat value={strong}  label="Strong"  color={C.teal}  />
          <MiniStat value={missing} label="Missing" color={C.red}   />
          <MiniStat value={useAutoCountUp(stats.skillsBasic || 0, 1400)} label="Basic" color={C.amber} />
          <MiniStat value={stats.totalSkills || 0} label="Total" color={C.textMuted} />
        </div>
      </HUDCard>

      {/* portfolio score */}
      {stats.portfolioScore !== null && (
        <HUDCard
          label="Portfolio"
          color={C.scoreColor(stats.portfolioScore || 0)}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{
              fontSize:   '28px',
              fontWeight: '700',
              color:      C.scoreColor(stats.portfolioScore || 0),
              fontFamily: 'monospace',
            }}>
              {portfolio}
            </span>
            <span style={{ fontSize: '12px', color: C.textMuted }}>/100</span>
          </div>
          <AnimBar
            value={stats.portfolioScore || 0}
            max={100}
            color={C.scoreColor(stats.portfolioScore || 0)}
          />
        </HUDCard>
      )}

      {/* roadmap position */}
      {stats.roadmapSteps > 0 && (
        <HUDCard label="Roadmap">
          <p style={{ fontSize: '11px', color: C.textMuted, marginBottom: '6px' }}>
            Step {stats.currentStep} of {stats.roadmapSteps}
          </p>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: stats.roadmapSteps }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                style={{
                  flex:         1,
                  height:       '4px',
                  borderRadius: '2px',
                  background:   i < stats.currentStep ? C.amber : C.border,
                  boxShadow:    i < stats.currentStep ? `0 0 4px ${C.amber}` : 'none',
                }}
              />
            ))}
          </div>
        </HUDCard>
      )}

      {/* job match */}
      {stats.matchPercent !== null && (
        <HUDCard
          label="Job match"
          color={C.matchColor(stats.matchPercent || 0)}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{
              fontSize:   '28px',
              fontWeight: '700',
              color:      C.matchColor(stats.matchPercent || 0),
              fontFamily: 'monospace',
            }}>
              {useAutoCountUp(stats.matchPercent || 0, 2200)}
            </span>
            <span style={{ fontSize: '12px', color: C.textMuted }}>%</span>
          </div>
          <AnimBar
            value={stats.matchPercent || 0}
            max={100}
            color={C.matchColor(stats.matchPercent || 0)}
          />
        </HUDCard>
      )}

      {/* pulsing status dot */}
      <div style={{
        marginTop:   'auto',
        display:     'flex',
        alignItems:  'center',
        gap:         '6px',
        padding:     '8px 0',
      }}>
        <motion.div
          animate={{
            boxShadow: [
              `0 0 0px ${C.teal}`,
              `0 0 8px ${C.teal}`,
              `0 0 0px ${C.teal}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   C.teal,
          }}
        />
        <span style={{ fontSize: '10px', color: C.textMuted }}>
          Analysis complete
        </span>
      </div>

    </div>
  )
}

// ── HUD CARD ──────────────────────────────────────────
function HUDCard({ label, children, color }) {
  return (
    <div style={{
      background:   C.card,
      border:       `1px solid ${color ? color + '30' : C.border}`,
      borderRadius: '10px',
      padding:      '12px',
    }}>
      <p style={{
        fontSize:      '9px',
        fontWeight:    '600',
        color:         color || C.textMuted,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom:  '8px',
      }}>
        {label}
      </p>
      {children}
    </div>
  )
}

// ── MINI STAT ─────────────────────────────────────────
function MiniStat({ value, label, color }) {
  return (
    <div style={{
      background:   `${color}10`,
      border:       `1px solid ${color}25`,
      borderRadius: '6px',
      padding:      '6px 8px',
      textAlign:    'center',
    }}>
      <p style={{ fontSize: '18px', fontWeight: '700', color, fontFamily: 'monospace' }}>
        {value}
      </p>
      <p style={{ fontSize: '9px', color: C.textMuted, letterSpacing: '0.05em' }}>
        {label}
      </p>
    </div>
  )
}

// ── ANIM BAR ──────────────────────────────────────────
function AnimBar({ value, max, color }) {
  return (
    <div style={{
      width:        '100%',
      height:       '3px',
      background:   C.border,
      borderRadius: '2px',
      overflow:     'hidden',
      marginTop:    '6px',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{
          height:       '100%',
          background:   color,
          borderRadius: '2px',
          boxShadow:    `0 0 6px ${color}`,
        }}
      />
    </div>
  )
}
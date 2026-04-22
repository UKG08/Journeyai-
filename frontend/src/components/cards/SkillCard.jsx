// ─────────────────────────────────────────────────────
// SkillCard.jsx — RESPONSIVE
// Act 2b — Skills section
// ─────────────────────────────────────────────────────

import { useRef }                  from 'react'
import { motion }                  from 'framer-motion'
import { C }                       from '../../utils/colors'
import { useAutoCountUp }          from '../../hooks/useCountUp'
import useInView                   from '../../hooks/useInView'
import SkillGlobe                  from '../visual/SkillGlobe'
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

function MicroStat({ value, label, color, delay = 0 }) {
  const count           = useAutoCountUp(value, 1000, delay * 1000)
  const { ref, inView } = useInView(0.3)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.4, type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        background: `${color}10`, border: `1px solid ${color}25`,
        borderRadius: '10px', padding: '12px', textAlign: 'center', flex: 1,
        minWidth: 0,
      }}
    >
      <motion.p
        animate={{ textShadow: [`0 0 0px ${color}`, `0 0 12px ${color}`, `0 0 0px ${color}`] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
        style={{ fontSize: '28px', fontWeight: '700', color, fontFamily: 'monospace', lineHeight: '1', marginBottom: '4px' }}
      >
        {count}
      </motion.p>
      <p style={{ fontSize: '9px', color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </p>
    </motion.div>
  )
}

function SkillBadge({ skill, index }) {
  const { ref, inView } = useInView(0.1)
  const colors          = C[`skill${skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}`] || C.skillMissing

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0, rotate: -5 }}
      animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 320, damping: 20 }}
      whileHover={{ scale: 1.08, y: -2 }}
      style={{ display: 'inline-block' }}
    >
      <motion.span
        animate={skill.level === 'strong' ? {
          boxShadow: [`0 0 0px ${colors.glow}`, `0 0 10px ${colors.glow}55`, `0 0 0px ${colors.glow}`],
        } : {}}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
        style={{
          display: 'inline-block', fontSize: '12px', fontWeight: '500',
          color: colors.text, background: colors.bg, border: `1px solid ${colors.border}`,
          borderRadius: '6px', padding: '5px 12px', cursor: 'default',
        }}
      >
        {skill.name}
      </motion.span>
    </motion.div>
  )
}

export default function SkillCard({ data }) {
  const skills          = data?.skills || []
  const stats           = data?.stats  || {}
  const { ref, inView } = useInView(0.1)
  const { isMobile }    = useBreakpoint()

  const strong  = skills.filter(s => s.level === 'strong')
  const basic   = skills.filter(s => s.level === 'basic')
  const missing = skills.filter(s => s.level === 'missing')

  // Globe shrinks on mobile
  const globeSize = isMobile ? 280 : 380

  return (
    <div id="act2-skills" ref={ref}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: '16px', padding: '24px', overflow: 'hidden',
      }}>
        <SectionLabel>Skills detected</SectionLabel>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}
        >
          <SkillGlobe skills={skills} size={globeSize} />
        </motion.div>

        {/* micro stats — wrap naturally on small screens */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <MicroStat value={strong.length}  label="Strong"  color={C.teal}      delay={0}   />
          <MicroStat value={basic.length}   label="Basic"   color={C.amber}     delay={0.1} />
          <MicroStat value={missing.length} label="Missing" color={C.red}       delay={0.2} />
          <MicroStat value={skills.length}  label="Total"   color={C.textMuted} delay={0.3} />
        </div>

        {[
          { list: strong,  label: 'Strong',  color: C.teal  },
          { list: basic,   label: 'Basic',   color: C.amber },
          { list: missing, label: 'Missing', color: C.red   },
        ].map(({ list, label, color }) => {
          if (!list.length) return null
          return (
            <div key={label} style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '9px', fontWeight: '600', color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                {label}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {list.map((skill, i) => (
                  <SkillBadge key={skill.name} skill={skill} index={i} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
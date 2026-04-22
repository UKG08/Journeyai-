import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { C } from '../../utils/colors'

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ%/'

function FlipDigit({ char, delay = 0, color = C.text }) {
  const [cur, setCur] = useState('?')
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      let n = 0
      const max = 10 + Math.floor(Math.random() * 8)
      const iv = setInterval(() => {
        setFlip(true)
        setCur(CHARS[Math.floor(Math.random() * CHARS.length)])
        if (++n >= max) { clearInterval(iv); setCur(char); setFlip(false) }
      }, 60)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t)
  }, [char, delay])

  return (
    <motion.div
      animate={flip ? { rotateX: [-90, 0] } : {}}
      transition={{ duration: 0.06 }}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 'clamp(22px,6vw,28px)', height: 'clamp(32px,8vw,40px)',
        background: '#0a0f1a', border: `1px solid ${C.border}`, borderRadius: '4px',
        fontFamily: 'monospace', fontSize: 'clamp(16px,4.5vw,22px)', fontWeight: '700',
        color: flip ? C.textMuted : color, position: 'relative', overflow: 'hidden',
        boxShadow: flip ? `0 0 8px ${C.amberGlow}` : 'inset 0 2px 4px rgba(0,0,0,0.4)',
        transition: 'color 0.1s, box-shadow 0.1s',
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: 'rgba(0,0,0,0.5)', zIndex: 2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(0,0,0,0.15)', zIndex: 1 }} />
      {cur}
    </motion.div>
  )
}

function FlipString({ value, color, delay = 0 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {String(value).split('').map((c, i) => <FlipDigit key={i} char={c} color={color} delay={delay + i * 40} />)}
    </div>
  )
}

function StatItem({ label, value, unit = '', color, delay = 0, icon }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        padding: 'clamp(10px,3vw,16px) clamp(12px,3vw,20px)',
        background: 'rgba(10,15,26,0.8)', border: `1px solid ${C.border}`,
        borderTop: `2px solid ${color}`, borderRadius: '0 0 8px 8px',
        minWidth: 'clamp(100px,22vw,140px)', flex: '1 1 100px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon && <span style={{ fontSize: '12px', color }}>{icon}</span>}
        <p style={{ fontSize: 'clamp(8px,2vw,9px)', fontWeight: '600', color: C.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {label}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <FlipString value={value} color={color} delay={delay + 200} />
        {unit && <span style={{ fontSize: 'clamp(11px,3vw,14px)', color: C.textMuted, fontFamily: 'monospace', fontWeight: '600' }}>{unit}</span>}
      </div>
    </motion.div>
  )
}

export default function StatFlipBoard({ data }) {
  const s = data?.stats || {}
  const items = [
    { label: 'Skills analyzed', value: String(s.totalSkills   || 0), color: C.amber,                                     icon: '◎', delay: 0   },
    { label: 'Gaps found',      value: String(s.skillsMissing || 0), color: C.red,                                       icon: '•', delay: 150 },
    { label: 'Readiness',       value: String(s.readiness     || 0), unit: '%', color: C.scoreColor(s.readiness || 0),   icon: '◉', delay: 300 },
    {
      label: 'Portfolio',
      value: s.portfolioScore != null ? String(s.portfolioScore || 0) : '--',
      unit:  s.portfolioScore != null ? '/100' : '',
      color: s.portfolioScore != null ? C.scoreColor(s.portfolioScore || 0) : C.textMuted,
      icon: '⬡', delay: 450,
    },
  ]

  return (
    <div style={{ padding: '0 0 24px' }}>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ fontSize: 'clamp(8px,2vw,9px)', fontWeight: '600', color: C.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}
      >
        ◈ — Analysis complete — ◈
      </motion.p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', flexWrap: 'wrap' }}>
        {items.map((item, i) => <StatItem key={i} {...item} />)}
      </div>
    </div>
  )
}
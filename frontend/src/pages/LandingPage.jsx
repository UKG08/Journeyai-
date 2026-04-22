import { useEffect, useRef } from 'react'
import { motion }            from 'framer-motion'
import { C }                 from '../utils/colors'
import { css }               from '../animations/transitions'

// ── tiny responsive hook ───────────────────────────────
import { useState } from 'react'
function useBreakpoint() {
  const [w, setW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    const handler = () => setW(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return { isMobile: w < 640, isTablet: w < 1024, width: w }
}

export default function LandingPage({ onStart }) {
  const canvasRef = useRef(null)
  const { isMobile, isTablet } = useBreakpoint()

  // animated path drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    let   raf
    let   progress = 0

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const points = [
      { x: -50,                 y: canvas.height * 0.7  },
      { x: canvas.width * 0.15, y: canvas.height * 0.65 },
      { x: canvas.width * 0.3,  y: canvas.height * 0.5  },
      { x: canvas.width * 0.45, y: canvas.height * 0.6  },
      { x: canvas.width * 0.6,  y: canvas.height * 0.4  },
      { x: canvas.width * 0.75, y: canvas.height * 0.5  },
      { x: canvas.width * 0.9,  y: canvas.height * 0.3  },
      { x: canvas.width + 50,   y: canvas.height * 0.25 },
    ]

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (progress >= 1) { raf = requestAnimationFrame(draw); return }

      const total = points.length - 1
      const idx   = Math.floor(progress * total)
      const rem   = (progress * total) - idx

      ctx.setLineDash([8, 14])
      ctx.lineWidth   = 1.5
      ctx.strokeStyle = `rgba(245,158,11,0.18)`
      ctx.beginPath()

      for (let i = 0; i <= idx; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y)
        else         ctx.lineTo(points[i].x, points[i].y)
      }

      if (idx < total) {
        const c = points[idx]
        const n = points[idx + 1]
        ctx.lineTo(c.x + (n.x - c.x) * rem, c.y + (n.y - c.y) * rem)
      }
      ctx.stroke()

      points.forEach((p, i) => {
        if (i / total <= progress) {
          ctx.setLineDash([])
          ctx.beginPath()
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(245,158,11,0.5)'
          ctx.fill()
        }
      })

      progress += 0.004
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const features = [
    { icon: '◎', title: 'Skill analysis',   desc: 'Exactly what you know and what is missing'    },
    { icon: '◈', title: 'Resume review',    desc: 'Surgical feedback with rewrite examples'       },
    { icon: '→', title: 'Your next step',   desc: 'One specific action with a day by day plan'    },
    { icon: '◉', title: 'Learning roadmap', desc: 'Logical ordered path to your goal'             },
    { icon: '⬡', title: 'Portfolio score',  desc: 'Honest scoring of your projects'               },
    { icon: '◐', title: 'Mentor chat',      desc: 'Ask anything — knows your full profile'        },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{   opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      {/* path canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'absolute',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        0,
        }}
      />

      {/* grid */}
      <div style={{
        position:        'fixed',
        inset:           0,
        backgroundImage: `
          linear-gradient(rgba(245,158,11,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,158,11,0.025) 1px, transparent 1px)
        `,
        backgroundSize:  '56px 56px',
        pointerEvents:   'none',
        zIndex:          0,
      }} />

      {/* nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          position:       'relative',
          zIndex:         10,
          padding:        isMobile ? '16px 20px' : '24px 40px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          borderBottom:   `1px solid rgba(30,42,58,0.4)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ color: C.amber, fontSize: '20px' }}
          >
            ◎
          </motion.span>
          <span style={{ fontSize: '18px', fontWeight: '600', color: C.text, letterSpacing: '0.04em' }}>
            Journey
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{  scale: 0.95 }}
          onClick={onStart}
          style={{
            background:   'transparent',
            border:       `1px solid ${C.amberBorder}`,
            color:        C.amber,
            padding:      isMobile ? '7px 14px' : '8px 20px',
            borderRadius: '8px',
            fontSize:     isMobile ? '13px' : '14px',
            cursor:       'pointer',
            fontWeight:   '500',
            transition:   css.fast,
            whiteSpace:   'nowrap',
          }}
        >
          {isMobile ? 'Start →' : 'Start your journey →'}
        </motion.button>
      </motion.nav>

      {/* hero */}
      <div style={{
        position:  'relative',
        zIndex:    10,
        maxWidth:  '860px',
        margin:    '0 auto',
        padding:   isMobile ? '60px 20px 40px' : isTablet ? '80px 32px 50px' : '100px 40px 60px',
        textAlign: 'center',
      }}>

        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.3 }}
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          '8px',
            background:   C.amberGlowSm,
            border:       `1px solid ${C.amberBorder}`,
            borderRadius: '100px',
            padding:      '6px 16px',
            marginBottom: isMobile ? '28px' : '40px',
          }}
        >
          <span style={{ color: C.amber, fontSize: '12px' }}>◎</span>
          <span style={{ color: C.amber, fontSize: '13px', fontWeight: '500' }}>
            AI-powered career navigation
          </span>
        </motion.div>

        {/* headline */}
        <div style={{ marginBottom: '28px' }}>
          {['Your career', 'has a next step.', 'Find it.'].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{
                delay:    0.5 + i * 0.15,
                duration: 0.7,
                ease:     [0.22, 1, 0.36, 1],
              }}
              style={{
                fontSize:      isMobile ? '38px' : isTablet ? '50px' : '62px',
                fontWeight:    '700',
                lineHeight:    '1.1',
                color:         i === 2 ? C.amber : C.text,
                letterSpacing: '-0.02em',
                display:       'block',
              }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 1.0, duration: 0.6 }}
          style={{
            fontSize:     isMobile ? '16px' : '18px',
            color:        C.textMuted,
            lineHeight:   '1.7',
            maxWidth:     '540px',
            margin:       '0 auto 40px',
            padding:      '0 4px',
          }}
        >
          Upload your resume. Tell us where you've been.{' '}
          <span style={{ color: C.text }}>
            We'll show you exactly where to go next.
          </span>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            display:        'flex',
            gap:            '16px',
            justifyContent: 'center',
            flexWrap:       'wrap',
            flexDirection:  isMobile ? 'column' : 'row',
            alignItems:     'center',
          }}
        >
          <motion.button
            whileHover={{
              scale:     1.05,
              boxShadow: `0 0 40px ${C.amber}44`,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            style={{
              background:   C.amber,
              color:        '#080c14',
              border:       'none',
              padding:      isMobile ? '16px 32px' : '16px 40px',
              borderRadius: '12px',
              fontSize:     '16px',
              fontWeight:   '700',
              cursor:       'pointer',
              width:        isMobile ? '100%' : 'auto',
            }}
          >
            Find my next step →
          </motion.button>

          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
            color:      C.textMuted,
            fontSize:   '14px',
            padding:    '8px 0',
          }}>
            <span style={{ color: C.teal }}>◎</span>
            Free — no account needed
          </div>
        </motion.div>
      </div>

      {/* how it works */}
      <div style={{
        position: 'relative',
        zIndex:   10,
        maxWidth: '1000px',
        margin:   '0 auto',
        padding:  isMobile ? '40px 20px' : isTablet ? '50px 32px' : '60px 40px',
      }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign:     'center',
            fontSize:      '10px',
            fontWeight:    '600',
            letterSpacing: '0.15em',
            color:         C.amber,
            textTransform: 'uppercase',
            marginBottom:  '40px',
          }}
        >
          How it works
        </motion.p>

        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap:                 '8px',
        }}>
          {[
            { n: '01', title: 'Where you are',        desc: "Upload your resume and tell us what you've built lately — even things not on your resume yet." },
            { n: '02', title: 'AI maps your journey',  desc: 'Our AI reads your full story — skills, gaps, potential — and builds a complete picture.'        },
            { n: '03', title: 'Your path appears',     desc: 'Get your exact next step, a day-by-day plan, free resources, and a full roadmap to your goal.'   },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              style={{
                background:   'rgba(15,21,32,0.8)',
                border:       `1px solid ${C.border}`,
                borderRadius: '14px',
                padding:      isMobile ? '24px 20px' : '32px 24px',
                cursor:       'default',
              }}
            >
              <p style={{
                fontSize:      '10px',
                fontWeight:    '600',
                color:         C.amber,
                letterSpacing: '0.1em',
                marginBottom:  '16px',
                opacity:       0.7,
              }}>
                {item.n}
              </p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: C.text, marginBottom: '10px' }}>
                {item.title}
              </p>
              <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.7' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* what you get */}
      <div style={{
        position: 'relative',
        zIndex:   10,
        maxWidth: '1000px',
        margin:   '0 auto',
        padding:  isMobile ? '20px 20px 60px' : isTablet ? '20px 32px 70px' : '20px 40px 80px',
      }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign:     'center',
            fontSize:      '10px',
            fontWeight:    '600',
            letterSpacing: '0.15em',
            color:         C.amber,
            textTransform: 'uppercase',
            marginBottom:  '32px',
          }}
        >
          What you get
        </motion.p>

        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
          gap:                 '8px',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -2 }}
              style={{
                background:   'rgba(15,21,32,0.6)',
                border:       `1px solid ${C.border}`,
                borderRadius: '10px',
                padding:      isMobile ? '16px' : '20px',
                cursor:       'default',
              }}
            >
              <span style={{ fontSize: '18px', color: C.amber, display: 'block', marginBottom: '10px' }}>
                {f.icon}
              </span>
              <p style={{ fontSize: '13px', fontWeight: '600', color: C.text, marginBottom: '6px' }}>
                {f.title}
              </p>
              <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.6' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          position:  'relative',
          zIndex:    10,
          textAlign: 'center',
          padding:   isMobile ? '40px 20px 80px' : '60px 40px 100px',
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <p style={{
          fontSize:      isMobile ? '26px' : '36px',
          fontWeight:    '700',
          color:         C.text,
          marginBottom:  '12px',
          letterSpacing: '-0.02em',
          padding:       '0 8px',
        }}>
          Ready to find your path?
        </p>
        <p style={{ fontSize: '15px', color: C.textMuted, marginBottom: '36px' }}>
          Takes 2 minutes. No account needed.
        </p>
        <motion.button
          whileHover={{
            scale:     1.05,
            boxShadow: `0 0 50px ${C.amber}44`,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          style={{
            background:   C.amber,
            color:        '#080c14',
            border:       'none',
            padding:      isMobile ? '16px 36px' : '18px 48px',
            borderRadius: '12px',
            fontSize:     isMobile ? '15px' : '17px',
            fontWeight:   '700',
            cursor:       'pointer',
            width:        isMobile ? 'calc(100% - 40px)' : 'auto',
            maxWidth:     '340px',
          }}
        >
          Start your journey →
        </motion.button>
      </motion.div>

    </motion.div>
  )
}
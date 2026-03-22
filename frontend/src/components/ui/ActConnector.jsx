// ─────────────────────────────────────────────────────
// ActConnector.jsx
// Animated connector between acts/sections
// Particles flow downward along the line
// Label explains the logical connection
// Tells the story of how sections relate
// ─────────────────────────────────────────────────────

import { useRef, useEffect } from 'react'
import { motion }            from 'framer-motion'
import { C }                 from '../../utils/colors'
import useInView             from '../../hooks/useInView'

export default function ActConnector({ message = '', fromColor = C.amber, toColor = C.amber }) {
  const canvasRef        = useRef(null)
  const { ref, inView }  = useInView(0.5)
  const startedRef       = useRef(false)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const W      = canvas.offsetWidth || 400
    const H      = 80

    canvas.width  = W
    canvas.height = H

    const cx       = W / 2
    const particles = []
    let   raf

    function spawnParticle() {
      particles.push({
        x:       cx + (Math.random() - 0.5) * 4,
        y:       0,
        vy:      1.5 + Math.random() * 1.5,
        opacity: 0.8 + Math.random() * 0.2,
        r:       1 + Math.random() * 1.5,
        life:    1,
      })
    }

    let spawnTimer = 0

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // draw center line
      const lineGrad = ctx.createLinearGradient(cx, 0, cx, H)
      lineGrad.addColorStop(0,   `${fromColor}88`)
      lineGrad.addColorStop(0.5, `${C.amber}44`)
      lineGrad.addColorStop(1,   `${toColor}22`)

      ctx.beginPath()
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx, H)
      ctx.strokeStyle = lineGrad
      ctx.lineWidth   = 1
      ctx.stroke()

      // spawn particles periodically
      spawnTimer++
      if (spawnTimer % 8 === 0) spawnParticle()

      // update + draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.y       += p.vy
        p.opacity -= 0.012
        p.life     = p.opacity

        if (p.opacity <= 0 || p.y > H) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.shadowBlur  = 6
        ctx.shadowColor = C.amber
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle   = C.amber
        ctx.fill()
        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [inView, fromColor, toColor])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        padding:        '8px 0',
        position:       'relative',
      }}
    >
      {/* canvas for particle line */}
      <canvas
        ref={canvasRef}
        style={{
          width:      '100%',
          height:     '80px',
          display:    'block',
        }}
      />

      {/* message label */}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            position:     'absolute',
            top:          '50%',
            left:         '50%',
            transform:    'translate(-50%, -50%)',
            background:   C.card,
            border:       `1px solid ${C.amberBorder}`,
            borderRadius: '20px',
            padding:      '5px 16px',
            whiteSpace:   'nowrap',
          }}
        >
          <p style={{
            fontSize:   '11px',
            color:      C.amber,
            fontWeight: '500',
            display:    'flex',
            alignItems: 'center',
            gap:        '6px',
          }}>
            <span style={{ opacity: 0.6 }}>◎</span>
            {message}
            <span style={{ opacity: 0.6 }}>→</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
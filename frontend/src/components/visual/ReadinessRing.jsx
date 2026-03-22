// ─────────────────────────────────────────────────────
// ReadinessRing.jsx
// Full size animated readiness ring
// Three layers running simultaneously:
//   1. Arc draws itself from 0 to score
//   2. Particle orbits the ring continuously
//   3. Radar sweep rotates behind everything
// Score number uses slot machine effect
// ─────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { motion }                      from 'framer-motion'
import { C }                           from '../../utils/colors'
import { useSlotMachine }              from '../../hooks/useCountUp'
import useInView                       from '../../hooks/useInView'

export default function ReadinessRing({ score = 0, size = 200 }) {
  const canvasRef          = useRef(null)
  const { ref, inView }    = useInView(0.3)
  const { display, settled, start } = useSlotMachine(score, {
    scrambleDuration: 900,
    delay:            400,
  })

  const color = C.scoreColor(score)

  useEffect(() => {
    if (inView) start()
  }, [inView])

  useEffect(() => {
    if (!inView) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const dpr    = window.devicePixelRatio || 1

    canvas.width  = size * dpr
    canvas.height = size * dpr
    canvas.style.width  = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx       = size / 2
    const cy       = size / 2
    const R        = size / 2 - 20
    const target   = score / 100
    const start_a  = -Math.PI / 2

    let arcProgress  = 0
    let orbitAngle   = 0
    let radarAngle   = 0
    let raf

    // tick marks around the ring
    const TICKS = 60

    function draw() {
      ctx.clearRect(0, 0, size, size)

      // ── LAYER 1: RADAR SWEEP ──────────────────────
      radarAngle += 0.008

      const sweepGrad = ctx.createConicalGradient
        ? ctx.createConicalGradient(cx, cy, radarAngle)
        : null

      // fallback radar sweep using arc fill
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R + 8, radarAngle, radarAngle + Math.PI * 0.4)
      ctx.closePath()
      const radarColor = color === C.teal
        ? 'rgba(20,184,166,'
        : color === C.amber
        ? 'rgba(245,158,11,'
        : 'rgba(239,68,68,'
      const rGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R + 8)
      rGrad.addColorStop(0,   radarColor + '0.12)')
      rGrad.addColorStop(0.7, radarColor + '0.06)')
      rGrad.addColorStop(1,   radarColor + '0)')
      ctx.fillStyle = rGrad
      ctx.fill()
      ctx.restore()

      // ── LAYER 2: TICK MARKS ───────────────────────
      for (let i = 0; i < TICKS; i++) {
        const angle    = (i / TICKS) * Math.PI * 2 - Math.PI / 2
        const filled   = i / TICKS <= arcProgress * target / target
        const isLong   = i % 5 === 0

        const inner = R - (isLong ? 14 : 10)
        const outer = R - 6

        const x1 = cx + inner * Math.cos(angle)
        const y1 = cy + inner * Math.sin(angle)
        const x2 = cx + outer * Math.cos(angle)
        const y2 = cy + outer * Math.sin(angle)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = filled
          ? `${color}99`
          : `${C.border}88`
        ctx.lineWidth   = isLong ? 2 : 1
        ctx.stroke()
      }

      // ── LAYER 3: BACKGROUND RING ──────────────────
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(30,42,58,0.6)'
      ctx.lineWidth   = 10
      ctx.stroke()

      // ── LAYER 4: PROGRESS ARC ─────────────────────
      if (arcProgress > 0) {
        // glow shadow
        ctx.save()
        ctx.shadowBlur  = 20
        ctx.shadowColor = color

        ctx.beginPath()
        ctx.arc(
          cx, cy, R,
          start_a,
          start_a + Math.PI * 2 * arcProgress,
        )
        ctx.strokeStyle = color
        ctx.lineWidth   = 10
        ctx.lineCap     = 'round'
        ctx.stroke()
        ctx.restore()

        // bright leading edge
        const edgeAngle = start_a + Math.PI * 2 * arcProgress
        const ex = cx + R * Math.cos(edgeAngle)
        const ey = cy + R * Math.sin(edgeAngle)

        ctx.save()
        ctx.shadowBlur  = 30
        ctx.shadowColor = color
        ctx.beginPath()
        ctx.arc(ex, ey, 5, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.restore()
      }

      // ── LAYER 5: ORBITING PARTICLE ────────────────
      orbitAngle += 0.025
      const orbitR = R + 14
      const ox = cx + orbitR * Math.cos(orbitAngle)
      const oy = cy + orbitR * Math.sin(orbitAngle)

      // particle trail
      for (let t = 1; t <= 8; t++) {
        const trailAngle = orbitAngle - t * 0.06
        const tx = cx + orbitR * Math.cos(trailAngle)
        const ty = cy + orbitR * Math.sin(trailAngle)
        ctx.beginPath()
        ctx.arc(tx, ty, 2 * (1 - t / 10), 0, Math.PI * 2)
        ctx.fillStyle = `${color}${Math.round((1 - t / 10) * 80).toString(16).padStart(2, '0')}`
        ctx.fill()
      }

      // main particle dot
      ctx.save()
      ctx.shadowBlur  = 12
      ctx.shadowColor = color
      ctx.beginPath()
      ctx.arc(ox, oy, 4, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()

      // ── ANIMATE ARC PROGRESS ──────────────────────
      const targetProgress = score / 100
      if (arcProgress < targetProgress) {
        arcProgress = Math.min(
          arcProgress + targetProgress / 80,
          targetProgress
        )
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [inView, score, size, color])

  return (
    <div
      ref={ref}
      style={{
        position:       'relative',
        width:          `${size}px`,
        height:         `${size}px`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      <canvas ref={canvasRef} />

      {/* center text */}
      <div style={{
        position:       'absolute',
        textAlign:      'center',
        pointerEvents:  'none',
      }}>
        <motion.p
          animate={settled ? {
            textShadow: [
              `0 0 0px ${color}`,
              `0 0 20px ${color}`,
              `0 0 0px ${color}`,
            ],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize:   `${size * 0.2}px`,
            fontWeight: '700',
            color,
            lineHeight: '1',
            fontFamily: 'monospace',
            margin:     '0 0 4px',
          }}
        >
          {display}%
        </motion.p>
        <p style={{
          fontSize: `${size * 0.075}px`,
          color:    C.textMuted,
        }}>
          of the way there
        </p>
      </div>
    </div>
  )
}
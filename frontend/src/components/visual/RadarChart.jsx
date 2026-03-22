// ─────────────────────────────────────────────────────
// RadarChart.jsx
// Holographic hexagonal radar chart
// Animates from 0 on scroll entry
// Rotating scan line creates hologram effect
// Shimmer sweep across filled area
// ─────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import { C }                 from '../../utils/colors'
import useInView             from '../../hooks/useInView'

export default function RadarChart({ breakdown = [], size = 300 }) {
  const canvasRef          = useRef(null)
  const { ref, inView }    = useInView(0.3)
  const startedRef         = useRef(false)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const dpr    = window.devicePixelRatio || 1
    const SIZE   = size

    canvas.width  = SIZE * dpr
    canvas.height = SIZE * dpr
    canvas.style.width  = `${SIZE}px`
    canvas.style.height = `${SIZE}px`
    ctx.scale(dpr, dpr)

    const cx   = SIZE / 2
    const cy   = SIZE / 2
    const maxR = SIZE / 2 - 40
    const N    = breakdown.length || 5

    const angles = breakdown.map((_, i) =>
      (i / N) * Math.PI * 2 - Math.PI / 2
    )

    let progress = 0
    let shimmer  = 0
    let scanAngle = 0
    let raf

    function getPoint(i, r) {
      return {
        x: cx + r * Math.cos(angles[i]),
        y: cy + r * Math.sin(angles[i]),
      }
    }

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE)
      shimmer   += 0.015
      scanAngle += 0.02
      progress   = Math.min(progress + 0.018, 1)

      // ── GRID RINGS ────────────────────────────────
      for (let ring = 1; ring <= 5; ring++) {
        const r = (ring / 5) * maxR
        ctx.beginPath()
        for (let i = 0; i < N; i++) {
          const p = getPoint(i, r)
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.closePath()
        ctx.strokeStyle = ring === 5
          ? 'rgba(30,42,58,0.8)'
          : 'rgba(30,42,58,0.35)'
        ctx.lineWidth   = ring === 5 ? 1 : 0.5
        ctx.stroke()
      }

      // ── AXIS LINES ────────────────────────────────
      for (let i = 0; i < N; i++) {
        const p = getPoint(i, maxR)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(p.x, p.y)
        ctx.strokeStyle = 'rgba(30,42,58,0.4)'
        ctx.lineWidth   = 0.5
        ctx.stroke()
      }

      // ── DATA POLYGON ──────────────────────────────
      const dataPoints = breakdown.map((item, i) => {
        const r = ((item.score || 0) / 10) * maxR * progress
        return getPoint(i, r)
      })

      // filled area with shimmer
      ctx.beginPath()
      dataPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.closePath()

      const shimmerX1 = cx + Math.cos(shimmer) * maxR
      const shimmerY1 = cy + Math.sin(shimmer) * maxR
      const shimmerX2 = cx - Math.cos(shimmer) * maxR
      const shimmerY2 = cy - Math.sin(shimmer) * maxR

      const fillGrad = ctx.createLinearGradient(shimmerX1, shimmerY1, shimmerX2, shimmerY2)
      fillGrad.addColorStop(0,   'rgba(245,158,11,0.25)')
      fillGrad.addColorStop(0.4, 'rgba(20,184,166,0.15)')
      fillGrad.addColorStop(0.6, 'rgba(245,158,11,0.3)')
      fillGrad.addColorStop(1,   'rgba(20,184,166,0.2)')
      ctx.fillStyle = fillGrad
      ctx.fill()

      // stroke
      ctx.beginPath()
      dataPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.closePath()
      ctx.strokeStyle = `${C.amber}cc`
      ctx.lineWidth   = 2
      ctx.stroke()

      // ── SCAN LINE ─────────────────────────────────
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, maxR, scanAngle, scanAngle + Math.PI * 0.35)
      ctx.closePath()
      const scanGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR)
      scanGrad.addColorStop(0,   'rgba(245,158,11,0.15)')
      scanGrad.addColorStop(0.7, 'rgba(245,158,11,0.06)')
      scanGrad.addColorStop(1,   'transparent')
      ctx.fillStyle = scanGrad
      ctx.fill()
      ctx.restore()

      // ── DATA POINT DOTS ───────────────────────────
      dataPoints.forEach((p, i) => {
        ctx.save()
        ctx.shadowBlur  = 12
        ctx.shadowColor = C.amber
        ctx.beginPath()
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = C.amber
        ctx.fill()
        ctx.restore()

        // value label
        const labelP = getPoint(i, ((breakdown[i]?.score || 0) / 10) * maxR * progress + 14)
        ctx.font        = '10px Inter'
        ctx.fillStyle   = `rgba(245,158,11,${progress})`
        ctx.textAlign   = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(breakdown[i]?.score || 0, labelP.x, labelP.y)
      })

      // ── AXIS LABELS ───────────────────────────────
      breakdown.forEach((item, i) => {
        const p = getPoint(i, maxR + 20)
        ctx.font        = '10px Inter'
        ctx.fillStyle   = C.textMuted
        ctx.textAlign   = 'center'
        ctx.textBaseline = 'middle'
        const label = item.category?.split(' ')[0] || ''
        ctx.fillText(label, p.x, p.y)
      })

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [inView, breakdown, size])

  return (
    <div
      ref={ref}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
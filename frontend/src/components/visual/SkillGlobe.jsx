// ─────────────────────────────────────────────────────
// SkillGlobe.jsx
// 3D rotating skill globe — canvas rendered
// Skills plotted on sphere surface using fibonacci spiral
// Strong skills glow amber, missing are dark holes
// Constellation lines connect nearby skills
// Pulse rings emanate from skill nodes
// Drag to rotate, auto-rotates when idle
// Size: 400px — takes full width of skills section
// ─────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { motion }                      from 'framer-motion'
import { C }                           from '../../utils/colors'

export default function SkillGlobe({ skills = [], size = 380 }) {
  const canvasRef   = useRef(null)
  const isDragging  = useRef(false)
  const lastMouse   = useRef({ x: 0, y: 0 })
  const rotation    = useRef({ x: 0.3, y: 0 })
  const velocity    = useRef({ x: 0, y: 0.004 })
  const [hovered, setHovered] = useState(null)
  const hoveredRef  = useRef(null)
  const pulseRef    = useRef([]) // pulse ring timers

  const colorMap = {
    strong:   { fill: C.amber,    glow: C.amber,    r: 7,  bright: true  },
    basic:    { fill: C.textMuted, glow: C.textMuted, r: 5, bright: false },
    missing:  { fill: '#1e2a3a',  glow: C.red,      r: 5,  bright: false },
    learning: { fill: C.blue,     glow: C.blue,     r: 6,  bright: true  },
  }

  useEffect(() => {
    const canvas  = canvasRef.current
    if (!canvas) return
    const ctx     = canvas.getContext('2d')
    const dpr     = window.devicePixelRatio || 1
    const SIZE    = size

    canvas.width  = SIZE * dpr
    canvas.height = SIZE * dpr
    canvas.style.width  = `${SIZE}px`
    canvas.style.height = `${SIZE}px`
    ctx.scale(dpr, dpr)

    const cx = SIZE / 2
    const cy = SIZE / 2
    const R  = SIZE / 2 - 40

    // distribute skills on sphere using fibonacci spiral
    const points = skills.slice(0, 35).map((skill, i) => {
      const total  = Math.max(skills.length, 1)
      const golden = Math.PI * (3 - Math.sqrt(5))
      const y      = 1 - (i / (total - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta  = golden * i
      return {
        ox: radius * Math.cos(theta),
        oy: y,
        oz: radius * Math.sin(theta),
        skill,
        pulseRadius: 0,
        pulsing:     false,
      }
    })

    // randomly trigger pulse rings
    setInterval(() => {
      const idx = Math.floor(Math.random() * points.length)
      if (points[idx]?.skill?.level === 'strong') {
        points[idx].pulseRadius = 0
        points[idx].pulsing     = true
      }
    }, 2000)

    let raf

    function rotatePoint(ox, oy, oz) {
      const rx = rotation.current.x
      const ry = rotation.current.y
      const x1 = ox * Math.cos(ry) + oz * Math.sin(ry)
      const z1 = -ox * Math.sin(ry) + oz * Math.cos(ry)
      const y2 = oy * Math.cos(rx) - z1 * Math.sin(rx)
      const z2 = oy * Math.sin(rx) + z1 * Math.cos(rx)
      return { x: x1, y: y2, z: z2 }
    }

    function project(rx, ry, rz) {
      const fov   = 500
      const scale = fov / (fov + rz * R)
      return {
        x: cx + rx * R * scale,
        y: cy + ry * R * scale,
        scale,
      }
    }

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // ── GLOBE GRID LINES ──────────────────────────
      const LATS = 7
      const LONS = 8

      for (let lat = 1; lat < LATS; lat++) {
        const phi   = (lat / LATS) * Math.PI
        const steps = 80
        ctx.beginPath()
        let started = false
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2
          const ox    = Math.sin(phi) * Math.cos(theta)
          const oy    = Math.cos(phi)
          const oz    = Math.sin(phi) * Math.sin(theta)
          const r     = rotatePoint(ox, oy, oz)
          const p     = project(r.x, r.y, r.z)
          if (r.z > -0.05) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true }
            else ctx.lineTo(p.x, p.y)
          } else started = false
        }
        ctx.strokeStyle = 'rgba(30,42,58,0.3)'
        ctx.lineWidth   = 0.5
        ctx.stroke()
      }

      for (let lon = 0; lon < LONS; lon++) {
        const theta = (lon / LONS) * Math.PI * 2
        const steps = 80
        ctx.beginPath()
        let started = false
        for (let i = 0; i <= steps; i++) {
          const phi = (i / steps) * Math.PI
          const ox  = Math.sin(phi) * Math.cos(theta)
          const oy  = Math.cos(phi)
          const oz  = Math.sin(phi) * Math.sin(theta)
          const r   = rotatePoint(ox, oy, oz)
          const p   = project(r.x, r.y, r.z)
          if (r.z > -0.05) {
            if (!started) { ctx.moveTo(p.x, p.y); started = true }
            else ctx.lineTo(p.x, p.y)
          } else started = false
        }
        ctx.strokeStyle = 'rgba(30,42,58,0.3)'
        ctx.lineWidth   = 0.5
        ctx.stroke()
      }

      // ── PROJECT ALL SKILL POINTS ──────────────────
      const projected = points.map(pt => {
        const r = rotatePoint(pt.ox, pt.oy, pt.oz)
        const p = project(r.x, r.y, r.z)
        return { ...pt, rx: r.x, ry: r.y, rz: r.z, px: p.x, py: p.y, scale: p.scale }
      }).sort((a, b) => a.rz - b.rz)

      // ── CONSTELLATION LINES ───────────────────────
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i]
          const b = projected[j]
          if (a.rz < 0 || b.rz < 0) continue

          const dx   = a.ox - b.ox
          const dy   = a.oy - b.oy
          const dz   = a.oz - b.oz
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)

          if (dist < 0.55) {
            const alpha = (1 - dist / 0.55) * 0.15
            ctx.beginPath()
            ctx.moveTo(a.px, a.py)
            ctx.lineTo(b.px, b.py)
            ctx.strokeStyle = `rgba(245,158,11,${alpha})`
            ctx.lineWidth   = 0.5
            ctx.stroke()
          }
        }
      }

      // ── SKILL NODES ───────────────────────────────
      projected.forEach(pt => {
        const level  = pt.skill?.level || 'missing'
        const colors = colorMap[level]  || colorMap.missing
        const r      = colors.r * pt.scale
        const front  = pt.rz > 0
        const alpha  = front ? 1 : 0.25
        const isHov  = hoveredRef.current === pt.skill?.name

        // pulse ring animation
        if (pt.pulsing && front) {
          pt.pulseRadius += 0.4
          const pulseAlpha = Math.max(0, 0.6 - pt.pulseRadius / 20)

          ctx.beginPath()
          ctx.arc(pt.px, pt.py, r + pt.pulseRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `${colors.glow}${Math.round(pulseAlpha * 255).toString(16).padStart(2, '0')}`
          ctx.lineWidth   = 1.5
          ctx.stroke()

          if (pt.pulseRadius > 20) {
            pt.pulseRadius = 0
            pt.pulsing     = false
          }
        }

        // hover glow ring
        if (isHov && front) {
          ctx.save()
          ctx.shadowBlur  = 20
          ctx.shadowColor = colors.glow
          ctx.beginPath()
          ctx.arc(pt.px, pt.py, r + 6, 0, Math.PI * 2)
          ctx.strokeStyle = `${colors.glow}66`
          ctx.lineWidth   = 2
          ctx.stroke()
          ctx.restore()
        }

        // outer glow
        if (front && colors.bright) {
          ctx.save()
          ctx.shadowBlur  = 15 * pt.scale
          ctx.shadowColor = colors.glow
          ctx.beginPath()
          ctx.arc(pt.px, pt.py, r, 0, Math.PI * 2)
          ctx.fillStyle = `${colors.fill}44`
          ctx.fill()
          ctx.restore()
        }

        // main dot
        ctx.save()
        if (front && colors.bright) {
          ctx.shadowBlur  = 10
          ctx.shadowColor = colors.glow
        }
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(pt.px, pt.py, r, 0, Math.PI * 2)

        if (level === 'missing') {
          ctx.fillStyle   = '#0f1520'
          ctx.fill()
          ctx.strokeStyle = `${C.red}88`
          ctx.lineWidth   = 1.5
          ctx.stroke()
        } else {
          ctx.fillStyle = colors.fill
          ctx.fill()
        }
        ctx.restore()

        // skill name label — front hemisphere only
        if (front && pt.rz > 0.25 && pt.skill?.name) {
          const fontSize = Math.max(9, Math.round(11 * pt.scale))
          ctx.font        = `${fontSize}px Inter, sans-serif`
          ctx.fillStyle   = `rgba(248,244,236,${Math.min(alpha, pt.rz * 1.5)})`
          ctx.textAlign   = 'center'
          ctx.textBaseline = 'top'
          ctx.fillText(pt.skill.name, pt.px, pt.py + r + 4)
        }
      })

      // ── AUTO ROTATE ───────────────────────────────
      if (!isDragging.current) {
        rotation.current.y += velocity.current.y
        // subtle vertical oscillation
        rotation.current.x = 0.3 + Math.sin(Date.now() * 0.0003) * 0.15
      }

      // dampen velocity
      velocity.current.x *= 0.95
      velocity.current.y  = isDragging.current
        ? velocity.current.y
        : Math.max(velocity.current.y * 0.999, 0.003)

      raf = requestAnimationFrame(draw)
    }

    draw()

    // drag handlers
    function onMouseDown(e) {
      isDragging.current = true
      lastMouse.current  = { x: e.clientX, y: e.clientY }
      velocity.current   = { x: 0, y: 0 }
    }
    function onMouseMove(e) {
      if (!isDragging.current) return
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      rotation.current.y  += dx * 0.007
      rotation.current.x  += dy * 0.007
      velocity.current     = { x: dy * 0.007, y: dx * 0.007 }
      lastMouse.current    = { x: e.clientX, y: e.clientY }
    }
    function onMouseUp() { isDragging.current = false }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [skills, size])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <canvas
        ref={canvasRef}
        style={{ cursor: 'grab' }}
      />

      {/* legend */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { level: 'strong',   color: C.amber,     label: 'Strong'   },
          { level: 'basic',    color: C.textMuted,  label: 'Basic'    },
          { level: 'learning', color: C.blue,       label: 'Learning' },
          { level: 'missing',  color: C.red,        label: 'Missing'  },
        ].map(item => (
          <div key={item.level} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <motion.div
              animate={{ boxShadow: [`0 0 0px ${item.color}`, `0 0 6px ${item.color}`, `0 0 0px ${item.color}`] }}
              transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
              style={{
                width:        '8px',
                height:       '8px',
                borderRadius: '50%',
                background:   item.color,
              }}
            />
            <span style={{ fontSize: '11px', color: C.textMuted }}>{item.label}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '11px', color: C.textDim }}>Drag to rotate</p>
    </div>
  )
}
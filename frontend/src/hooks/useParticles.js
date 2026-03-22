// ─────────────────────────────────────────────────────
// useParticles.js
// Unified particle system for three use cases:
//   1. Background neural network — ambient, mouse reactive
//   2. Cursor trail — follows mouse, fades out
//   3. Burst effect — explosion from a point
//
// All share the same physics engine
// Each has its own canvas and lifecycle
// ─────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react'

// ── PHYSICS ENGINE ────────────────────────────────────
// Core particle update logic shared by all systems

function createParticle(config = {}) {
  return {
    x:       config.x       ?? 0,
    y:       config.y       ?? 0,
    vx:      config.vx      ?? (Math.random() - 0.5) * 2,
    vy:      config.vy      ?? (Math.random() - 0.5) * 2,
    r:       config.r       ?? Math.random() * 2 + 0.5,
    opacity: config.opacity ?? Math.random() * 0.6 + 0.2,
    life:    config.life    ?? 1,      // 1 = full life, 0 = dead
    decay:   config.decay   ?? 0,      // how fast it dies
    color:   config.color   ?? '#f59e0b',
    type:    config.type    ?? 'dot',  // dot | ring | spark
  }
}

function updateParticle(p, mouse, repulseRadius = 0) {
  // mouse repulsion
  if (repulseRadius > 0 && mouse) {
    const dx   = p.x - mouse.x
    const dy   = p.y - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < repulseRadius && dist > 0) {
      const force = (repulseRadius - dist) / repulseRadius
      p.vx += (dx / dist) * force * 0.8
      p.vy += (dy / dist) * force * 0.8
    }
  }

  // damping — slow down over time
  p.vx *= 0.98
  p.vy *= 0.98

  // speed limit
  const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
  if (speed > 3) {
    p.vx = (p.vx / speed) * 3
    p.vy = (p.vy / speed) * 3
  }

  // move
  p.x += p.vx
  p.y += p.vy

  // decay life
  if (p.decay > 0) p.life -= p.decay

  return p
}

function drawParticle(ctx, p) {
  if (p.life <= 0) return

  const alpha = p.opacity * p.life

  ctx.save()
  ctx.globalAlpha = alpha

  if (p.type === 'ring') {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.strokeStyle = p.color
    ctx.lineWidth   = 1
    ctx.stroke()
  } else if (p.type === 'spark') {
    // elongated spark in direction of velocity
    const angle  = Math.atan2(p.vy, p.vx)
    const length = Math.sqrt(p.vx * p.vx + p.vy * p.vy) * 3

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(
      p.x - Math.cos(angle) * length,
      p.y - Math.sin(angle) * length
    )
    ctx.strokeStyle = p.color
    ctx.lineWidth   = p.r
    ctx.lineCap     = 'round'
    ctx.stroke()
  } else {
    // default dot
    ctx.beginPath()
    ctx.arc(p.x, p.y, Math.max(0.1, p.r * p.life), 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.fill()
  }

  ctx.restore()
}

// ── 1. BACKGROUND NEURAL NETWORK ─────────────────────
// Ambient particle field with connections
// Mouse causes repulsion
// Particles wrap around screen edges

export function useBackgroundParticles(options = {}) {
  const {
    count         = 100,
    connectionDist = 110,
    repulseRadius  = 130,
    color          = '#f59e0b',
    opacity        = 0.5,
  } = options

  const canvasRef   = useRef(null)
  const particlesRef = useRef([])
  const mouseRef    = useRef({ x: -1000, y: -1000 })
  const rafRef      = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      // reinitialize particles on resize
      initParticles()
    }

    function initParticles() {
      particlesRef.current = Array.from({ length: count }, () =>
        createParticle({
          x:       Math.random() * canvas.width,
          y:       Math.random() * canvas.height,
          vx:      (Math.random() - 0.5) * 0.5,
          vy:      (Math.random() - 0.5) * 0.5,
          r:       Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.15,
          color,
        })
      )
    }

    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      const mouse     = mouseRef.current

      // update all particles
      particles.forEach(p => {
        updateParticle(p, mouse, repulseRadius)

        // wrap edges
        if (p.x < 0)              p.x = canvas.width
        if (p.x > canvas.width)   p.x = 0
        if (p.y < 0)              p.y = canvas.height
        if (p.y > canvas.height)  p.y = 0

        drawParticle(ctx, p)
      })

      // draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDist) {
            const lineOpacity = (1 - dist / connectionDist) * opacity * 0.4
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = color
            ctx.globalAlpha = lineOpacity
            ctx.lineWidth   = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    function onMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [count, connectionDist, repulseRadius, color, opacity])

  return canvasRef
}

// ── 2. CURSOR TRAIL ───────────────────────────────────
// Particles spawn at cursor position
// Fade out over time
// Spark type for streaking effect

export function useCursorTrail(options = {}) {
  const {
    maxParticles = 25,
    color        = '#f59e0b',
    decay        = 0.04,
    type         = 'spark',
  } = options

  const canvasRef   = useRef(null)
  const particlesRef = useRef([])
  const rafRef      = useRef(null)
  const lastPos     = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function onMouseMove(e) {
      const pos = { x: e.clientX, y: e.clientY }

      // calculate velocity from last position
      let vx = 0
      let vy = 0
      if (lastPos.current) {
        vx = (pos.x - lastPos.current.x) * 0.3
        vy = (pos.y - lastPos.current.y) * 0.3
      }
      lastPos.current = pos

      // spawn 2-3 particles per mouse move
      const spawnCount = Math.min(3, Math.floor(Math.sqrt(vx*vx + vy*vy) / 3) + 1)

      for (let i = 0; i < spawnCount; i++) {
        if (particlesRef.current.length >= maxParticles) {
          particlesRef.current.shift() // remove oldest
        }

        particlesRef.current.push(createParticle({
          x:       pos.x + (Math.random() - 0.5) * 4,
          y:       pos.y + (Math.random() - 0.5) * 4,
          vx:      -vx * 0.2 + (Math.random() - 0.5) * 1,
          vy:      -vy * 0.2 + (Math.random() - 0.5) * 1,
          r:       Math.random() * 2 + 1,
          opacity: 0.8,
          life:    1,
          decay,
          color,
          type,
        }))
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // update and draw — remove dead particles
      particlesRef.current = particlesRef.current
        .map(p => updateParticle(p, null, 0))
        .filter(p => p.life > 0)

      particlesRef.current.forEach(p => drawParticle(ctx, p))

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [maxParticles, color, decay, type])

  return canvasRef
}

// ── 3. BURST EFFECT ───────────────────────────────────
// Explosion of particles from a specific point
// Used when chat button opens
// Call burst(x, y) to trigger

export function useBurst(options = {}) {
  const {
    count   = 20,
    color   = '#f59e0b',
    speed   = 6,
    decay   = 0.03,
    type    = 'spark',
  } = options

  const canvasRef    = useRef(null)
  const particlesRef = useRef([])
  const rafRef       = useRef(null)
  const activeRef    = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      if (!activeRef.current && particlesRef.current.length === 0) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current
        .map(p => updateParticle(p, null, 0))
        .filter(p => p.life > 0)

      particlesRef.current.forEach(p => drawParticle(ctx, p))

      if (particlesRef.current.length === 0) {
        activeRef.current = false
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const burst = useCallback((x, y) => {
    if (!canvasRef.current) return
    activeRef.current = true

    // spawn particles in all directions
    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const s     = speed * (0.5 + Math.random() * 0.5)

      return createParticle({
        x,
        y,
        vx:      Math.cos(angle) * s,
        vy:      Math.sin(angle) * s,
        r:       Math.random() * 3 + 1,
        opacity: 1,
        life:    1,
        decay:   decay * (0.5 + Math.random()),
        color,
        type,
      })
    })

    // also add some random scatter
    for (let i = 0; i < count / 2; i++) {
      newParticles.push(createParticle({
        x:       x + (Math.random() - 0.5) * 20,
        y:       y + (Math.random() - 0.5) * 20,
        vx:      (Math.random() - 0.5) * speed * 1.5,
        vy:      (Math.random() - 0.5) * speed * 1.5,
        r:       Math.random() * 2 + 0.5,
        opacity: 0.8,
        life:    1,
        decay:   decay * 1.5,
        color,
        type:    'dot',
      }))
    }

    particlesRef.current = [...particlesRef.current, ...newParticles]
  }, [count, color, speed, decay, type])

  return { canvasRef, burst }
}

// ── 4. AURORA BACKGROUND ─────────────────────────────
// Slow moving color blobs in deep background
// Uses canvas with large soft circles
// Teal and amber blobs drifting

export function useAurora() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // define aurora blobs
    const blobs = [
      {
        x: canvas.width * 0.2,  y: canvas.height * 0.3,
        vx: 0.15, vy: 0.08,
        r: 300, color: 'rgba(245,158,11,0.04)'
      },
      {
        x: canvas.width * 0.8,  y: canvas.height * 0.6,
        vx: -0.1, vy: -0.12,
        r: 350, color: 'rgba(20,184,166,0.04)'
      },
      {
        x: canvas.width * 0.5,  y: canvas.height * 0.8,
        vx: 0.08, vy: -0.08,
        r: 250, color: 'rgba(245,158,11,0.03)'
      },
      {
        x: canvas.width * 0.1,  y: canvas.height * 0.7,
        vx: 0.12, vy: 0.06,
        r: 200, color: 'rgba(20,184,166,0.03)'
      },
    ]

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      blobs.forEach(blob => {
        // move
        blob.x += blob.vx
        blob.y += blob.vy

        // bounce off edges
        if (blob.x < -blob.r || blob.x > canvas.width  + blob.r) blob.vx *= -1
        if (blob.y < -blob.r || blob.y > canvas.height + blob.r) blob.vy *= -1

        // draw soft blob
        const grad = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.r
        )
        grad.addColorStop(0,   blob.color)
        grad.addColorStop(0.5, blob.color)
        grad.addColorStop(1,   'transparent')

        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return canvasRef
}

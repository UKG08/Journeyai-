// ─────────────────────────────────────────────────────
// useTilt.js
// Adds 3D perspective tilt to any element
// Follows mouse cursor within the element bounds
// Three intensity levels — subtle, medium, strong
// ─────────────────────────────────────────────────────

import { useRef, useCallback, useEffect } from 'react'

export default function useTilt(intensity = 8) {
  const ref         = useRef(null)
  const rafRef      = useRef(null)
  const currentTilt = useRef({ x: 0, y: 0 })
  const targetTilt  = useRef({ x: 0, y: 0 })
  const isHovered   = useRef(false)

  // smooth lerp between current and target tilt
  // this is what makes the tilt feel fluid not jerky
  const lerp = (a, b, t) => a + (b - a) * t

  const animate = useCallback(() => {
    const el = ref.current
    if (!el) return

    // lerp toward target — 0.12 = smooth, 0.3 = snappy
    currentTilt.current.x = lerp(currentTilt.current.x, targetTilt.current.x, 0.12)
    currentTilt.current.y = lerp(currentTilt.current.y, targetTilt.current.y, 0.12)

    const { x, y } = currentTilt.current

    // only apply transform if there's meaningful movement
    if (Math.abs(x) > 0.01 || Math.abs(y) > 0.01) {
      el.style.transform = `
        perspective(1000px)
        rotateY(${x}deg)
        rotateX(${-y}deg)
        translateZ(${isHovered.current ? '12px' : '0px'})
      `

      // dynamic shadow follows tilt direction
      const shadowX = x * 0.8
      const shadowY = y * 0.8
      el.style.boxShadow = isHovered.current
        ? `
          ${-shadowX}px ${-shadowY}px 30px rgba(0,0,0,0.3),
          0 0 0 1px rgba(245,158,11,0.15)
        `
        : '0 4px 24px rgba(0,0,0,0.3)'
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()

    // normalize to -1 to 1
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2

    // apply intensity — clamp to prevent extreme angles
    targetTilt.current.x = Math.max(-intensity, Math.min(intensity, x * intensity))
    targetTilt.current.y = Math.max(-intensity, Math.min(intensity, y * intensity))
  }, [intensity])

  const onMouseEnter = useCallback(() => {
    isHovered.current = true

    // start animation loop on hover
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  const onMouseLeave = useCallback(() => {
    isHovered.current    = false
    targetTilt.current   = { x: 0, y: 0 }

    // keep animating until tilt returns to 0
    // then stop the loop
    const checkDone = () => {
      const { x, y } = currentTilt.current
      if (Math.abs(x) < 0.05 && Math.abs(y) < 0.05) {
        currentTilt.current = { x: 0, y: 0 }
        const el = ref.current
        if (el) {
          el.style.transform  = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
          el.style.boxShadow  = '0 4px 24px rgba(0,0,0,0.3)'
        }
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      } else {
        rafRef.current = requestAnimationFrame(checkDone)
      }
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(checkDone)
  }, [])

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { ref, onMouseMove, onMouseEnter, onMouseLeave }
}

// ── INTENSITY PRESETS ─────────────────────────────────
// Export preset intensities for different card types

export const tiltIntensity = {
  subtle: 4,   // background cards, subtle depth
  normal: 8,   // standard cards — default
  strong: 14,  // hero cards, next step card
  extreme: 20, // special showcase elements
}
// ─────────────────────────────────────────────────────
// useInView.js
// Detects when elements enter the viewport
// Powers all scroll-triggered animations
// Multiple variants for different use cases
// Uses IntersectionObserver — no scroll event listeners
// IntersectionObserver is more performant than scroll events
// it fires off the main thread and doesn't cause jank
// ─────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react'

// ── BASIC IN VIEW ─────────────────────────────────────
// Returns true once element enters viewport
// Stays true — does not reset when element leaves
// Use this for one-shot entry animations

export default function useInView(threshold = 0.15) {
  const ref            = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          // disconnect after first trigger — no need to keep watching
          observer.disconnect()
        }
      },
      {
        threshold,
        // rootMargin pulls the trigger slightly before element is fully visible
        // so animation starts just as element comes into view
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ── TOGGLE IN VIEW ────────────────────────────────────
// Returns true while element is visible, false when it leaves
// Use this for continuous effects that should pause when off screen
// Example: particle animations, canvas renders

export function useInViewToggle(threshold = 0.1) {
  const ref              = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ── IN VIEW WITH CALLBACK ─────────────────────────────
// Calls a function when element enters viewport
// Use when you need to imperatively trigger something
// Example: start a canvas animation, trigger a sound

export function useInViewCallback(callback, threshold = 0.15) {
  const ref     = useRef(null)
  const firedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true
          callback()
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [callback, threshold])

  return ref
}

// ── STAGGERED IN VIEW ─────────────────────────────────
// For a list of elements — returns array of inView booleans
// Each element triggers independently as it enters viewport
// Use for roadmap steps, skill cards, insight cards

export function useStaggeredInView(count, threshold = 0.2) {
  const refs   = useRef([])
  const [inViews, setInViews] = useState(() => Array(count).fill(false))

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInViews(prev => {
              const next = [...prev]
              next[i]   = true
              return next
            })
            observer.disconnect()
          }
        },
        {
          threshold,
          rootMargin: '0px 0px -40px 0px',
        }
      )

      observer.observe(el)
      return observer
    })

    return () => observers.forEach(obs => obs?.disconnect())
  }, [count, threshold])

  const setRef = useCallback((index) => (el) => {
    refs.current[index] = el
  }, [])

  return { inViews, setRef }
}

// ── SCROLL PROGRESS ───────────────────────────────────
// Returns how far through an element you've scrolled
// 0 = just entered viewport, 1 = just left viewport
// Use for parallax effects and progress-based animations
// Example: timeline drawing itself as you scroll through

export function useScrollProgress() {
  const ref              = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onScroll() {
      const rect   = el.getBoundingClientRect()
      const winH   = window.innerHeight
      const total  = rect.height + winH

      // how far element has traveled through viewport
      const traveled = winH - rect.top
      const prog     = Math.max(0, Math.min(1, traveled / total))

      setProgress(prog)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // check on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { ref, progress }
}

// ── ACTIVE SECTION ────────────────────────────────────
// Tracks which section ID is currently in view
// Use for section progress indicator and left panel
// Returns the ID of the currently visible section

export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0])

  useEffect(() => {
    const observers = sectionIds.map(id => {
      const el = document.getElementById(id)
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        {
          threshold:  0.3,
          rootMargin: '-20% 0px -60% 0px',
        }
      )

      observer.observe(el)
      return observer
    })

    return () => observers.forEach(obs => obs?.disconnect())
  }, [sectionIds])

  return activeId
}

// ── BELOW FOLD ────────────────────────────────────────
// Returns true if element has NOT yet been seen
// Use for showing scroll hints or loading indicators

export function useBelowFold() {
  const ref              = useRef(null)
  const [seen,  setSeen] = useState(false)
  const [below, setBelow] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          setBelow(false)
        } else if (!seen) {
          setBelow(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [seen])

  return { ref, seen, below }
} 
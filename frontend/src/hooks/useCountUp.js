// ─────────────────────────────────────────────────────
// useCountUp.js
// Animates numbers from 0 to target
// Two modes:
//   smooth     — eased count like a speedometer
//   slotMachine — digits scramble then land
// Triggers when element enters viewport
// ─────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'

// ── SMOOTH COUNT UP ───────────────────────────────────
export function useCountUp(target, duration = 1500, delay = 0) {
  const [count,   setCount]   = useState(0)
  const [started, setStarted] = useState(false)
  const rafRef                = useRef(null)

  const start = useCallback(() => {
    if (started) return
    setStarted(true)

    const startTime  = performance.now() + delay
    const startValue = 0

    function update(now) {
      if (now < startTime) {
        rafRef.current = requestAnimationFrame(update)
        return
      }

      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // ease out cubic — fast start, slow end
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(startValue + (target - startValue) * eased)

      setCount(value)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update)
      }
    }

    rafRef.current = requestAnimationFrame(update)
  }, [target, duration, delay, started])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { count, start }
}

// ── SLOT MACHINE COUNT ────────────────────────────────
// Digits scramble through random values before landing
// scrambleDuration — how long the scramble lasts (ms)
// settleDuration   — how long the settle animation takes (ms)

export function useSlotMachine(target, options = {}) {
  const {
    scrambleDuration = 800,
    settleDuration   = 400,
    delay            = 0,
    decimals         = 0,
  } = options

  const [display,  setDisplay]  = useState('--')
  const [settled,  setSettled]  = useState(false)
  const [started,  setStarted]  = useState(false)
  const intervalRef             = useRef(null)
  const timeoutRef              = useRef(null)

  const start = useCallback(() => {
    if (started) return
    setStarted(true)

    timeoutRef.current = setTimeout(() => {
      // phase 1 — scramble random numbers
      const scrambleEnd = Date.now() + scrambleDuration
      let   fastInterval = 50

      function scramble() {
        if (Date.now() >= scrambleEnd) {
          // phase 2 — slow down and settle
          clearInterval(intervalRef.current)

          let   slowInterval = 100
          let   steps        = 5
          let   step         = 0

          function settle() {
            step++
            if (step >= steps) {
              // landed — show real value
              setDisplay(decimals > 0
                ? target.toFixed(decimals)
                : String(target)
              )
              setSettled(true)
              return
            }

            // show progressively closer random numbers
            const progress    = step / steps
            const closeness   = Math.pow(progress, 2)
            const randomRange = (1 - closeness) * target * 0.3
            const fake        = Math.round(target + (Math.random() - 0.5) * randomRange)

            setDisplay(String(Math.max(0, fake)))

            setTimeout(settle, slowInterval + step * 40)
          }

          settle()
          return
        }

        // generate random number in plausible range
        const fake = Math.round(Math.random() * target * 1.5)
        setDisplay(String(fake))
      }

      intervalRef.current = setInterval(scramble, fastInterval)

    }, delay)
  }, [target, scrambleDuration, settleDuration, delay, decimals, started])

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return { display, settled, start }
}

// ── AUTO COUNT — triggers immediately on mount ────────
export function useAutoCountUp(target, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0)
  const rafRef            = useRef(null)

  useEffect(() => {
    if (target === 0 || target === null || target === undefined) return

    const startTime = performance.now() + delay

    function update(now) {
      if (now < startTime) {
        rafRef.current = requestAnimationFrame(update)
        return
      }

      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)

      setCount(Math.round(target * eased))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update)
      }
    }

    rafRef.current = requestAnimationFrame(update)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, delay])

  return count
}

// ── SCRAMBLE TEXT ─────────────────────────────────────
// Like slot machine but for text — chars scramble then settle
// Used for section labels and headings

export function useScrambleText(text, options = {}) {
  const {
    duration = 600,
    delay    = 0,
    chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$◎◈→◉',
  } = options

  const [display,  setDisplay]  = useState(text)
  const [settled,  setSettled]  = useState(false)
  const [started,  setStarted]  = useState(false)
  const intervalRef             = useRef(null)
  const timeoutRef              = useRef(null)

  const start = useCallback(() => {
    if (started) return
    setStarted(true)

    timeoutRef.current = setTimeout(() => {
      const startTime = Date.now()
      const endTime   = startTime + duration

      function scramble() {
        const now      = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)

        // progressively reveal real characters from left
        const revealed = Math.floor(progress * text.length)

        const scrambled = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < revealed) return char
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')

        setDisplay(scrambled)

        if (progress < 1) {
          intervalRef.current = requestAnimationFrame(scramble)
        } else {
          setDisplay(text)
          setSettled(true)
        }
      }

      intervalRef.current = requestAnimationFrame(scramble)
    }, delay)
  }, [text, duration, delay, chars, started])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(intervalRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return { display, settled, start }
}
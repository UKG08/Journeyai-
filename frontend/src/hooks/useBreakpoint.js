// ─────────────────────────────────────────────────────
// useBreakpoint.js
// Shared responsive hook — returns { isMobile, isTablet }
// isMobile  → < 640px
// isTablet  → 640–1023px
// ─────────────────────────────────────────────────────
import { useState, useEffect } from 'react'

export default function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    width,
  }
}
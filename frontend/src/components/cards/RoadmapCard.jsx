// ─────────────────────────────────────────────────────
// RoadmapCard.jsx — RESPONSIVE
// Act 4b — wraps the RoadMap3D visual
// ─────────────────────────────────────────────────────

import { motion }    from 'framer-motion'
import { C }         from '../../utils/colors'
import useInView     from '../../hooks/useInView'
import RoadMap3D     from '../visual/RoadMap3D'
import useBreakpoint from '../../hooks/useBreakpoint'

export default function RoadmapCard({ data }) {
  const roadmap         = data?.roadmap      || []
  const title           = data?.roadmapTitle || 'Your path forward'
  const totalTime       = data?.totalTime    || ''
  const { ref, inView } = useInView(0.1)
  const { isMobile }    = useBreakpoint()

  if (!roadmap.length) return null

  return (
    <div id="act4-roadmap" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        <p style={{
          fontSize: '9px', fontWeight: '600', color: C.textMuted,
          letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>
          ◈ — Act IV continued — The Road — ◈
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          overflow: 'hidden',
        }}
      >
        <RoadMap3D
          roadmap={roadmap}
          title={title}
          totalTime={totalTime}
        />
      </motion.div>
    </div>
  )
}
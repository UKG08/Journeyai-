// ─────────────────────────────────────────────────────
// RoadmapCard.jsx
// Act 4b — wraps the RoadMap3D visual
// Adds act label and card container
// ─────────────────────────────────────────────────────

import { motion }    from 'framer-motion'
import { C }         from '../../utils/colors'
import useInView     from '../../hooks/useInView'
import RoadMap3D     from '../visual/RoadMap3D'

export default function RoadmapCard({ data }) {
  const roadmap         = data?.roadmap     || []
  const title           = data?.roadmapTitle|| 'Your path forward'
  const totalTime       = data?.totalTime   || ''
  const { ref, inView } = useInView(0.1)

  if (!roadmap.length) return null

  return (
    <div id="act4-roadmap" ref={ref}>

      {/* act label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        <p style={{
          fontSize:      '9px',
          fontWeight:    '600',
          color:         C.textMuted,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          ◈ — Act IV continued — The Road — ◈
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:   C.card,
          border:       `1px solid ${C.border}`,
          borderRadius: '16px',
          padding:      '24px',
          overflow:     'hidden',
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
import { useEffect, useState }     from 'react'
import { motion }                  from 'framer-motion'
import {
  useBackgroundParticles,
  useAurora,
  useCursorTrail,
}                                  from '../../hooks/useParticles'
import { C }                       from '../../utils/colors'
import { pageEnter }               from '../../animations/variants'

export default function ThreeZoneLayout({ children, data }) {
  const [mounted, setMounted] = useState(false)

  const particleRef = useBackgroundParticles({
    count:          90,
    connectionDist: 100,
    repulseRadius:  120,
    color:          C.amber,
    opacity:        0.4,
  })

  const auroraRef = useAurora()
  const cursorRef = useCursorTrail({
    maxParticles: 20,
    color:        C.amber,
    decay:        0.045,
    type:         'spark',
  })

  useEffect(() => { setMounted(true) }, [])

  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      style={{
        minHeight:   '100vh',
        background:  C.bg,
        position:    'relative',
        overflowX:   'hidden',
      }}
    >
      {/* ── BACKGROUND LAYERS ── */}

      {/* aurora blobs */}
      <canvas
        ref={auroraRef}
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        0,
        }}
      />

      {/* convex dome grid */}
      <div style={{
        position:        'fixed',
        inset:           0,
        pointerEvents:   'none',
        zIndex:          1,
        backgroundImage: `
          linear-gradient(rgba(245,158,11,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,158,11,0.025) 1px, transparent 1px)
        `,
        backgroundSize:  '56px 56px',
        maskImage:       'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* particle neural network */}
      <canvas
        ref={particleRef}
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        2,
          opacity:       0.55,
        }}
      />

      {/* cursor trail */}
      <canvas
        ref={cursorRef}
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        9999,
        }}
      />

      {/* global scan line */}
      <motion.div
        animate={{
          y:       ['-100vh', '100vh'],
          opacity: [0, 0.4, 0.4, 0],
        }}
        transition={{
          duration:    10,
          repeat:      Infinity,
          repeatDelay: 8,
          ease:        'linear',
          times:       [0, 0.05, 0.95, 1],
        }}
        style={{
          position:      'fixed',
          left:          0,
          right:         0,
          height:        '2px',
          background:    `linear-gradient(90deg, transparent, ${C.amber}, transparent)`,
          pointerEvents: 'none',
          zIndex:        100,
        }}
      />

      {/* ── THREE ZONE WRAPPER ── */}
      <div style={{
        position:            'relative',
        zIndex:              10,
        display:             'grid',
        gridTemplateColumns: 'clamp(180px, 15vw, 220px) 1fr clamp(160px, 14vw, 200px)',
        gridTemplateAreas:   '"left center right"',
        minHeight:           '100vh',
        maxWidth:            '1400px',
        margin:              '0 auto',
      }}>

        {/* left panel */}
        <div style={{
          gridArea:        'left',
          position:        'sticky',
          top:             0,
          height:          '100vh',
          overflowY:       'auto',
          overflowX:       'hidden',
          padding:         '24px 0 24px 16px',
          scrollbarWidth:  'none',
          msOverflowStyle: 'none',
        }}>
          {children.left}
        </div>

        {/* center — scrollable */}
        <div style={{
          gridArea: 'center',
          padding:  '0 16px',
          minWidth: 0,
        }}>
          {children.center}
        </div>

        {/* right HUD */}
        <div style={{
          gridArea:        'right',
          position:        'sticky',
          top:             0,
          height:          '100vh',
          overflowY:       'auto',
          overflowX:       'hidden',
          padding:         '24px 16px 24px 0',
          scrollbarWidth:  'none',
          msOverflowStyle: 'none',
        }}>
          {children.right}
        </div>

      </div>
    </motion.div>
  )
}
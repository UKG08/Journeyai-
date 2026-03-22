// ─────────────────────────────────────────────────────
// SectionProgress.jsx
// Left edge scroll progress indicator
// Dots for each section — highlights active
// Clicking jumps to section
// Progress line fills as you scroll
// ─────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { motion }              from 'framer-motion'
import { C }                   from '../../utils/colors'
import { useActiveSection }    from '../../hooks/useInView'
import { css }                 from '../../animations/transitions'

const SECTIONS = [
  { id: 'act1',           label: 'Overview'   },
  { id: 'act2-insights',  label: 'Insights'   },
  { id: 'act2-skills',    label: 'Skills'     },
  { id: 'act3-graph',     label: 'Skill map'  },
  { id: 'act3-resume',    label: 'Resume'     },
  { id: 'act4-nextstep',  label: 'Next step'  },
  { id: 'act4-roadmap',   label: 'Roadmap'    },
  { id: 'act5-portfolio', label: 'Portfolio'  },
  { id: 'act5-jobmatch',  label: 'Job match'  },
  { id: 'completion',     label: 'Summary'    },
]

export default function SectionProgress() {
  const activeId   = useActiveSection(SECTIONS.map(s => s.id))
  const [progress, setProgress] = useState(0)
  const activeIdx  = SECTIONS.findIndex(s => s.id === activeId)

  useEffect(() => {
    function onScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? window.scrollY / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{
      position:      'fixed',
      left:          '12px',
      top:           '50%',
      transform:     'translateY(-50%)',
      zIndex:        200,
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      gap:           '0',
    }}>

      {/* progress line track */}
      <div style={{
        position:   'absolute',
        left:       '50%',
        top:        '8px',
        bottom:     '8px',
        width:      '1px',
        background: C.border,
        transform:  'translateX(-50%)',
      }}>
        <motion.div
          style={{
            width:      '100%',
            background: `linear-gradient(to bottom, ${C.amber}, ${C.amberDim})`,
            boxShadow:  `0 0 4px ${C.amber}`,
            originY:    0,
          }}
          animate={{ height: `${progress * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {SECTIONS.map((s, i) => {
        const isActive = activeId === s.id
        const isPast   = i < activeIdx

        return (
          <div
            key={s.id}
            onClick={() => scrollTo(s.id)}
            style={{
              position:   'relative',
              padding:    '6px 0',
              display:    'flex',
              alignItems: 'center',
              gap:        '8px',
              cursor:     'pointer',
              zIndex:     1,
            }}
          >
            {/* dot */}
            <motion.div
              animate={{
                width:      isActive ? '12px' : '6px',
                height:     isActive ? '12px' : '6px',
                background: isActive
                  ? C.amber
                  : isPast
                  ? `${C.amber}66`
                  : C.border,
                boxShadow:  isActive
                  ? `0 0 10px ${C.amber}, 0 0 20px ${C.amberGlow}`
                  : 'none',
              }}
              style={{
                borderRadius: '50%',
                flexShrink:   0,
                transition:   css.fast,
              }}
            />

            {/* label — only for active */}
            <motion.div
              animate={{
                opacity:   isActive ? 1 : 0,
                x:         isActive ? 0 : -8,
                width:     isActive ? 'auto' : 0,
              }}
              style={{
                overflow:   'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{
                fontSize:      '10px',
                fontWeight:    '600',
                color:         C.amber,
                letterSpacing: '0.06em',
                display:       'block',
                paddingRight:  '4px',
              }}>
                {s.label}
              </span>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
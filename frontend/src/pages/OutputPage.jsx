// ─────────────────────────────────────────────────────
// OutputPage.jsx  (responsive)
// THE CONDUCTOR — arranges all 20+ components
// Zero animation logic here
// Zero data processing here
// Just imports, normalizes, and arranges
// Five acts with connectors between them
// ─────────────────────────────────────────────────────

import { useEffect, useState }   from 'react'
import { motion }                from 'framer-motion'
import { normalizeData }         from '../utils/normalize'
import { C }                     from '../utils/colors'

// layout
import ThreeZoneLayout           from '../components/layout/ThreeZoneLayout'
import LeftPanel                 from '../components/layout/LeftPanel'
import RightHUD                  from '../components/layout/RightHUD'

// ui
import ActConnector              from '../components/ui/ActConnector'
import SectionProgress           from '../components/ui/SectionProgress'
import JarvisChat                from '../components/ui/JarvisChat'

// cards — act by act
import HeroCard                  from '../components/cards/HeroCard'
import InsightCard               from '../components/cards/InsightCard'
import SkillCard                 from '../components/cards/SkillCard'
import ResumeCard                from '../components/cards/ResumeCard'
import NextStepCard              from '../components/cards/NextStepCard'
import RoadmapCard               from '../components/cards/RoadmapCard'
import PortfolioCard             from '../components/cards/PortfolioCard'
import JobMatchCard              from '../components/cards/JobMatchCard'

// visual — dependency graph
import ForceGraph                from '../components/visual/ForceGraph'

// ── tiny responsive hook ───────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    const handler = () => setW(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  // Three-zone layout needs ~1100px to be comfortable
  return { isMobile: w < 640, isTablet: w < 1100, width: w }
}

export default function OutputPage({ data, onReset }) {

  const { isMobile, isTablet } = useBreakpoint()

  // normalize raw Groq data into clean guaranteed shape
  const normalized = normalizeData(data)

  if (!normalized) {
    return (
      <div style={{
        minHeight:      '100vh',
        background:     C.bg,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexDirection:  'column',
        gap:            '16px',
        padding:        '20px',
      }}>
        <p style={{ color: C.red, fontSize: '16px', textAlign: 'center' }}>
          Something went wrong. No data received.
        </p>
        <button
          onClick={onReset}
          style={{
            background:   'transparent',
            border:       `1px solid ${C.border}`,
            color:        C.textMuted,
            padding:      '10px 20px',
            borderRadius: '8px',
            cursor:       'pointer',
            fontSize:     '14px',
          }}
        >
          ← Try again
        </button>
      </div>
    )
  }

  // ── CENTER CONTENT ─────────────────────────────────
  const CenterContent = (
    <div style={{
      maxWidth: '680px',
      margin:   '0 auto',
      padding:  isMobile ? '16px 0 100px' : '20px 0 120px',
    }}>

      {/* ── ACT 1: THE AWAKENING ── */}
      <HeroCard data={normalized} />

      <ActConnector message="these gaps reveal your key insights" />

      {/* ── ACT 2a: KEY INSIGHTS ── */}
      <InsightCard data={normalized} />

      <ActConnector message="which maps your full skill picture" />

      {/* ── ACT 2b: SKILLS ── */}
      <SkillCard data={normalized} />

      {/* ── DEPENDENCY GRAPH ── */}
      {normalized.depMap?.nodes?.length > 0 && (
        <>
          <ActConnector message="showing how skills unlock each other" />
          <div
            id="act3-graph"
            style={{
              background:   C.card,
              border:       `1px solid ${C.border}`,
              borderRadius: '16px',
              padding:      isMobile ? '16px' : '24px',
              marginBottom: '0',
            }}
          >
            <p style={{
              fontSize:      '9px',
              fontWeight:    '600',
              letterSpacing: '0.15em',
              color:         C.amber,
              textTransform: 'uppercase',
              marginBottom:  '8px',
              display:       'flex',
              alignItems:    'center',
              gap:           '8px',
            }}>
              <span style={{ display: 'inline-block', width: '14px', height: '1px', background: C.amber }} />
              Skill dependency map
            </p>
            <p style={{ fontSize: '13px', fontWeight: '600', color: C.text, marginBottom: '4px' }}>
              {normalized.depMap.map_title}
            </p>
            <p style={{ fontSize: '11px', color: C.textMuted, marginBottom: '16px' }}>
              {isMobile ? 'Tap nodes to explore' : 'Drag nodes to explore — hover to see connections'}
            </p>

            {/* critical path */}
            {normalized.depMap.critical_path?.length > 0 && (
              <div style={{
                background:   C.amberGlowSm,
                border:       `1px solid ${C.amberBorder}`,
                borderRadius: '10px',
                padding:      '12px 16px',
                marginBottom: '16px',
                display:      'flex',
                alignItems:   'center',
                flexWrap:     'wrap',
                gap:          '6px',
              }}>
                <p style={{
                  fontSize:      '9px',
                  color:         C.amber,
                  fontWeight:    '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginRight:   '4px',
                }}>
                  Critical path
                </p>
                {normalized.depMap.critical_path.map((id, i) => {
                  const node = normalized.depMap.nodes.find(n => n.id === id)
                  return node ? (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        fontSize:     '11px',
                        color:        C.amber,
                        background:   C.amberGlowSm,
                        border:       `1px solid ${C.amberBorder}`,
                        borderRadius: '6px',
                        padding:      '3px 10px',
                      }}>
                        {node.name}
                      </span>
                      {i < normalized.depMap.critical_path.length - 1 && (
                        <span style={{ color: C.amber, fontSize: '10px', opacity: 0.5 }}>→</span>
                      )}
                    </div>
                  ) : null
                })}
              </div>
            )}

            <ForceGraph depMap={normalized.depMap} />
          </div>
        </>
      )}

      <ActConnector message="exposing what needs to be fixed" />

      {/* ── ACT 3: THE WOUND ── */}
      <ResumeCard data={normalized} />

      <ActConnector message="which defines your exact next step" />

      {/* ── ACT 4a: THE PATH — NEXT STEP ── */}
      <NextStepCard data={normalized} />

      <ActConnector message="part of a longer journey" />

      {/* ── ACT 4b: THE ROAD ── */}
      <RoadmapCard data={normalized} />

      {/* ── ACT 5a: PORTFOLIO ── */}
      {normalized.portfolio && (
        <>
          <ActConnector message="measured against your portfolio" />
          <PortfolioCard data={normalized} />
        </>
      )}

      {/* ── GITHUB ── */}
      {normalized.github && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background:   C.card,
            border:       `1px solid ${C.border}`,
            borderRadius: '16px',
            padding:      isMobile ? '16px' : '24px',
            marginTop:    '16px',
          }}
        >
          <p style={{
            fontSize:      '9px',
            fontWeight:    '600',
            letterSpacing: '0.15em',
            color:         C.amber,
            textTransform: 'uppercase',
            marginBottom:  '8px',
            display:       'flex',
            alignItems:    'center',
            gap:           '8px',
          }}>
            <span style={{ display: 'inline-block', width: '14px', height: '1px', background: C.amber }} />
            GitHub analysis
          </p>
          <p style={{ fontSize: '13px', fontWeight: '600', color: C.text, marginBottom: '16px' }}>
            {normalized.github.title || 'Repository review'}
          </p>

          <div style={{
            display:    'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap:        '16px',
            marginBottom: '12px',
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <p style={{
              fontSize:   isMobile ? '36px' : '40px',
              fontWeight: '700',
              color:      C.scoreColor(normalized.github.score),
              fontFamily: 'monospace',
              lineHeight: '1',
              flexShrink: 0,
            }}>
              {normalized.github.score}
              <span style={{ fontSize: '16px', color: C.textMuted }}>/100</span>
            </p>
            <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: '1.6' }}>
              {normalized.github.summary}
            </p>
          </div>

          {normalized.github.findings?.length > 0 && (
            <div style={{
              display:             'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap:                 '12px',
              marginBottom:        '12px',
            }}>
              <div>
                {normalized.github.findings
                  .filter(f => f.type === 'positive')
                  .map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ color: C.teal, fontSize: '11px', marginTop: '2px', flexShrink: 0 }}>→</span>
                      <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.5' }}>{f.point}</p>
                    </div>
                  ))
                }
              </div>
              <div>
                {normalized.github.findings
                  .filter(f => f.type === 'negative')
                  .map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ color: C.red, fontSize: '11px', marginTop: '2px', flexShrink: 0 }}>•</span>
                      <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.5' }}>{f.point}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {normalized.github.improvements?.length > 0 && (
            <div style={{
              background:   'rgba(10,15,26,0.6)',
              border:       `1px solid ${C.border}`,
              borderRadius: '10px',
              padding:      '14px',
            }}>
              <p style={{ fontSize: '9px', color: C.textMuted, fontWeight: '600', marginBottom: '8px', letterSpacing: '0.1em' }}>
                HOW TO IMPROVE
              </p>
              {normalized.github.improvements.map((imp, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ color: C.amber, fontSize: '11px', marginTop: '2px', flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: '12px', color: C.textMuted, lineHeight: '1.5' }}>{imp}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ── ACT 5b: JOB MATCH ── */}
      {normalized.jobMatch && (
        <>
          <ActConnector message="and compared against your target role" />
          <JobMatchCard data={normalized} />
        </>
      )}

      {/* ── COMPLETION SEQUENCE ── */}
      <div id="completion">
        <ActConnector message="your journey is mapped" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:   'rgba(8,12,20,0.95)',
            border:       `1px solid ${C.amberBorder}`,
            borderRadius: '20px',
            padding:      isMobile ? '28px 20px' : '40px',
            textAlign:    'center',
            position:     'relative',
            overflow:     'hidden',
          }}
        >
          {/* ambient glow */}
          <motion.div
            animate={{
              background: [
                `radial-gradient(ellipse at 50% 50%, ${C.amberGlowSm}, transparent 70%)`,
                `radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.08), transparent 70%)`,
                `radial-gradient(ellipse at 50% 50%, ${C.amberGlowSm}, transparent 70%)`,
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              position:      'absolute',
              inset:         0,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                fontSize:     '36px',
                marginBottom: '16px',
                display:      'block',
                color:        C.amber,
              }}
            >
              ◎
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize:      isMobile ? '22px' : '28px',
                fontWeight:    '700',
                color:         C.text,
                marginBottom:  '8px',
                letterSpacing: '-0.02em',
              }}
            >
              Your journey is mapped
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize:     '15px',
                color:        C.textMuted,
                marginBottom: '8px',
                lineHeight:   '1.6',
              }}
            >
              You are{' '}
              <span style={{ color: C.scoreColor(normalized.score), fontWeight: '700' }}>
                {normalized.score}% of the way
              </span>
              {' '}to your goal.
            </motion.p>

            {normalized.totalTime && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                style={{
                  fontSize:     '13px',
                  color:        C.textMuted,
                  marginBottom: '32px',
                }}
              >
                Estimated total: {normalized.totalTime}
              </motion.p>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{
                  scale:     1.05,
                  boxShadow: `0 0 40px ${C.amber}44`,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                style={{
                  background:   C.amber,
                  border:       'none',
                  color:        '#080c14',
                  padding:      isMobile ? '14px 24px' : '14px 32px',
                  borderRadius: '10px',
                  fontSize:     '14px',
                  fontWeight:   '700',
                  cursor:       'pointer',
                }}
              >
                Start a new journey →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  )

  // ── THREE ZONE LAYOUT (desktop only) ───────────────
  // On tablet/mobile: collapse to single-column, hide side panels
  if (isTablet) {
    return (
      <>
        <SectionProgress />

        {/* Mobile top bar with reset */}
        <div style={{
          position:       'sticky',
          top:            0,
          zIndex:         50,
          background:     'rgba(8,12,20,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom:   `1px solid ${C.border}`,
          padding:        isMobile ? '12px 16px' : '14px 24px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ color: C.amber, fontSize: '16px' }}
            >
              ◎
            </motion.span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: C.text }}>Journey</span>
          </div>

          <button
            onClick={onReset}
            style={{
              background:   'transparent',
              border:       `1px solid ${C.border}`,
              color:        C.textMuted,
              padding:      '7px 14px',
              borderRadius: '8px',
              cursor:       'pointer',
              fontSize:     '13px',
            }}
          >
            ← New journey
          </button>
        </div>

        {/* Single column content */}
        <div style={{ padding: isMobile ? '0 16px' : '0 24px' }}>
          {CenterContent}
        </div>

        <JarvisChat profile={data} />
      </>
    )
  }

  return (
    <>
      <SectionProgress />

      <ThreeZoneLayout data={normalized}>
        {{
          left:   <LeftPanel  data={normalized} onReset={onReset} />,
          center: CenterContent,
          right:  <RightHUD   data={normalized} />,
        }}
      </ThreeZoneLayout>

      <JarvisChat profile={data} />
    </>
  )
}
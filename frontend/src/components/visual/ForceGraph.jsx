// ─────────────────────────────────────────────────────
// ForceGraph.jsx
// D3 force-directed skill dependency graph
// Full width — 600px tall
// Nodes spawn with particle burst on load
// Electric pulse travels along edges on hover
// Critical path nodes have continuous amber pulse ring
// Draggable nodes with physics
// ─────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import * as d3                         from 'd3'
import { C }                           from '../../utils/colors'
import useInView                       from '../../hooks/useInView'

export default function ForceGraph({ depMap }) {
  const svgRef           = useRef(null)
  const { ref, inView }  = useInView(0.2)
  const startedRef       = useRef(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!inView || startedRef.current || !depMap?.nodes) return
    startedRef.current = true

    const W = svgRef.current?.parentElement?.offsetWidth || 640
    const H = 560

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width',   W)
      .attr('height',  H)
      .attr('viewBox', `0 0 ${W} ${H}`)

    // defs
    const defs = svg.append('defs')

    // glow filter
    const glowFilter = defs.append('filter').attr('id', 'glow-filter')
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur')
    const merge = glowFilter.append('feMerge')
    merge.append('feMergeNode').attr('in', 'blur')
    merge.append('feMergeNode').attr('in', 'SourceGraphic')

    // arrow marker
    defs.append('marker')
      .attr('id',           'dep-arrow')
      .attr('viewBox',      '0 0 10 10')
      .attr('refX',         9)
      .attr('refY',         5)
      .attr('markerWidth',  6)
      .attr('markerHeight', 6)
      .attr('orient',       'auto')
      .append('path')
      .attr('d',            'M1 1L9 5L1 9')
      .attr('fill',         'none')
      .attr('stroke',       `${C.amber}66`)
      .attr('stroke-width', 1.5)

    const colorMap = {
      have:     C.amber,
      basic:    C.textMuted,
      learning: C.blue,
      locked:   '#1e2a3a',
    }

    // build links
    const links = []
    depMap.nodes.forEach(node => {
      node.unlocks?.forEach(targetId => {
        if (depMap.nodes.find(n => n.id === targetId)) {
          links.push({ source: node.id, target: targetId })
        }
      })
    })

    const nodes = depMap.nodes.map(n => ({ ...n }))

    // force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link',      d3.forceLink(links).id(d => d.id).distance(100).strength(0.4))
      .force('charge',    d3.forceManyBody().strength(-280))
      .force('center',    d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(38))

    // ── LINKS ─────────────────────────────────────
    const linkGroup = svg.append('g')
    const link = linkGroup
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke',       `${C.amber}22`)
      .attr('stroke-width',  1)
      .attr('marker-end',   'url(#dep-arrow)')

    // ── PULSE PARTICLES ON LINKS ──────────────────
    // animated dots traveling along links
    const pulseParticles = linkGroup
      .selectAll('.pulse-particle')
      .data(links)
      .enter()
      .append('circle')
      .attr('class',  'pulse-particle')
      .attr('r',       2)
      .attr('fill',    C.amber)
      .attr('opacity', 0.8)

    // animate particles along links
    function animateParticles() {
      pulseParticles
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attrTween('cx', function(d) {
          return t => {
            if (!d.source.x) return 0
            return d.source.x + (d.target.x - d.source.x) * t
          }
        })
        .attrTween('cy', function(d) {
          return t => {
            if (!d.source.y) return 0
            return d.source.y + (d.target.y - d.source.y) * t
          }
        })
        .attr('opacity', 0)
        .on('end', animateParticles)
    }

    setTimeout(animateParticles, 1000)

    // ── NODES ─────────────────────────────────────
    const nodeGroup = svg.append('g')

    const node = nodeGroup
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      // spawn animation — start invisible
      .attr('opacity', 0)

    // critical path pulse ring
    node.filter(d => d.is_critical_path)
      .append('circle')
      .attr('class', 'pulse-ring')
      .attr('r',     24)
      .attr('fill',  'none')
      .attr('stroke', `${C.amber}44`)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 4')

    // outer glow circle
    node.append('circle')
      .attr('r',    22)
      .attr('fill', d => `${colorMap[d.level] || '#1e2a3a'}15`)
      .attr('stroke', d => `${colorMap[d.level] || C.border}33`)
      .attr('stroke-width', 1)

    // main circle
    node.append('circle')
      .attr('r',    16)
      .attr('fill', d => {
        if (d.level === 'locked') return '#0f1520'
        return colorMap[d.level] || '#1e2a3a'
      })
      .attr('stroke', d => colorMap[d.level] || C.border)
      .attr('stroke-width', 1.5)
      .attr('filter', d => d.level !== 'locked' ? 'url(#glow-filter)' : null)

    // label
    node.append('text')
      .text(d => d.name?.length > 9 ? d.name.slice(0, 8) + '…' : d.name)
      .attr('text-anchor',  'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill',         d => d.level === 'locked' ? C.textMuted : '#080c14')
      .attr('font-size',    '9px')
      .attr('font-weight',  '700')
      .attr('font-family',  'Inter, sans-serif')
      .style('pointer-events', 'none')

    // time label below node
    node.filter(d => d.time_to_learn && d.level !== 'have')
      .append('text')
      .text(d => d.time_to_learn)
      .attr('text-anchor', 'middle')
      .attr('y',           26)
      .attr('fill',        C.textMuted)
      .attr('font-size',   '8px')
      .attr('font-family', 'Inter, sans-serif')
      .style('pointer-events', 'none')

    // ── NODE INTERACTIONS ─────────────────────────
    node
      .on('mouseenter', function(event, d) {
        // highlight this node
        d3.select(this).select('circle:nth-child(2)')
          .attr('r', 20)

        // brighten connected links
        link
          .attr('stroke', l =>
            l.source.id === d.id || l.target.id === d.id
              ? `${C.amber}cc`
              : `${C.amber}11`
          )
          .attr('stroke-width', l =>
            l.source.id === d.id || l.target.id === d.id ? 2 : 0.5
          )

        setSelected(d)
      })
      .on('mouseleave', function() {
        d3.select(this).select('circle:nth-child(2)').attr('r', 16)
        link.attr('stroke', `${C.amber}22`).attr('stroke-width', 1)
      })

    // drag
    node.call(
      d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x; d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x; d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null; d.fy = null
        })
    )

    // ── TICK ──────────────────────────────────────
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      pulseParticles
        .attr('cx', d => d.source.x || 0)
        .attr('cy', d => d.source.y || 0)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    // ── SPAWN ANIMATION ───────────────────────────
    // nodes fade in one by one
    node
      .transition()
      .delay((d, i) => i * 80)
      .duration(400)
      .attr('opacity', 1)

    // animate critical path pulse rings
    function pulseDash() {
      svg.selectAll('.pulse-ring')
        .transition()
        .duration(1500)
        .attr('stroke-dashoffset', -30)
        .on('end', pulseDash)
    }
    pulseDash()

    return () => simulation.stop()
  }, [inView, depMap])

  return (
    <div ref={ref}>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg ref={svgRef} />
      </div>

      {/* selected node detail */}
      {selected && (
        <div style={{
          marginTop:    '16px',
          background:   `${colorMap?.[selected.level] || C.border}15`,
          border:       `1px solid ${colorMap?.[selected.level] || C.border}44`,
          borderRadius: '10px',
          padding:      '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: C.text }}>
              {selected.name}
            </p>
            <button
              onClick={() => setSelected(null)}
              style={{
                background: 'none', border: 'none',
                color: C.textMuted, cursor: 'pointer', fontSize: '16px',
              }}
            >
              ×
            </button>
          </div>
          {selected.why_first && (
            <p style={{ fontSize: '12px', color: C.textMuted, marginTop: '6px', lineHeight: '1.6' }}>
              {selected.why_first}
            </p>
          )}
          {selected.time_to_learn && selected.level !== 'have' && (
            <p style={{ fontSize: '11px', color: C.amber, marginTop: '6px' }}>
              Time to learn: {selected.time_to_learn}
            </p>
          )}
          {selected.unlocks?.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', color: C.textMuted }}>Unlocks:</span>
              {selected.unlocks.map(id => {
                const node = depMap.nodes.find(n => n.id === id)
                return node ? (
                  <span key={id} style={{
                    fontSize: '10px', color: C.amber,
                    background: C.amberGlowSm,
                    border: `1px solid ${C.amberBorder}`,
                    borderRadius: '4px', padding: '2px 8px',
                  }}>
                    {node.name}
                  </span>
                ) : null
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// colorMap needs to be accessible outside useEffect
const colorMap = {
  have:     C.amber,
  basic:    C.textMuted,
  learning: C.blue,
  locked:   '#1e2a3a',
}

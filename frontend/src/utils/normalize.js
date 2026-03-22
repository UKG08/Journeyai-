// ─────────────────────────────────────────────────────
// normalize.js
// Takes raw Groq API response and returns clean data
// Every component receives guaranteed shape from here
// No component should ever read raw data directly
// ─────────────────────────────────────────────────────

// ── SKILLS ──────────────────────────────────────────
function normalizeSkill(raw) {
  return {
    name:  typeof raw?.name  === 'string' ? raw.name  : 'Unknown',
    level: ['strong','basic','missing'].includes(raw?.level)
      ? raw.level
      : 'missing',
    note:  typeof raw?.note  === 'string' ? raw.note  : '',
  }
}

function normalizeSkills(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(normalizeSkill)
}

// ── POSITION SUMMARY ────────────────────────────────
function normalizeSummary(raw) {
  if (typeof raw === 'string') {
    return {
      overview:          raw,
      strengths:         [],
      honest_gaps:       [],
      hidden_advantage:  null,
    }
  }
  return {
    overview:         typeof raw?.overview          === 'string' ? raw.overview          : '',
    strengths:        Array.isArray(raw?.strengths)              ? raw.strengths.filter(s => typeof s === 'string')         : [],
    honest_gaps:      Array.isArray(raw?.honest_gaps)            ? raw.honest_gaps.filter(g => typeof g === 'string')       : [],
    hidden_advantage: typeof raw?.hidden_advantage  === 'string' ? raw.hidden_advantage  : null,
  }
}

// ── RESUME SUMMARY ───────────────────────────────────
function normalizeResumeSummary(raw) {
  if (typeof raw === 'string') {
    return {
      overall_impression: raw,
      biggest_strength:   null,
      biggest_problem:    null,
    }
  }
  return {
    overall_impression: typeof raw?.overall_impression === 'string' ? raw.overall_impression : '',
    biggest_strength:   typeof raw?.biggest_strength   === 'string' ? raw.biggest_strength   : null,
    biggest_problem:    typeof raw?.biggest_problem    === 'string' ? raw.biggest_problem    : null,
  }
}

// ── RESUME WEAK SPOTS ────────────────────────────────
function normalizeWeakSpots(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(spot => ({
    section:     typeof spot?.section     === 'string' ? spot.section     : 'General',
    issue:       typeof spot?.issue       === 'string' ? spot.issue       : '',
    why_it_hurts:typeof spot?.why_it_hurts=== 'string' ? spot.why_it_hurts: '',
    fix:         typeof spot?.fix         === 'string' ? spot.fix         : '',
    example:     typeof spot?.example     === 'string' ? spot.example     : '',
  }))
}

// ── NEXT STEP ─────────────────────────────────────────
function normalizeWhy(raw) {
  if (typeof raw === 'string') {
    return { main_reason: raw, career_impact: null, builds_on: null }
  }
  return {
    main_reason:   typeof raw?.main_reason   === 'string' ? raw.main_reason   : '',
    career_impact: typeof raw?.career_impact === 'string' ? raw.career_impact : null,
    builds_on:     typeof raw?.builds_on     === 'string' ? raw.builds_on     : null,
  }
}

function normalizeWeekPlan(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(item => ({
    day:  typeof item?.day  === 'string' ? item.day  : '',
    task: typeof item?.task === 'string' ? item.task : '',
    goal: typeof item?.goal === 'string' ? item.goal : '',
  }))
}

function normalizeResources(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(r => ({
    title:        typeof r?.title        === 'string' ? r.title        : '',
    url:          typeof r?.url          === 'string' ? r.url          : '#',
    type:         typeof r?.type         === 'string' ? r.type         : '',
    use_on:       typeof r?.use_on       === 'string' ? r.use_on       : '',
    why_this_one: typeof r?.why_this_one === 'string' ? r.why_this_one : '',
  }))
}

function normalizeNextStep(raw) {
  if (!raw) return null
  return {
    title:                   typeof raw?.title                   === 'string' ? raw.title                   : '',
    why:                     normalizeWhy(raw?.why),
    what_you_will_have_after:typeof raw?.what_you_will_have_after=== 'string' ? raw.what_you_will_have_after: '',
    time_estimate:           typeof raw?.time_estimate           === 'string' ? raw.time_estimate           : '',
    week_plan:               normalizeWeekPlan(raw?.week_plan),
    resources:               normalizeResources(raw?.resources),
  }
}

// ── ROADMAP ───────────────────────────────────────────
function normalizeRoadmap(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(step => ({
    step:          typeof step?.step        === 'string'  ? step.step        : '',
    why_now:       typeof step?.why_now     === 'string'  ? step.why_now     : '',
    what_to_learn: Array.isArray(step?.what_to_learn)
      ? step.what_to_learn.filter(t => typeof t === 'string')
      : [],
    milestone:     typeof step?.milestone   === 'string'  ? step.milestone   : '',
    time:          typeof step?.time        === 'string'  ? step.time        : '',
    is_current:    step?.is_current === true,
  }))
}

// ── PORTFOLIO ─────────────────────────────────────────
function normalizeBreakdown(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(item => ({
    category: typeof item?.category === 'string' ? item.category : '',
    score:    typeof item?.score    === 'number' ? item.score    : 0,
    comment:  typeof item?.comment  === 'string' ? item.comment  : '',
  }))
}

function normalizePortfolio(raw) {
  if (!raw) return null
  return {
    score:            typeof raw?.score             === 'number' ? raw.score             : 0,
    grade:            typeof raw?.grade             === 'string' ? raw.grade             : '',
    summary:          typeof raw?.summary           === 'string' ? raw.summary           : '',
    breakdown:        normalizeBreakdown(raw?.breakdown),
    strongest_project:typeof raw?.strongest_project === 'string' ? raw.strongest_project : '',
    missing_projects: Array.isArray(raw?.missing_projects)
      ? raw.missing_projects.filter(p => typeof p === 'string')
      : [],
  }
}

// ── GITHUB ────────────────────────────────────────────
function normalizeGithub(raw) {
  if (!raw || raw?.error) return null
  return {
    score:        typeof raw?.score       === 'number' ? raw.score       : 0,
    summary:      typeof raw?.summary     === 'string' ? raw.summary     : '',
    top_project:  typeof raw?.top_project === 'string' ? raw.top_project : '',
    findings:     Array.isArray(raw?.findings)
      ? raw.findings.filter(f => f?.type && f?.point)
      : [],
    improvements: Array.isArray(raw?.improvements)
      ? raw.improvements.filter(i => typeof i === 'string')
      : [],
  }
}

// ── JOB MATCH ─────────────────────────────────────────
function normalizeJobMatch(raw) {
  if (!raw) return null
  return {
    match_percentage:       typeof raw?.match_percentage       === 'number' ? raw.match_percentage       : 0,
    summary:                typeof raw?.summary                === 'string' ? raw.summary                : '',
    apply_recommendation:   typeof raw?.apply_recommendation   === 'string' ? raw.apply_recommendation   : 'no',
    verdict:                typeof raw?.verdict                === 'string' ? raw.verdict                : '',
    matched_requirements:   Array.isArray(raw?.matched_requirements)  ? raw.matched_requirements  : [],
    missing_requirements:   Array.isArray(raw?.missing_requirements)  ? raw.missing_requirements  : [],
  }
}

// ── META ANALYSIS ─────────────────────────────────────
function normalizeMeta(raw) {
  if (!raw) return null
  return {
    headline:          typeof raw?.headline          === 'string' ? raw.headline          : '',
    top_3_insights:    Array.isArray(raw?.top_3_insights)         ? raw.top_3_insights    : [],
    realistic_timeline:typeof raw?.realistic_timeline === 'string' ? raw.realistic_timeline: '',
    biggest_risk:      typeof raw?.biggest_risk      === 'string' ? raw.biggest_risk      : '',
    biggest_risk_solution: typeof raw?.biggest_risk_solution === 'string'
      ? raw.biggest_risk_solution : '',
  }
}

// ── DEPENDENCY MAP ────────────────────────────────────
function normalizeDepMap(raw) {
  if (!raw?.nodes) return null
  return {
    map_title:     typeof raw?.map_title     === 'string' ? raw.map_title     : 'Skill dependency map',
    critical_path: Array.isArray(raw?.critical_path)      ? raw.critical_path : [],
    nodes:         Array.isArray(raw?.nodes)
      ? raw.nodes.map(n => ({
          id:              typeof n?.id              === 'string'  ? n.id              : '',
          name:            typeof n?.name            === 'string'  ? n.name            : '',
          level:           ['have','basic','learning','locked'].includes(n?.level)
            ? n.level : 'locked',
          unlocks:         Array.isArray(n?.unlocks)               ? n.unlocks         : [],
          why_first:       typeof n?.why_first       === 'string'  ? n.why_first       : '',
          time_to_learn:   typeof n?.time_to_learn   === 'string'  ? n.time_to_learn   : '',
          is_critical_path:n?.is_critical_path === true,
        }))
      : [],
  }
}

// ── QUICK STATS ───────────────────────────────────────
// Derived stats used by StatFlipBoard and RightHUD
function deriveStats(raw, skills) {
  const strong  = skills.filter(s => s.level === 'strong').length
  const basic   = skills.filter(s => s.level === 'basic').length
  const missing = skills.filter(s => s.level === 'missing').length

  return {
    skillsStrong:  strong,
    skillsBasic:   basic,
    skillsMissing: missing,
    totalSkills:   skills.length,
    readiness:     typeof raw?.readiness_score  === 'number' ? raw.readiness_score  : 0,
    portfolioScore:raw?.portfolio_score?.score  ?? null,
    roadmapSteps:  Array.isArray(raw?.roadmap)  ? raw.roadmap.length : 0,
    currentStep:   Array.isArray(raw?.roadmap)
      ? (raw.roadmap.findIndex(s => s.is_current) + 1) || 1
      : 1,
    matchPercent:  raw?.job_match?.match_percentage ?? null,
  }
}

// ── MAIN EXPORT ───────────────────────────────────────
export function normalizeData(raw) {
  if (!raw) return null

  const skills = normalizeSkills(raw.skills)

  return {
    // identity
    level:         typeof raw?.current_level === 'string' ? raw.current_level : 'Unknown',
    score:         typeof raw?.readiness_score === 'number' ? raw.readiness_score : 0,
    shareId:       typeof raw?.share_id === 'string' ? raw.share_id : null,

    // sections
    summary:       normalizeSummary(raw.current_position_summary),
    skills,
    resumeSummary: normalizeResumeSummary(raw.resume_summary),
    weakSpots:     normalizeWeakSpots(raw.resume_weak_spots),
    quickWins:     Array.isArray(raw?.quick_wins)
      ? raw.quick_wins.filter(w => typeof w === 'string')
      : [],
    nextStep:      normalizeNextStep(raw.next_step),
    roadmap:       normalizeRoadmap(raw.roadmap),
    roadmapTitle:  typeof raw?.roadmap_title      === 'string' ? raw.roadmap_title      : 'Your path forward',
    totalTime:     typeof raw?.estimated_total_time=== 'string' ? raw.estimated_total_time: '',
    portfolio:     normalizePortfolio(raw.portfolio_score),
    github:        normalizeGithub(raw.github_analysis),
    jobMatch:      normalizeJobMatch(raw.job_match),
    meta:          normalizeMeta(raw.meta_analysis),
    depMap:        normalizeDepMap(raw.dependency_map),

    // derived
    stats:         deriveStats(raw, skills),
  }
}
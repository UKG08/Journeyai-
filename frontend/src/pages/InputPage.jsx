import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { C } from '../utils/colors'
import { css } from '../animations/transitions'

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
  return { isMobile: w < 640, isTablet: w < 1024, width: w }
}

const STEPS = [
  {
    waypoint: '01',
    title:    'Where have you been?',
    subtitle: 'Upload your resume and tell us your story so far',
  },
  {
    waypoint: '02',
    title:    'What have you discovered?',
    subtitle: "Tell us what you've built or learned recently — even if it's not on your resume",
  },
  {
    waypoint: '03',
    title:    'Where do you want to go?',
    subtitle: 'Set your destination and help us personalize your path',
  },
]

export default function InputPage({ onLoading, onResult }) {
  const [step,           setStep]           = useState(0)
  const [error,          setError]          = useState(null)
  const [dragOver,       setDragOver]       = useState(false)
  const [resume,         setResume]         = useState(null)
  const [recentWork,     setRecentWork]     = useState('')
  const [careerGoal,     setCareerGoal]     = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [hoursPerDay,    setHoursPerDay]    = useState('')
  const [struggle,       setStruggle]       = useState('')
  const [background,     setBackground]     = useState('')
  const [githubUrl,      setGithubUrl]      = useState('')

  const { isMobile } = useBreakpoint()

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') setResume(file)
  }

  function next() {
    if (step === 0 && !resume)           return setError('Please upload your resume PDF')
    if (step === 1 && !recentWork.trim()) return setError('Please describe your recent work')
    setError(null)
    setStep(s => s + 1)
  }

  function prev() {
    setError(null)
    setStep(s => s - 1)
  }

  async function handleSubmit() {
    if (!careerGoal.trim()) return setError('Please enter your career goal')
    setError(null)
    onLoading()

    try {
      const form = new FormData()
      form.append('resume',          resume)
      form.append('recent_work',     recentWork)
      form.append('career_goal',     careerGoal)
      form.append('hours_per_day',   hoursPerDay    || '1-2 hours')
      form.append('struggle',        struggle       || 'nothing specific')
      form.append('background',      background     || 'not specified')
      if (jobDescription) form.append('job_description', jobDescription)
      if (githubUrl)      form.append('github_url',      githubUrl)

      const res = await axios.post(
        'https://journeyai-myji.onrender.com/analyze',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      onResult(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const inputStyle = {
    width:        '100%',
    background:   'rgba(15,21,32,0.8)',
    border:       `1px solid ${C.border}`,
    borderRadius: '10px',
    padding:      isMobile ? '12px 14px' : '14px 16px',
    fontSize:     isMobile ? '16px' : '15px', // 16px prevents iOS zoom on focus
    color:        C.text,
    outline:      'none',
    resize:       'none',
    transition:   css.fast,
    boxSizing:    'border-box',
  }

  const labelStyle = {
    display:      'block',
    fontSize:     '13px',
    fontWeight:   '500',
    color:        C.textMuted,
    marginBottom: '8px',
  }

  const selectStyle = {
    ...inputStyle,
    cursor:     'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  }

  function onFocus(e)  { e.target.style.borderColor = C.amberBorder }
  function onBlur(e)   { e.target.style.borderColor = C.border      }

  // connector line width responsive
  const connectorWidth = isMobile ? '40px' : '60px'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{   opacity: 0 }}
      style={{
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        padding:        isMobile ? '24px 16px' : '40px 20px',
        position:       'relative',
      }}
    >
      {/* grid background */}
      <div style={{
        position:        'fixed',
        inset:           0,
        backgroundImage: `
          linear-gradient(rgba(245,158,11,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,158,11,0.02) 1px, transparent 1px)
        `,
        backgroundSize:  '56px 56px',
        pointerEvents:   'none',
        zIndex:          0,
      }} />

      <div style={{
        position: 'relative',
        zIndex:   1,
        width:    '100%',
        maxWidth: '580px',
      }}>

        {/* logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0   }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: isMobile ? '32px' : '48px' }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ color: C.amber, fontSize: '18px' }}
          >
            ◎
          </motion.span>
          <span style={{ fontSize: '16px', fontWeight: '600', color: C.text }}>Journey</span>
        </motion.div>

        {/* progress waypoints */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          marginBottom:   isMobile ? '32px' : '48px',
        }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                animate={{
                  background:  i <= step ? C.amberGlowSm : 'rgba(30,42,58,0.5)',
                  borderColor: i <= step ? C.amberBorder  : C.border,
                  color:       i <= step ? C.amber         : C.textMuted,
                }}
                style={{
                  width:          isMobile ? '32px' : '36px',
                  height:         isMobile ? '32px' : '36px',
                  borderRadius:   '50%',
                  border:         '1px solid',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '12px',
                  fontWeight:     '600',
                  transition:     css.normal,
                  flexShrink:     0,
                }}
              >
                {i < step ? '✓' : s.waypoint}
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  animate={{ background: i < step ? C.amber : C.border }}
                  style={{ width: connectorWidth, height: '1px', transition: css.normal }}
                />
              )}
            </div>
          ))}
        </div>

        {/* step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40  }}
            animate={{ opacity: 1, x: 0   }}
            exit={{   opacity: 0, x: -40  }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* step header */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{
                fontSize:      '10px',
                fontWeight:    '600',
                letterSpacing: '0.15em',
                color:         C.amber,
                textTransform: 'uppercase',
                marginBottom:  '8px',
              }}>
                {STEPS[step].waypoint} — Step {step + 1} of 3
              </p>
              <h2 style={{
                fontSize:      isMobile ? '22px' : '26px',
                fontWeight:    '700',
                color:         C.text,
                marginBottom:  '8px',
                letterSpacing: '-0.01em',
              }}>
                {STEPS[step].title}
              </h2>
              <p style={{ fontSize: '14px', color: C.textMuted }}>
                {STEPS[step].subtitle}
              </p>
            </div>

            {/* ── STEP 1 — RESUME ── */}
            {step === 0 && (
              <motion.div
                onDragOver={e => { e.preventDefault(); setDragOver(true)  }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
                animate={{
                  borderColor: dragOver
                    ? C.amber
                    : resume
                    ? C.teal
                    : C.border,
                  background: dragOver
                    ? C.amberGlowSm
                    : resume
                    ? C.tealGlow
                    : 'rgba(15,21,32,0.5)',
                }}
                style={{
                  border:        '1.5px dashed',
                  borderRadius:  '14px',
                  padding:       isMobile ? '36px 24px' : '48px',
                  textAlign:     'center',
                  cursor:        'pointer',
                  transition:    css.normal,
                }}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={e => setResume(e.target.files[0])}
                />
                {resume ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1,   opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p style={{ fontSize: '28px', marginBottom: '10px' }}>✓</p>
                    <p style={{
                      color:      C.teal,
                      fontWeight: '600',
                      marginBottom: '4px',
                      wordBreak:  'break-word',
                      fontSize:   isMobile ? '13px' : '15px',
                    }}>
                      {resume.name}
                    </p>
                    <p style={{ color: C.textMuted, fontSize: '13px' }}>Click to change</p>
                  </motion.div>
                ) : (
                  <div>
                    <motion.p
                      animate={{ rotate: dragOver ? 45 : 0 }}
                      style={{ fontSize: '30px', marginBottom: '12px', color: C.amber }}
                    >
                      ◎
                    </motion.p>
                    <p style={{ color: C.text, fontWeight: '500', marginBottom: '4px' }}>
                      {isMobile ? 'Tap to browse' : 'Drop your resume here'}
                    </p>
                    <p style={{ color: C.textMuted, fontSize: '13px' }}>
                      {isMobile ? 'PDF only' : 'or click to browse — PDF only'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STEP 2 — RECENT WORK ── */}
            {step === 1 && (
              <div>
                <label style={labelStyle}>
                  What have you done recently that's not on your resume?
                </label>
                <textarea
                  rows={isMobile ? 6 : 7}
                  value={recentWork}
                  onChange={e => setRecentWork(e.target.value)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder="e.g. Completed Andrew Ng's ML course, built a sentiment analysis project using HuggingFace, learning Docker for the past 2 weeks..."
                  style={inputStyle}
                />
              </div>
            )}

            {/* ── STEP 3 — GOAL + CONTEXT ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                <div>
                  <label style={labelStyle}>Where do you want to go?</label>
                  <input
                    type="text"
                    value={careerGoal}
                    onChange={e => setCareerGoal(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="e.g. I want to become a ML Engineer"
                    style={inputStyle}
                  />
                </div>

                {/* personalization box */}
                <div style={{
                  background:    'rgba(15,21,32,0.6)',
                  border:        `1px solid ${C.border}`,
                  borderRadius:  '12px',
                  padding:       isMobile ? '16px' : '18px',
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           '14px',
                }}>
                  <p style={{
                    fontSize:      '9px',
                    fontWeight:    '600',
                    letterSpacing: '0.14em',
                    color:         C.amber,
                    textTransform: 'uppercase',
                  }}>
                    Personalize your path
                  </p>

                  {/* hours + background side by side on larger screens */}
                  <div style={{
                    display:             'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap:                 '14px',
                  }}>
                    <div>
                      <label style={labelStyle}>Hours per day to study</label>
                      <select
                        value={hoursPerDay}
                        onChange={e => setHoursPerDay(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        style={selectStyle}
                      >
                        <option value=""           style={{ background: '#0f1520' }}>Select...</option>
                        <option value="30 minutes" style={{ background: '#0f1520' }}>30 minutes</option>
                        <option value="1 hour"     style={{ background: '#0f1520' }}>1 hour</option>
                        <option value="1-2 hours"  style={{ background: '#0f1520' }}>1-2 hours</option>
                        <option value="2-3 hours"  style={{ background: '#0f1520' }}>2-3 hours</option>
                        <option value="3+ hours"   style={{ background: '#0f1520' }}>3+ hours</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Your background</label>
                      <select
                        value={background}
                        onChange={e => setBackground(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        style={selectStyle}
                      >
                        <option value=""                   style={{ background: '#0f1520' }}>Select...</option>
                        <option value="Self taught"        style={{ background: '#0f1520' }}>Self taught</option>
                        <option value="CS degree"          style={{ background: '#0f1520' }}>CS degree</option>
                        <option value="Bootcamp graduate"  style={{ background: '#0f1520' }}>Bootcamp graduate</option>
                        <option value="Non-CS degree"      style={{ background: '#0f1520' }}>Non-CS degree</option>
                        <option value="Currently studying" style={{ background: '#0f1520' }}>Currently studying</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>What have you tried to learn but struggled with?</label>
                    <input
                      type="text"
                      value={struggle}
                      onChange={e => setStruggle(e.target.value)}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder="e.g. System design, algorithms, deployment..."
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    GitHub profile URL
                    <span style={{ color: C.textDim, marginLeft: '8px', fontWeight: '400' }}>(optional)</span>
                  </label>
                  <input
                    type="url"
                    inputMode="url"
                    autoCapitalize="none"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="https://github.com/yourusername"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Job description
                    <span style={{ color: C.textDim, marginLeft: '8px', fontWeight: '400' }}>(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="Paste a job listing to get an exact match analysis..."
                    style={inputStyle}
                  />
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* error */}
        {error && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1,  x: 0  }}
            style={{ color: C.red, fontSize: '13px', marginTop: '12px' }}
          >
            {error}
          </motion.p>
        )}

        {/* navigation */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '32px' }}>
          {step > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{  scale: 0.98 }}
              onClick={prev}
              style={{
                background:   'transparent',
                border:       `1px solid ${C.border}`,
                color:        C.textMuted,
                padding:      '14px 22px',
                borderRadius: '10px',
                fontSize:     '15px',
                cursor:       'pointer',
                transition:   css.fast,
                flexShrink:   0,
              }}
            >
              ← Back
            </motion.button>
          )}

          {step < 2 ? (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${C.amber}22` }}
              whileTap={{  scale: 0.98 }}
              onClick={next}
              style={{
                flex:         1,
                background:   C.amber,
                border:       'none',
                color:        '#080c14',
                padding:      '14px 24px',
                borderRadius: '10px',
                fontSize:     '15px',
                fontWeight:   '700',
                cursor:       'pointer',
              }}
            >
              Continue →
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 0 40px ${C.amber}33` }}
              whileTap={{  scale: 0.98 }}
              onClick={handleSubmit}
              style={{
                flex:         1,
                background:   C.amber,
                border:       'none',
                color:        '#080c14',
                padding:      '14px 24px',
                borderRadius: '10px',
                fontSize:     '15px',
                fontWeight:   '700',
                cursor:       'pointer',
              }}
            >
              Chart my path →
            </motion.button>
          )}
        </div>

      </div>
    </motion.div>
  )
}

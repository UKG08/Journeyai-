import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence }                  from 'framer-motion'
import { C }                                        from '../../utils/colors'
import { useBurst }                                 from '../../hooks/useParticles'
import { css }                                      from '../../animations/transitions'
import { useScrambleText }                          from '../../hooks/useCountUp'

const WELCOME = "I've mapped your complete journey. Ask me anything — why a specific step, what to prioritize, how long something will take. I know your full profile."

const SUGGESTIONS = [
  'Why this next step?',
  'How long will this take me?',
  'What should I build first?',
  'Am I ready to apply?',
  'What is my biggest weakness?',
]

// ── TYPEWRITER ────────────────────────────────────────
function TypewriterText({ text, onDone, speed = 18 }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef                  = useRef(0)

  useEffect(() => {
    indexRef.current = 0
    setDisplayed('')

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(interval)
        onDone?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ color: C.amber }}
        >
          |
        </motion.span>
      )}
    </span>
  )
}

// ── MESSAGE BUBBLE ────────────────────────────────────
function MessageBubble({ msg, isNew }) {
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1,  x: 0,                scale: 1    }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display:        'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        gap:            '8px',
        alignItems:     'flex-start',
      }}
    >
      {/* AI avatar */}
      {!isUser && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{
            width:          '22px',
            height:         '22px',
            borderRadius:   '50%',
            background:     C.amberGlowSm,
            border:         `1px solid ${C.amberBorder}`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
            fontSize:       '10px',
            color:          C.amber,
          }}
        >
          ◎
        </motion.div>
      )}

      {/* bubble */}
      <div style={{
        maxWidth:     '78%',
        background:   isUser
          ? C.amberGlowSm
          : 'rgba(15,21,32,0.9)',
        border:       `1px solid ${isUser ? C.amberBorder : C.border}`,
        borderRadius: isUser
          ? '12px 12px 2px 12px'
          : '12px 12px 12px 2px',
        padding:      '9px 13px',
      }}>
        <p style={{
          fontSize:   '13px',
          color:      C.text,
          lineHeight: '1.6',
        }}>
          {isNew && !isUser
            ? <TypewriterText text={msg.content} speed={14} />
            : msg.content
          }
        </p>
      </div>
    </motion.div>
  )
}

// ── MAIN JARVIS CHAT ──────────────────────────────────
export default function JarvisChat({ profile }) {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [welcomed, setWelcomed] = useState(false)
  const [newMsgIdx,setNewMsgIdx]= useState(-1)
  const bottomRef               = useRef(null)
  const { canvasRef, burst }    = useBurst({
    count: 24, color: C.amber, speed: 7, decay: 0.035, type: 'spark',
  })

  // scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // welcome message on first open
  useEffect(() => {
    if (open && !welcomed) {
      setWelcomed(true)
      setTimeout(() => {
        setMessages([{ role: 'assistant', content: WELCOME }])
        setNewMsgIdx(0)
      }, 600)
    }
  }, [open, welcomed])

  function handleOpen() {
    const btn = document.getElementById('jarvis-btn')
    if (btn) {
      const rect = btn.getBoundingClientRect()
      burst(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
    setOpen(prev => !prev)
  }

  async function send(text) {
    const msg = text || input
    if (!msg.trim() || loading) return

    const userMsg = { role: 'user', content: msg }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setNewMsgIdx(-1)

    try {
      const res  = await fetch('http://127.0.0.1:8000/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: updated, profile }),
      })
      const data = await res.json()
      const aiMsg = { role: 'assistant', content: data.reply }
      setMessages(prev => {
        setNewMsgIdx(prev.length)
        return [...prev, aiMsg]
      })
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Make sure the backend is running.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* burst canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'fixed',
          inset:         0,
          pointerEvents: 'none',
          zIndex:        9998,
        }}
      />

      {/* chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scaleY: 0.8, scaleX: 0.95 }}
            animate={{ opacity: 1, y: 0,  scaleY: 1,   scaleX: 1    }}
            exit={{   opacity: 0, y: 20,  scaleY: 0.8, scaleX: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position:        'fixed',
              bottom:          '84px',
              right:           '20px',
              width:           '360px',
              maxHeight:       '520px',
              zIndex:          1000,
              background:      'rgba(8,12,20,0.97)',
              backdropFilter:  'blur(20px)',
              border:          `1px solid ${C.amberBorder}`,
              borderRadius:    '20px',
              display:         'flex',
              flexDirection:   'column',
              overflow:        'hidden',
              boxShadow:       `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${C.amberGlowSm}, 0 0 40px ${C.amberGlowSm}`,
              transformOrigin: 'bottom right',
            }}
          >
            {/* scanline effect on header */}
            <div style={{
              padding:      '14px 16px',
              borderBottom: `1px solid ${C.border}`,
              position:     'relative',
              overflow:     'hidden',
            }}>
              {/* animated scan line */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                style={{
                  position:   'absolute',
                  top:        0,
                  left:       0,
                  width:      '40%',
                  height:     '100%',
                  background: `linear-gradient(90deg, transparent, ${C.amberGlowSm}, transparent)`,
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  style={{ fontSize: '18px', color: C.amber }}
                >
                  ◎
                </motion.div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize:   '14px',
                    fontWeight: '600',
                    color:      C.text,
                  }}>
                    Journey Guide
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        width:        '5px',
                        height:       '5px',
                        borderRadius: '50%',
                        background:   C.teal,
                      }}
                    />
                    <p style={{ fontSize: '11px', color: C.textMuted }}>
                      Knows your full profile
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: 'none',
                    border:     'none',
                    color:      C.textMuted,
                    fontSize:   '18px',
                    cursor:     'pointer',
                    lineHeight: 1,
                    padding:    '0 4px',
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* messages */}
            <div style={{
              flex:          1,
              overflowY:     'auto',
              padding:       '14px 14px',
              display:       'flex',
              flexDirection: 'column',
              gap:           '10px',
              scrollbarWidth: 'none',
            }}>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  msg={msg}
                  isNew={i === newMsgIdx}
                />
              ))}

              {/* typing indicator */}
              {loading && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{
                    width:          '22px',
                    height:         '22px',
                    borderRadius:   '50%',
                    background:     C.amberGlowSm,
                    border:         `1px solid ${C.amberBorder}`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    fontSize:       '10px',
                    color:          C.amber,
                    flexShrink:     0,
                  }}>
                    ◎
                  </div>
                  <div style={{
                    background:   'rgba(15,21,32,0.9)',
                    border:       `1px solid ${C.border}`,
                    borderRadius: '12px',
                    padding:      '10px 14px',
                    display:      'flex',
                    gap:          '4px',
                    alignItems:   'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        style={{
                          width:        '5px',
                          height:       '5px',
                          borderRadius: '50%',
                          background:   C.textMuted,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* suggestions */}
              {messages.length <= 1 && !loading && (
                <div style={{ marginTop: '4px' }}>
                  <p style={{
                    fontSize:     '9px',
                    color:        C.textMuted,
                    letterSpacing:'0.1em',
                    marginBottom: '8px',
                    textTransform:'uppercase',
                  }}>
                    Suggested
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {SUGGESTIONS.map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03, borderColor: C.amber }}
                        whileTap={{  scale: 0.97 }}
                        onClick={() => send(q)}
                        style={{
                          fontSize:     '11px',
                          color:        C.textMuted,
                          background:   'rgba(20,30,50,0.6)',
                          border:       `1px solid ${C.border}`,
                          borderRadius: '20px',
                          padding:      '5px 12px',
                          cursor:       'pointer',
                          transition:   css.fast,
                        }}
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* input bar */}
            <div style={{
              padding:      '10px 12px',
              borderTop:    `1px solid ${C.border}`,
              display:      'flex',
              gap:          '8px',
              alignItems:   'center',
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask your guide..."
                style={{
                  flex:         1,
                  background:   'rgba(10,15,26,0.8)',
                  border:       `1px solid ${C.border}`,
                  borderRadius: '12px',
                  padding:      '10px 14px',
                  fontSize:     '13px',
                  color:        C.text,
                  outline:      'none',
                  transition:   css.fast,
                }}
                onFocus={e  => e.target.style.borderColor = C.amberBorder}
                onBlur={e   => e.target.style.borderColor = C.border}
              />
              <motion.button
                whileHover={input.trim() ? { scale: 1.08 } : {}}
                whileTap={input.trim()   ? { scale: 0.92 } : {}}
                onClick={() => send()}
                disabled={loading || !input.trim()}
                style={{
                  width:        '38px',
                  height:       '38px',
                  borderRadius: '50%',
                  background:   input.trim() ? C.amber : 'rgba(30,42,58,0.6)',
                  border:       'none',
                  color:        input.trim() ? '#080c14' : C.textMuted,
                  fontSize:     '16px',
                  cursor:       input.trim() ? 'pointer' : 'default',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent:'center',
                  flexShrink:   0,
                  transition:   css.normal,
                }}
              >
                →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toggle button */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1001 }}>
        {/* pulse rings */}
        {!open && [0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              scale:   [1, 2.2 + i * 0.3],
              opacity: [0.5, 0],
            }}
            transition={{
              duration:   2,
              repeat:     Infinity,
              delay:      i * 0.5,
              ease:       'easeOut',
            }}
            style={{
              position:     'absolute',
              inset:        0,
              borderRadius: '50%',
              border:       `1px solid ${C.amber}`,
              pointerEvents:'none',
            }}
          />
        ))}

        <motion.button
          id="jarvis-btn"
          whileHover={{
            scale:     1.12,
            boxShadow: `0 0 30px ${C.amber}66`,
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpen}
          style={{
            width:          '56px',
            height:         '56px',
            borderRadius:   '50%',
            background:     open
              ? 'rgba(20,30,50,0.9)'
              : C.amber,
            border:         `1px solid ${open ? C.amberBorder : C.amber}`,
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            position:       'relative',
            zIndex:         1,
            boxShadow:      open
              ? `0 4px 20px rgba(0,0,0,0.4)`
              : `0 4px 24px ${C.amberGlow}`,
          }}
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: '22px',
              color:    open ? C.amber : '#080c14',
              display:  'block',
              lineHeight: 1,
            }}
          >
            {open ? '×' : '◎'}
          </motion.span>
        </motion.button>
      </div>
    </>
  )
}
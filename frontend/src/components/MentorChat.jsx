import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

export default function MentorChat({ profile }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I've analyzed your full profile and built your roadmap. Ask me anything — why a specific step, what to prioritize, what to do if you're stuck, anything at all.`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  // auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    const messageText = text || input
    if (!messageText.trim() || loading) return

    const userMessage = { role: 'user', content: messageText }
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/chat',
        {
          messages: updated,
          profile: profile
        }
      )
      setMessages([
        ...updated,
        { role: 'assistant', content: response.data.reply }
      ])
    } catch (err) {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: 'Something went wrong. Make sure the backend is running.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = [
    'Why this next step specifically?',
    'What if I only have 30 mins/day?',
    'Which skill should I focus on first?',
    'How do I know when I am ready to apply?',
    'What projects should I build?'
  ]

  return (
    <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden">

      {/* header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <p className="text-sm font-medium text-gray-800">
            Ask your mentor
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Knows your full profile — ask anything
        </p>
      </div>

      {/* messages */}
      <div className="px-4 py-4 space-y-3 max-h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <span className="text-white text-xs font-bold">J</span>
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-gray-900 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-white text-xs font-bold">J</span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* suggested questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400 mb-2">Suggested questions</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200
                  px-2.5 py-1.5 rounded-full transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* input */}
      <div className="px-4 pb-4 flex gap-2 border-t border-gray-100 pt-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about your roadmap..."
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2
            text-sm text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="bg-gray-900 text-white px-4 rounded-xl text-sm font-medium
            hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          Send
        </button>
      </div>

    </div>
  )
}
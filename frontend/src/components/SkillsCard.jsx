export default function SkillsCard({ skills, summary }) {
  const colors = {
    strong: 'bg-green-100 text-green-700',
    basic:  'bg-yellow-100 text-yellow-700',
    missing:'bg-red-100 text-red-600',
  }

  // normalize — groq sometimes returns string
  const s = typeof summary === 'string'
    ? { overview: summary, strengths: [], honest_gaps: [], hidden_advantage: null }
    : summary || {}

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Profile summary
      </p>

      {/* overview */}
      {s.overview && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Overview
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {s.overview}
          </p>
        </div>
      )}

      {/* strengths + gaps */}
      {((s.strengths && s.strengths.length > 0) ||
        (s.honest_gaps && s.honest_gaps.length > 0)) && (
        <div className="grid grid-cols-2 gap-3 mb-4">

          {s.strengths && s.strengths.length > 0 && (
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">
                Strengths
              </p>
              <ul className="space-y-1.5">
                {s.strengths.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-green-500 font-bold text-xs mt-0.5">•</span>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {typeof item === 'string' ? item : JSON.stringify(item)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {s.honest_gaps && s.honest_gaps.length > 0 && (
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-2">
                Gaps
              </p>
              <ul className="space-y-1.5">
                {s.honest_gaps.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-red-400 font-bold text-xs mt-0.5">•</span>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {typeof item === 'string' ? item : JSON.stringify(item)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* hidden advantage */}
      {s.hidden_advantage && typeof s.hidden_advantage === 'string' && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
            Hidden advantage
          </p>
          <div className="flex gap-2 items-start">
            <span className="text-blue-500 font-bold text-xs mt-0.5">•</span>
            <p className="text-xs text-blue-800 leading-relaxed">
              {s.hidden_advantage}
            </p>
          </div>
        </div>
      )}

      {/* skills grouped by level */}
      {skills && skills.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Skills breakdown
          </p>
          {['strong', 'basic', 'missing'].map(level => {
            const filtered = skills.filter(s => s.level === level)
            if (filtered.length === 0) return null
            const labels = { strong: 'Strong', basic: 'Basic', missing: 'Missing' }
            const dotColors = {
              strong: 'text-green-500',
              basic: 'text-yellow-500',
              missing: 'text-red-400'
            }
            return (
              <div key={level} className="mb-3">
                <p className={`text-xs font-medium mb-1.5 ${dotColors[level]}`}>
                  {labels[level]}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {filtered.map((skill, i) => (
                    <span
                      key={i}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[level]}`}
                    >
                      {typeof skill.name === 'string' ? skill.name : ''}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
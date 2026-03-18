export default function ResumeWeakSpots({ summary, spots, quickWins }) {
  if (!spots || spots.length === 0) return null

  // normalize summary
  const s = typeof summary === 'string'
    ? { overall_impression: summary, biggest_strength: null, biggest_problem: null }
    : summary || {}

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Resume review
      </p>

      {/* first impression */}
      {s.overall_impression && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            First impression
          </p>
          <div className="flex gap-2 items-start mb-3">
            <span className="text-gray-400 font-bold text-xs mt-0.5">•</span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {s.overall_impression}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {s.biggest_strength && (
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Best part</p>
                <div className="flex gap-1.5 items-start">
                  <span className="text-green-500 text-xs mt-0.5">•</span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {s.biggest_strength}
                  </p>
                </div>
              </div>
            )}
            {s.biggest_problem && (
              <div>
                <p className="text-xs font-medium text-red-500 mb-1">Biggest problem</p>
                <div className="flex gap-1.5 items-start">
                  <span className="text-red-400 text-xs mt-0.5">•</span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {s.biggest_problem}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* issues */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Issues to fix
        </p>
        <div className="space-y-4">
          {spots.map((spot, i) => (
            <div key={i} className="border-l-2 border-red-200 pl-3">

              {spot.section && (
                <span className="text-xs font-medium text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded-full">
                  {spot.section}
                </span>
              )}

              {spot.issue && (
                <div className="flex gap-2 items-start mt-2">
                  <span className="text-red-400 font-bold text-xs mt-0.5">•</span>
                  <p className="text-sm font-medium text-gray-800">
                    {typeof spot.issue === 'string' ? spot.issue : ''}
                  </p>
                </div>
              )}

              {spot.why_it_hurts && (
                <div className="flex gap-2 items-start mt-1">
                  <span className="text-orange-400 font-bold text-xs mt-0.5">•</span>
                  <p className="text-xs text-gray-500">
                    {typeof spot.why_it_hurts === 'string' ? spot.why_it_hurts : ''}
                  </p>
                </div>
              )}

              {spot.example && (
                <div className="bg-gray-50 rounded-lg p-2 mt-2">
                  <p className="text-xs font-medium text-gray-400 mb-1">Example</p>
                  <div className="flex gap-2 items-start">
                    <span className="text-gray-400 text-xs mt-0.5">•</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {typeof spot.example === 'string' ? spot.example : ''}
                    </p>
                  </div>
                </div>
              )}

              {spot.fix && (
                <div className="flex gap-2 items-start mt-2">
                  <span className="text-green-500 font-bold text-xs mt-0.5">→</span>
                  <p className="text-xs text-green-700 font-medium">
                    {typeof spot.fix === 'string' ? spot.fix : ''}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* quick wins */}
      {quickWins && quickWins.length > 0 && (
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2">
            Quick wins — do these today
          </p>
          <ul className="space-y-1.5">
            {quickWins.map((win, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-green-500 font-bold text-xs mt-0.5">→</span>
                <p className="text-sm text-gray-700">
                  {typeof win === 'string' ? win : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
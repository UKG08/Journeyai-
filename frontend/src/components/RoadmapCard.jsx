export default function RoadmapCard({ roadmap, title, totalTime }) {
  if (!roadmap || roadmap.length === 0) return null

  const lastStep = roadmap[roadmap.length - 1]

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">

      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {typeof title === 'string' ? title : 'Your roadmap'}
        </p>
        {totalTime && typeof totalTime === 'string' && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {totalTime}
          </span>
        )}
      </div>

      {/* summary line */}
      <p className="text-sm text-gray-500 mb-4">
        {roadmap.length} steps to reach{' '}
        <span className="font-medium text-gray-700">
          {lastStep?.step || 'your goal'}
        </span>
      </p>

      <div className="relative pl-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />

        {roadmap.map((item, i) => (
          <div key={i} className="relative mb-6 last:mb-0">

            {/* dot */}
            <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2
              ${item.is_current
                ? 'bg-gray-900 border-gray-900'
                : 'bg-white border-gray-300'
              }`}
            />

            {/* title + badges */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className={`text-sm font-medium
                ${item.is_current ? 'text-gray-900' : 'text-gray-400'}`}>
                {typeof item.step === 'string' ? item.step : ''}
              </p>
              {item.is_current && (
                <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                  now
                </span>
              )}
              {item.time && typeof item.time === 'string' && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {item.time}
                </span>
              )}
            </div>

            {/* why now */}
            {item.why_now && typeof item.why_now === 'string' && (
              <div className="flex gap-1.5 items-start mb-2">
                <span className="text-gray-300 font-bold text-xs mt-0.5">•</span>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.why_now}
                </p>
              </div>
            )}

            {/* what to learn */}
            {item.what_to_learn && item.what_to_learn.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-gray-400 mb-1">What to learn</p>
                <ul className="space-y-0.5">
                  {item.what_to_learn.map((topic, j) => (
                    <li key={j} className="flex gap-1.5 items-center">
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-xs text-gray-600">
                        {typeof topic === 'string' ? topic : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* milestone */}
            {item.milestone && typeof item.milestone === 'string' && (
              <div className="flex gap-1.5 items-start">
                <span className="text-green-500 font-bold text-xs mt-0.5">→</span>
                <p className="text-xs text-gray-500">
                  <span className="text-gray-400">Milestone: </span>
                  <span className="font-medium text-gray-700">
                    {item.milestone}
                  </span>
                </p>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}
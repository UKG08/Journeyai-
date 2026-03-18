export default function NextStepCard({ nextStep }) {
  if (!nextStep) return null

  // normalize why — sometimes groq returns string
  const why = typeof nextStep.why === 'string'
    ? { main_reason: nextStep.why, career_impact: null, builds_on: null }
    : nextStep.why || {}

  return (
    <div className="border-2 border-gray-900 rounded-xl p-4 mb-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        Your major next step
      </p>

      <p className="text-xl font-semibold text-gray-900 mb-4">
        {nextStep.title}
      </p>

      {/* why */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Why this step
        </p>
        <ul className="space-y-2">
          {why.main_reason && (
            <li className="flex gap-2 items-start">
              <span className="text-gray-400 font-medium text-xs min-w-[60px] pt-0.5">
                Why now
              </span>
              <div className="flex gap-1.5 items-start">
                <span className="text-gray-400 text-xs mt-0.5">•</span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {why.main_reason}
                </p>
              </div>
            </li>
          )}
          {why.career_impact && (
            <li className="flex gap-2 items-start">
              <span className="text-gray-400 font-medium text-xs min-w-[60px] pt-0.5">
                Impact
              </span>
              <div className="flex gap-1.5 items-start">
                <span className="text-gray-400 text-xs mt-0.5">•</span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {why.career_impact}
                </p>
              </div>
            </li>
          )}
          {why.builds_on && (
            <li className="flex gap-2 items-start">
              <span className="text-gray-400 font-medium text-xs min-w-[60px] pt-0.5">
                Builds on
              </span>
              <div className="flex gap-1.5 items-start">
                <span className="text-gray-400 text-xs mt-0.5">•</span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {why.builds_on}
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* outcome + time */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {nextStep.what_you_will_have_after && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              You will have
            </p>
            <div className="flex gap-1.5 items-start">
              <span className="text-green-500 font-bold text-xs mt-0.5">•</span>
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {nextStep.what_you_will_have_after}
              </p>
            </div>
          </div>
        )}
        {nextStep.time_estimate && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Time needed
            </p>
            <div className="flex gap-1.5 items-start">
              <span className="text-blue-500 font-bold text-xs mt-0.5">•</span>
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {nextStep.time_estimate}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* week plan */}
      {nextStep.week_plan && nextStep.week_plan.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Day by day plan
          </p>
          <ul className="space-y-3">
            {nextStep.week_plan.map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-xs font-medium text-gray-400 min-w-[44px] bg-gray-100 px-1.5 py-0.5 rounded text-center">
                  {typeof item.day === 'string' ? item.day : `Day ${i + 1}`}
                </span>
                <div>
                  <div className="flex gap-1.5 items-start">
                    <span className="text-gray-400 font-bold text-xs mt-0.5">•</span>
                    <p className="text-sm text-gray-800">
                      {typeof item.task === 'string' ? item.task : ''}
                    </p>
                  </div>
                  {item.goal && typeof item.goal === 'string' && (
                    <div className="flex gap-1.5 items-start mt-0.5 ml-3">
                      <span className="text-green-400 font-bold text-xs mt-0.5">→</span>
                      <p className="text-xs text-gray-400">{item.goal}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* resources */}
      {nextStep.resources && nextStep.resources.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Resources for this step
          </p>
          <ul className="space-y-3">
            {nextStep.resources.map((r, i) => (
              <li key={i} className="border-l-2 border-blue-100 pl-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-blue-500 font-bold text-xs">•</span>
                  <a
                    href={typeof r.url === 'string' ? r.url : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    {typeof r.title === 'string' ? r.title : ''}
                  </a>
                  {r.type && typeof r.type === 'string' && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {r.type}
                    </span>
                  )}
                </div>
                {r.use_on && typeof r.use_on === 'string' && (
                  <div className="flex gap-1.5 ml-3">
                    <span className="text-gray-300 text-xs">•</span>
                    <p className="text-xs text-gray-400">Use on: {r.use_on}</p>
                  </div>
                )}
                {r.why_this_one && typeof r.why_this_one === 'string' && (
                  <div className="flex gap-1.5 ml-3">
                    <span className="text-gray-300 text-xs">•</span>
                    <p className="text-xs text-gray-500">{r.why_this_one}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
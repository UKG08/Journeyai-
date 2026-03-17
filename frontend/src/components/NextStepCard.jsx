export default function NextStepCard({ nextStep }) {
  return (
    <div className="border-2 border-gray-900 rounded-xl p-4 mb-4">

      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        Your major next step
      </p>

      <p className="text-xl font-semibold text-gray-900 mb-2">
        {nextStep.title}
      </p>

      <p className="text-sm text-gray-500 mb-1">
        {nextStep.why}
      </p>

      <p className="text-xs text-gray-400 mb-4">
        {nextStep.time_estimate}
      </p>

      <div className="border-t border-gray-100 pt-3 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          This week
        </p>
        {nextStep.week_plan.map((item, i) => (
          <div key={i} className="flex gap-3 mb-2">
            <span className="text-xs text-gray-400 min-w-[52px]">
              {item.day}
            </span>
            <span className="text-sm text-gray-700">
              {item.task}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
          Free resources
        </p>
        {nextStep.resources.map((r, i) => (
          <p key={i} className="mb-1">
  <a
    href={r.url}
    target="_blank"
    rel="noreferrer"
    className="text-sm text-blue-600 hover:underline"
  >
    {r.title}
  </a>
</p>
        ))}
      </div>

    </div>
  )
}
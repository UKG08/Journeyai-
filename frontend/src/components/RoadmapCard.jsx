export default function RoadmapCard({ roadmap }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Your roadmap
      </p>

      <div className="relative pl-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />

        {roadmap.map((item, i) => (
          <div key={i} className="relative mb-5 last:mb-0">
            <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2
              ${item.is_current
                ? 'bg-gray-900 border-gray-900'
                : 'bg-white border-gray-300'
              }`}
            />
            <p className={`text-sm font-medium
              ${item.is_current ? 'text-gray-900' : 'text-gray-400'}`}>
              {item.step}
              {item.is_current && (
                <span className="ml-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                  now
                </span>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
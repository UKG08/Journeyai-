export default function ResumeWeakSpots({ spots }) {
  if (!spots || spots.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        Resume weak spots
      </p>
      <div className="space-y-3">
        {spots.map((spot, i) => (
          <div key={i}>
            <p className="text-sm font-medium text-red-500">{spot.issue}</p>
            <p className="text-sm text-gray-500 mt-0.5">Fix: {spot.fix}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default function SkillsCard({ skills }) {
  const colors = {
    strong: 'bg-green-100 text-green-700',
    basic: 'bg-yellow-100 text-yellow-700',
    missing: 'bg-red-100 text-red-600',
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        Skills detected
      </p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className={`text-xs font-medium px-3 py-1 rounded-full ${colors[skill.level] || 'bg-gray-100 text-gray-600'}`}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  )
}
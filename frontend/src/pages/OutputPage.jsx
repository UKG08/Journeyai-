import SkillsCard from '../components/SkillsCard'
import ResumeWeakSpots from '../components/ResumeWeakSpots'
import NextStepCard from '../components/NextStepCard'
import RoadmapCard from '../components/RoadmapCard'

export default function OutputPage({ data, onReset }) {
  const shareUrl = `${window.location.origin}/roadmap/${data.share_id}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied!')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Your roadmap
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Based on your resume and recent work
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Start over
        </button>
      </div>

      {/* score row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {data.current_level}
          </p>
          <p className="text-sm text-gray-500 mt-1">Current level</p>
        </div>
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {data.readiness_score}% ready
          </p>
          <p className="text-sm text-gray-500 mt-1">For your goal</p>
        </div>
      </div>

      {/* cards */}
      <SkillsCard skills={data.skills} />
      <ResumeWeakSpots spots={data.resume_weak_spots} />
      <NextStepCard nextStep={data.next_step} />
      <RoadmapCard roadmap={data.roadmap} />

      {/* share */}
      <div className="mt-6 border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Share your roadmap
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 text-xs border border-gray-200
              rounded-lg px-3 py-2 text-gray-500 bg-gray-50"
          />
          <button
            onClick={copyLink}
            className="bg-gray-900 text-white text-sm px-4
              rounded-lg hover:bg-gray-700 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

    </div>
  )
}
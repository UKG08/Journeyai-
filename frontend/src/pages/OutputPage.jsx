import SkillsCard from '../components/SkillsCard'
import ResumeWeakSpots from '../components/ResumeWeakSpots'
import NextStepCard from '../components/NextStepCard'
import RoadmapCard from '../components/RoadmapCard'

export default function OutputPage({ data, onReset }) {

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-red-500">Something went wrong. No data received.</p>
        <button onClick={onReset} className="mt-4 text-sm text-gray-500 underline">
          Try again
        </button>
      </div>
    )
  }

  // normalize current_position_summary
  // groq sometimes returns string sometimes object
  const positionSummary = typeof data.current_position_summary === 'string'
    ? {
        overview: data.current_position_summary,
        strengths: [],
        honest_gaps: [],
        hidden_advantage: null
      }
    : data.current_position_summary || {}

  // normalize resume_summary
  const resumeSummary = typeof data.resume_summary === 'string'
    ? {
        overall_impression: data.resume_summary,
        biggest_strength: null,
        biggest_problem: null
      }
    : data.resume_summary || {}

  const shareUrl = data.share_id
    ? `${window.location.origin}/roadmap/${data.share_id}`
    : null

  function copyLink() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied!')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* header */}
      <div className="flex items-center justify-between mb-6">
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
          className="text-sm text-gray-400 hover:text-gray-900"
        >
          Start over
        </button>
      </div>

      {/* score row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {data.current_level || 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Current level</p>
        </div>
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {data.readiness_score ?? '?'}% ready
          </p>
          <p className="text-sm text-gray-500 mt-1">For your goal</p>
        </div>
      </div>

      {/* position summary */}
      {positionSummary?.overview && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {positionSummary.overview}
          </p>
        </div>
      )}

      {/* cards */}
      {data.skills && (
        <SkillsCard
          skills={data.skills}
          summary={positionSummary}
        />
      )}

      {data.resume_weak_spots && (
        <ResumeWeakSpots
          summary={resumeSummary}
          spots={data.resume_weak_spots}
          quickWins={data.quick_wins || []}
        />
      )}

      {data.next_step && (
        <NextStepCard nextStep={data.next_step} />
      )}

      {data.roadmap && (
        <RoadmapCard
          roadmap={data.roadmap}
          title={data.roadmap_title}
          totalTime={data.estimated_total_time}
        />
      )}

      {/* share */}
      {shareUrl && (
        <div className="border border-gray-200 rounded-xl p-4 mt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Share your roadmap
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-500 bg-gray-50"
            />
            <button
              onClick={copyLink}
              className="bg-gray-900 text-white text-sm px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
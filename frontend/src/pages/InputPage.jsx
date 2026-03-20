import { useState } from 'react'
import axios from 'axios'

export default function InputPage({ onResult }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [resume, setResume] = useState(null)
  const [recentWork, setRecentWork] = useState('')
  const [careerGoal, setCareerGoal] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState('')
  const [struggle, setStruggle] = useState('')
  const [background, setBackground] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!resume) return setError('Please upload your resume PDF')
    if (!recentWork) return setError('Please describe your recent work')
    if (!careerGoal) return setError('Please enter your career goal')

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('resume', resume)
      formData.append('recent_work', recentWork)
      formData.append('career_goal', careerGoal)
      formData.append('hours_per_day', hoursPerDay || '1-2 hours')
      formData.append('struggle', struggle || 'nothing specific')
      formData.append('background', background || 'not specified')
      if (jobDescription) {
        formData.append('job_description', jobDescription)
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/analyze',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      onResult(response.data)

    } catch (err) {
      setError('Something went wrong. Make sure backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          JourneyAI
        </h1>
        <p className="text-gray-500">
          Tell us where you are. We'll tell you exactly what to do next.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* resume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={e => setResume(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4 file:rounded-lg
              file:border-0 file:text-sm file:font-medium
              file:bg-gray-900 file:text-white
              hover:file:bg-gray-700 cursor-pointer"
          />
        </div>

        {/* recent work */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What have you done recently?
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Anything not on your resume — courses, projects, tools you learned
          </p>
          <textarea
            rows={4}
            value={recentWork}
            onChange={e => setRecentWork(e.target.value)}
            placeholder="e.g. I completed Andrew Ng's ML course, built a sentiment analysis project using HuggingFace, and I've been learning Docker for 2 weeks..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3
              text-sm text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        {/* career goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Career goal
          </label>
          <input
            type="text"
            value={careerGoal}
            onChange={e => setCareerGoal(e.target.value)}
            placeholder="e.g. I want to become a ML Engineer"
            className="w-full border border-gray-200 rounded-lg px-4 py-3
              text-sm text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* 3 new context questions */}
        <div className="border border-gray-100 rounded-xl p-4 space-y-4 bg-gray-50">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Help us personalize your roadmap
          </p>

          {/* hours per day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How many hours per day can you study?
            </label>
            <select
              value={hoursPerDay}
              onChange={e => setHoursPerDay(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3
                text-sm text-gray-900 bg-white
                focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select...</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="1-2 hours">1-2 hours</option>
              <option value="2-3 hours">2-3 hours</option>
              <option value="3+ hours">3+ hours</option>
            </select>
          </div>

          {/* struggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What have you tried to learn but struggled with?
            </label>
            <input
              type="text"
              value={struggle}
              onChange={e => setStruggle(e.target.value)}
              placeholder="e.g. System design, algorithms, deployment..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3
                text-sm text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background
            </label>
            <select
              value={background}
              onChange={e => setBackground(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3
                text-sm text-gray-900 bg-white
                focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select...</option>
              <option value="Self taught">Self taught</option>
              <option value="CS degree">CS degree</option>
              <option value="Bootcamp graduate">Bootcamp graduate</option>
              <option value="Non-CS degree">Non-CS degree</option>
              <option value="Currently studying">Currently studying</option>
            </select>
          </div>
        </div>

        {/* job description optional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job description
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Paste any job listing to get a gap analysis against it
          </p>
          <textarea
            rows={3}
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3
              text-sm text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 px-6
            rounded-lg text-sm font-medium
            hover:bg-gray-700 disabled:opacity-50
            transition-colors"
        >
          {loading
            ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analyzing your profile...
              </span>
            )
            : 'Get my roadmap →'
          }
        </button>

      </form>
    </div>
  )
}
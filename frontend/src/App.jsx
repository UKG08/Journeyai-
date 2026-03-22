import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import InputPage from './pages/InputPage'
import OutputPage from './pages/OutputPage'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [stage, setStage] = useState('landing')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleStart() {
    setStage('input')
  }

  function handleSubmit(data) {
    setResult(data)
    setIsLoading(false)
    setStage('output')
  }

  function handleLoading() {
    setIsLoading(true)
    setStage('loading')
  }

  function handleReset() {
    setResult(null)
    setStage('landing')
  }

  return (
    <div className="min-h-screen" style={{ background: '#080c14' }}>
      <AnimatePresence mode="wait">

        {stage === 'landing' && (
          <LandingPage key="landing" onStart={handleStart} />
        )}

        {stage === 'input' && (
          <InputPage
            key="input"
            onLoading={handleLoading}
            onResult={handleSubmit}
          />
        )}

        {stage === 'loading' && (
          <LoadingScreen key="loading" />
        )}

        {stage === 'output' && (
          <OutputPage
            key="output"
            data={result}
            onReset={handleReset}
          />
        )}

      </AnimatePresence>
    </div>
  )
}
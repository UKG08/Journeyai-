import { useState } from 'react'
import InputPage from './pages/InputPage'
import OutputPage from './pages/OutputPage'

export default function App() {

  const [result, setResult] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {result === null
        ? <InputPage onResult={setResult} />
        : <OutputPage data={result} onReset={() => setResult(null)} />
      }
    </div>
  )
}
'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface WorkflowLog {
  id: string
  timestamp: string
  topic: string
  status: string
  rhymeText?: string
  audioUrl?: string
  videoUrl?: string
  youtubeUrl?: string
  error?: string
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<WorkflowLog[]>([])
  const [currentLog, setCurrentLog] = useState<WorkflowLog | null>(null)

  const startWorkflow = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for rhyme generation')
      return
    }

    setIsRunning(true)
    const workflowId = `workflow_${Date.now()}`

    const newLog: WorkflowLog = {
      id: workflowId,
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      topic: topic,
      status: 'Starting...'
    }

    setCurrentLog(newLog)
    setLogs(prev => [newLog, ...prev])

    try {
      // Step 1: Generate Rhyme
      updateLog(workflowId, { status: 'Generating rhyme with AI...' })
      const rhymeResponse = await fetch('/api/generate-rhyme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
      const rhymeData = await rhymeResponse.json()

      if (!rhymeResponse.ok) throw new Error(rhymeData.error || 'Failed to generate rhyme')

      updateLog(workflowId, {
        status: 'Rhyme generated. Logging to Google Sheets...',
        rhymeText: rhymeData.rhyme
      })

      // Step 2: Log to Google Sheets
      const sheetResponse = await fetch('/api/log-to-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          topic,
          rhyme: rhymeData.rhyme,
          timestamp: newLog.timestamp
        })
      })
      const sheetData = await sheetResponse.json()

      if (!sheetResponse.ok) throw new Error(sheetData.error || 'Failed to log to sheets')

      updateLog(workflowId, { status: 'Logged to sheets. Generating audio...' })

      // Step 3: Generate Audio
      const audioResponse = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rhymeData.rhyme,
          workflowId
        })
      })
      const audioData = await audioResponse.json()

      if (!audioResponse.ok) throw new Error(audioData.error || 'Failed to generate audio')

      updateLog(workflowId, {
        status: 'Audio generated. Creating video...',
        audioUrl: audioData.audioUrl
      })

      // Step 4: Generate Video
      const videoResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioUrl: audioData.audioUrl,
          rhymeText: rhymeData.rhyme,
          topic,
          workflowId
        })
      })
      const videoData = await videoResponse.json()

      if (!videoResponse.ok) throw new Error(videoData.error || 'Failed to generate video')

      updateLog(workflowId, {
        status: 'Video created. Uploading to YouTube...',
        videoUrl: videoData.videoUrl
      })

      // Step 5: Upload to YouTube
      const youtubeResponse = await fetch('/api/upload-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: videoData.videoUrl,
          title: `AI Generated Rhyme: ${topic}`,
          description: rhymeData.rhyme,
          workflowId
        })
      })
      const youtubeData = await youtubeResponse.json()

      if (!youtubeResponse.ok) throw new Error(youtubeData.error || 'Failed to upload to YouTube')

      updateLog(workflowId, {
        status: 'Completed successfully!',
        youtubeUrl: youtubeData.youtubeUrl
      })

      // Step 6: Final log update
      await fetch('/api/log-to-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          topic,
          rhyme: rhymeData.rhyme,
          timestamp: newLog.timestamp,
          audioUrl: audioData.audioUrl,
          videoUrl: videoData.videoUrl,
          youtubeUrl: youtubeData.youtubeUrl,
          status: 'completed'
        })
      })

    } catch (error: any) {
      updateLog(workflowId, {
        status: 'Failed',
        error: error.message
      })
    } finally {
      setIsRunning(false)
      setCurrentLog(null)
    }
  }

  const updateLog = (id: string, updates: Partial<WorkflowLog>) => {
    setLogs(prev => prev.map(log =>
      log.id === id ? { ...log, ...updates } : log
    ))
    setCurrentLog(prev => prev && prev.id === id ? { ...prev, ...updates } : prev)
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            AI Rhyme Automation Agent
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Automated pipeline: Rhyme Generation → Sheets Logging → Audio Creation → Video Generation → YouTube Upload
          </p>
        </header>

        {/* Control Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Start New Workflow</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic for rhyme generation (e.g., 'ocean', 'love', 'adventure')"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isRunning}
            />
            <button
              onClick={startWorkflow}
              disabled={isRunning}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isRunning ? 'Running...' : 'Start Workflow'}
            </button>
          </div>
        </div>

        {/* Current Workflow Status */}
        {currentLog && (
          <div className="bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8 animate-pulse">
            <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200">Current Workflow</h3>
            <div className="space-y-2">
              <p className="text-blue-700 dark:text-blue-300"><strong>Topic:</strong> {currentLog.topic}</p>
              <p className="text-blue-700 dark:text-blue-300"><strong>Status:</strong> {currentLog.status}</p>
              {currentLog.rhymeText && (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentLog.rhymeText}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Workflow History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Workflow History</h2>

          {logs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No workflows yet. Start one above!</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`border rounded-lg p-5 transition-all ${
                    log.status === 'Completed successfully!'
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                      : log.status === 'Failed'
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{log.topic}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{log.timestamp}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      log.status === 'Completed successfully!'
                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                        : log.status === 'Failed'
                        ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                        : 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                    }`}>
                      {log.status}
                    </span>
                  </div>

                  {log.rhymeText && (
                    <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{log.rhymeText}</p>
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    {log.audioUrl && (
                      <a href={log.audioUrl} target="_blank" rel="noopener noreferrer"
                         className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                        🎵 Audio
                      </a>
                    )}
                    {log.videoUrl && (
                      <a href={log.videoUrl} target="_blank" rel="noopener noreferrer"
                         className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        🎬 Video
                      </a>
                    )}
                    {log.youtubeUrl && (
                      <a href={log.youtubeUrl} target="_blank" rel="noopener noreferrer"
                         className="text-sm text-red-600 dark:text-red-400 hover:underline font-semibold">
                        📺 YouTube
                      </a>
                    )}
                  </div>

                  {log.error && (
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded">
                      <p className="text-sm text-red-700 dark:text-red-300">Error: {log.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800 dark:text-yellow-200">📋 Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
            <li>Configure environment variables in <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">.env.local</code></li>
            <li>Set up OpenAI API key for rhyme generation</li>
            <li>Configure Google Sheets API with service account credentials</li>
            <li>Set up Replicate API for audio generation</li>
            <li>Configure YouTube Data API v3 credentials</li>
            <li>All services use free tiers where available</li>
          </ol>
        </div>
      </div>
    </main>
  )
}

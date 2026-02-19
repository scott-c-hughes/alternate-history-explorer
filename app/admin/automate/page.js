'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AUTO_IMPORT_TOPICS } from '@/lib/topics'

export default function AutomatePage() {
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const runBatchImport = async () => {
    setRunning(true)
    setError('')
    setResults(null)

    try {
      const res = await fetch('/api/import/batch', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Batch import failed')
      }

      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl text-ancient-gold-light">
          Automated Import
        </h1>
        <Link
          href="/admin"
          className="text-ancient-text-muted hover:text-ancient-gold transition-colors"
        >
          &larr; Back to Studio
        </Link>
      </div>

      {/* Run Import */}
      <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6 mb-8">
        <h2 className="font-serif text-xl text-ancient-gold mb-4">
          Run Batch Import
        </h2>
        <p className="text-ancient-text-muted text-sm mb-6">
          This will search for new content across all topics below and import anything not already in your database.
          It skips duplicates automatically.
        </p>

        <button
          onClick={runBatchImport}
          disabled={running}
          className="px-6 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                   hover:bg-ancient-gold-light transition-colors disabled:opacity-50"
        >
          {running ? 'Running... (this takes a few minutes)' : 'Run Batch Import Now'}
        </button>

        {/* Results */}
        {results && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h3 className="text-green-300 font-semibold mb-2">Import Complete</h3>
            <ul className="text-sm text-ancient-text-muted space-y-1">
              <li>Topics searched: {results.searched}</li>
              <li>New articles imported: {results.imported}</li>
              <li>Duplicates skipped: {results.skipped}</li>
              {results.errors > 0 && <li className="text-red-300">Errors: {results.errors}</li>}
            </ul>
            {results.articles?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-ancient-text-muted mb-2">New articles:</p>
                <ul className="text-sm space-y-1">
                  {results.articles.slice(0, 10).map((a, i) => (
                    <li key={i}>
                      <Link href={`/ancient-societies/${a.slug}`} className="text-ancient-gold hover:underline">
                        {a.title}
                      </Link>
                    </li>
                  ))}
                  {results.articles.length > 10 && (
                    <li className="text-ancient-text-muted">...and {results.articles.length - 10} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Topics List */}
      <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6">
        <h2 className="font-serif text-xl text-ancient-gold mb-4">
          Auto-Import Topics ({AUTO_IMPORT_TOPICS.length})
        </h2>
        <p className="text-ancient-text-muted text-sm mb-4">
          These topics are searched automatically. Edit <code className="bg-ancient-gray px-1 rounded">lib/topics.js</code> to add or remove topics.
        </p>
        <div className="flex flex-wrap gap-2">
          {AUTO_IMPORT_TOPICS.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-ancient-gray/50 text-ancient-text-muted text-sm rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-ancient-dark border border-ancient-gray rounded-lg p-6">
        <h2 className="font-serif text-xl text-ancient-gold mb-4">
          Automate Daily Imports
        </h2>
        <p className="text-ancient-text-muted text-sm mb-4">
          To run this automatically every day, you can set up a cron job after deploying to Vercel.
          Add this to your <code className="bg-ancient-gray px-1 rounded">vercel.json</code>:
        </p>
        <pre className="bg-ancient-gray p-4 rounded-lg text-sm text-ancient-text overflow-x-auto">
{`{
  "crons": [{
    "path": "/api/import/batch",
    "schedule": "0 8 * * *"
  }]
}`}
        </pre>
        <p className="text-ancient-text-muted text-sm mt-4">
          This runs the import every day at 8 AM UTC.
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ConnectionsPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [existingConnections, setExistingConnections] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchExistingConnections()
  }, [])

  const fetchExistingConnections = async () => {
    try {
      const res = await fetch('/api/connections')
      if (res.ok) {
        const data = await res.json()
        setExistingConnections(data)
      }
    } catch (e) {
      console.error('Failed to fetch connections:', e)
    }
  }

  const runAnalysis = async () => {
    setAnalyzing(true)
    setError('')
    setResults(null)

    try {
      const res = await fetch('/api/connections/analyze', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResults(data)
      fetchExistingConnections() // Refresh the list
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const connectionTypeLabels = {
    'flood-myths': 'Flood Myths',
    'megalithic': 'Megalithic Builders',
    'astronomical': 'Astronomical Alignments',
    'lost-technology': 'Lost Technology',
    'cultural-parallels': 'Cultural Parallels',
    'timeline': 'Timeline Anomalies',
    'geographic': 'Geographic Mysteries',
    'thematic': 'Thematic',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl text-ancient-gold-light">
          AI Connections
        </h1>
        <Link
          href="/admin"
          className="text-ancient-text-muted hover:text-ancient-gold transition-colors"
        >
          &larr; Back to Studio
        </Link>
      </div>

      {/* Run Analysis */}
      <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6 mb-8">
        <h2 className="font-serif text-xl text-ancient-gold mb-4">
          Discover Connections
        </h2>
        <p className="text-ancient-text-muted text-sm mb-6">
          Claude will analyze all your articles and find thematic connections between them.
          It looks for patterns like flood myths across cultures, similar building techniques,
          astronomical alignments, and more.
        </p>

        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="px-6 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                   hover:bg-ancient-gold-light transition-colors disabled:opacity-50"
        >
          {analyzing ? 'Analyzing... (this takes a minute)' : 'Find Connections with AI'}
        </button>

        {/* Results */}
        {results && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h3 className="text-green-300 font-semibold mb-2">Analysis Complete</h3>
            <ul className="text-sm text-ancient-text-muted space-y-1">
              <li>Connections found: {results.found}</li>
              <li>Saved to database: {results.saved}</li>
              {results.errors > 0 && <li className="text-red-300">Errors: {results.errors}</li>}
            </ul>

            {results.connections?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-ancient-text-muted mb-2">Sample connections:</p>
                <ul className="text-sm space-y-2">
                  {results.connections.slice(0, 5).map((c, i) => (
                    <li key={i} className="p-2 bg-ancient-gray/30 rounded">
                      <span className="text-ancient-gold">{connectionTypeLabels[c.connection_type] || c.connection_type}:</span>
                      <span className="text-ancient-text ml-2">{c.explanation}</span>
                    </li>
                  ))}
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

      {/* Existing Connections */}
      <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6">
        <h2 className="font-serif text-xl text-ancient-gold mb-4">
          Current Connections ({existingConnections.length})
        </h2>

        {existingConnections.length > 0 ? (
          <div className="space-y-3">
            {existingConnections.map((conn, i) => (
              <div key={i} className="p-3 bg-ancient-gray/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-ancient-gold/20 text-ancient-gold text-xs rounded">
                    {connectionTypeLabels[conn.connection_type] || conn.connection_type}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <Link href={`/${conn.article?.category}/${conn.article?.slug}`} className="text-ancient-text hover:text-ancient-gold">
                    {conn.article?.title}
                  </Link>
                  <span className="text-ancient-text-muted mx-2">↔</span>
                  <Link href={`/${conn.related?.category}/${conn.related?.slug}`} className="text-ancient-text hover:text-ancient-gold">
                    {conn.related?.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ancient-text-muted text-center py-8">
            No connections yet. Click "Find Connections with AI" to discover them.
          </p>
        )}
      </div>
    </div>
  )
}

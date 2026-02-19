'use client'

import { useState } from 'react'
import Link from 'next/link'

const SEARCH_SUGGESTIONS = [
  'Gobekli Tepe ancient civilization',
  'Graham Hancock lost civilization',
  'Younger Dryas impact theory',
  'Ancient Egypt mysteries',
  'Randall Carlson cataclysm',
  'Ancient megalithic structures',
  'Sphinx water erosion',
  'Ancient astronaut theory',
  'Lost technology ancient builders',
  'Pre-ice age civilization',
]

export default function ImportPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [importing, setImporting] = useState({})
  const [imported, setImported] = useState({})
  const [error, setError] = useState('')

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query
    if (!q.trim()) return

    setSearching(true)
    setError('')
    setResults([])

    try {
      const res = await fetch('/api/import/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, numResults: 15 }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setResults(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
    }
  }

  const handleImport = async (item) => {
    setImporting(prev => ({ ...prev, [item.url]: true }))

    try {
      const res = await fetch('/api/import/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          url: item.url,
          text: item.text,
          videoId: item.videoId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setImported(prev => ({ ...prev, [item.url]: data.article }))
    } catch (err) {
      setError(`Failed to import: ${err.message}`)
    } finally {
      setImporting(prev => ({ ...prev, [item.url]: false }))
    }
  }

  const handleImportAll = async () => {
    for (const item of results) {
      if (!imported[item.url] && !importing[item.url]) {
        await handleImport(item)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl text-ancient-gold-light">
          Import Content
        </h1>
        <Link
          href="/admin"
          className="text-ancient-text-muted hover:text-ancient-gold transition-colors"
        >
          &larr; Back to Studio
        </Link>
      </div>

      {/* Search */}
      <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6 mb-8">
        <h2 className="font-serif text-xl text-ancient-gold mb-4">
          Search for Content
        </h2>
        <p className="text-ancient-text-muted text-sm mb-4">
          Search for YouTube videos, podcasts, and articles about alternative history topics.
          Results will be summarized by AI and added to your site.
        </p>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for topics, channels, or specific content..."
            className="flex-1 px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                     text-ancient-text placeholder-ancient-text-muted
                     focus:outline-none focus:border-ancient-gold"
          />
          <button
            onClick={() => handleSearch()}
            disabled={searching || !query.trim()}
            className="px-6 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                     hover:bg-ancient-gold-light transition-colors disabled:opacity-50"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Quick search suggestions */}
        <div className="flex flex-wrap gap-2">
          <span className="text-ancient-text-muted text-sm">Try:</span>
          {SEARCH_SUGGESTIONS.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion)
                handleSearch(suggestion)
              }}
              className="text-sm px-3 py-1 bg-ancient-gray/50 text-ancient-gold rounded-full
                       hover:bg-ancient-gold/20 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-ancient-gold">
              Found {results.length} Results
            </h2>
            <button
              onClick={handleImportAll}
              className="px-4 py-2 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                       hover:bg-ancient-gold-light transition-colors"
            >
              Import All
            </button>
          </div>

          <div className="space-y-4">
            {results.map((item, index) => (
              <div
                key={item.url}
                className="flex items-start gap-4 p-4 bg-ancient-gray/30 rounded-lg"
              >
                {/* Thumbnail for YouTube */}
                {item.videoId && (
                  <img
                    src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                    alt=""
                    className="w-32 h-20 object-cover rounded flex-shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-ancient-text font-medium mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-ancient-text-muted text-sm mb-2 line-clamp-2">
                    {item.text?.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-3 text-xs text-ancient-text-muted">
                    {item.isYouTube && (
                      <span className="px-2 py-0.5 bg-red-900/30 text-red-300 rounded">
                        YouTube
                      </span>
                    )}
                    {item.isPodcast && (
                      <span className="px-2 py-0.5 bg-green-900/30 text-green-300 rounded">
                        Podcast
                      </span>
                    )}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ancient-gold hover:underline"
                    >
                      View Source
                    </a>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {imported[item.url] ? (
                    <Link
                      href={`/${imported[item.url].category}/${imported[item.url].slug}`}
                      className="px-4 py-2 bg-green-900/30 text-green-300 rounded-lg text-sm"
                    >
                      View Article
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleImport(item)}
                      disabled={importing[item.url]}
                      className="px-4 py-2 border border-ancient-gold text-ancient-gold rounded-lg
                               hover:bg-ancient-gold/10 transition-colors disabled:opacity-50 text-sm"
                    >
                      {importing[item.url] ? 'Importing...' : 'Import'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!searching && results.length === 0 && (
        <div className="text-center py-16 bg-ancient-gray/20 rounded-lg">
          <p className="text-ancient-text-muted mb-4">
            Search for content to import into your encyclopedia.
          </p>
          <p className="text-sm text-ancient-text-muted">
            Try searching for topics like "Gobekli Tepe", "Graham Hancock", or "ancient mysteries"
          </p>
        </div>
      )}
    </div>
  )
}

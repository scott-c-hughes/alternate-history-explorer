'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'ancient-societies', name: 'Ancient Societies' },
  { id: 'alternative-history', name: 'Alternative History' },
  { id: 'cosmic-mysteries', name: 'Cosmic Mysteries' },
]

const regions = [
  { id: 'all', name: 'All Regions' },
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'americas', name: 'Americas' },
  { id: 'asia', name: 'Asia' },
  { id: 'africa', name: 'Africa' },
  { id: 'europe', name: 'Europe' },
  { id: 'oceania', name: 'Oceania' },
  { id: 'global', name: 'Global' },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState('all')
  const [region, setRegion] = useState('all')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      handleSearch()
    }
  }, [])

  const handleSearch = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (category !== 'all') params.set('category', category)
      if (region !== 'all') params.set('region', region)

      const res = await fetch(`/api/articles/search?${params}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ancient-gold-light mb-4">
          Search the Archives
        </h1>
        <p className="text-xl text-ancient-text-muted">
          Discover hidden knowledge across all categories and regions.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for mysteries..."
            className="flex-1 px-6 py-4 bg-ancient-dark border border-ancient-gray rounded-lg
                     text-ancient-text placeholder-ancient-text-muted
                     focus:outline-none focus:border-ancient-gold transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                     hover:bg-ancient-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div>
            <label className="block text-sm text-ancient-text-muted mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-ancient-dark border border-ancient-gray rounded-lg
                       text-ancient-text focus:outline-none focus:border-ancient-gold"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-ancient-text-muted mb-2">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-2 bg-ancient-dark border border-ancient-gray rounded-lg
                       text-ancient-text focus:outline-none focus:border-ancient-gold"
            >
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id}>{reg.name}</option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl text-ancient-gold-light">
              {loading ? 'Searching...' : `${results.length} Result${results.length !== 1 ? 's' : ''}`}
            </h2>
          </div>

          {!loading && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : !loading ? (
            <div className="text-center py-16 bg-ancient-gray/20 rounded-lg">
              <p className="text-ancient-text-muted mb-4">
                No articles found matching your search.
              </p>
              <p className="text-sm text-ancient-text-muted">
                Try adjusting your filters or using different keywords.
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Browse Prompt */}
      {!searched && (
        <div className="text-center py-16 bg-ancient-dark/50 rounded-lg">
          <p className="text-ancient-text-muted mb-4">
            Enter a search term or select filters to explore the archives.
          </p>
          <button
            onClick={handleSearch}
            className="text-ancient-gold hover:text-ancient-gold-light transition-colors"
          >
            Browse all articles &rarr;
          </button>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-ancient-text-muted">Loading search...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

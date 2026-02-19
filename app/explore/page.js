'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import map to avoid SSR issues
const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] bg-ancient-dark rounded-lg border border-ancient-gray flex items-center justify-center">
      <div className="text-ancient-text-muted">Loading map...</div>
    </div>
  ),
})

const regions = [
  { id: 'all', name: 'All Regions' },
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'americas', name: 'Americas' },
  { id: 'asia', name: 'Asia' },
  { id: 'africa', name: 'Africa' },
  { id: 'europe', name: 'Europe' },
  { id: 'oceania', name: 'Oceania' },
]

export default function ExplorePage() {
  const [articles, setArticles] = useState([])
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/articles/map')
        if (res.ok) {
          const data = await res.json()
          setArticles(data)
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const filteredArticles = selectedRegion === 'all'
    ? articles
    : articles.filter(a => a.region === selectedRegion)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ancient-gold-light mb-4">
          Explore the World
        </h1>
        <p className="text-xl text-ancient-text-muted max-w-2xl mx-auto">
          Ancient mysteries span the globe. Discover how distant civilizations share
          unexplained connections across time and space.
        </p>
      </div>

      {/* Region Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setSelectedRegion(region.id)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedRegion === region.id
                ? 'bg-ancient-gold text-ancient-black font-semibold'
                : 'bg-ancient-gray text-ancient-text-muted hover:bg-ancient-gold/20 hover:text-ancient-gold'
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* Map */}
      <WorldMap
        articles={filteredArticles}
        selectedRegion={selectedRegion}
      />

      {/* Articles List */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl text-ancient-gold-light mb-6">
          {selectedRegion === 'all' ? 'All Locations' : regions.find(r => r.id === selectedRegion)?.name}
          <span className="text-ancient-text-muted font-sans text-lg ml-2">
            ({filteredArticles.length} sites)
          </span>
        </h2>

        {loading ? (
          <div className="text-center py-12 text-ancient-text-muted">
            Loading articles...
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.category}/${article.slug}`}
                className="p-4 bg-ancient-dark border border-ancient-gray rounded-lg hover:border-ancient-gold/50 transition-colors group"
              >
                <h3 className="font-serif text-lg text-ancient-text group-hover:text-ancient-gold transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center mt-2 text-sm text-ancient-text-muted">
                  <span className="capitalize">{article.region}</span>
                  <span className="mx-2">|</span>
                  <span className="capitalize">{article.category.replace('-', ' ')}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-ancient-gray/20 rounded-lg">
            <p className="text-ancient-text-muted mb-4">
              No sites mapped in this region yet.
            </p>
            <Link
              href="/admin"
              className="text-ancient-gold hover:text-ancient-gold-light transition-colors"
            >
              Add an article with coordinates &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

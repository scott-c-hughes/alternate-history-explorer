'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setIsExpanded(false)
    }
  }

  return (
    <div className="relative">
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mysteries..."
            className="w-48 sm:w-64 px-4 py-2 bg-ancient-gray border border-ancient-gold/30 rounded-lg
                     text-ancient-text placeholder-ancient-text-muted focus:outline-none focus:border-ancient-gold
                     transition-all"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="ml-2 p-2 text-ancient-text-muted hover:text-ancient-gold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 text-ancient-text-muted hover:text-ancient-gold transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}
    </div>
  )
}

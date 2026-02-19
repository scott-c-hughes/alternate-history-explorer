'use client'

import { useState } from 'react'
import Link from 'next/link'

const categories = [
  { id: 'ancient-societies', name: 'Ancient Societies' },
  { id: 'alternative-history', name: 'Alternative History' },
  { id: 'cosmic-mysteries', name: 'Cosmic Mysteries' },
]

const regions = [
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'americas', name: 'Americas' },
  { id: 'asia', name: 'Asia' },
  { id: 'africa', name: 'Africa' },
  { id: 'europe', name: 'Europe' },
  { id: 'oceania', name: 'Oceania' },
  { id: 'global', name: 'Global' },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('ancient-societies')
  const [region, setRegion] = useState('mediterranean')
  const [generating, setGenerating] = useState(false)
  const [draft, setDraft] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = (e) => {
    e.preventDefault()
    // Simple password check - in production use proper auth
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'althistory2024') {
      setIsAuthenticated(true)
      setAuthError('')
    } else {
      setAuthError('Incorrect password')
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return

    setGenerating(true)
    setMessage('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category }),
      })

      if (!res.ok) {
        throw new Error('Failed to generate article')
      }

      const data = await res.json()
      setDraft(data.content)
      setTitle(data.title || topic)
      setExcerpt(data.excerpt || '')
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async (publish = false) => {
    if (!title.trim() || !draft.trim()) {
      setMessage('Title and content are required')
      return
    }

    setSaving(true)
    setMessage('')

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          category,
          region,
          content: draft,
          excerpt,
          cover_image: coverImage || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          published: publish,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to save article')
      }

      setMessage(publish ? 'Article published successfully!' : 'Draft saved successfully!')

      // Clear form if published
      if (publish) {
        setTopic('')
        setDraft('')
        setTitle('')
        setExcerpt('')
        setCoverImage('')
        setLatitude('')
        setLongitude('')
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-8">
          <h1 className="font-serif text-2xl text-ancient-gold-light mb-6 text-center">
            Content Studio
          </h1>
          <form onSubmit={handleAuth}>
            <label className="block text-sm text-ancient-text-muted mb-2">
              Enter Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                       text-ancient-text focus:outline-none focus:border-ancient-gold mb-4"
              placeholder="Password"
            />
            {authError && (
              <p className="text-red-400 text-sm mb-4">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                       hover:bg-ancient-gold-light transition-colors"
            >
              Access Studio
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-4xl text-ancient-gold-light">
          AI Content Studio
        </h1>
        <div className="flex gap-3">
          <Link
            href="/admin/import"
            className="px-5 py-2 border border-ancient-gold text-ancient-gold rounded-lg hover:bg-ancient-gold/10 transition-colors"
          >
            Import
          </Link>
          <Link
            href="/admin/automate"
            className="px-5 py-2 border border-ancient-gold text-ancient-gold rounded-lg hover:bg-ancient-gold/10 transition-colors"
          >
            Automate
          </Link>
          <Link
            href="/admin/connections"
            className="px-5 py-2 bg-ancient-gold text-ancient-black font-semibold rounded-lg hover:bg-ancient-gold-light transition-colors"
          >
            Find Connections
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Generation */}
        <div className="space-y-6">
          <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6">
            <h2 className="font-serif text-xl text-ancient-gold mb-4">
              Generate New Article
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm text-ancient-text-muted mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., The Sphinx Water Erosion Hypothesis"
                  className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                           text-ancient-text placeholder-ancient-text-muted
                           focus:outline-none focus:border-ancient-gold"
                />
              </div>

              <div>
                <label className="block text-sm text-ancient-text-muted mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                           text-ancient-text focus:outline-none focus:border-ancient-gold"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={generating || !topic.trim()}
                className="w-full py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                         hover:bg-ancient-gold-light transition-colors disabled:opacity-50"
              >
                {generating ? 'Generating with Claude...' : 'Generate Article Draft'}
              </button>
            </form>
          </div>

          {/* Metadata */}
          <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6">
            <h2 className="font-serif text-xl text-ancient-gold mb-4">
              Article Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-ancient-text-muted mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                           text-ancient-text focus:outline-none focus:border-ancient-gold"
                />
              </div>

              <div>
                <label className="block text-sm text-ancient-text-muted mb-2">
                  Excerpt (1-2 sentences)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                           text-ancient-text focus:outline-none focus:border-ancient-gold resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-ancient-text-muted mb-2">
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                           text-ancient-text focus:outline-none focus:border-ancient-gold"
                >
                  {regions.map((reg) => (
                    <option key={reg.id} value={reg.id}>{reg.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-ancient-text-muted mb-2">
                  Cover Image URL (optional)
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                           text-ancient-text placeholder-ancient-text-muted
                           focus:outline-none focus:border-ancient-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-ancient-text-muted mb-2">
                    Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g., 29.9792"
                    className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                             text-ancient-text placeholder-ancient-text-muted
                             focus:outline-none focus:border-ancient-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-ancient-text-muted mb-2">
                    Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g., 31.1342"
                    className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                             text-ancient-text placeholder-ancient-text-muted
                             focus:outline-none focus:border-ancient-gold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editor */}
        <div className="space-y-6">
          <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6">
            <h2 className="font-serif text-xl text-ancient-gold mb-4">
              Article Content (Markdown)
            </h2>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={20}
              placeholder="Article content will appear here after generation, or write your own..."
              className="w-full px-4 py-3 bg-ancient-gray border border-ancient-gray rounded-lg
                       text-ancient-text placeholder-ancient-text-muted font-mono text-sm
                       focus:outline-none focus:border-ancient-gold resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !title.trim() || !draft.trim()}
              className="flex-1 py-3 border border-ancient-gold text-ancient-gold rounded-lg
                       hover:bg-ancient-gold/10 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title.trim() || !draft.trim()}
              className="flex-1 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                       hover:bg-ancient-gold-light transition-colors disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg text-center ${
              message.startsWith('Error')
                ? 'bg-red-900/30 text-red-300'
                : 'bg-green-900/30 text-green-300'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

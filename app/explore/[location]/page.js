import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { KNOWN_LOCATIONS } from '@/lib/locations'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Get location info from slug
function getLocationInfo(slug) {
  const locationName = slug.replace(/-/g, ' ')
  const location = KNOWN_LOCATIONS[locationName]

  if (!location) return null

  return {
    name: locationName,
    displayName: locationName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    ...location
  }
}

// Get region display name
function getRegionName(region) {
  const regions = {
    'mediterranean': 'Mediterranean',
    'americas': 'Americas',
    'asia': 'Asia',
    'africa': 'Africa',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'global': 'Global',
  }
  return regions[region] || region
}

// Get articles near this location
async function getArticlesAtLocation(lat, lng, threshold = 0.5) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  if (error) return []

  // Filter articles within threshold distance
  return data.filter(article => {
    const latDiff = Math.abs(article.latitude - lat)
    const lngDiff = Math.abs(article.longitude - lng)
    return latDiff < threshold && lngDiff < threshold
  })
}

export async function generateMetadata({ params }) {
  const { location } = await params
  const locationInfo = getLocationInfo(location)

  if (!locationInfo) return { title: 'Location Not Found' }

  return {
    title: `${locationInfo.displayName} | Alternate History Explorer`,
    description: `Explore ancient mysteries and alternative history content related to ${locationInfo.displayName}`,
  }
}

export default async function LocationPage({ params }) {
  const { location } = await params
  const locationInfo = getLocationInfo(location)

  if (!locationInfo) notFound()

  const articles = await getArticlesAtLocation(locationInfo.lat, locationInfo.lng)

  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    const cat = article.category || 'uncategorized'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(article)
    return acc
  }, {})

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ancient-dark via-ancient-black to-ancient-black"></div>

        {/* Map pin decoration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <svg className="w-96 h-96" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-ancient-text-muted mb-6">
            <Link href="/explore" className="hover:text-ancient-gold transition-colors">
              World Map
            </Link>
            <span>/</span>
            <span className="text-ancient-gold">{locationInfo.displayName}</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-ancient-gold-light mb-4">
            {locationInfo.displayName}
          </h1>

          {/* Location Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-ancient-dark/50 border border-ancient-gray rounded-lg px-6 py-4">
              <div className="text-sm text-ancient-text-muted uppercase tracking-wide mb-1">Region</div>
              <div className="text-xl text-ancient-gold font-semibold">
                {getRegionName(locationInfo.region)}
              </div>
            </div>
            <div className="bg-ancient-dark/50 border border-ancient-gray rounded-lg px-6 py-4">
              <div className="text-sm text-ancient-text-muted uppercase tracking-wide mb-1">Coordinates</div>
              <div className="text-xl text-ancient-gold font-semibold font-mono">
                {locationInfo.lat.toFixed(4)}°, {locationInfo.lng.toFixed(4)}°
              </div>
            </div>
            <div className="bg-ancient-dark/50 border border-ancient-gray rounded-lg px-6 py-4">
              <div className="text-sm text-ancient-text-muted uppercase tracking-wide mb-1">Articles</div>
              <div className="text-xl text-ancient-gold font-semibold">
                {articles.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {articles.length > 0 ? (
            <>
              {Object.entries(articlesByCategory).map(([category, catArticles]) => (
                <div key={category} className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-1 bg-ancient-gold"></div>
                    <h2 className="font-serif text-2xl text-ancient-gold-light capitalize">
                      {category.replace('-', ' ')}
                    </h2>
                    <span className="text-ancient-text-muted">
                      ({catArticles.length} article{catArticles.length !== 1 ? 's' : ''})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/${article.category}/${article.slug}`}
                        className="group"
                      >
                        <div className="h-full bg-ancient-dark border border-ancient-gray rounded-lg p-6
                                      hover:border-ancient-gold/50 hover:bg-ancient-gray/20
                                      transition-all duration-300">
                          <h3 className="font-serif text-xl text-ancient-text group-hover:text-ancient-gold
                                       transition-colors mb-3 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-ancient-text-muted text-sm line-clamp-3 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="text-ancient-gold text-sm group-hover:translate-x-1 transition-transform">
                            Read more →
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-20 bg-ancient-dark/50 rounded-2xl border border-ancient-gray">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="font-serif text-2xl text-ancient-gold-light mb-4">
                No Articles Yet
              </h2>
              <p className="text-ancient-text-muted mb-6">
                We haven't imported any content about {locationInfo.displayName} yet.
              </p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                         hover:bg-ancient-gold-light transition-colors"
              >
                Import Content
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-ancient-gray">
        <Link
          href="/explore"
          className="inline-flex items-center text-ancient-gold hover:text-ancient-gold-light transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to World Map
        </Link>
      </div>
    </div>
  )
}

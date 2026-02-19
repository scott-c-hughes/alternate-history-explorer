import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getMystery(slug) {
  const { data, error } = await supabase
    .from('mysteries')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

async function getMysteryArticles(mysteryId) {
  const { data, error } = await supabase
    .from('mystery_articles')
    .select(`
      article_id,
      articles (*)
    `)
    .eq('mystery_id', mysteryId)

  if (error) return []
  return data?.map(ma => ma.articles).filter(Boolean) || []
}

async function getRelatedMysteries(currentSlug) {
  const { data, error } = await supabase
    .from('mysteries')
    .select('id, name, slug, icon, tagline')
    .neq('slug', currentSlug)
    .limit(4)

  if (error) return []
  return data || []
}

function parseMarkdown(markdown) {
  if (!markdown) return ''

  return markdown
    .replace(/^### (.+)$/gm, '<h3 class="font-serif text-xl text-ancient-gold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-serif text-2xl text-ancient-gold-light mt-8 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h2 class="font-serif text-3xl text-ancient-gold-light mt-8 mb-4">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-ancient-text">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, '</p>')
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const mystery = await getMystery(slug)

  if (!mystery) return { title: 'Mystery Not Found' }

  return {
    title: `${mystery.name} | Alternate History Explorer`,
    description: mystery.tagline,
  }
}

export default async function MysteryPage({ params }) {
  const { slug } = await params
  const mystery = await getMystery(slug)

  if (!mystery) notFound()

  const [articles, relatedMysteries] = await Promise.all([
    getMysteryArticles(mystery.id),
    getRelatedMysteries(slug),
  ])

  // Separate YouTube videos from articles
  const videos = articles.filter(a => a.content?.includes('youtube.com/embed'))
  const textArticles = articles.filter(a => !a.content?.includes('youtube.com/embed'))

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-ancient-dark via-ancient-black to-ancient-black"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #d4a853 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #d4a853 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="text-8xl mb-6 animate-pulse">{mystery.icon}</div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-ancient-gold-light mb-6">
            {mystery.name}
          </h1>
          <p className="text-2xl text-ancient-text-muted max-w-3xl mx-auto leading-relaxed">
            {mystery.tagline}
          </p>

          {/* Stats Bar */}
          <div className="flex justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-ancient-gold">{articles.length}</div>
              <div className="text-sm text-ancient-text-muted uppercase tracking-wide">Sources</div>
            </div>
            <div className="w-px bg-ancient-gray"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-ancient-gold">{videos.length}</div>
              <div className="text-sm text-ancient-text-muted uppercase tracking-wide">Videos</div>
            </div>
            <div className="w-px bg-ancient-gray"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-ancient-gold">{relatedMysteries.length}</div>
              <div className="text-sm text-ancient-text-muted uppercase tracking-wide">Connections</div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-1 bg-ancient-gold"></div>
            <h2 className="font-serif text-3xl text-ancient-gold-light">The Mystery</h2>
          </div>
          <div
            className="text-lg leading-relaxed text-ancient-text-muted space-y-4"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(mystery.overview) }}
          />
        </div>
      </section>

      {/* Video Evidence */}
      {videos.length > 0 && (
        <section className="py-16 px-4 bg-ancient-dark/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-ancient-gold"></div>
              <h2 className="font-serif text-3xl text-ancient-gold-light">Video Evidence</h2>
              <span className="ml-auto text-ancient-text-muted">{videos.length} videos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.slice(0, 6).map((article) => {
                const videoMatch = article.content?.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
                const videoId = videoMatch?.[1]

                return (
                  <Link
                    key={article.id}
                    href={`/${article.category}/${article.slug}`}
                    className="group"
                  >
                    <div className="bg-ancient-dark border border-ancient-gray rounded-lg overflow-hidden
                                  hover:border-ancient-gold/50 transition-all duration-300">
                      {videoId && (
                        <div className="relative aspect-video bg-ancient-gray">
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center
                                        group-hover:bg-black/20 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-ancient-gold/90 flex items-center justify-center">
                              <svg className="w-8 h-8 text-ancient-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-serif text-lg text-ancient-text group-hover:text-ancient-gold
                                     transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      {textArticles.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-ancient-gold"></div>
              <h2 className="font-serif text-3xl text-ancient-gold-light">Research & Articles</h2>
              <span className="ml-auto text-ancient-text-muted">{textArticles.length} articles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {textArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${article.category}/${article.slug}`}
                  className="group"
                >
                  <div className="h-full bg-ancient-dark border border-ancient-gray rounded-lg p-6
                                hover:border-ancient-gold/50 hover:bg-ancient-gray/20
                                transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs px-2 py-1 bg-ancient-gray rounded text-ancient-gold uppercase tracking-wide">
                        {article.category?.replace('-', ' ')}
                      </span>
                      {article.region && (
                        <span className="text-xs text-ancient-text-muted capitalize">
                          {article.region}
                        </span>
                      )}
                    </div>
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
        </section>
      )}

      {/* Connected Mysteries */}
      {relatedMysteries.length > 0 && (
        <section className="py-16 px-4 bg-ancient-dark/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-ancient-gold"></div>
              <h2 className="font-serif text-3xl text-ancient-gold-light">Connected Mysteries</h2>
            </div>
            <p className="text-ancient-text-muted mb-8 max-w-2xl">
              These mysteries share thematic connections—flood narratives, advanced ancient technology,
              or unexplained global patterns that challenge mainstream history.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedMysteries.map((m) => (
                <Link
                  key={m.id}
                  href={`/mysteries/${m.slug}`}
                  className="group relative"
                >
                  <div className="bg-ancient-dark border border-ancient-gray rounded-xl p-6 text-center
                                hover:border-ancient-gold hover:bg-ancient-gold/5
                                transition-all duration-300 h-full">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {m.icon}
                    </div>
                    <h3 className="font-serif text-lg text-ancient-text group-hover:text-ancient-gold transition-colors">
                      {m.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-ancient-gray">
        <div className="flex justify-between items-center">
          <Link
            href="/mysteries"
            className="inline-flex items-center text-ancient-gold hover:text-ancient-gold-light transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Mysteries
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center text-ancient-gold hover:text-ancient-gold-light transition-colors"
          >
            Explore Map
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

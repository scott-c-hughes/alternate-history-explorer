import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getMysteries() {
  const { data, error } = await supabase
    .from('mysteries')
    .select(`
      *,
      mystery_articles(count)
    `)
    .order('name')

  if (error) return []

  return data?.map(m => ({
    ...m,
    article_count: m.mystery_articles?.[0]?.count || 0,
  })) || []
}

export const metadata = {
  title: 'Mysteries | Alternate History Explorer',
  description: 'Explore the great unsolved mysteries of human history',
}

export default async function MysteriesPage() {
  const mysteries = await getMysteries()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ancient-dark to-ancient-black"></div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23d4a853' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-ancient-gold-light mb-6">
            The Great Mysteries
          </h1>
          <p className="text-xl text-ancient-text-muted max-w-2xl mx-auto leading-relaxed">
            Patterns that span continents and millennia. Evidence that challenges everything
            we think we know about human history.
          </p>
        </div>
      </section>

      {/* Mysteries Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {mysteries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mysteries.map((mystery, index) => (
                <Link
                  key={mystery.id}
                  href={`/mysteries/${mystery.slug}`}
                  className="group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-full bg-gradient-to-br from-ancient-dark to-ancient-gray/30
                                border border-ancient-gray rounded-2xl p-8
                                hover:border-ancient-gold/50 hover:from-ancient-dark hover:to-ancient-gold/5
                                transition-all duration-500 overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ancient-gold/5 rounded-full blur-3xl
                                  group-hover:bg-ancient-gold/10 transition-colors"></div>

                    <div className="relative">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {mystery.icon}
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-ancient-gold-light mb-3
                                   group-hover:text-ancient-gold transition-colors">
                        {mystery.name}
                      </h2>
                      <p className="text-ancient-text-muted leading-relaxed mb-6">
                        {mystery.tagline}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-ancient-text-muted">
                          {mystery.article_count} source{mystery.article_count !== 1 ? 's' : ''}
                        </span>
                        <span className="text-ancient-gold flex items-center gap-2 group-hover:gap-3 transition-all">
                          Explore
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-ancient-dark/50 rounded-2xl border border-ancient-gray">
              <div className="text-6xl mb-4">🔮</div>
              <h2 className="font-serif text-2xl text-ancient-gold-light mb-4">
                No Mysteries Generated Yet
              </h2>
              <p className="text-ancient-text-muted mb-6">
                Import some content first, then generate mystery pages.
              </p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                         hover:bg-ancient-gold-light transition-colors"
              >
                Go to Admin
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-ancient-dark/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-ancient-gold-light mb-4">
            See the Connections
          </h2>
          <p className="text-ancient-text-muted mb-8">
            Explore how these mysteries connect across geography and time on our interactive world map.
          </p>
          <Link
            href="/explore"
            className="inline-block px-8 py-4 bg-ancient-gold text-ancient-black font-semibold rounded-lg
                     hover:bg-ancient-gold-light transition-colors"
          >
            Open World Map
          </Link>
        </div>
      </section>
    </div>
  )
}

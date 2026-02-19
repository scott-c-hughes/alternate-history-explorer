import Link from 'next/link'
import CategoryCard from '@/components/CategoryCard'
import ArticleCard from '@/components/ArticleCard'
import { getRecentArticles } from '@/lib/supabase'

const categories = [
  {
    id: 'ancient-societies',
    name: 'Ancient Societies',
    description: 'Advanced civilizations that mainstream academia underestimates. From Gobekli Tepe to pre-dynastic Egypt.',
    icon: '&#127963;',
    href: '/ancient-societies',
  },
  {
    id: 'alternative-history',
    name: 'Alternative History',
    description: 'Challenging official narratives. Younger Dryas impact, Egyptian King List anomalies, pre-ice age civilizations.',
    icon: '&#128220;',
    href: '/alternative-history',
  },
  {
    id: 'cosmic-mysteries',
    name: 'Cosmic Mysteries',
    description: 'Ancient astronaut theories, unexplained artifacts, celestial alignments and their hidden meanings.',
    icon: '&#9734;',
    href: '/cosmic-mysteries',
  },
]

export default async function HomePage() {
  const recentArticles = await getRecentArticles(6)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ancient-dark/50 to-ancient-black"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-ancient-gold-light mb-6 animate-fade-in">
            What If Everything You Know<br />About History Is Wrong?
          </h1>
          <p className="text-xl text-ancient-text-muted mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Explore the hidden chapters of human civilization. From ancient builders who possessed
            knowledge we&apos;re only rediscovering, to cosmic connections that defy explanation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/explore"
              className="px-8 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg hover:bg-ancient-gold-light transition-colors"
            >
              Explore the Map
            </Link>
            <Link
              href="/search"
              className="px-8 py-3 border border-ancient-gold text-ancient-gold rounded-lg hover:bg-ancient-gold/10 transition-colors"
            >
              Search Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-ancient-gold-light mb-8 text-center">
            Explore the Unknown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-16 px-4 bg-ancient-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-ancient-gold-light">
              Recent Discoveries
            </h2>
            <Link
              href="/search"
              className="text-ancient-gold hover:text-ancient-gold-light transition-colors gold-underline"
            >
              View All &rarr;
            </Link>
          </div>

          {recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-ancient-gray/30 rounded-lg">
              <p className="text-ancient-text-muted mb-4">No articles published yet.</p>
              <Link
                href="/admin"
                className="text-ancient-gold hover:text-ancient-gold-light transition-colors"
              >
                Create your first article &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-ancient-gold-light mb-4">
            The Truth Is Out There
          </h2>
          <p className="text-ancient-text-muted mb-8">
            Human history stretches back far beyond what conventional archaeology admits.
            Advanced civilizations rose and fell before the last ice age. The evidence is
            scattered across the globe, waiting to be connected.
          </p>
          <Link
            href="/explore"
            className="inline-block px-8 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg hover:bg-ancient-gold-light transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  )
}

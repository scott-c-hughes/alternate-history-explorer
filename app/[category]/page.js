import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getArticlesByCategory } from '@/lib/supabase'
import { notFound } from 'next/navigation'

const categoryInfo = {
  'ancient-societies': {
    name: 'Ancient Societies',
    description: 'Advanced civilizations that mainstream academia underestimates. Explore the builders of Gobekli Tepe, the mysteries of pre-dynastic Egypt, and megalithic cultures that possessed knowledge we\'re only beginning to understand.',
    icon: '&#127963;',
  },
  'alternative-history': {
    name: 'Alternative History',
    description: 'Challenging official narratives and exploring suppressed evidence. From the Younger Dryas impact theory to Egyptian King List anomalies and pre-ice age civilizations.',
    icon: '&#128220;',
  },
  'cosmic-mysteries': {
    name: 'Cosmic Mysteries',
    description: 'Ancient astronaut theories, unexplained artifacts, and celestial alignments. Discover the cosmic connections that link ancient cultures across the globe.',
    icon: '&#9734;',
  },
}

export async function generateMetadata({ params }) {
  const { category } = await params
  const info = categoryInfo[category]

  if (!info) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${info.name} | Alternate History Explorer`,
    description: info.description,
  }
}

export default async function CategoryPage({ params }) {
  const { category } = await params
  const info = categoryInfo[category]

  if (!info) {
    notFound()
  }

  const articles = await getArticlesByCategory(category)

  return (
    <div>
      {/* Category Header */}
      <section className="py-16 px-4 bg-ancient-dark/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4" dangerouslySetInnerHTML={{ __html: info.icon }} />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ancient-gold-light mb-4">
            {info.name}
          </h1>
          <p className="text-xl text-ancient-text-muted max-w-2xl mx-auto">
            {info.description}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {articles.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <p className="text-ancient-text-muted">
                  {articles.length} article{articles.length !== 1 ? 's' : ''}
                </p>
                <Link
                  href="/explore"
                  className="text-ancient-gold hover:text-ancient-gold-light transition-colors"
                >
                  View on Map &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-ancient-gray/20 rounded-lg">
              <div className="text-4xl mb-4" dangerouslySetInnerHTML={{ __html: info.icon }} />
              <h2 className="font-serif text-2xl text-ancient-gold-light mb-2">
                No Articles Yet
              </h2>
              <p className="text-ancient-text-muted mb-6">
                This category is waiting to be explored.
              </p>
              <Link
                href="/admin"
                className="inline-block px-6 py-2 bg-ancient-gold text-ancient-black font-semibold rounded-lg hover:bg-ancient-gold-light transition-colors"
              >
                Create First Article
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12 px-4 border-t border-ancient-gray">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl text-ancient-gold-light mb-6">
            Explore Other Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryInfo)
              .filter(([key]) => key !== category)
              .map(([key, cat]) => (
                <Link
                  key={key}
                  href={`/${key}`}
                  className="flex items-center p-4 bg-ancient-dark border border-ancient-gray rounded-lg hover:border-ancient-gold/50 transition-colors"
                >
                  <span className="text-3xl mr-4" dangerouslySetInnerHTML={{ __html: cat.icon }} />
                  <div>
                    <h3 className="font-serif text-lg text-ancient-gold-light">{cat.name}</h3>
                    <p className="text-sm text-ancient-text-muted line-clamp-1">{cat.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

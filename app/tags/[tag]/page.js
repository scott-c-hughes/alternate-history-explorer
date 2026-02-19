import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { getAllTags, getArticlesByTag } from '@/lib/supabase'

export async function generateMetadata({ params }) {
  const { tag } = await params

  return {
    title: `#${tag} | Alternate History Explorer`,
    description: `Explore articles tagged with ${tag}`,
  }
}

export default async function TagPage({ params }) {
  const { tag } = await params
  const allTags = await getAllTags()
  const tagData = allTags.find(t => t.name === tag)

  const articles = tagData ? await getArticlesByTag(tagData.id) : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-ancient-gold text-lg">Topic</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ancient-gold-light mt-2 mb-4">
          #{tag}
        </h1>
        {tagData?.description && (
          <p className="text-xl text-ancient-text-muted max-w-2xl mx-auto">
            {tagData.description}
          </p>
        )}
      </div>

      {/* Articles */}
      {articles.length > 0 ? (
        <div>
          <p className="text-ancient-text-muted mb-6">
            {articles.length} article{articles.length !== 1 ? 's' : ''} with this tag
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-ancient-gray/20 rounded-lg">
          <p className="text-ancient-text-muted mb-4">
            No articles with this tag yet.
          </p>
          <Link
            href="/search"
            className="text-ancient-gold hover:text-ancient-gold-light transition-colors"
          >
            Browse all articles &rarr;
          </Link>
        </div>
      )}

      {/* Other Tags */}
      {allTags.length > 1 && (
        <div className="mt-16 pt-8 border-t border-ancient-gray">
          <h2 className="font-serif text-2xl text-ancient-gold-light mb-6">
            Other Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags
              .filter(t => t.name !== tag)
              .map((t) => (
                <Link
                  key={t.id}
                  href={`/tags/${t.name}`}
                  className="px-4 py-2 bg-ancient-gray/50 text-ancient-text-muted rounded-full
                           hover:bg-ancient-gold/20 hover:text-ancient-gold
                           transition-colors border border-ancient-gray hover:border-ancient-gold/50"
                >
                  #{t.name}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

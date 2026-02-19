import Link from 'next/link'
import Image from 'next/image'

export default function ArticleCard({ article }) {
  const categoryLabels = {
    'ancient-societies': 'Ancient Societies',
    'alternative-history': 'Alternative History',
    'cosmic-mysteries': 'Cosmic Mysteries',
  }

  return (
    <Link href={`/${article.category}/${article.slug}`}>
      <article className="group bg-ancient-dark border border-ancient-gray rounded-lg overflow-hidden
                        hover:border-ancient-gold/50 transition-all duration-300 h-full flex flex-col">
        {/* Cover Image */}
        <div className="relative h-48 bg-ancient-gray overflow-hidden">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ancient-text-muted">
              <svg className="w-12 h-12 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-ancient-black/80 text-ancient-gold text-xs rounded">
              {categoryLabels[article.category] || article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-serif text-lg font-bold text-ancient-text mb-2 group-hover:text-ancient-gold transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-ancient-text-muted text-sm mb-4 line-clamp-3 flex-1">
            {article.excerpt}
          </p>

          {/* Region & Date */}
          <div className="flex items-center justify-between text-xs text-ancient-text-muted">
            {article.region && (
              <span className="capitalize">{article.region}</span>
            )}
            <span>
              {new Date(article.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

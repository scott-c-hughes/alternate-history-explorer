import Link from 'next/link'

export default function RelatedArticles({ articles }) {
  if (!articles || articles.length === 0) return null

  const connectionLabels = {
    'geographic': 'Same Region',
    'thematic': 'Related Theme',
    'chronological': 'Same Era',
  }

  return (
    <div className="bg-ancient-dark border border-ancient-gray rounded-lg p-6">
      <h3 className="font-serif text-xl text-ancient-gold-light mb-4">
        Related Mysteries
      </h3>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.category}/${article.slug}`}
            className="block group"
          >
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-ancient-gold flex-shrink-0" />
              <div>
                <h4 className="text-ancient-text group-hover:text-ancient-gold transition-colors font-medium">
                  {article.title}
                </h4>
                {article.connection_type && (
                  <span className="text-xs text-ancient-text-muted">
                    {connectionLabels[article.connection_type] || article.connection_type}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

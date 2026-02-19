import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getRelatedArticles, getArticleTags } from '@/lib/supabase'
import RelatedArticles from '@/components/RelatedArticles'
import TagCloud from '@/components/TagCloud'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: `${article.title} | Alternate History Explorer`,
    description: article.excerpt,
  }
}

// Simple markdown to HTML conversion
function parseMarkdown(markdown) {
  if (!markdown) return ''

  let html = markdown
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="font-serif text-xl text-ancient-gold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-serif text-2xl text-ancient-gold-light mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-serif text-3xl text-ancient-gold-light mb-6">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ancient-text">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-ancient-gold hover:underline">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-ancient-gold pl-4 my-4 text-ancient-text-muted italic">$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-ancient-gray my-8" />')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="mb-4">')

  return `<p class="mb-4">${html}</p>`
}

export default async function ArticlePage({ params }) {
  const { category, slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article || article.category !== category) {
    notFound()
  }

  const [relatedArticles, tags] = await Promise.all([
    getRelatedArticles(article.id),
    getArticleTags(article.id),
  ])

  const categoryLabels = {
    'ancient-societies': 'Ancient Societies',
    'alternative-history': 'Alternative History',
    'cosmic-mysteries': 'Cosmic Mysteries',
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-ancient-text-muted">
          <li>
            <Link href="/" className="hover:text-ancient-gold transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/${category}`} className="hover:text-ancient-gold transition-colors">
              {categoryLabels[category]}
            </Link>
          </li>
          <li>/</li>
          <li className="text-ancient-text truncate max-w-[200px]">{article.title}</li>
        </ol>
      </nav>

      {/* Cover Image */}
      {article.cover_image && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href={`/${category}`}
            className="px-3 py-1 bg-ancient-gray text-ancient-gold text-sm rounded-full hover:bg-ancient-gold/20 transition-colors"
          >
            {categoryLabels[category]}
          </Link>
          {article.region && (
            <span className="px-3 py-1 bg-ancient-gray/50 text-ancient-text-muted text-sm rounded-full capitalize">
              {article.region}
            </span>
          )}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ancient-gold-light mb-4">
          {article.title}
        </h1>
        <p className="text-xl text-ancient-text-muted">
          {article.excerpt}
        </p>
        <div className="mt-4 text-sm text-ancient-text-muted">
          Published {new Date(article.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
          {article.updated_at !== article.created_at && (
            <span className="ml-4">
              Updated {new Date(article.updated_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
        </div>
      </header>

      {/* Article Content */}
      <div
        className="prose-ancient text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(article.content) }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-ancient-gray">
          <h3 className="font-serif text-lg text-ancient-gold mb-4">Topics</h3>
          <TagCloud tags={tags} />
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 pt-8 border-t border-ancient-gray text-right">
        <Link
          href="/admin"
          className="text-sm text-ancient-text-muted hover:text-ancient-gold transition-colors"
        >
          Suggest an edit &rarr;
        </Link>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <RelatedArticles articles={relatedArticles} />
        </div>
      )}

      {/* Navigation */}
      <div className="mt-12 pt-8 border-t border-ancient-gray">
        <Link
          href={`/${category}`}
          className="inline-flex items-center text-ancient-gold hover:text-ancient-gold-light transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to {categoryLabels[category]}
        </Link>
      </div>
    </article>
  )
}

import Link from 'next/link'

export default function TagCloud({ tags, size = 'normal' }) {
  if (!tags || tags.length === 0) return null

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    normal: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-2',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tags/${tag.name}`}
          className={`
            ${sizeClasses[size]}
            bg-ancient-gray/50 text-ancient-text-muted rounded-full
            hover:bg-ancient-gold/20 hover:text-ancient-gold
            transition-colors border border-ancient-gray hover:border-ancient-gold/50
          `}
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  )
}

import Link from 'next/link'

export default function CategoryCard({ category }) {
  return (
    <Link href={category.href}>
      <div className="group bg-ancient-dark border border-ancient-gray rounded-lg p-6 h-full
                    hover:border-ancient-gold/50 hover:bg-ancient-gray/30 transition-all duration-300
                    cursor-pointer">
        <div className="text-4xl mb-4" dangerouslySetInnerHTML={{ __html: category.icon }} />
        <h3 className="font-serif text-xl font-bold text-ancient-gold-light mb-2 group-hover:text-ancient-gold transition-colors">
          {category.name}
        </h3>
        <p className="text-ancient-text-muted text-sm">
          {category.description}
        </p>
        <div className="mt-4 text-ancient-gold text-sm group-hover:translate-x-1 transition-transform inline-block">
          Explore &rarr;
        </div>
      </div>
    </Link>
  )
}

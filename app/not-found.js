import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">&#9788;</div>
        <h1 className="font-serif text-4xl text-ancient-gold-light mb-4">
          Lost in Time
        </h1>
        <p className="text-xl text-ancient-text-muted mb-8 max-w-md mx-auto">
          The page you seek has vanished like the Library of Alexandria.
          Perhaps it never existed, or perhaps it&apos;s yet to be discovered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-ancient-gold text-ancient-black font-semibold rounded-lg hover:bg-ancient-gold-light transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 border border-ancient-gold text-ancient-gold rounded-lg hover:bg-ancient-gold/10 transition-colors"
          >
            Search Archives
          </Link>
        </div>
      </div>
    </div>
  )
}

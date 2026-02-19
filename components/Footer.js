import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ancient-dark border-t border-ancient-gray mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">&#9788;</span>
              <span className="font-serif text-xl font-bold text-ancient-gold-light">
                Alternate History Explorer
              </span>
            </Link>
            <p className="text-ancient-text-muted text-sm max-w-md">
              Uncovering the hidden chapters of human history. Exploring ancient mysteries,
              lost civilizations, and cosmic connections that challenge conventional narratives.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-ancient-gold font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ancient-societies" className="text-ancient-text-muted hover:text-ancient-gold transition-colors">
                  Ancient Societies
                </Link>
              </li>
              <li>
                <Link href="/alternative-history" className="text-ancient-text-muted hover:text-ancient-gold transition-colors">
                  Alternative History
                </Link>
              </li>
              <li>
                <Link href="/cosmic-mysteries" className="text-ancient-text-muted hover:text-ancient-gold transition-colors">
                  Cosmic Mysteries
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-ancient-text-muted hover:text-ancient-gold transition-colors">
                  World Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-ancient-gold font-semibold mb-4">Site</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-ancient-text-muted hover:text-ancient-gold transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-ancient-text-muted hover:text-ancient-gold transition-colors">
                  Content Studio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ancient-gray mt-8 pt-8 text-center text-sm text-ancient-text-muted">
          <p>
            &copy; {new Date().getFullYear()} Alternate History Explorer.
            <span className="mx-2">|</span>
            <span className="italic">What if human history is far older and stranger than we&apos;re taught?</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import SearchBar from './SearchBar'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const categories = [
    { name: 'Mysteries', href: '/mysteries' },
    { name: 'Ancient Societies', href: '/ancient-societies' },
    { name: 'Alternative History', href: '/alternative-history' },
    { name: 'Cosmic Mysteries', href: '/cosmic-mysteries' },
  ]

  return (
    <header className="bg-ancient-dark/95 backdrop-blur-sm border-b border-ancient-gray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">&#9788;</span>
            <span className="font-serif text-xl font-bold text-ancient-gold-light">
              Alternate History Explorer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="text-ancient-text-muted hover:text-ancient-gold transition-colors gold-underline"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/explore"
              className="text-ancient-text-muted hover:text-ancient-gold transition-colors gold-underline"
            >
              World Map
            </Link>
          </nav>

          {/* Search & Menu */}
          <div className="flex items-center space-x-4">
            <SearchBar />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ancient-text-muted hover:text-ancient-gold"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-ancient-gray">
            <nav className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="text-ancient-text-muted hover:text-ancient-gold transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/explore"
                className="text-ancient-text-muted hover:text-ancient-gold transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                World Map
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

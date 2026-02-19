import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Alternate History Explorer',
  description: 'Explore hidden history, lost civilizations, and cosmic mysteries. Discover what mainstream academia won\'t tell you.',
  keywords: ['alternate history', 'ancient civilizations', 'lost civilizations', 'ancient mysteries', 'cosmic mysteries'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-ancient-black text-ancient-text min-h-screen bg-stars-pattern">
        <Header />
        <main className="min-h-[calc(100vh-160px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

import { NextResponse } from 'next/server'
import { searchContent, searchYouTube } from '@/lib/exa'

export async function POST(request) {
  try {
    const { query, type = 'all', numResults = 10 } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    let results

    if (type === 'youtube') {
      results = await searchYouTube(query, numResults)
    } else {
      results = await searchContent(query, { numResults })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    )
  }
}

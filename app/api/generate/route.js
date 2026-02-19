import { NextResponse } from 'next/server'
import { generateArticleDraft, generateExcerpt, generateTitle } from '@/lib/claude'

export async function POST(request) {
  try {
    const body = await request.json()
    const { topic, category } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Generate the article draft
    const content = await generateArticleDraft({
      topic,
      category: category || 'alternative-history',
      style: 'informative',
    })

    // Generate title and excerpt
    const [title, excerpt] = await Promise.all([
      generateTitle(content),
      generateExcerpt(content),
    ])

    return NextResponse.json({
      content,
      title,
      excerpt,
    })
  } catch (error) {
    console.error('Error generating article:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate article' },
      { status: 500 }
    )
  }
}

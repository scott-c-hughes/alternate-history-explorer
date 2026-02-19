import { NextResponse } from 'next/server'
import { createArticle, searchArticles } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category')
  const region = searchParams.get('region')

  const filters = {}
  if (category) filters.category = category
  if (region) filters.region = region

  const articles = await searchArticles(query, filters)
  return NextResponse.json(articles)
}

export async function POST(request) {
  try {
    const body = await request.json()

    const article = await createArticle({
      title: body.title,
      slug: body.slug,
      category: body.category,
      region: body.region || 'global',
      content: body.content,
      excerpt: body.excerpt || '',
      cover_image: body.cover_image || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      published: body.published || false,
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

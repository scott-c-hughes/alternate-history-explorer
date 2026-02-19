import { NextResponse } from 'next/server'
import { searchArticles } from '@/lib/supabase'

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

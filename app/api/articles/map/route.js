import { NextResponse } from 'next/server'
import { getArticlesWithCoordinates, getRecentArticles } from '@/lib/supabase'

export async function GET() {
  // Get articles with coordinates for the map
  let articles = await getArticlesWithCoordinates()

  // If no articles with coordinates, fall back to recent articles
  if (articles.length === 0) {
    articles = await getRecentArticles(20)
  }

  return NextResponse.json(articles)
}

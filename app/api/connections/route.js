import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  // Get all connections with article details
  const { data, error } = await supabase
    .from('article_connections')
    .select(`
      article_id,
      related_article_id,
      connection_type,
      article:articles!article_connections_article_id_fkey(id, title, slug, category),
      related:articles!article_connections_related_article_id_fkey(id, title, slug, category)
    `)
    .limit(100)

  if (error) {
    console.error('Error fetching connections:', error)
    return NextResponse.json([])
  }

  // Remove duplicate pairs (A→B and B→A)
  const seen = new Set()
  const unique = (data || []).filter(conn => {
    const pair = [conn.article_id, conn.related_article_id].sort().join('-')
    if (seen.has(pair)) return false
    seen.add(pair)
    return true
  })

  return NextResponse.json(unique)
}

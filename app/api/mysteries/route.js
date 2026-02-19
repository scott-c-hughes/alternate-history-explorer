import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  const { data, error } = await supabase
    .from('mysteries')
    .select(`
      *,
      mystery_articles(count)
    `)
    .order('name')

  if (error) {
    console.error('Error fetching mysteries:', error)
    return NextResponse.json([])
  }

  // Add article count
  const mysteries = data?.map(m => ({
    ...m,
    article_count: m.mystery_articles?.[0]?.count || 0,
  })) || []

  return NextResponse.json(mysteries)
}

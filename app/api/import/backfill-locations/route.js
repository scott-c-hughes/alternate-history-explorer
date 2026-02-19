import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { findLocation } from '@/lib/locations'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST() {
  // Get all articles without coordinates
  const { data: articles, error: fetchError } = await supabase
    .from('articles')
    .select('id, title, content')
    .is('latitude', null)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  let updated = 0
  let skipped = 0

  for (const article of articles || []) {
    const combinedText = article.title + ' ' + (article.content || '')
    const location = findLocation(combinedText)

    if (location) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          latitude: location.latitude,
          longitude: location.longitude,
          region: location.region,
        })
        .eq('id', article.id)

      if (!updateError) {
        updated++
      }
    } else {
      skipped++
    }
  }

  return NextResponse.json({
    total: articles?.length || 0,
    updated,
    skipped,
  })
}

export async function GET() {
  return POST()
}

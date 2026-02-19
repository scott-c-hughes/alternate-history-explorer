import { NextResponse } from 'next/server'
import Exa from 'exa-js'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { AUTO_IMPORT_TOPICS, RESULTS_PER_TOPIC } from '@/lib/topics'
import { findLocation } from '@/lib/locations'

const exa = process.env.EXA_API_KEY ? new Exa(process.env.EXA_API_KEY) : null
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function extractYouTubeId(url) {
  if (!url) return null
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) return shortMatch[1]
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
  if (longMatch) return longMatch[1]
  return null
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
}

function guessCategory(title, text) {
  const combined = (title + ' ' + text).toLowerCase()
  if (combined.match(/alien|ufo|extraterrestrial|ancient astronaut|anunnaki|cosmic/)) {
    return 'cosmic-mysteries'
  }
  if (combined.match(/flood|younger dryas|atlantis|ice age|cataclysm|lost civilization|impact/)) {
    return 'alternative-history'
  }
  return 'ancient-societies'
}

function guessRegion(title, text) {
  const combined = (title + ' ' + text).toLowerCase()
  if (combined.match(/egypt|pyramid|sphinx|giza|mediterranean|greek|roman/)) return 'mediterranean'
  if (combined.match(/maya|aztec|inca|peru|mexico|america|olmec/)) return 'americas'
  if (combined.match(/china|japan|india|turkey|gobekli|asia/)) return 'asia'
  if (combined.match(/africa|sudan|ethiopia/)) return 'africa'
  if (combined.match(/stonehenge|britain|ireland|europe/)) return 'europe'
  if (combined.match(/australia|pacific|easter island|oceania/)) return 'oceania'
  return 'global'
}

async function importSingleItem(item) {
  const { title, url, text, videoId } = item

  // Build embed code
  let embedCode = ''
  const ytId = videoId || extractYouTubeId(url)
  if (ytId) {
    embedCode = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen></iframe>`
  }

  // Generate summary
  let summary = text || 'Content imported from external source.'

  if (anthropic && text) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `Write a 2-3 paragraph summary for an alternative history encyclopedia based on this content. Focus on the key mysteries or theories discussed.\n\nTitle: ${title}\nContent: ${text?.substring(0, 1500)}`
        }],
      })
      summary = message.content[0].text
    } catch (e) {
      console.error('Claude error:', e.message)
    }
  }

  const articleContent = `${embedCode ? embedCode + '\n\n---\n\n' : ''}## Summary\n\n${summary}\n\n---\n\n**Source:** [${title}](${url})`
  const excerpt = summary.split('\n')[0].substring(0, 200) + '...'
  const category = guessCategory(title, text || '')
  let region = guessRegion(title, text || '')
  const slug = `${generateSlug(title)}-${Date.now().toString(36)}`

  // Try to find location coordinates
  const combinedText = title + ' ' + (text || '')
  const location = findLocation(combinedText)
  if (location) {
    region = location.region
  }

  const { data, error } = await supabase
    .from('articles')
    .insert([{
      title,
      slug,
      category,
      region,
      content: articleContent,
      excerpt,
      published: true,
      source_url: url,
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
    }])
    .select()
    .single()

  if (error) {
    console.error('DB error:', error)
    return null
  }

  return data
}

export async function POST(request) {
  if (!exa) {
    return NextResponse.json({ error: 'Exa not configured' }, { status: 500 })
  }

  // Optional: check for secret key to prevent unauthorized runs
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
    // Only check if CRON_SECRET is set
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    searched: 0,
    imported: 0,
    skipped: 0,
    errors: 0,
    articles: [],
  }

  // Get existing URLs to avoid duplicates
  const { data: existing } = await supabase
    .from('articles')
    .select('source_url')

  const existingUrls = new Set(existing?.map(a => a.source_url).filter(Boolean) || [])

  // Process each topic
  for (const topic of AUTO_IMPORT_TOPICS) {
    try {
      const searchResults = await exa.searchAndContents(topic, {
        numResults: RESULTS_PER_TOPIC,
        type: 'auto',
        text: { maxCharacters: 1500 },
      })

      results.searched++

      for (const item of searchResults.results) {
        // Skip if already imported
        if (existingUrls.has(item.url)) {
          results.skipped++
          continue
        }

        // Import the item
        const article = await importSingleItem({
          title: item.title,
          url: item.url,
          text: item.text,
          videoId: extractYouTubeId(item.url),
        })

        if (article) {
          results.imported++
          results.articles.push({ title: article.title, slug: article.slug })
          existingUrls.add(item.url) // Track to avoid duplicates within batch
        } else {
          results.errors++
        }

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500))
      }
    } catch (error) {
      console.error(`Error searching "${topic}":`, error.message)
      results.errors++
    }

    // Delay between topics
    await new Promise(r => setTimeout(r, 1000))
  }

  return NextResponse.json(results)
}

// Also support GET for easy testing
export async function GET(request) {
  return POST(request)
}

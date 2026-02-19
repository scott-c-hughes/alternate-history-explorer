import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { findLocation } from '@/lib/locations'

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Extract YouTube video ID from URL
function extractYouTubeId(url) {
  if (!url) return null
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) return shortMatch[1]
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
  if (longMatch) return longMatch[1]
  return null
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
}

// Determine category from content
function guessCategory(title, text) {
  const combined = (title + ' ' + text).toLowerCase()

  if (combined.includes('alien') || combined.includes('ufo') || combined.includes('extraterrestrial') ||
      combined.includes('ancient astronaut') || combined.includes('star') || combined.includes('cosmic')) {
    return 'cosmic-mysteries'
  }

  if (combined.includes('flood') || combined.includes('younger dryas') || combined.includes('atlantis') ||
      combined.includes('ice age') || combined.includes('cataclysm') || combined.includes('lost civilization')) {
    return 'alternative-history'
  }

  return 'ancient-societies'
}

// Determine region from content
function guessRegion(title, text) {
  const combined = (title + ' ' + text).toLowerCase()

  if (combined.includes('egypt') || combined.includes('pyramid') || combined.includes('sphinx') ||
      combined.includes('mediterranean') || combined.includes('greek') || combined.includes('roman')) {
    return 'mediterranean'
  }
  if (combined.includes('maya') || combined.includes('aztec') || combined.includes('inca') ||
      combined.includes('peru') || combined.includes('mexico') || combined.includes('america')) {
    return 'americas'
  }
  if (combined.includes('china') || combined.includes('japan') || combined.includes('india') ||
      combined.includes('turkey') || combined.includes('gobekli')) {
    return 'asia'
  }
  if (combined.includes('africa') || combined.includes('sudan') || combined.includes('ethiopia')) {
    return 'africa'
  }
  if (combined.includes('stonehenge') || combined.includes('britain') || combined.includes('ireland') ||
      combined.includes('europe')) {
    return 'europe'
  }
  if (combined.includes('australia') || combined.includes('pacific') || combined.includes('easter island')) {
    return 'oceania'
  }

  return 'global'
}

export async function POST(request) {
  try {
    const { title, url, text, videoId } = await request.json()

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    // Build the embed code
    let embedCode = ''
    const ytId = videoId || extractYouTubeId(url)
    if (ytId) {
      embedCode = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen></iframe>`
    } else if (url.includes('spotify.com')) {
      // Convert Spotify URL to embed
      const spotifyEmbed = url.replace('open.spotify.com', 'open.spotify.com/embed')
      embedCode = `<iframe src="${spotifyEmbed}" width="100%" height="352" frameBorder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`
    }

    // Generate summary with Claude
    let summary = ''
    let articleContent = ''

    if (anthropic) {
      const prompt = `You are writing for an alternative history encyclopedia. Based on this content, write an engaging article summary.

Title: ${title}
URL: ${url}
Content/Description: ${text || 'No description available'}

Write:
1. A 2-3 paragraph summary of the key points and theories discussed
2. Why this is significant for alternative history research
3. What questions it raises about mainstream narratives

Keep it informative and intriguing. Write in markdown format.`

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      })

      summary = message.content[0].text
    } else {
      summary = text || 'Summary not available - Claude API not configured.'
    }

    // Build full article content
    articleContent = `${embedCode ? embedCode + '\n\n---\n\n' : ''}## Summary\n\n${summary}\n\n---\n\n**Source:** [${title}](${url})`

    // Generate excerpt
    const excerpt = summary.split('\n')[0].substring(0, 200) + '...'

    // Determine category and region
    const category = guessCategory(title, text || '')
    let region = guessRegion(title, text || '')

    // Try to find specific location coordinates
    const combinedText = title + ' ' + (text || '')
    const location = findLocation(combinedText)

    // If we found a location, use its region
    if (location) {
      region = location.region
    }

    // Generate unique slug
    const baseSlug = generateSlug(title)
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    // Save to database
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
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save article' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      article: data,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error.message || 'Import failed' },
      { status: 500 }
    )
  }
}

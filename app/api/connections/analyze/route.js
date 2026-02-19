import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  if (!anthropic) {
    return NextResponse.json({ error: 'Claude API not configured' }, { status: 500 })
  }

  // Get all published articles
  const { data: articles, error: fetchError } = await supabase
    .from('articles')
    .select('id, title, excerpt, category, region, content')
    .eq('published', true)

  if (fetchError || !articles?.length) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }

  // Create a summary of all articles for Claude
  const articleSummaries = articles.map((a, i) =>
    `[${i}] "${a.title}" (${a.category}, ${a.region}): ${a.excerpt?.substring(0, 150) || ''}`
  ).join('\n')

  // Ask Claude to find connections
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `You are an alternative history researcher finding connections between ancient mysteries.

Here are articles in our database:

${articleSummaries}

Find meaningful connections between these articles. Look for:
1. **Flood myths** - Stories of great floods across different cultures
2. **Megalithic builders** - Similar construction techniques across continents
3. **Astronomical alignments** - Structures aligned to stars/solstices
4. **Lost technology** - Evidence of advanced ancient knowledge
5. **Cultural parallels** - Similar symbols, gods, or practices in distant cultures
6. **Timeline anomalies** - Things that don't fit the mainstream chronology
7. **Geographic mysteries** - Underwater structures, impossible locations

For each connection found, output a JSON object with this format:
{
  "connections": [
    {
      "article1_index": 0,
      "article2_index": 5,
      "connection_type": "flood-myths",
      "explanation": "Both discuss flood narratives - one from Mesopotamia, one from Mesoamerica"
    }
  ]
}

Find as many meaningful connections as possible. Only output valid JSON.`
    }],
  })

  // Parse Claude's response
  let connections = []
  try {
    const responseText = message.content[0].text
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      connections = parsed.connections || []
    }
  } catch (e) {
    console.error('Failed to parse Claude response:', e)
    return NextResponse.json({ error: 'Failed to parse connections' }, { status: 500 })
  }

  // Store connections in database
  let saved = 0
  let errors = 0

  for (const conn of connections) {
    const article1 = articles[conn.article1_index]
    const article2 = articles[conn.article2_index]

    if (!article1 || !article2) continue

    // Insert connection (both directions)
    const { error: insertError } = await supabase
      .from('article_connections')
      .upsert([
        {
          article_id: article1.id,
          related_article_id: article2.id,
          connection_type: conn.connection_type,
        },
        {
          article_id: article2.id,
          related_article_id: article1.id,
          connection_type: conn.connection_type,
        }
      ], { onConflict: 'article_id,related_article_id' })

    if (insertError) {
      errors++
    } else {
      saved++
    }
  }

  return NextResponse.json({
    found: connections.length,
    saved,
    errors,
    connections: connections.slice(0, 20), // Return sample
  })
}

export async function GET() {
  return POST()
}

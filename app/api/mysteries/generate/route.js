import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { MYSTERY_DEFINITIONS, findMatchingMysteries } from '@/lib/mysteries'

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST() {
  if (!anthropic) {
    return NextResponse.json({ error: 'Claude API not configured' }, { status: 500 })
  }

  // Get all articles
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('id, title, content, excerpt')
    .eq('published', true)

  if (articlesError) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }

  const results = {
    created: 0,
    updated: 0,
    linked: 0,
    mysteries: [],
  }

  // Process each mystery definition
  for (const mysteryDef of MYSTERY_DEFINITIONS) {
    // Find articles that match this mystery
    const matchingArticles = articles.filter(article => {
      const matches = findMatchingMysteries(article.title, article.content || '')
      return matches.some(m => m.slug === mysteryDef.slug)
    })

    if (matchingArticles.length === 0) continue

    // Check if mystery already exists
    const { data: existing } = await supabase
      .from('mysteries')
      .select('id')
      .eq('slug', mysteryDef.slug)
      .single()

    let mysteryId

    if (existing) {
      mysteryId = existing.id
      results.updated++
    } else {
      // Generate overview with Claude
      const articleTitles = matchingArticles.map(a => a.title).join('\n- ')

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Write an engaging overview for an alternative history encyclopedia page about "${mysteryDef.name}".

Tagline: ${mysteryDef.tagline}

Related articles in our database:
- ${articleTitles}

Write 3-4 paragraphs that:
1. Introduce the mystery and why it matters
2. Summarize the key evidence and theories
3. Explain what mainstream academia says vs. alternative researchers
4. End with thought-provoking questions

Write in an engaging, curious tone. Use markdown formatting.`
        }],
      })

      const overview = message.content[0].text

      // Create the mystery
      const { data: newMystery, error: createError } = await supabase
        .from('mysteries')
        .insert([{
          slug: mysteryDef.slug,
          name: mysteryDef.name,
          tagline: mysteryDef.tagline,
          icon: mysteryDef.icon,
          overview,
        }])
        .select()
        .single()

      if (createError) {
        console.error('Failed to create mystery:', createError)
        continue
      }

      mysteryId = newMystery.id
      results.created++
      results.mysteries.push(mysteryDef.name)
    }

    // Link articles to mystery
    for (const article of matchingArticles) {
      const { error: linkError } = await supabase
        .from('mystery_articles')
        .upsert([{
          mystery_id: mysteryId,
          article_id: article.id,
        }], { onConflict: 'mystery_id,article_id' })

      if (!linkError) {
        results.linked++
      }
    }
  }

  return NextResponse.json(results)
}

export async function GET() {
  return POST()
}

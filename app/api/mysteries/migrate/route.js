import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { MYSTERY_DEFINITIONS } from '@/lib/mysteries'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function generateOverview(mystery, articleTitles) {
  const articlesContext = articleTitles.length > 0
    ? `Related articles on this site include: ${articleTitles.slice(0, 10).join(', ')}`
    : 'This is a new topic being explored.'

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Write a compelling 2-3 paragraph overview for a mystery page about "${mystery.name}".

Tagline: ${mystery.tagline}

${articlesContext}

Write in an engaging, mysterious tone. Present the evidence and questions without being too sensational.
Use markdown formatting with ## for section headers if needed.`
    }]
  })

  return message.content[0].text
}

export async function GET() {
  const results = {
    gobekliMoved: 0,
    gobekliDeleted: false,
    alienCreated: false,
  }

  // Step 1: Get the gobekli-tepe mystery ID and younger-dryas mystery ID
  const { data: gobekliMystery } = await supabase
    .from('mysteries')
    .select('id')
    .eq('slug', 'gobekli-tepe')
    .single()

  const { data: youngerDryasMystery } = await supabase
    .from('mysteries')
    .select('id')
    .eq('slug', 'younger-dryas')
    .single()

  // Step 2: Move gobekli-tepe articles to younger-dryas
  if (gobekliMystery && youngerDryasMystery) {
    // Get articles linked to gobekli-tepe
    const { data: gobekliArticles } = await supabase
      .from('mystery_articles')
      .select('article_id')
      .eq('mystery_id', gobekliMystery.id)

    if (gobekliArticles) {
      for (const { article_id } of gobekliArticles) {
        // Check if already linked to younger-dryas
        const { data: existing } = await supabase
          .from('mystery_articles')
          .select('*')
          .eq('mystery_id', youngerDryasMystery.id)
          .eq('article_id', article_id)
          .single()

        if (!existing) {
          await supabase
            .from('mystery_articles')
            .insert({ mystery_id: youngerDryasMystery.id, article_id })
          results.gobekliMoved++
        }
      }
    }

    // Delete gobekli-tepe article associations
    await supabase
      .from('mystery_articles')
      .delete()
      .eq('mystery_id', gobekliMystery.id)

    // Delete gobekli-tepe mystery
    const { error: deleteError } = await supabase
      .from('mysteries')
      .delete()
      .eq('id', gobekliMystery.id)

    results.gobekliDeleted = !deleteError
  }

  // Step 3: Delete old ancient-astronauts mystery if exists
  await supabase
    .from('mysteries')
    .delete()
    .eq('slug', 'ancient-astronauts')

  // Step 4: Create new alien-interference mystery
  const alienDef = MYSTERY_DEFINITIONS.find(m => m.slug === 'alien-interference')

  if (alienDef) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('mysteries')
      .select('id')
      .eq('slug', 'alien-interference')
      .single()

    if (!existing) {
      // Find matching articles
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, content')
        .eq('published', true)

      const matchingArticles = articles?.filter(article => {
        const text = (article.title + ' ' + article.content).toLowerCase()
        return alienDef.keywords.some(kw => text.includes(kw.toLowerCase()))
      }) || []

      // Generate overview (even if no articles yet)
      const overview = await generateOverview(alienDef, matchingArticles.map(a => a.title))

      // Create mystery
      const { data: newMystery, error } = await supabase
        .from('mysteries')
        .insert({
          slug: alienDef.slug,
          name: alienDef.name,
          tagline: alienDef.tagline,
          icon: alienDef.icon,
          overview,
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to create alien mystery:', error)
        results.alienError = error.message
      } else {
        results.alienCreated = true
        results.alienArticles = matchingArticles.length

        // Link articles if any
        if (newMystery && matchingArticles.length > 0) {
          const links = matchingArticles.map(a => ({
            mystery_id: newMystery.id,
            article_id: a.id,
          }))
          await supabase.from('mystery_articles').insert(links)
        }
      }
    } else {
      results.alienCreated = 'already exists'
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Migration complete',
    results,
  })
}

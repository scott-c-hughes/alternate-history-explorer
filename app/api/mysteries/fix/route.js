import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function GET() {
  const results = {}

  // Step 1: Get younger-dryas mystery ID
  const { data: ydMystery } = await supabase
    .from('mysteries')
    .select('id')
    .eq('slug', 'younger-dryas')
    .single()

  // Step 2: Get gobekli-tepe mystery and its articles
  const { data: gtMystery } = await supabase
    .from('mysteries')
    .select('id')
    .eq('slug', 'gobekli-tepe')
    .single()

  if (gtMystery && ydMystery) {
    // Get gobekli articles
    const { data: gtArticles } = await supabase
      .from('mystery_articles')
      .select('article_id')
      .eq('mystery_id', gtMystery.id)

    // Move articles to younger-dryas
    if (gtArticles) {
      for (const { article_id } of gtArticles) {
        await supabase
          .from('mystery_articles')
          .upsert({ mystery_id: ydMystery.id, article_id }, { onConflict: 'mystery_id,article_id' })
      }
      results.articlesMoved = gtArticles.length
    }

    // Delete gobekli article links
    await supabase
      .from('mystery_articles')
      .delete()
      .eq('mystery_id', gtMystery.id)

    // Delete gobekli mystery
    const { error: delError } = await supabase
      .from('mysteries')
      .delete()
      .eq('slug', 'gobekli-tepe')

    results.gobekliDeleted = !delError
    if (delError) results.deleteError = delError.message
  } else {
    results.gobekliDeleted = 'not found'
  }

  // Step 3: Check if alien-interference exists
  const { data: alienExists } = await supabase
    .from('mysteries')
    .select('id')
    .eq('slug', 'alien-interference')
    .single()

  if (alienExists) {
    results.alienStatus = 'already exists'
  } else {
    // Create it
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Write a compelling 2-3 paragraph overview for a mystery page about "Alien Interference in Human Development".

Tagline: Did extraterrestrial beings guide the rise of human civilization?

Topics include: Ancient astronaut theories, the Anunnaki, unexplained genetic leaps in human evolution, ancient texts describing "sky people" and "watchers", cave art depicting strange beings, and advanced ancient knowledge that seems beyond the capabilities of early humans.

Write in an engaging, mysterious tone. Present the evidence and questions without being too sensational.
Use markdown formatting with ## for section headers if needed.`
      }]
    })

    const overview = message.content[0].text

    const { data: newMystery, error: createError } = await supabase
      .from('mysteries')
      .insert({
        slug: 'alien-interference',
        name: 'Alien Interference in Human Development',
        tagline: 'Did extraterrestrial beings guide the rise of human civilization?',
        icon: '👽',
        overview,
      })
      .select()
      .single()

    if (createError) {
      results.alienStatus = 'failed: ' + createError.message
    } else {
      results.alienStatus = 'created'
      results.alienId = newMystery.id
    }
  }

  return NextResponse.json({ success: true, results })
}

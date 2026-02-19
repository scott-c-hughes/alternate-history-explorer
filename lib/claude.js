import Anthropic from '@anthropic-ai/sdk'

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

// Check if Claude API is configured
export function isClaudeConfigured() {
  return anthropic !== null
}

// Generate article draft using Claude
export async function generateArticleDraft({ topic, category, style = 'informative' }) {
  if (!anthropic) {
    throw new Error('Claude API not configured. Please add ANTHROPIC_API_KEY to environment variables.')
  }

  const categoryDescriptions = {
    'ancient-societies': 'advanced ancient civilizations, megalithic builders, and sophisticated pre-historic cultures',
    'alternative-history': 'challenging mainstream historical narratives, lost civilizations, and suppressed archaeological evidence',
    'cosmic-mysteries': 'ancient astronaut theories, celestial alignments, and unexplained connections between ancient cultures and the cosmos',
  }

  const prompt = `You are an expert writer for an alternative history encyclopedia. Write an engaging, well-researched article about: "${topic}"

Category: ${category} (${categoryDescriptions[category] || 'general alternative history'})

Guidelines:
- Write in a ${style} but captivating tone
- Present alternative theories while acknowledging mainstream views
- Include specific details, dates, and locations where relevant
- Reference archaeological evidence, ancient texts, or scholarly debates
- Make connections to broader themes in alternative history
- Be intellectually curious and open-minded, not conspiratorial
- Length: 800-1200 words

Format the article in Markdown with:
- A compelling title (as an H1)
- An engaging introduction
- 3-5 main sections with H2 headers
- A thought-provoking conclusion
- Suggested related topics at the end

Write the complete article now:`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      { role: 'user', content: prompt }
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return content.text
}

// Generate article excerpt
export async function generateExcerpt(content, maxLength = 200) {
  if (!anthropic) {
    // Fallback: extract first paragraph
    const firstPara = content.split('\n\n').find(p => p && !p.startsWith('#'))
    return firstPara?.substring(0, maxLength) + '...' || ''
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: `Write a compelling 1-2 sentence excerpt (max ${maxLength} characters) for this article that would make readers want to learn more:\n\n${content.substring(0, 2000)}`
      }
    ],
  })

  const response = message.content[0]
  if (response.type !== 'text') {
    return content.substring(0, maxLength) + '...'
  }

  return response.text
}

// Suggest tags for an article
export async function suggestTags(content, existingTags = []) {
  if (!anthropic) {
    return []
  }

  const tagList = existingTags.length > 0
    ? `Available tags: ${existingTags.join(', ')}`
    : 'Suggest new tags that would be useful for categorizing alternative history content.'

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Based on this article, suggest 3-5 relevant tags for categorization.
${tagList}

Article:
${content.substring(0, 2000)}

Return only the tag names, comma-separated, lowercase with hyphens for spaces.`
      }
    ],
  })

  const response = message.content[0]
  if (response.type !== 'text') {
    return []
  }

  return response.text.split(',').map(tag => tag.trim().toLowerCase())
}

// Generate title from content
export async function generateTitle(content) {
  if (!anthropic) {
    // Fallback: try to extract H1 from markdown
    const h1Match = content.match(/^#\s+(.+)$/m)
    return h1Match ? h1Match[1] : 'Untitled Article'
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: `Generate a compelling, SEO-friendly title for this article (max 60 characters). Return only the title, no quotes or extra formatting:\n\n${content.substring(0, 1500)}`
      }
    ],
  })

  const response = message.content[0]
  if (response.type !== 'text') {
    return 'Untitled Article'
  }

  return response.text.trim().replace(/^["']|["']$/g, '')
}

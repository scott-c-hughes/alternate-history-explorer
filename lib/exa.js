import Exa from 'exa-js'

const exa = process.env.EXA_API_KEY
  ? new Exa(process.env.EXA_API_KEY)
  : null

export function isExaConfigured() {
  return exa !== null
}

// Search for alternative history content
export async function searchContent(query, options = {}) {
  if (!exa) {
    throw new Error('Exa API not configured. Add EXA_API_KEY to environment variables.')
  }

  const {
    type = 'auto', // 'auto', 'neural', 'keyword'
    numResults = 10,
    includeDomains = [],
    category = null,
  } = options

  // Add relevant domains for alternative history content
  const altHistoryDomains = [
    'youtube.com',
    'youtu.be',
    'spotify.com',
    'podcasts.apple.com',
    'joerogan.com',
    'grahamhancock.com',
    'randallcarlson.com',
    'ancientorigins.net',
    'ancient-code.com',
    'gaia.com',
  ]

  const searchParams = {
    numResults,
    type,
    useAutoprompt: true,
  }

  if (includeDomains.length > 0) {
    searchParams.includeDomains = includeDomains
  }

  const result = await exa.searchAndContents(query, {
    ...searchParams,
    text: { maxCharacters: 2000 },
    highlights: true,
  })

  return result.results.map(item => ({
    title: item.title,
    url: item.url,
    publishedDate: item.publishedDate,
    author: item.author,
    text: item.text,
    highlights: item.highlights,
    isYouTube: item.url.includes('youtube.com') || item.url.includes('youtu.be'),
    isPodcast: item.url.includes('spotify.com') || item.url.includes('podcasts.apple.com'),
  }))
}

// Search specifically for YouTube videos
export async function searchYouTube(query, numResults = 10) {
  if (!exa) {
    throw new Error('Exa API not configured.')
  }

  const result = await exa.searchAndContents(query, {
    numResults,
    type: 'auto',
    includeDomains: ['youtube.com', 'youtu.be'],
    text: { maxCharacters: 2000 },
  })

  return result.results.map(item => ({
    title: item.title,
    url: item.url,
    publishedDate: item.publishedDate,
    text: item.text,
    videoId: extractYouTubeId(item.url),
  }))
}

// Search for podcasts
export async function searchPodcasts(query, numResults = 10) {
  if (!exa) {
    throw new Error('Exa API not configured.')
  }

  const result = await exa.searchAndContents(query, {
    numResults,
    type: 'auto',
    includeDomains: ['spotify.com', 'podcasts.apple.com', 'youtube.com'],
    text: { maxCharacters: 2000 },
  })

  return result.results.filter(item =>
    item.url.includes('podcast') ||
    item.url.includes('episode') ||
    item.title?.toLowerCase().includes('podcast')
  ).map(item => ({
    title: item.title,
    url: item.url,
    publishedDate: item.publishedDate,
    text: item.text,
  }))
}

// Helper to extract YouTube video ID
function extractYouTubeId(url) {
  if (!url) return null

  // Handle youtu.be format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) return shortMatch[1]

  // Handle youtube.com format
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
  if (longMatch) return longMatch[1]

  return null
}

export { exa }

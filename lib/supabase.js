import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client only if credentials are available
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to check if Supabase is configured
export function isSupabaseConfigured() {
  return supabase !== null
}

// Get recent published articles
export async function getRecentArticles(limit = 10) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data || []
}

// Get articles by category
export async function getArticlesByCategory(category, limit = 50) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching articles by category:', error)
    return []
  }

  return data || []
}

// Get single article by slug
export async function getArticleBySlug(slug) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  return data
}

// Get articles by region
export async function getArticlesByRegion(region, limit = 50) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('region', region)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching articles by region:', error)
    return []
  }

  return data || []
}

// Get articles with coordinates (for map)
export async function getArticlesWithCoordinates() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, category, excerpt, latitude, longitude, region')
    .eq('published', true)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  if (error) {
    console.error('Error fetching articles with coordinates:', error)
    return []
  }

  return data || []
}

// Search articles
export async function searchArticles(query, filters = {}) {
  if (!supabase) return []

  let queryBuilder = supabase
    .from('articles')
    .select('*')
    .eq('published', true)

  // Text search on title and content
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
  }

  // Category filter
  if (filters.category) {
    queryBuilder = queryBuilder.eq('category', filters.category)
  }

  // Region filter
  if (filters.region) {
    queryBuilder = queryBuilder.eq('region', filters.region)
  }

  queryBuilder = queryBuilder.order('created_at', { ascending: false })

  const { data, error } = await queryBuilder

  if (error) {
    console.error('Error searching articles:', error)
    return []
  }

  return data || []
}

// Get all tags
export async function getAllTags() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  return data || []
}

// Get articles by tag
export async function getArticlesByTag(tagId) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('article_tags')
    .select(`
      article_id,
      articles (*)
    `)
    .eq('tag_id', tagId)

  if (error) {
    console.error('Error fetching articles by tag:', error)
    return []
  }

  return data?.map(item => item.articles).filter(Boolean) || []
}

// Get related articles
export async function getRelatedArticles(articleId) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('article_connections')
    .select(`
      related_article_id,
      connection_type,
      articles!article_connections_related_article_id_fkey (*)
    `)
    .eq('article_id', articleId)

  if (error) {
    console.error('Error fetching related articles:', error)
    return []
  }

  return data?.map(item => ({
    ...item.articles,
    connection_type: item.connection_type
  })).filter(Boolean) || []
}

// Get tags for an article
export async function getArticleTags(articleId) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('article_tags')
    .select(`
      tag_id,
      tags (*)
    `)
    .eq('article_id', articleId)

  if (error) {
    console.error('Error fetching article tags:', error)
    return []
  }

  return data?.map(item => item.tags).filter(Boolean) || []
}

// Create article (for admin)
export async function createArticle(article) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single()

  if (error) {
    console.error('Error creating article:', error)
    return null
  }

  return data
}

// Update article (for admin)
export async function updateArticle(id, updates) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating article:', error)
    return null
  }

  return data
}

export { supabase }

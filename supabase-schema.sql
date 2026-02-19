-- Alternate History Explorer - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table (optional, for reference)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

-- Insert default categories
INSERT INTO categories (id, name, description, icon) VALUES
  ('ancient-societies', 'Ancient Societies', 'Advanced civilizations that mainstream academia underestimates', '&#127963;'),
  ('alternative-history', 'Alternative History', 'Challenging official narratives and exploring suppressed evidence', '&#128220;'),
  ('cosmic-mysteries', 'Cosmic Mysteries', 'Ancient astronaut theories, celestial alignments, and unexplained artifacts', '&#9734;')
ON CONFLICT (id) DO NOTHING;

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL REFERENCES categories(id),
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  region TEXT DEFAULT 'global',
  latitude FLOAT,
  longitude FLOAT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table (cross-cutting themes)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

-- Article-Tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Article connections (related articles)
CREATE TABLE IF NOT EXISTS article_connections (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  related_article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  connection_type TEXT DEFAULT 'thematic',
  PRIMARY KEY (article_id, related_article_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_region ON articles(region);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_connections ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access to published articles
CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (published = true);

-- Policies: Allow public read access to tags
CREATE POLICY "Public can read tags" ON tags
  FOR SELECT USING (true);

-- Policies: Allow public read access to article_tags
CREATE POLICY "Public can read article_tags" ON article_tags
  FOR SELECT USING (true);

-- Policies: Allow public read access to article_connections
CREATE POLICY "Public can read article_connections" ON article_connections
  FOR SELECT USING (true);

-- For the admin panel to work (insert/update), you'll need to either:
-- 1. Use a service role key (not anon key) for admin operations
-- 2. Or add insert/update policies with proper authentication

-- Simple approach: Allow all operations for now (for development)
-- In production, you'd want proper authentication
CREATE POLICY "Allow all inserts" ON articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates" ON articles FOR UPDATE USING (true);
CREATE POLICY "Allow tag inserts" ON tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow article_tags inserts" ON article_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow connections inserts" ON article_connections FOR INSERT WITH CHECK (true);

-- Insert some sample tags
INSERT INTO tags (name, description) VALUES
  ('megalithic', 'Massive stone structures and monuments'),
  ('flood-myths', 'Ancient stories of great floods across cultures'),
  ('astronomical-alignments', 'Structures aligned with celestial events'),
  ('pre-12000-bc', 'Evidence of civilizations before the Younger Dryas'),
  ('lost-technology', 'Advanced ancient techniques we cannot easily replicate'),
  ('global-connections', 'Unexplained similarities between distant cultures')
ON CONFLICT (name) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample article (optional - uncomment to add a starter article)
/*
INSERT INTO articles (title, slug, category, content, excerpt, region, latitude, longitude, published)
VALUES (
  'The Sphinx Water Erosion Hypothesis',
  'sphinx-water-erosion-hypothesis',
  'ancient-societies',
  '# The Sphinx Water Erosion Hypothesis

What if the Great Sphinx of Giza is far older than mainstream Egyptology admits?

## The Evidence

Geologist Robert Schoch examined the enclosure walls around the Sphinx in 1990 and made a startling discovery: the erosion patterns on the limestone were consistent with **water erosion**, not wind and sand erosion.

This matters because Egypt has been a desert for approximately 5,000 years. For water erosion of this magnitude to occur, the Sphinx would need to be at least **7,000-10,000 years old** - potentially dating back to when the Sahara was a lush, green savanna.

## Mainstream Response

Orthodox Egyptologists dismiss this theory, dating the Sphinx to around 2500 BCE during the reign of Pharaoh Khafre. They argue the erosion patterns can be explained by other factors.

## The Implications

If the Sphinx is truly 10,000+ years old, it would predate the conventional emergence of complex civilization by thousands of years. This raises profound questions about lost chapters of human history.',
  'Geological evidence suggests the Great Sphinx may be thousands of years older than mainstream academia claims, pointing to a lost chapter of human civilization.',
  'africa',
  29.9753,
  31.1376,
  true
);
*/

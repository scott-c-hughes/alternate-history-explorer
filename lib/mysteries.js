// Pre-defined mysteries to look for in articles
// These will become landing pages

export const MYSTERY_DEFINITIONS = [
  {
    slug: 'flood-myths',
    name: 'The Great Flood',
    tagline: 'Why do cultures worldwide share stories of a catastrophic deluge?',
    icon: '🌊',
    keywords: ['flood', 'deluge', 'noah', 'gilgamesh', 'manu', 'deucalion', 'atlantis sinking'],
  },
  {
    slug: 'younger-dryas',
    name: 'The Younger Dryas Impact',
    tagline: 'Did a cosmic catastrophe end the Ice Age and destroy an ancient civilization?',
    icon: '☄️',
    keywords: ['younger dryas', 'impact', 'comet', 'cataclysm', '12800', '12,800', 'randall carlson', 'gobekli', 'göbekli', 'tas tepeler', 'karahan', 't-pillar'],
  },
  {
    slug: 'sphinx-age',
    name: 'The Age of the Sphinx',
    tagline: 'Water erosion suggests the Sphinx may be thousands of years older than claimed',
    icon: '🦁',
    keywords: ['sphinx', 'water erosion', 'schoch', 'west', 'older than'],
  },
  {
    slug: 'pyramid-mysteries',
    name: 'Pyramid Mysteries',
    tagline: 'How were the pyramids really built, and what was their true purpose?',
    icon: '🔺',
    keywords: ['pyramid', 'giza', 'great pyramid', 'khufu', 'cheops', 'orion'],
  },
  {
    slug: 'megalithic-builders',
    name: 'The Megalithic Builders',
    tagline: 'Who moved stones weighing hundreds of tons with supposed primitive technology?',
    icon: '🗿',
    keywords: ['megalith', 'baalbek', 'puma punku', 'sacsayhuaman', 'stonehenge', 'carnac', 'massive stone'],
  },
  {
    slug: 'alien-interference',
    name: 'Alien Interference in Human Development',
    tagline: 'Did extraterrestrial beings guide the rise of human civilization?',
    icon: '👽',
    keywords: ['ancient astronaut', 'alien', 'extraterrestrial', 'anunnaki', 'vimana', 'ufo', 'intervention', 'genetic', 'nephilim', 'watchers', 'sky people'],
  },
  {
    slug: 'lost-civilization',
    name: 'Lost Civilization',
    tagline: 'Evidence for an advanced global civilization before the Ice Age',
    icon: '🌍',
    keywords: ['lost civilization', 'antediluvian', 'pre-ice age', 'graham hancock', 'atlantis'],
  },
  {
    slug: 'astronomical-alignments',
    name: 'Astronomical Alignments',
    tagline: 'Ancient structures aligned to stars, solstices, and celestial events',
    icon: '⭐',
    keywords: ['astronomical', 'alignment', 'solstice', 'equinox', 'orion', 'sirius', 'pleiades'],
  },
  {
    slug: 'underwater-ruins',
    name: 'Underwater Ruins',
    tagline: 'Submerged structures hint at civilizations lost to rising seas',
    icon: '🏊',
    keywords: ['underwater', 'submerged', 'yonaguni', 'dwarka', 'bimini', 'sunken'],
  },
]

// Find which mysteries an article matches
export function findMatchingMysteries(title, content) {
  const text = (title + ' ' + content).toLowerCase()

  return MYSTERY_DEFINITIONS.filter(mystery =>
    mystery.keywords.some(keyword => text.includes(keyword.toLowerCase()))
  )
}

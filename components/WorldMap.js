'use client'

import { useState, memo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'
import { KNOWN_LOCATIONS } from '@/lib/locations'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Find location name from coordinates
function findLocationFromCoords(lat, lng, threshold = 0.5) {
  for (const [name, coords] of Object.entries(KNOWN_LOCATIONS)) {
    const latDiff = Math.abs(coords.lat - lat)
    const lngDiff = Math.abs(coords.lng - lng)
    if (latDiff < threshold && lngDiff < threshold) {
      return name
    }
  }
  return null
}

// Group articles by location
function groupArticlesByLocation(articles) {
  const groups = {}

  articles.forEach(article => {
    if (!article.latitude || !article.longitude) return

    const locationName = findLocationFromCoords(article.latitude, article.longitude)
    if (locationName) {
      if (!groups[locationName]) {
        groups[locationName] = {
          name: locationName,
          lat: KNOWN_LOCATIONS[locationName].lat,
          lng: KNOWN_LOCATIONS[locationName].lng,
          articles: []
        }
      }
      groups[locationName].articles.push(article)
    } else {
      // Use coordinates as key for unknown locations
      const key = `${article.latitude.toFixed(2)},${article.longitude.toFixed(2)}`
      if (!groups[key]) {
        groups[key] = {
          name: null,
          lat: article.latitude,
          lng: article.longitude,
          articles: []
        }
      }
      groups[key].articles.push(article)
    }
  })

  return Object.values(groups)
}

function WorldMap({ articles = [], onMarkerClick, selectedRegion }) {
  const router = useRouter()
  const [tooltipContent, setTooltipContent] = useState('')
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Group articles by location
  const locationGroups = groupArticlesByLocation(articles)

  const handleMarkerHover = (group, event) => {
    const displayName = group.name
      ? group.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Unknown Location'
    setTooltipContent(`${displayName} (${group.articles.length} article${group.articles.length !== 1 ? 's' : ''})`)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMarkerClick = (group) => {
    if (group.name) {
      const slug = group.name.replace(/ /g, '-')
      router.push(`/explore/${slug}`)
    } else {
      // For unknown locations, just show the first article
      onMarkerClick?.(group.articles[0])
    }
  }

  return (
    <div className="relative w-full bg-ancient-dark rounded-lg border border-ancient-gray overflow-hidden">
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 20]
        }}
        className="w-full h-[400px] md:h-[500px]"
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#2a2a2a"
                  stroke="#3a3a3a"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#3a3a3a', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Location Markers */}
          {locationGroups.map((group, index) => (
            <Marker
              key={group.name || index}
              coordinates={[group.lng, group.lat]}
              onMouseEnter={(e) => handleMarkerHover(group, e)}
              onMouseLeave={() => setTooltipContent('')}
              onClick={() => handleMarkerClick(group)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                r={Math.min(6 + group.articles.length, 12)}
                fill="#d4a853"
                stroke="#f0c674"
                strokeWidth={2}
                className="animate-pulse"
              />
              {group.articles.length > 1 && (
                <text
                  textAnchor="middle"
                  y={4}
                  style={{ fontSize: 10, fill: '#1a1a1a', fontWeight: 'bold' }}
                >
                  {group.articles.length}
                </text>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-50 px-3 py-2 bg-ancient-black border border-ancient-gold rounded-lg text-sm text-ancient-text pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 30,
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-ancient-black/80 rounded-lg p-3 text-xs">
        <div className="flex items-center space-x-2 mb-2">
          <span className="w-3 h-3 rounded-full bg-ancient-gold"></span>
          <span className="text-ancient-text-muted">Click to explore location</span>
        </div>
        <p className="text-ancient-text-muted">
          {locationGroups.length} location{locationGroups.length !== 1 ? 's' : ''} mapped
        </p>
      </div>
    </div>
  )
}

export default memo(WorldMap)

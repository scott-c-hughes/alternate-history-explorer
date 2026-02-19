// Known locations for ancient/alternative history sites
// Add more as needed

export const KNOWN_LOCATIONS = {
  // Turkey
  'gobekli tepe': { lat: 37.2233, lng: 38.9224, region: 'asia' },
  'gobeklitepe': { lat: 37.2233, lng: 38.9224, region: 'asia' },
  'göbekli tepe': { lat: 37.2233, lng: 38.9224, region: 'asia' },
  'karahan tepe': { lat: 37.0667, lng: 39.1833, region: 'asia' },
  'tas tepeler': { lat: 37.2233, lng: 38.9224, region: 'asia' },
  'catalhoyuk': { lat: 37.6661, lng: 32.8281, region: 'asia' },
  'çatalhöyük': { lat: 37.6661, lng: 32.8281, region: 'asia' },
  'derinkuyu': { lat: 38.3747, lng: 34.7344, region: 'asia' },
  'cappadocia': { lat: 38.6431, lng: 34.8289, region: 'asia' },

  // Egypt
  'giza': { lat: 29.9792, lng: 31.1342, region: 'mediterranean' },
  'great pyramid': { lat: 29.9792, lng: 31.1342, region: 'mediterranean' },
  'pyramid of giza': { lat: 29.9792, lng: 31.1342, region: 'mediterranean' },
  'khufu': { lat: 29.9792, lng: 31.1342, region: 'mediterranean' },
  'cheops': { lat: 29.9792, lng: 31.1342, region: 'mediterranean' },
  'sphinx': { lat: 29.9753, lng: 31.1376, region: 'mediterranean' },
  'karnak': { lat: 25.7188, lng: 32.6573, region: 'mediterranean' },
  'luxor': { lat: 25.6872, lng: 32.6396, region: 'mediterranean' },
  'abu simbel': { lat: 22.3372, lng: 31.6258, region: 'mediterranean' },
  'saqqara': { lat: 29.8713, lng: 31.2165, region: 'mediterranean' },
  'abydos': { lat: 26.1853, lng: 31.9190, region: 'mediterranean' },
  'dendera': { lat: 26.1416, lng: 32.6700, region: 'mediterranean' },
  'osireion': { lat: 26.1853, lng: 31.9190, region: 'mediterranean' },
  'serapeum': { lat: 29.8713, lng: 31.2165, region: 'mediterranean' },
  'valley of kings': { lat: 25.7402, lng: 32.6014, region: 'mediterranean' },

  // Peru / South America
  'machu picchu': { lat: -13.1631, lng: -72.5450, region: 'americas' },
  'nazca': { lat: -14.7356, lng: -75.1300, region: 'americas' },
  'nazca lines': { lat: -14.7356, lng: -75.1300, region: 'americas' },
  'puma punku': { lat: -16.5617, lng: -68.6803, region: 'americas' },
  'pumapunku': { lat: -16.5617, lng: -68.6803, region: 'americas' },
  'tiwanaku': { lat: -16.5546, lng: -68.6731, region: 'americas' },
  'tiahuanaco': { lat: -16.5546, lng: -68.6731, region: 'americas' },
  'sacsayhuaman': { lat: -13.5092, lng: -71.9822, region: 'americas' },
  'ollantaytambo': { lat: -13.2588, lng: -72.2639, region: 'americas' },
  'cusco': { lat: -13.5320, lng: -71.9675, region: 'americas' },
  'caral': { lat: -10.8933, lng: -77.5203, region: 'americas' },
  'paracas': { lat: -13.8333, lng: -76.2500, region: 'americas' },
  'elongated skulls': { lat: -13.8333, lng: -76.2500, region: 'americas' },
  'chavin': { lat: -9.5947, lng: -77.1778, region: 'americas' },

  // Mexico / Central America
  'teotihuacan': { lat: 19.6925, lng: -98.8438, region: 'americas' },
  'chichen itza': { lat: 20.6843, lng: -88.5678, region: 'americas' },
  'palenque': { lat: 17.4838, lng: -92.0462, region: 'americas' },
  'tikal': { lat: 17.2220, lng: -89.6237, region: 'americas' },
  'la venta': { lat: 18.1033, lng: -94.0400, region: 'americas' },
  'monte alban': { lat: 17.0436, lng: -96.7678, region: 'americas' },
  'olmec': { lat: 18.1033, lng: -94.0400, region: 'americas' },
  'maya': { lat: 20.6843, lng: -88.5678, region: 'americas' },
  'aztec': { lat: 19.4326, lng: -99.1332, region: 'americas' },
  'tulum': { lat: 20.2144, lng: -87.4291, region: 'americas' },

  // Europe
  'stonehenge': { lat: 51.1789, lng: -1.8262, region: 'europe' },
  'avebury': { lat: 51.4288, lng: -1.8544, region: 'europe' },
  'newgrange': { lat: 53.6947, lng: -6.4756, region: 'europe' },
  'carnac': { lat: 47.5847, lng: -3.0778, region: 'europe' },
  'skara brae': { lat: 59.0488, lng: -3.3415, region: 'europe' },
  'malta temples': { lat: 35.8267, lng: 14.5367, region: 'europe' },
  'gozo': { lat: 36.0444, lng: 14.2511, region: 'europe' },
  'bosnian pyramid': { lat: 43.9769, lng: 18.1761, region: 'europe' },
  'visoko': { lat: 43.9769, lng: 18.1761, region: 'europe' },
  'silbury hill': { lat: 51.4158, lng: -1.8575, region: 'europe' },
  'orkney': { lat: 59.0000, lng: -3.0000, region: 'europe' },

  // Middle East
  'baalbek': { lat: 34.0069, lng: 36.2039, region: 'asia' },
  'petra': { lat: 30.3285, lng: 35.4444, region: 'asia' },
  'jerusalem': { lat: 31.7683, lng: 35.2137, region: 'asia' },
  'jericho': { lat: 31.8570, lng: 35.4595, region: 'asia' },
  'sumerian': { lat: 31.3256, lng: 45.6375, region: 'asia' },
  'sumer': { lat: 31.3256, lng: 45.6375, region: 'asia' },
  'babylon': { lat: 32.5425, lng: 44.4211, region: 'asia' },
  'mesopotamia': { lat: 33.3152, lng: 44.3661, region: 'asia' },
  'ur': { lat: 30.9628, lng: 46.1031, region: 'asia' },
  'anunnaki': { lat: 31.3256, lng: 45.6375, region: 'asia' },

  // Asia
  'angkor wat': { lat: 13.4125, lng: 103.8670, region: 'asia' },
  'angkor': { lat: 13.4125, lng: 103.8670, region: 'asia' },
  'borobudur': { lat: -7.6079, lng: 110.2038, region: 'asia' },
  'mohenjo daro': { lat: 27.3242, lng: 68.1375, region: 'asia' },
  'mohenjo-daro': { lat: 27.3242, lng: 68.1375, region: 'asia' },
  'harappa': { lat: 30.6314, lng: 72.8643, region: 'asia' },
  'indus valley': { lat: 27.3242, lng: 68.1375, region: 'asia' },
  'sanchi': { lat: 23.4793, lng: 77.7399, region: 'asia' },
  'ellora': { lat: 20.0269, lng: 75.1791, region: 'asia' },
  'ajanta': { lat: 20.5519, lng: 75.7033, region: 'asia' },
  'dwarka': { lat: 22.2442, lng: 68.9685, region: 'asia' },
  'gunung padang': { lat: -6.9944, lng: 107.0564, region: 'asia' },
  'longyou caves': { lat: 29.0333, lng: 119.1667, region: 'asia' },
  'forbidden city': { lat: 39.9163, lng: 116.3972, region: 'asia' },

  // Pacific
  'easter island': { lat: -27.1127, lng: -109.3497, region: 'oceania' },
  'rapa nui': { lat: -27.1127, lng: -109.3497, region: 'oceania' },
  'moai': { lat: -27.1127, lng: -109.3497, region: 'oceania' },
  'nan madol': { lat: 6.8444, lng: 158.3356, region: 'oceania' },
  'yonaguni': { lat: 24.4353, lng: 122.9419, region: 'asia' },

  // Africa
  'great zimbabwe': { lat: -20.2674, lng: 30.9330, region: 'africa' },
  'axum': { lat: 14.1211, lng: 38.7469, region: 'africa' },
  'lalibela': { lat: 12.0319, lng: 39.0475, region: 'africa' },
  'dogon': { lat: 14.0000, lng: -3.5000, region: 'africa' },
  'timbuktu': { lat: 16.7666, lng: -3.0026, region: 'africa' },

  // Mediterranean / Greece
  'knossos': { lat: 35.2979, lng: 25.1625, region: 'mediterranean' },
  'minoan': { lat: 35.2979, lng: 25.1625, region: 'mediterranean' },
  'mycenae': { lat: 37.7306, lng: 22.7564, region: 'mediterranean' },
  'delphi': { lat: 38.4824, lng: 22.5010, region: 'mediterranean' },
  'sardinia': { lat: 40.1209, lng: 9.0129, region: 'mediterranean' },
  'santorini': { lat: 36.3932, lng: 25.4615, region: 'mediterranean' },
  'thera': { lat: 36.3932, lng: 25.4615, region: 'mediterranean' },
  'antikythera': { lat: 35.8617, lng: 23.3100, region: 'mediterranean' },
  'crete': { lat: 35.2401, lng: 24.8093, region: 'mediterranean' },

  // Underwater / Legendary
  'bimini road': { lat: 25.7617, lng: -79.2756, region: 'americas' },
  'bimini': { lat: 25.7617, lng: -79.2756, region: 'americas' },
  'richat structure': { lat: 21.1245, lng: -11.4017, region: 'africa' },
  'eye of sahara': { lat: 21.1245, lng: -11.4017, region: 'africa' },
  'eye of the sahara': { lat: 21.1245, lng: -11.4017, region: 'africa' },
  'atlantis': { lat: 21.1245, lng: -11.4017, region: 'africa' },

  // USA
  'coral castle': { lat: 25.5003, lng: -80.4445, region: 'americas' },
  'serpent mound': { lat: 39.0253, lng: -83.4303, region: 'americas' },
  'cahokia': { lat: 38.6558, lng: -90.0619, region: 'americas' },
  'grand canyon': { lat: 36.0544, lng: -112.1401, region: 'americas' },
}

// Find location from text content
export function findLocation(text) {
  if (!text) return null

  const lowerText = text.toLowerCase()

  for (const [name, coords] of Object.entries(KNOWN_LOCATIONS)) {
    if (lowerText.includes(name)) {
      return {
        name,
        latitude: coords.lat,
        longitude: coords.lng,
        region: coords.region,
      }
    }
  }

  return null
}

// Get all location names for reference
export function getAllLocationNames() {
  return Object.keys(KNOWN_LOCATIONS)
}

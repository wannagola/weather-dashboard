import clearIcon from '@/assets/weather-icons/clear.png'
import cloudsIcon from '@/assets/weather-icons/clouds.png'
import rainIcon from '@/assets/weather-icons/rain.png'
import drizzleIcon from '@/assets/weather-icons/drizzle.png'
import thunderstormIcon from '@/assets/weather-icons/thunderstorm.png'
import snowIcon from '@/assets/weather-icons/snow.png'
import atmosphereIcon from '@/assets/weather-icons/atmosphere.png'

const ICON_BY_CONDITION = {
  Clear: clearIcon,
  Clouds: cloudsIcon,
  Rain: rainIcon,
  Drizzle: drizzleIcon,
  Thunderstorm: thunderstormIcon,
  Snow: snowIcon,
}

const ATMOSPHERE_CONDITIONS = new Set([
  'Mist',
  'Smoke',
  'Haze',
  'Dust',
  'Fog',
  'Sand',
  'Ash',
  'Squall',
  'Tornado',
])

export function getWeatherIcon(condition) {
  if (ICON_BY_CONDITION[condition]) return ICON_BY_CONDITION[condition]
  if (ATMOSPHERE_CONDITIONS.has(condition)) return atmosphereIcon
  return clearIcon
}

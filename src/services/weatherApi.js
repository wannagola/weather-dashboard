import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  timeout: 7000,
})

const forecastClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/forecast',
  timeout: 7000,
})

export const CITY_LIST = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.9780 },
  { id: 'city_02', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'city_03', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'city_04', name: '제주', lat: 33.4996, lon: 126.5312 },
  { id: 'city_05', name: '의왕', lat: 37.3444, lon: 126.9683 },
  { id: 'city_06', name: '대구', lat: 35.8714, lon: 128.6014 },
  { id: 'city_07', name: '광주', lat: 35.1595, lon: 126.8526 },
  { id: 'city_08', name: '대전', lat: 36.3504, lon: 127.3845 },
  { id: 'city_09', name: '울산', lat: 35.5384, lon: 129.3114 },
  { id: 'city_10', name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 'city_11', name: '강릉', lat: 37.7519, lon: 128.8761 },
  { id: 'city_12', name: '속초', lat: 38.2044, lon: 128.5912 },
  { id: 'city_13', name: '춘천', lat: 37.8813, lon: 127.7298 },
  { id: 'city_14', name: '전주', lat: 35.8242, lon: 127.1480 },
  { id: 'city_15', name: '청주', lat: 36.6424, lon: 127.4890 },
  { id: 'city_16', name: '포항', lat: 36.0190, lon: 129.3435 },
  { id: 'city_17', name: '여수', lat: 34.7604, lon: 127.6620 },
  { id: 'city_18', name: '목포', lat: 34.8110, lon: 126.3929 },
  { id: 'city_19', name: '군산', lat: 35.9670, lon: 126.7368 },
  { id: 'city_20', name: '서산', lat: 36.7845, lon: 126.4506 },
]

function assertApiKey() {
  if (!API_KEY) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 설정되지 않았습니다.')
  }
}

async function requestWeather(city) {
  assertApiKey()

  const { data } = await weatherClient.get('', {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return data
}

function normalizeWeather(city, data) {
  return {
    id: city.id,
    name: city.name,
    temp: data.main.temp,
    status: data.weather?.[0]?.description ?? '정보 없음',
    condition: data.weather?.[0]?.main ?? 'Clear',
    humidity: data.main.humidity,
    wind: data.wind.speed,
  }
}
export async function fetchWeatherList() {
  return Promise.all(
    CITY_LIST.map(async (city) => {
      const data = await requestWeather(city)
      return normalizeWeather(city, data)
    }),
  )
}

export async function fetchWeatherDetail(cityId) {
  const city = CITY_LIST.find((item) => item.id === cityId)
  if (!city) return null

  const data = await requestWeather(city)
  return normalizeWeather(city, data)
}

export async function fetchWeatherForecast(cityId) {
  const city = CITY_LIST.find((item) => item.id === cityId)
  if (!city) return []

  assertApiKey()

  const { data } = await forecastClient.get('', {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return data.list
    .filter((entry) => entry.dt_txt.includes('12:00:00'))
    .map((entry) => ({
      dateTime: entry.dt_txt,
      temp: entry.main.temp,
      status: entry.weather?.[0]?.description ?? '정보 없음',
      condition: entry.weather?.[0]?.main ?? 'Clear',
    }))
}
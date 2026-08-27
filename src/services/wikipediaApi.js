import axios from 'axios'

const wikipediaClient = axios.create({
  baseURL: 'https://ko.wikipedia.org/api/rest_v1/page/summary',
  timeout: 7000,
})

export async function fetchCitySummary(cityName) {
  try {
    const { data } = await wikipediaClient.get(`/${encodeURIComponent(cityName)}`)
    return {
      title: data.title,
      extract: data.extract,
      thumbnailUrl: data.thumbnail?.source ?? null,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

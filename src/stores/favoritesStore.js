import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'weather-dashboard:favorites'

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch (error) {
    console.error(error)
    return new Set()
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref(loadFavorites())

  function isFavorite(cityId) {
    return favoriteIds.value.has(cityId)
  }

  function toggleFavorite(cityId) {
    if (favoriteIds.value.has(cityId)) {
      favoriteIds.value.delete(cityId)
    } else {
      favoriteIds.value.add(cityId)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoriteIds.value]))
  }

  return { favoriteIds, isFavorite, toggleFavorite }
})

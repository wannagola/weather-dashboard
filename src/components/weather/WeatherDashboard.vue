<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import { fetchWeatherList } from '@/services/weatherApi'

const route = useRoute()
const router = useRouter()

const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectedCityInfo = ref('도시 카드를 선택해 보세요.')

const searchQuery = ref(
  typeof route.query.search === 'string' ? route.query.search : '',
)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

watch(selectedCityInfo, (message) => console.log('[watch]', message))

watch(searchQuery, (value) => {
  router.replace({
    query: { ...route.query, search: value || undefined },
  })
})

watchEffect(() => {
  console.log('[watchEffect] 검색어:', searchQuery.value)
})

async function loadWeather() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    weatherList.value = await fetchWeatherList()
  } catch (error) {
    console.error(error)
    errorMessage.value = '날씨 정보를 불러오지 못했습니다. API Key와 네트워크 상태를 확인하세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadWeather)

function goDetail(cityId) {
  router.push({ name: 'WeatherDetail', params: { cityId } })
}
</script>

<template>
  <div>
    <BaseDashboardCard>
      <template #title><h2>도시 검색</h2></template>
      <SearchBar
        :current-query="searchQuery"
        @update-query="(value) => (searchQuery = value)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <template #title><h2>지역별 날씨 현황</h2></template>
      <p v-if="isLoading">날씨 정보를 불러오는 중입니다...</p>
      <p v-else-if="errorMessage">{{ errorMessage }}</p>
      <template v-else>
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city-item="city"
          @select-card="(message) => (selectedCityInfo = message)"
          @click-detail="goDetail"
        />
        <p v-if="filteredWeatherList.length === 0">검색 결과가 없습니다.</p>
      </template>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
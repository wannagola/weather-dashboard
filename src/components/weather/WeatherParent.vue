<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import UnitToggler from './UnitToggler.vue'
import { fetchWeatherList } from '@/services/weatherApi'
import { useFavoritesStore } from '@/stores/favoritesStore'

const route = useRoute()
const router = useRouter()
const favoritesStore = useFavoritesStore()

const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const selectedCityInfo = ref('도시 카드를 선택해 보세요.')
const favoritesOnly = ref(false)

const searchQuery = ref(
  typeof route.query.search === 'string' ? route.query.search : '',
)

const pageSize = 5
const currentPage = ref(1)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  let list = weatherList.value

  if (query) {
    list = list.filter((city) => city.name.includes(query))
  }

  if (favoritesOnly.value) {
    list = list.filter((city) => favoritesStore.isFavorite(city.id))
  }

  return list
})

const paginatedWeatherList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredWeatherList.value.slice(start, start + pageSize)
})

watch(selectedCityInfo, (message) => console.log('[watch]', message))

watch(searchQuery, (value) => {
  currentPage.value = 1
  router.replace({
    query: { ...route.query, search: value || undefined },
  })
})

watch(favoritesOnly, () => {
  currentPage.value = 1
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
      <template #title>
        <div class="section-title">
          <h2>지역별 날씨 현황</h2>
          <div class="section-title__actions">
            <el-checkbox v-model="favoritesOnly">즐겨찾기만 보기</el-checkbox>
            <UnitToggler />
          </div>
        </div>
      </template>
      <p v-if="isLoading">날씨 정보를 불러오는 중입니다...</p>
      <p v-else-if="errorMessage">{{ errorMessage }}</p>
      <template v-else>
        <WeatherCard
          v-for="city in paginatedWeatherList"
          :key="city.id"
          :city-item="city"
          @select-card="(message) => (selectedCityInfo = message)"
          @click-detail="goDetail"
        />
        <p v-if="filteredWeatherList.length === 0">표시할 도시가 없습니다.</p>
        <el-pagination
          v-else
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredWeatherList.length"
          layout="prev, pager, next"
          background
        />
      </template>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
</style>
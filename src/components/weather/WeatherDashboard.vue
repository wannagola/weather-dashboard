<script setup>
import { computed, ref, watch } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대구', temp: 30, status: '맑음' },
  { id: 'city_05', name: '광주', temp: 27, status: '비' },
  { id: 'city_06', name: '대전', temp: 25, status: '맑음' },
  { id: 'city_07', name: '울산', temp: 29, status: '구름' },
  { id: 'city_08', name: '인천', temp: 23, status: '비' },
  { id: 'city_09', name: '창원', temp: 28, status: '맑음' },
  { id: 'city_10', name: '제주', temp: 22, status: '비' },
  { id: 'city_11', name: '강릉', temp: 27, status: '맑음' },
  { id: 'city_12', name: '전주', temp: 26, status: '구름' },
  { id: 'city_13', name: '청주', temp: 25, status: '맑음' },
  { id: 'city_14', name: '포항', temp: 29, status: '맑음' },
  { id: 'city_15', name: '속초', temp: 24, status: '비' },
  { id: 'city_16', name: '여수', temp: 28, status: '맑음' },
  { id: 'city_17', name: '목포', temp: 27, status: '구름' },
  { id: 'city_18', name: '군산', temp: 26, status: '맑음' },
  { id: 'city_19', name: '김해', temp: 29, status: '맑음' },
  { id: 'city_20', name: '양양', temp: 23, status: '비' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('도시 카드를 선택해 보세요.')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

watch(selectedCityInfo, (message) => console.log('[watch]', message))


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
      <WeatherCard
        v-for="city in filteredWeatherList"
        :key="city.id"
        :city-item="city"
        @select-card="(message) => (selectedCityInfo = message)"
        @click-detail="goDetail"
      />
      <p v-if="filteredWeatherList.length === 0">검색 결과가 없습니다.</p>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>
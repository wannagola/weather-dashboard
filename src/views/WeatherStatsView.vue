<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchWeatherList } from '@/services/weatherApi'
import { useConfigStore } from '@/stores/configStore'
import { getWeatherIcon } from '@/utils/weatherIcons'
import BaseDashboardCard from '@/components/weather/BaseDashboardCard.vue'

const configStore = useConfigStore()

const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const CONDITION_LABELS = {
  Clear: '맑음',
  Clouds: '구름',
  Rain: '비',
  Drizzle: '이슬비',
  Thunderstorm: '뇌우',
  Snow: '눈',
}

const averageTemp = computed(() => {
  if (!weatherList.value.length) return 0
  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)
  return total / weatherList.value.length
})

const hottestCity = computed(() =>
  weatherList.value.reduce(
    (hottest, city) => (!hottest || city.temp > hottest.temp ? city : hottest),
    null,
  ),
)

const coldestCity = computed(() =>
  weatherList.value.reduce(
    (coldest, city) => (!coldest || city.temp < coldest.temp ? city : coldest),
    null,
  ),
)

const conditionCounts = computed(() => {
  const counts = {}
  weatherList.value.forEach((city) => {
    counts[city.condition] = (counts[city.condition] ?? 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
})

function toDisplayTemp(celsius) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }
  return Math.round(celsius)
}

function conditionLabel(condition) {
  return CONDITION_LABELS[condition] ?? '기타'
}

async function loadStats() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    weatherList.value = await fetchWeatherList()
  } catch (error) {
    console.error(error)
    errorMessage.value = '통계를 불러오지 못했습니다. API Key와 네트워크 상태를 확인하세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <BaseDashboardCard>
    <template #title><h2>날씨 통계</h2></template>

    <p v-if="isLoading">통계를 불러오는 중입니다...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <div v-else class="weather-stats">
      <div class="weather-stats__summary">
        <div class="stat-box">
          <span class="stat-box__label">평균 기온</span>
          <span class="stat-box__value">
            {{ toDisplayTemp(averageTemp) }}{{ configStore.unitSymbol }}
          </span>
        </div>
        <div v-if="hottestCity" class="stat-box">
          <span class="stat-box__label">가장 더운 도시</span>
          <span class="stat-box__value">
            {{ hottestCity.name }} ({{ toDisplayTemp(hottestCity.temp) }}{{ configStore.unitSymbol }})
          </span>
        </div>
        <div v-if="coldestCity" class="stat-box">
          <span class="stat-box__label">가장 추운 도시</span>
          <span class="stat-box__value">
            {{ coldestCity.name }} ({{ toDisplayTemp(coldestCity.temp) }}{{ configStore.unitSymbol }})
          </span>
        </div>
      </div>

      <h4 class="weather-stats__subtitle">날씨 상태 분포</h4>
      <ul class="weather-stats__conditions">
        <li v-for="[condition, count] in conditionCounts" :key="condition">
          <img :src="getWeatherIcon(condition)" class="weather-stats__icon" alt="" />
          <span class="weather-stats__condition-label">{{ conditionLabel(condition) }}</span>
          <span class="weather-stats__condition-count">{{ count }}개 도시</span>
        </li>
      </ul>
    </div>
  </BaseDashboardCard>
</template>

<style scoped>
.weather-stats__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.stat-box {
  flex: 1;
  min-width: 160px;
  padding: 16px;
  border-radius: 10px;
  background: #f5f7fa;
  text-align: center;
}

.stat-box__label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #909399;
}

.stat-box__value {
  display: block;
  font-size: 20px;
  font-weight: 700;
}

.weather-stats__subtitle {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 700;
  color: #606266;
}

.weather-stats__conditions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.weather-stats__conditions li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f5f7fa;
}

.weather-stats__icon {
  width: 28px;
  height: 28px;
}

.weather-stats__condition-label {
  flex: 1;
  font-weight: 600;
}

.weather-stats__condition-count {
  color: #909399;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { fetchWeatherDetail } from '@/services/weatherApi'
import BaseDashboardCard from '@/components/weather/BaseDashboardCard.vue'
import { getWeatherIcon } from '@/utils/weatherIcons'

const route = useRoute()
const router = useRouter()
const cityData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const { displayTemp, unitSymbol } = useTemperature(
  () => cityData.value?.temp ?? 0,
)

async function loadWeatherDetail() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    cityData.value = await fetchWeatherDetail(String(route.params.cityId))
    if (!cityData.value) errorMessage.value = '등록되지 않은 도시입니다.'
  } catch (error) {
    console.error(error)
    errorMessage.value = '상세 날씨 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadWeatherDetail)
</script>

<template>
  <BaseDashboardCard>
    <template #title><h2>상세 날씨</h2></template>

    <p v-if="isLoading">데이터를 불러오는 중입니다...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <div v-else-if="cityData" class="weather-detail">
      <div class="weather-detail__header">
        <div class="weather-detail__title">
          <img
            class="weather-detail__icon"
            :src="getWeatherIcon(cityData.condition)"
            alt=""
          />
          <h3 class="weather-detail__name">{{ cityData.name }}</h3>
          <el-tag size="large" effect="plain">{{ cityData.status }}</el-tag>
        </div>

        <p class="weather-detail__temp">
          {{ displayTemp }}<span class="weather-detail__unit">{{ unitSymbol }}</span>
        </p>
      </div>

      <div class="weather-detail__stats">
        <div class="stat">
          <span class="stat__label">습도</span>
          <span class="stat__value">{{ cityData.humidity }}%</span>
        </div>
        <div class="stat">
          <span class="stat__label">풍속</span>
          <span class="stat__value">{{ cityData.wind }}m/s</span>
        </div>
      </div>
    </div>

    <el-button size="large" @click="router.push({ name: 'WeatherHome' })">
      ← 홈으로 돌아가기
    </el-button>
  </BaseDashboardCard>
</template>

<style scoped>
.weather-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.weather-detail__title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-detail__icon {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}

.weather-detail__name {
  margin: 0;
  font-size: 40px;
  font-weight: 800;
}

.weather-detail__temp {
  margin: 0;
  font-size: 52px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  flex-shrink: 0;
}

.weather-detail__unit {
  margin-left: 4px;
  font-size: 26px;
  font-weight: 500;
  color: #909399;
}

.weather-detail__stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat {
  flex: 1;
  padding: 14px 16px;
  border-radius: 10px;
  background: #f5f7fa;
  text-align: center;
}

.stat__label {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  color: #909399;
}

.stat__value {
  display: block;
  font-size: 18px;
  font-weight: 600;
}
</style>

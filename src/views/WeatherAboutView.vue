<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/weather/BaseDashboardCard.vue'

const appTitle = inject('appTitle', 'Weather Dashboard')
const router = useRouter()
</script>

<template>
  <BaseDashboardCard>
    <template #title><h2>서비스 소개</h2></template>

    <p class="about-text">
      <strong>{{ appTitle }}</strong>는 SKALA에서 진행한 vue.js 프로젝트 실습용으로 제가 직접 제작한 날씨 서비스 알림 서비스입니다. 날씨를 손쉽게 찾아볼 수 있을 뿐만 아니라 즐겨찾기 기능 등을 통해 자주 방문하거나, 거주하는 곳, 근무하는 곳의 날씨를 빠르게 확인할 수 있도록 설계 및 구성하였습니다. 뿐만 아니라 각 도시에 대한 정보도 함께 열람할 수 있도록 상세보기 페이지에 추가해 놓았습니다. 또한, 5일 간의 날씨도 확인할 수 있습니다!
      읽어주셔서 감사합니다!
    </p>
    <p class="about-text">
      특징 : Vue Router, Pinia, Axios, Element Plus를 하나의 SPA에서 연결합니다.
    </p>
    <p>
        <strong>사용된 API</strong> : OpenWeatherMap API, Wikipedia API
    </p>
    <p>개발자 : Sung Minki(https://github.com/sungmg01)</p>

    <el-button size="large" @click="router.push({ name: 'WeatherHome' })">
      ← 메인으로 돌아가기
    </el-button>
  </BaseDashboardCard>
</template>

<style scoped>
.about-text {
  margin: 0 0 16px 0;
  line-height: 1.6;
  color: #606266;
}
</style>
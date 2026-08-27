<script setup>
import { computed } from 'vue'
import { useTemperature } from '@/composables/useTemperature'

const props = defineProps({
  cityItem: { type: Object, required: true },
})

const emit = defineEmits(['select-card', 'click-detail'])

const { displayTemp, unitSymbol } = useTemperature(() => props.cityItem.temp)

const isHot = computed(() => props.cityItem.temp >= 25)
</script>

<template>
  <article
    class="weather-card"
    @click="emit('select-card', `${props.cityItem.name}이 선택되었습니다.`)"
  >
    <h3 class="weather-card__name">{{ props.cityItem.name }}</h3>

    <div class="weather-card__stats">
      <el-tag size="large" effect="plain">{{ displayTemp }}{{ unitSymbol }}</el-tag>
      <el-tag size="large" effect="plain">{{ props.cityItem.status }}</el-tag>
      <el-tag size="large" :type="isHot ? 'danger' : 'primary'">
        {{ isHot ? '더움' : '선선함' }}
      </el-tag>
    </div>

    <el-button
      type="primary"
      size="large"
      class="weather-card__detail-btn"
      @click.stop="emit('click-detail', props.cityItem.id)"
    >
      상세보기
    </el-button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 12px 0;
  padding: 20px 24px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.weather-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.weather-card__name {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  min-width: 72px;
}

.weather-card__stats {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.weather-card__detail-btn {
  flex-shrink: 0;
}
</style>

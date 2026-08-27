<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['update:current-page'])
</script>

<template>
  <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    layout="prev, pager, next"
    background
    @update:current-page="emit('update:current-page', $event)"
  />
</template>

<style scoped>
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
</style>

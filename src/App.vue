<script setup>
import { provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

provide('appTitle', 'Vue Weather Dashboard')
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">Vue Weather Dashboard</h1>
      <nav class="app-nav">
        <RouterLink to="/" class="app-nav__link">Home</RouterLink>
        <RouterLink to="/about" class="app-nav__link">About</RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  text-align: center;
}

.app-title {
  margin: 0;
  font-size: 40px;
  font-weight: 800;
}

.app-nav {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: #f0f2f5;
}

.app-nav__link {
  padding: 8px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  text-decoration: none;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.app-nav__link:hover {
  color: #303133;
}

.app-nav__link.router-link-exact-active {
  background: #ffffff;
  color: #409eff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
</style>
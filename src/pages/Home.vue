<template>
  <div class="home">
    <header class="header">
      <h1>记忆助手</h1>
      <p class="subtitle">记录生活，找回记忆</p>
    </header>

    <nav class="nav-grid">
      <router-link to="/items" class="nav-card">
        <span class="nav-icon">📦</span>
        <span>物品管理</span>
      </router-link>
      <router-link to="/locations" class="nav-card">
        <span class="nav-icon">📍</span>
        <span>位置管理</span>
      </router-link>
      <router-link to="/search" class="nav-card">
        <span class="nav-icon">🔍</span>
        <span>搜索</span>
      </router-link>
      <router-link to="/items/new" class="nav-card add">
        <span class="nav-icon">➕</span>
        <span>快速添加</span>
      </router-link>
    </nav>

    <section class="quick-stats">
      <div class="stat-card">
        <span class="stat-value">{{ stats.itemCount }}</span>
        <span class="stat-label">物品总数</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.locationCount }}</span>
        <span class="stat-label">位置数量</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { itemRepository } from '@/db/repositories'
import { locationRepository } from '@/db/repositories'

const stats = ref({
  itemCount: 0,
  locationCount: 0
})

onMounted(async () => {
  stats.value.itemCount = await itemRepository.count()
  stats.value.locationCount = await locationRepository.count()
})
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
}

.nav-card:hover {
  transform: translateY(-2px);
}

.nav-card.add {
  background: #42b883;
  color: white;
}

.nav-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.quick-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: bold;
  color: #42b883;
}

.stat-label {
  font-size: 12px;
  color: #666;
}
</style>

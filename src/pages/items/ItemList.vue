<template>
  <div class="item-list-page">
    <header class="page-header">
      <router-link to="/" class="back-link">←</router-link>
      <h1>物品列表</h1>
      <router-link to="/items/new" class="add-btn">+</router-link>
    </header>

    <div class="search-bar">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="搜索物品..."
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="items.length === 0" class="empty-state">
      <p>暂无物品</p>
      <router-link to="/items/new" class="btn-primary">添加第一个物品</router-link>
    </div>

    <div v-else class="item-grid">
      <router-link
        v-for="item in filteredItems"
        :key="item.id"
        :to="`/items/${item.id}`"
        class="item-card"
      >
        <div class="item-name">{{ item.name }}</div>
        <div class="item-meta">
          <span class="status-badge" :class="item.status">{{ statusText[item.status] }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { itemRepositoryExt } from '@/db/repositories'
import type { Item } from '@/types'

const items = ref<Item[]>([])
const searchKeyword = ref('')
const loading = ref(true)

const statusText: Record<string, string> = {
  using: '在用',
  idle: '闲置',
  consumed: '已消耗',
  discarded: '已丢弃'
}

const filteredItems = computed(() => {
  if (!searchKeyword.value) return items.value
  const keyword = searchKeyword.value.toLowerCase()
  return items.value.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.alias?.toLowerCase().includes(keyword)
  )
})

onMounted(async () => {
  items.value = await itemRepositoryExt.findAll()
  loading.value = false
})
</script>

<style scoped>
.item-list-page {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.back-link {
  font-size: 24px;
  color: #666;
}

.page-header h1 {
  font-size: 18px;
}

.add-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #42b883;
  color: white;
  border-radius: 50%;
  font-size: 20px;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.btn-primary {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border-radius: 8px;
}

.item-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.item-name {
  font-size: 16px;
  font-weight: 500;
}

.status-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f0f0f0;
  color: #666;
}

.status-badge.using {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.idle {
  background: #fff3e0;
  color: #ef6c00;
}
</style>

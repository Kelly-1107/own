<template>
  <div class="search-page">
    <header class="page-header">
      <router-link to="/" class="back-link">←</router-link>
      <h1>搜索</h1>
    </header>

    <div class="search-bar">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索物品..."
        class="search-input"
        autofocus
      />
    </div>

    <div v-if="!keyword" class="hint">
      输入关键词搜索物品
    </div>

    <div v-else-if="results.length === 0" class="no-result">
      未找到相关物品
    </div>

    <div v-else class="results">
      <router-link
        v-for="item in results"
        :key="item.id"
        :to="`/items/${item.id}`"
        class="result-item"
      >
        <span class="result-name">{{ item.name }}</span>
        <span class="result-arrow">›</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { itemRepositoryExt } from '@/db/repositories'
import type { Item } from '@/types'

const keyword = ref('')
const results = ref<Item[]>([])

let debounceTimer: number | null = null

watch(keyword, async (newKeyword) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = window.setTimeout(async () => {
    if (!newKeyword.trim()) {
      results.value = []
      return
    }
    results.value = await itemRepositoryExt.findByName(newKeyword)
  }, 300)
})
</script>

<style scoped>
.search-page {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.back-link {
  font-size: 24px;
  color: #666;
}

.page-header h1 {
  font-size: 18px;
}

.search-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
}

.search-input:focus {
  outline: none;
  border-color: #42b883;
}

.hint,
.no-result {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 10px;
}

.result-name {
  font-size: 16px;
}

.result-arrow {
  color: #ccc;
  font-size: 20px;
}
</style>

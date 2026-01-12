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

    <div v-else class="item-list">
      <SwipeAction
        v-for="item in filteredItems"
        :key="item.id"
        ref="swipeActionRefs"
        :actions-width="80"
      >
        <div class="item-content" @click="goToDetail(item.id)">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-meta">
            <span class="status-badge" :class="item.status">{{ statusText[item.status] }}</span>
          </div>
        </div>
        <template #actions>
          <button class="delete-btn" @touchstart.stop @touchend.stop @click.stop="deleteItem(item)">删除</button>
        </template>
      </SwipeAction>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { itemRepository } from '@/db/repositories'
import type { Item } from '@/types'
import SwipeAction from '@/components/domain/SwipeAction.vue'

const router = useRouter()
const items = ref<Item[]>([])
const searchKeyword = ref('')
const loading = ref(true)
const swipeActionRefs = ref<InstanceType<typeof SwipeAction>[]>([])

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

function goToDetail(id: string) {
  router.push(`/items/${id}`)
}

async function deleteItem(item: Item) {
  // 关闭其他已打开的滑面板
  swipeActionRefs.value.forEach(ref => ref.close())

  if (confirm(`确定要删除"${item.name}"吗？`)) {
    await itemRepository.delete(item.id)
    items.value = items.value.filter(i => i.id !== item.id)
  }
}

onMounted(async () => {
  items.value = await itemRepository.findAll()
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

.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  cursor: pointer;
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

.delete-btn {
  width: 80px;
  height: 100%;
  border: none;
  background: #ff5252;
  color: white;
  font-size: 14px;
  cursor: pointer;
  touch-action: none;
}
</style>

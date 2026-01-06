<template>
  <div class="item-detail-page">
    <header class="page-header">
      <router-link to="/items" class="back-link">←</router-link>
      <h1>物品详情</h1>
      <button class="delete-btn" @click="deleteItem">删除</button>
    </header>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="!item" class="not-found">物品不存在</div>

    <div v-else class="detail-container">
      <div class="item-name">{{ item.name }}</div>

      <div class="info-section">
        <div class="info-row" v-if="item.alias">
          <span class="label">别名</span>
          <span class="value">{{ item.alias }}</span>
        </div>
        <div class="info-row" v-if="item.category">
          <span class="label">分类</span>
          <span class="value">{{ item.category }}</span>
        </div>
        <div class="info-row">
          <span class="label">状态</span>
          <span class="value status-badge" :class="item.status">{{ statusText[item.status] }}</span>
        </div>
        <div class="info-row">
          <span class="label">创建时间</span>
          <span class="value">{{ formatDate(item.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { itemRepository } from '@/db/repositories'
import type { Item } from '@/types'

const route = useRoute()
const router = useRouter()

const item = ref<Item | undefined>()
const loading = ref(true)

const statusText: Record<string, string> = {
  using: '在用',
  idle: '闲置',
  consumed: '已消耗',
  discarded: '已丢弃'
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('zh-CN')
}

async function deleteItem() {
  if (!item.value) return
  if (confirm('确定要删除这个物品吗？')) {
    await itemRepository.delete(item.value.id)
    router.push('/items')
  }
}

onMounted(async () => {
  const id = route.params.id as string
  item.value = await itemRepository.findById(id)
  loading.value = false
})
</script>

<style scoped>
.item-detail-page {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.back-link {
  font-size: 24px;
  color: #666;
}

.page-header h1 {
  font-size: 18px;
}

.delete-btn {
  padding: 8px 16px;
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
}

.loading,
.not-found {
  text-align: center;
  padding: 40px;
  color: #666;
}

.detail-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.item-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.label {
  color: #666;
  font-size: 14px;
}

.value {
  font-size: 14px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  background: #f0f0f0;
}

.status-badge.using {
  background: #e8f5e9;
  color: #2e7d32;
}
</style>

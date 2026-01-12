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

      <!-- 位置信息 -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">位置</span>
          <button class="edit-btn" @click="showLocationPicker = true">
            {{ currentLocation ? '更换' : '添加' }}
          </button>
        </div>
        <div v-if="currentLocation" class="location-info">
          <span class="location-icon">📍</span>
          <span class="location-name">{{ getLocationName(currentLocation.location_id) }}</span>
          <span class="location-time">自 {{ formatDate(currentLocation.started_at) }}</span>
        </div>
        <div v-else class="location-empty">
          <span>未记录位置</span>
        </div>
      </div>

      <!-- 位置历史 -->
      <div v-if="locationHistory.length > 0" class="section">
        <div class="section-title">位置历史</div>
        <div class="location-history">
          <div
            v-for="history in locationHistory"
            :key="history.id"
            class="history-item"
          >
            <span class="history-name">{{ getLocationName(history.location_id) }}</span>
            <span class="history-time">{{ formatDateRange(history.started_at, history.ended_at) }}</span>
          </div>
        </div>
      </div>

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

    <!-- 位置选择器弹窗 -->
    <div v-if="showLocationPicker" class="picker-wrapper">
      <LocationPicker
        :modelValue="selectedLocationId"
        @update:modelValue="onLocationChange"
        @close="showLocationPicker = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { itemRepository, itemLocationRepositoryExt, locationRepositoryExt, type LocationTreeNode } from '@/db/repositories'
import type { Item, ItemLocationHistory } from '@/types'
import LocationPicker from '@/components/domain/LocationPicker.vue'

const route = useRoute()
const router = useRouter()

const item = ref<Item | undefined>()
const loading = ref(true)
const showLocationPicker = ref(false)
const selectedLocationId = ref<string | null>(null)
const locationHistory = ref<ItemLocationHistory[]>([])
const locationTree = ref<LocationTreeNode[]>([])

const statusText: Record<string, string> = {
  using: '在用',
  idle: '闲置',
  consumed: '已消耗',
  discarded: '已丢弃'
}

const currentLocation = computed(() => {
  return locationHistory.value.find(h => !h.ended_at)
})

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

function formatDateRange(start: number, end?: number) {
  const startStr = new Date(start).toLocaleDateString('zh-CN')
  if (!end) return `${startStr} 至今`
  const endStr = new Date(end).toLocaleDateString('zh-CN')
  return `${startStr} - ${endStr}`
}

function getLocationName(locationId: string): string {
  function find(nodes: LocationTreeNode[]): string {
    for (const node of nodes) {
      if (node.id === locationId) return node.name
      if (node.children?.length) {
        const found = find(node.children)
        if (found) return found
      }
    }
    return '未知位置'
  }
  return find(locationTree.value)
}

async function loadData() {
  const id = route.params.id as string
  item.value = await itemRepository.findById(id)

  if (item.value) {
    locationHistory.value = await itemLocationRepositoryExt.findByItem(item.value.id)
    selectedLocationId.value = currentLocation.value?.location_id || null
  }

  locationTree.value = await locationRepositoryExt.getTree()
  loading.value = false
}

async function onLocationChange(newLocationId: string | null) {
  if (!item.value) return

  if (newLocationId) {
    await itemLocationRepositoryExt.assignLocation(item.value.id, newLocationId)
  } else {
    await itemLocationRepositoryExt.removeLocation(item.value.id)
  }

  showLocationPicker.value = false
  await loadData()
}

async function deleteItem() {
  if (!item.value) return
  if (confirm('确定要删除这个物品吗？')) {
    await itemRepository.delete(item.value.id)
    router.push('/items')
  }
}

onMounted(loadData)
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

.section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  color: #666;
}

.edit-btn {
  padding: 4px 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-icon {
  font-size: 16px;
}

.location-name {
  font-size: 16px;
  font-weight: 500;
}

.location-time {
  font-size: 12px;
  color: #999;
}

.location-empty {
  color: #999;
  font-size: 14px;
}

.location-history {
  margin-top: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
}

.history-name {
  color: #666;
}

.history-time {
  color: #999;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
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

.picker-wrapper {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
</style>

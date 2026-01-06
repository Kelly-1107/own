<template>
  <div class="location-list-page">
    <header class="page-header">
      <router-link to="/" class="back-link">←</router-link>
      <h1>位置管理</h1>
      <button class="add-btn" @click="showAddDialog = true">+</button>
    </header>

    <div class="location-list">
      <div v-if="tree.length === 0" class="empty-state">
        <p>暂无位置</p>
        <button class="btn-primary" @click="showAddDialog = true">添加位置</button>
      </div>

      <div
        v-for="location in tree"
        :key="location.id"
        class="location-item"
      >
        <div class="location-name">{{ location.name }}</div>
        <div v-if="location.children?.length" class="location-children">
          <div
            v-for="child in location.children"
            :key="child.id"
            class="location-child"
          >
            <span class="child-name">└ {{ child.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加位置弹窗 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="showAddDialog = false">
      <div class="dialog" @click.stop>
        <h3>添加位置</h3>
        <input
          v-model="newLocationName"
          type="text"
          placeholder="位置名称"
          class="form-input"
        />
        <div class="dialog-actions">
          <button @click="showAddDialog = false">取消</button>
          <button class="btn-primary" @click="addLocation">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { locationRepositoryExt, type LocationTreeNode } from '@/db/repositories'

const tree = ref<LocationTreeNode[]>([])
const showAddDialog = ref(false)
const newLocationName = ref('')

async function loadLocations() {
  tree.value = await locationRepositoryExt.getTree()
}

async function addLocation() {
  if (!newLocationName.value.trim()) return
  await locationRepositoryExt.createWithName(newLocationName.value)
  newLocationName.value = ''
  showAddDialog.value = false
  await loadLocations()
}

onMounted(loadLocations)
</script>

<style scoped>
.location-list-page {
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

.add-btn {
  width: 36px;
  height: 36px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.btn-primary {
  margin-top: 16px;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
}

.location-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.location-name {
  font-weight: 500;
  font-size: 16px;
}

.location-children {
  margin-top: 12px;
  padding-left: 20px;
}

.location-child {
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
}

.child-name {
  font-size: 14px;
  color: #666;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 300px;
}

.dialog h3 {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #f0f0f0;
}

.dialog-actions .btn-primary {
  background: #42b883;
  color: white;
  margin-top: 0;
}
</style>

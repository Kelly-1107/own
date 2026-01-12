<template>
  <div class="location-picker">
    <!-- 当前选中位置展示 -->
    <div v-if="modelValue" class="selected-location" @click="openPicker">
      <span class="location-icon">📍</span>
      <span class="location-name">{{ selectedLocationName }}</span>
      <span class="change-btn">更换</span>
    </div>

    <!-- 未选择状态 -->
    <button type="button" v-else class="add-location-btn" @click="openPicker">
      <span>+</span>
      <span>添加位置</span>
    </button>

    <!-- 位置选择弹窗 -->
    <div v-if="showPicker" class="picker-overlay" @click="close">
      <div class="picker-dialog" @click.stop>
        <div class="picker-header">
          <h3>选择位置</h3>
          <button type="button" class="close-btn" @click="close">×</button>
        </div>

        <div class="picker-content">
          <!-- 新建位置 -->
          <div class="new-location">
            <input
              v-model="newLocationName"
              type="text"
              placeholder="新建位置..."
              class="new-input"
              @keyup.enter="createNewLocation"
            />
            <button type="button" class="create-btn" @click="createNewLocation">新建</button>
          </div>

          <!-- 位置列表 -->
          <div class="location-tree">
            <div
              v-for="loc in locationTree"
              :key="loc.id"
              class="location-item"
              :class="{ selected: selectedId === loc.id }"
              @click="selectLocation(loc)"
            >
              <span class="item-name">{{ loc.name }}</span>
              <span v-if="loc.children?.length" class="child-count">
                {{ loc.children.length }} 个子位置
              </span>
            </div>

            <div v-if="locationTree.length === 0" class="empty-tip">
              暂无位置，请新建
            </div>
          </div>
        </div>

        <div class="picker-footer">
          <button type="button" class="cancel-btn" @click="close">取消</button>
          <button type="button" class="confirm-btn" @click="confirm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { locationRepositoryExt, type LocationTreeNode } from '@/db/repositories'

const props = defineProps<{
  modelValue: string | null  // location_id
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const showPicker = ref(false)
const newLocationName = ref('')
const selectedId = ref<string | null>(null)
const locationTree = ref<LocationTreeNode[]>([])

// 显示的名称使用 modelValue
const selectedLocationName = computed(() => {
  if (!props.modelValue) return ''
  return findLocationName(locationTree.value, props.modelValue)
})

function findLocationName(nodes: LocationTreeNode[], id: string): string {
  for (const node of nodes) {
    if (node.id === id) return node.name
    if (node.children?.length) {
      const found = findLocationName(node.children, id)
      if (found) return found
    }
  }
  return ''
}

async function loadLocations() {
  locationTree.value = await locationRepositoryExt.getTree()
}

function openPicker() {
  // 打开时，同步 selectedId
  selectedId.value = props.modelValue
  showPicker.value = true
}

function selectLocation(loc: LocationTreeNode) {
  selectedId.value = loc.id
}

async function createNewLocation() {
  if (!newLocationName.value.trim()) return
  const location = await locationRepositoryExt.createWithName(newLocationName.value)
  selectedId.value = location.id
  newLocationName.value = ''
  await loadLocations()
}

function confirm() {
  emit('update:modelValue', selectedId.value)
  showPicker.value = false
}

function close() {
  showPicker.value = false
}

onMounted(loadLocations)
</script>

<style scoped>
.location-picker {
  width: 100%;
}

.selected-location {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #e8f5e9;
  border-radius: 8px;
  cursor: pointer;
}

.location-icon {
  margin-right: 8px;
}

.location-name {
  flex: 1;
  font-size: 14px;
  color: #2e7d32;
}

.change-btn {
  font-size: 12px;
  color: #666;
}

.add-location-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  background: transparent;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.add-location-btn:hover {
  border-color: #42b883;
  color: #42b883;
}

.picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.picker-dialog {
  background: white;
  border-radius: 12px;
  width: 320px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.picker-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
}

.picker-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.new-location {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.new-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.create-btn {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.location-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.location-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.location-item:hover {
  background: #f5f5f5;
}

.location-item.selected {
  background: #e8f5e9;
  border: 1px solid #42b883;
}

.item-name {
  font-size: 14px;
}

.child-count {
  display: block;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

.picker-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #eee;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn {
  background: #f0f0f0;
}

.confirm-btn {
  background: #42b883;
  color: white;
}
</style>

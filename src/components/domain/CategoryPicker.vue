<template>
  <div class="category-picker">
    <div class="selected-value" @click="showPicker = !showPicker">
      <span v-if="modelValue" class="value-text">{{ modelValue }}</span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <span class="arrow" :class="{ opened: showPicker }">▼</span>
    </div>

    <div v-if="showPicker" class="picker-dropdown">
      <div class="preset-list">
        <button
          v-for="preset in presetCategories"
          :key="preset"
          type="button"
          class="preset-btn"
          :class="{ active: modelValue === preset }"
          @click="selectPreset(preset)"
        >
          {{ preset }}
        </button>
      </div>

      <div class="custom-section">
        <div class="custom-header">自定义</div>
        <div v-if="customCategories.length > 0" class="custom-list">
          <div
            v-for="cat in customCategories"
            :key="cat.id"
            class="custom-item"
          >
            <button
              type="button"
              class="custom-btn"
              :class="{ active: modelValue === cat.name }"
              @click="selectCustom(cat.name)"
            >
              {{ cat.name }}
            </button>
            <button
              type="button"
              class="delete-icon"
              @click.stop="deleteCustomCategory(cat.id)"
            >
              ×
            </button>
          </div>
        </div>
        <div class="add-custom">
          <input
            v-model="newCategory"
            type="text"
            placeholder="新建分类..."
            class="new-input"
            @keydown.enter="addCustomCategory"
          />
          <button
            type="button"
            class="add-btn"
            :disabled="!newCategory.trim()"
            @click="addCustomCategory"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { tagRepository, tagRepositoryExt } from '@/db/repositories'
import type { Tag } from '@/types'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
}>(), {
  placeholder: '请选择分类'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
}>()

// 预设分类
const presetCategories = ['衣物', '食品', '电子产品', '家居', '书籍', '化妆品', '运动', '数码', '其他']

// 自定义分类
const customCategories = ref<Tag[]>([])
const newCategory = ref('')
const showPicker = ref(false)

// 获取自定义分类列表
async function loadCustomCategories() {
  const all = await tagRepository.findAll()
  customCategories.value = all
}

// 添加自定义分类
async function addCustomCategory() {
  const name = newCategory.value.trim()
  if (!name) return

  const tag = await tagRepositoryExt.findOrCreate(name)
  customCategories.value = [...customCategories.value, tag]
  emit('update:modelValue', name)
  newCategory.value = ''
  showPicker.value = false
}

async function deleteCustomCategory(id: string) {
  // 如果删除的是当前选中的分类，清除选中状态
  const cat = customCategories.value.find(c => c.id === id)
  if (cat && props.modelValue === cat.name) {
    emit('update:modelValue', undefined)
  }

  // 从数据库删除
  await tagRepository.delete(id)
  // 从列表移除
  customCategories.value = customCategories.value.filter(c => c.id !== id)
}

function selectPreset(name: string) {
  emit('update:modelValue', name)
  showPicker.value = false
}

function selectCustom(name: string) {
  emit('update:modelValue', name)
  showPicker.value = false
}

// 点击外部关闭
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.category-picker')) {
    showPicker.value = false
  }
}

onMounted(() => {
  loadCustomCategories()
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.category-picker {
  position: relative;
  width: 100%;
}

.selected-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.selected-value:focus {
  outline: none;
  border-color: #42b883;
}

.value-text {
  color: #333;
  font-size: 14px;
}

.placeholder {
  color: #999;
  font-size: 14px;
}

.arrow {
  font-size: 10px;
  color: #999;
  transition: transform 0.2s;
}

.arrow.opened {
  transform: rotate(180deg);
}

.picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.preset-btn,
.custom-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover,
.custom-btn:hover {
  border-color: #42b883;
  color: #42b883;
}

.preset-btn.active,
.custom-btn.active {
  background: #42b883;
  border-color: #42b883;
  color: white;
}

.custom-section {
  padding: 12px;
}

.custom-header {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.custom-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.custom-item {
  display: flex;
  align-items: center;
  gap: 0;
}

.custom-btn {
  border-radius: 12px 0 0 12px;
  padding-right: 6px;
}

.delete-icon {
  width: 20px;
  height: 24px;
  border: none;
  border-radius: 0 12px 12px 0;
  background: transparent;
  color: #bbb;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-icon:hover {
  background: #ff5252;
  color: white;
}

.add-custom {
  display: flex;
  gap: 8px;
}

.new-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}

.new-input:focus {
  outline: none;
  border-color: #42b883;
}

.add-btn {
  padding: 8px 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

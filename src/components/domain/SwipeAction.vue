<template>
  <div
    class="swipe-action"
    :class="{ opened: isOpened }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @click="onClick"
  >
    <div class="swipe-content" :style="{ transform: `translateX(${offsetX}px)` }">
      <slot />
    </div>
    <div class="swipe-actions" :style="{ width: actionsWidth + 'px' }">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  actionsWidth?: number
}>(), {
  actionsWidth: 80
})

const emit = defineEmits<{
  (e: 'open'): void
  (e: 'close'): void
}>()

const isOpened = ref(false)
const startX = ref(0)
const currentX = ref(0)
const isSwiping = ref(false)
const maxOffset = computed(() => -props.actionsWidth)

function onTouchStart(e: TouchEvent) {
  startX.value = e.touches[0].clientX
  currentX.value = 0
  isSwiping.value = true
}

function onTouchMove(e: TouchEvent) {
  const delta = e.touches[0].clientX - startX.value
  currentX.value = delta

  // 限制滑动范围
  if (delta > 0) {
    currentX.value = 0
  } else if (delta < maxOffset.value) {
    currentX.value = maxOffset.value
  }
}

function onTouchEnd(e: TouchEvent) {
  if (!isSwiping.value) return
  isSwiping.value = false

  if (currentX.value < maxOffset.value / 2) {
    // 打开
    currentX.value = maxOffset.value
    isOpened.value = true
    emit('open')
  } else {
    // 关闭
    currentX.value = 0
    isOpened.value = false
    emit('close')
  }
}

function onClick(e: MouseEvent) {
  // 如果滑面板是打开状态，阻止点击穿透到内容区域
  if (isOpened.value) {
    e.stopPropagation()
    e.preventDefault()
  }
}

function close() {
  currentX.value = 0
  isOpened.value = false
  emit('close')
}

// 暴露 close 方法给父组件
defineExpose({ close })

const offsetX = computed(() => currentX.value)
</script>

<style scoped>
.swipe-action {
  position: relative;
  overflow: hidden;
  user-select: none;
}

.swipe-content {
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.swipe-actions {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  transform: translateX(100%);
}

.swipe-action.opened .swipe-content {
  transform: translateX(-80px);
}

.swipe-action.opened .swipe-actions {
  transform: translateX(0);
}
</style>

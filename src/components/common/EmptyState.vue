<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <div class="empty-message">{{ message }}</div>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  message?: string
}>(), {
  icon: '📭',
  message: '暂无数据'
})
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-message {
  color: #999;
  font-size: 14px;
}
</style>

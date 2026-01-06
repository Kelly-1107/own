<template>
  <button :class="['base-button', `type-${type}`, { disabled }]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>(), {
  type: 'primary',
  disabled: false
})
</script>

<style scoped>
.base-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.base-button:active {
  opacity: 0.8;
}

.base-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.type-primary {
  background: #42b883;
  color: white;
}

.type-secondary {
  background: #f0f0f0;
  color: #333;
}

.type-danger {
  background: #ff5252;
  color: white;
}
</style>

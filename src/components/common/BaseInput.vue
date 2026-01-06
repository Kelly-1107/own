<template>
  <div class="base-input-wrapper">
    <label v-if="label" class="base-input-label">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :type="type"
      class="base-input"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.base-input-wrapper {
  margin-bottom: 16px;
}

.base-input-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.base-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.base-input:focus {
  outline: none;
  border-color: #42b883;
}
</style>

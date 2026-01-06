<template>
  <div class="item-form-page">
    <header class="page-header">
      <router-link to="/items" class="back-link">←</router-link>
      <h1>添加物品</h1>
      <button class="save-btn" @click="save">保存</button>
    </header>

    <form class="form-container" @submit.prevent="save">
      <div class="form-group">
        <label>名称 *</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="物品名称"
          required
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label>别名</label>
        <input
          v-model="form.alias"
          type="text"
          placeholder="其他名称/昵称"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label>分类</label>
        <input
          v-model="form.category"
          type="text"
          placeholder="如：衣物、食品、电子产品"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label>状态</label>
        <select v-model="form.status" class="form-input">
          <option value="using">在用</option>
          <option value="idle">闲置</option>
          <option value="consumed">已消耗</option>
          <option value="discarded">已丢弃</option>
        </select>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { itemRepositoryExt } from '@/db/repositories'
import type { Item } from '@/types'

const router = useRouter()

const form = reactive({
  name: '',
  alias: '',
  category: '',
  status: 'using' as Item['status']
})

async function save() {
  if (!form.name.trim()) return

  await itemRepositoryExt.createWithName(form.name)
  router.push('/items')
}
</script>

<style scoped>
.item-form-page {
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

.save-btn {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #42b883;
}
</style>

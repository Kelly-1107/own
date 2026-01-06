import { getDB } from './index'

// 生成唯一 ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// 简化版仓库操作
export const baseRepository = {
  async get(storeName: string, id: string) {
    return (await getDB()).get(storeName as any, id)
  },

  async getAll(storeName: string) {
    return (await getDB()).getAll(storeName as any)
  },

  async put(storeName: string, value: { id: string }) {
    await (await getDB()).put(storeName as any, value)
    return value.id
  },

  async delete(storeName: string, id: string) {
    await (await getDB()).delete(storeName as any, id)
  },

  async count(storeName: string) {
    return (await getDB()).count(storeName as any)
  }
}

import type { ItemLocationHistory } from '@/types'
import { baseRepository, generateId } from '../baseRepository'

// 基础 CRUD
export const itemLocationRepository = {
  async findById(id: string) {
    return baseRepository.get('item_location_histories', id) as Promise<ItemLocationHistory | undefined>
  },

  async findAll() {
    return baseRepository.getAll('item_location_histories') as Promise<ItemLocationHistory[]>
  },

  async create(data: ItemLocationHistory) {
    return baseRepository.put('item_location_histories', data)
  },

  async update(id: string, data: Partial<ItemLocationHistory>) {
    const existing = await this.findById(id)
    if (!existing) throw new Error(`ItemLocationHistory not found: ${id}`)
    const updated = { ...existing, ...data }
    await baseRepository.put('item_location_histories', updated as ItemLocationHistory)
  },

  async delete(id: string) {
    await baseRepository.delete('item_location_histories', id)
  },

  async count() {
    return baseRepository.count('item_location_histories')
  }
}

// 扩展方法
export const itemLocationRepositoryExt = {
  ...itemLocationRepository,

  async findByItem(itemId: string): Promise<ItemLocationHistory[]> {
    const all = await itemLocationRepository.findAll()
    return all.filter(h => h.item_id === itemId).sort((a, b) => b.started_at - a.started_at)
  },

  async findCurrentByItem(itemId: string): Promise<ItemLocationHistory | undefined> {
    const history = await this.findByItem(itemId)
    return history.find(h => !h.ended_at)
  },

  async findByLocation(locationId: string): Promise<ItemLocationHistory[]> {
    const all = await itemLocationRepository.findAll()
    return all.filter(h => h.location_id === locationId)
  },

  async assignLocation(
    itemId: string,
    locationId: string
  ): Promise<ItemLocationHistory> {
    const now = Date.now()

    // 先结束该物品之前的当前位置（如果有）
    const current = await this.findCurrentByItem(itemId)
    if (current) {
      await itemLocationRepository.update(current.id, { ended_at: now })
    }

    // 创建新的位置记录
    const history: ItemLocationHistory = {
      id: generateId(),
      item_id: itemId,
      location_id: locationId,
      started_at: now,
      created_at: now
    }
    await itemLocationRepository.create(history)
    return history
  },

  async removeLocation(itemId: string): Promise<void> {
    const current = await this.findCurrentByItem(itemId)
    if (current) {
      await itemLocationRepository.update(current.id, { ended_at: Date.now() })
    }
  }
}

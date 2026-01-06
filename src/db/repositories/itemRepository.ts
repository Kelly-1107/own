import type { Item } from '@/types'
import { baseRepository, generateId } from '../baseRepository'

// 基础 CRUD
export const itemRepository = {
  async findById(id: string) {
    return baseRepository.get('items', id) as Promise<Item | undefined>
  },

  async findAll() {
    return baseRepository.getAll('items') as Promise<Item[]>
  },

  async create(data: Item) {
    return baseRepository.put('items', data)
  },

  async update(id: string, data: Partial<Item>) {
    const existing = await this.findById(id)
    if (!existing) throw new Error(`Item not found: ${id}`)
    const updated = { ...existing, ...data }
    await baseRepository.put('items', updated as Item)
  },

  async delete(id: string) {
    await baseRepository.delete('items', id)
  },

  async count() {
    return baseRepository.count('items')
  }
}

// 扩展方法
export const itemRepositoryExt = {
  ...itemRepository,

  async findByName(keyword: string): Promise<Item[]> {
    const all = await itemRepository.findAll()
    const lower = keyword.toLowerCase()
    return all.filter(item =>
      item.name.toLowerCase().includes(lower) ||
      item.alias?.toLowerCase().includes(lower)
    )
  },

  async findByStatus(status: Item['status']): Promise<Item[]> {
    const all = await itemRepository.findAll()
    return all.filter(item => item.status === status)
  },

  async createWithName(name: string): Promise<Item> {
    const now = Date.now()
    const item: Item = {
      id: generateId(),
      name,
      status: 'using',
      created_at: now,
      updated_at: now
    }
    await itemRepository.create(item)
    return item
  }
}

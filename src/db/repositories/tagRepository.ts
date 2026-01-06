import type { Tag } from '@/types'
import { baseRepository, generateId } from '../baseRepository'

// 基础 CRUD
export const tagRepository = {
  async findById(id: string) {
    return baseRepository.get('tags', id) as Promise<Tag | undefined>
  },

  async findAll() {
    return baseRepository.getAll('tags') as Promise<Tag[]>
  },

  async create(data: Tag) {
    return baseRepository.put('tags', data)
  },

  async delete(id: string) {
    await baseRepository.delete('tags', id)
  },

  async count() {
    return baseRepository.count('tags')
  }
}

// 扩展方法
export const tagRepositoryExt = {
  ...tagRepository,

  async findByName(name: string): Promise<Tag | undefined> {
    const all = await tagRepository.findAll()
    return all.find(t => t.name === name)
  },

  async findOrCreate(name: string): Promise<Tag> {
    const existing = await this.findByName(name)
    if (existing) return existing

    const now = Date.now()
    const tag: Tag = {
      id: generateId(),
      name,
      created_at: now
    }
    await tagRepository.create(tag)
    return tag
  }
}

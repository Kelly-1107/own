import type { Experience } from '@/types'
import { baseRepository, generateId } from '../baseRepository'

// 基础 CRUD
export const experienceRepository = {
  async findById(id: string) {
    return baseRepository.get('experiences', id) as Promise<Experience | undefined>
  },

  async findAll() {
    return baseRepository.getAll('experiences') as Promise<Experience[]>
  },

  async create(data: Experience) {
    return baseRepository.put('experiences', data)
  },

  async delete(id: string) {
    await baseRepository.delete('experiences', id)
  },

  async count() {
    return baseRepository.count('experiences')
  }
}

// 扩展方法
export const experienceRepositoryExt = {
  ...experienceRepository,

  async findByItem(itemId: string): Promise<Experience[]> {
    const all = await experienceRepository.findAll()
    return all.filter(exp => exp.item_id === itemId)
  },

  async findByEvent(eventId: string): Promise<Experience[]> {
    const all = await experienceRepository.findAll()
    return all.filter(exp => exp.event_id === eventId)
  },

  async createWithData(data: Omit<Experience, 'id' | 'created_at'>): Promise<Experience> {
    const now = Date.now()
    const experience: Experience = {
      ...data,
      id: generateId(),
      created_at: now
    }
    await experienceRepository.create(experience)
    return experience
  }
}

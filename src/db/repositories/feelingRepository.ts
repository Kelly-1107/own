import type { Feeling } from '@/types'
import { baseRepository, generateId } from '../baseRepository'

// 基础 CRUD
export const feelingRepository = {
  async findById(id: string) {
    return baseRepository.get('feelings', id) as Promise<Feeling | undefined>
  },

  async findAll() {
    return baseRepository.getAll('feelings') as Promise<Feeling[]>
  },

  async create(data: Feeling) {
    return baseRepository.put('feelings', data)
  },

  async delete(id: string) {
    await baseRepository.delete('feelings', id)
  },

  async count() {
    return baseRepository.count('feelings')
  }
}

// 扩展方法
export const feelingRepositoryExt = {
  ...feelingRepository,

  async findByExperience(experienceId: string): Promise<Feeling[]> {
    const all = await feelingRepository.findAll()
    return all.filter(f => f.experience_id === experienceId)
  },

  async findByEvent(eventId: string): Promise<Feeling[]> {
    const all = await feelingRepository.findAll()
    return all.filter(f => f.event_id === eventId)
  },

  async createWithContent(content: string, experienceId?: string, eventId?: string): Promise<Feeling> {
    const now = Date.now()
    const feeling: Feeling = {
      id: generateId(),
      experience_id: experienceId,
      event_id: eventId,
      content,
      created_at: now
    }
    await feelingRepository.create(feeling)
    return feeling
  }
}

import type { Event } from '@/types'
import { baseRepository, generateId } from '../baseRepository'

// 基础 CRUD
export const eventRepository = {
  async findById(id: string) {
    return baseRepository.get('events', id) as Promise<Event | undefined>
  },

  async findAll() {
    return baseRepository.getAll('events') as Promise<Event[]>
  },

  async create(data: Event) {
    return baseRepository.put('events', data)
  },

  async delete(id: string) {
    await baseRepository.delete('events', id)
  },

  async count() {
    return baseRepository.count('events')
  }
}

// 扩展方法
export const eventRepositoryExt = {
  ...eventRepository,

  async createWithTitle(title: string, occurredAt?: number): Promise<Event> {
    const now = Date.now()
    const event: Event = {
      id: generateId(),
      title,
      occurred_at: occurredAt || now,
      created_at: now
    }
    await eventRepository.create(event)
    return event
  }
}

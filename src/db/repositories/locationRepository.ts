import type { Location } from '@/types'
import { baseRepository, generateId } from '../baseRepository'

// 基础 CRUD
export const locationRepository = {
  async findById(id: string) {
    return baseRepository.get('locations', id) as Promise<Location | undefined>
  },

  async findAll() {
    return baseRepository.getAll('locations') as Promise<Location[]>
  },

  async create(data: Location) {
    return baseRepository.put('locations', data)
  },

  async delete(id: string) {
    await baseRepository.delete('locations', id)
  },

  async count() {
    return baseRepository.count('locations')
  }
}

// 扩展方法
export const locationRepositoryExt = {
  ...locationRepository,

  async findRoots(): Promise<Location[]> {
    const all = await locationRepository.findAll()
    return all.filter(loc => !loc.parent_id)
  },

  async findChildren(parentId: string): Promise<Location[]> {
    const all = await locationRepository.findAll()
    return all.filter(loc => loc.parent_id === parentId)
  },

  async createWithName(name: string, parentId?: string): Promise<Location> {
    const now = Date.now()
    const location: Location = {
      id: generateId(),
      name,
      parent_id: parentId,
      created_at: now
    }
    await locationRepository.create(location)
    return location
  },

  async getTree(): Promise<LocationTreeNode[]> {
    const all = await locationRepository.findAll()
    const roots = all.filter(loc => !loc.parent_id)

    function buildNode(loc: Location): LocationTreeNode {
      const children = all.filter(c => c.parent_id === loc.id)
      return {
        ...loc,
        children: children.map(buildNode)
      }
    }

    return roots.map(buildNode)
  }
}

export interface LocationTreeNode extends Location {
  children: LocationTreeNode[]
}

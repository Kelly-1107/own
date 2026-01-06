import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { MemoryDB } from './schema'

let dbInstance: IDBPDatabase<MemoryDB> | null = null

export async function initDB(): Promise<IDBPDatabase<MemoryDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<MemoryDB>('memory-assistant-db', 1, {
    upgrade(db) {
      // Items
      if (!db.objectStoreNames.contains('items')) {
        const itemStore = db.createObjectStore('items', { keyPath: 'id' })
        itemStore.createIndex('by-name', 'name')
        itemStore.createIndex('by-status', 'status')
        itemStore.createIndex('by-created', 'created_at')
      }

      // Locations
      if (!db.objectStoreNames.contains('locations')) {
        const locationStore = db.createObjectStore('locations', { keyPath: 'id' })
        locationStore.createIndex('by-parent', 'parent_id')
        locationStore.createIndex('by-created', 'created_at')
      }

      // Experiences
      if (!db.objectStoreNames.contains('experiences')) {
        const expStore = db.createObjectStore('experiences', { keyPath: 'id' })
        expStore.createIndex('by-item', 'item_id')
        expStore.createIndex('by-event', 'event_id')
        expStore.createIndex('by-occurred', 'occurred_at')
        expStore.createIndex('by-created', 'created_at')
      }

      // Feelings
      if (!db.objectStoreNames.contains('feelings')) {
        const feelingStore = db.createObjectStore('feelings', { keyPath: 'id' })
        feelingStore.createIndex('by-experience', 'experience_id')
        feelingStore.createIndex('by-event', 'event_id')
        feelingStore.createIndex('by-created', 'created_at')
      }

      // Events
      if (!db.objectStoreNames.contains('events')) {
        const eventStore = db.createObjectStore('events', { keyPath: 'id' })
        eventStore.createIndex('by-occurred', 'occurred_at')
        eventStore.createIndex('by-created', 'created_at')
      }

      // Tags
      if (!db.objectStoreNames.contains('tags')) {
        const tagStore = db.createObjectStore('tags', { keyPath: 'id' })
        tagStore.createIndex('by-name', 'name')
        tagStore.createIndex('by-created', 'created_at')
      }

      // Item Tags
      if (!db.objectStoreNames.contains('item_tags')) {
        db.createObjectStore('item_tags', { keyPath: ['item_id', 'tag_id'] })
      }

      // Experience Tags
      if (!db.objectStoreNames.contains('experience_tags')) {
        db.createObjectStore('experience_tags', { keyPath: ['experience_id', 'tag_id'] })
      }
    }
  })

  return dbInstance
}

export function getDB(): IDBPDatabase<MemoryDB> {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDB() first.')
  }
  return dbInstance
}

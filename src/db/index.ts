import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { MemoryDB } from './schema'

const DB_NAME = 'memory-assistant-db'
let dbInstance: IDBPDatabase<MemoryDB> | null = null

// 强制删除数据库（用于迁移）
function deleteDatabase(): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onsuccess = () => resolve()
    request.onerror = () => resolve()
    request.onblocked = () => resolve() // 即使 blocked 也继续
  })
}

// 获取数据库当前版本
function getDBVersionSync(): number {
  // 返回 -1 表示未知
  return -1
}

export async function initDB(): Promise<IDBPDatabase<MemoryDB>> {
  if (dbInstance) return dbInstance

  // 检查是否需要重建数据库（版本 < 2 或结构不完整）
  let needRebuild = false
  try {
    const testDB = await openDB(DB_NAME, 1, {
      upgrade(db) {
        // 什么也不做，只是测试
      }
    })

    // 检查必需的表是否存在
    const requiredStores = [
      'items',
      'locations',
      'experiences',
      'feelings',
      'events',
      'tags',
      'item_tags',
      'experience_tags',
      'item_location_histories'
    ]

    for (const store of requiredStores) {
      if (!testDB.objectStoreNames.contains(store)) {
        needRebuild = true
        break
      }
    }
    testDB.close()
  } catch {
    // 如果打开失败（版本太旧），需要重建
    needRebuild = true
  }

  // 如果需要重建，先删除旧数据库
  if (needRebuild) {
    await deleteDatabase()
    // 等待一下确保删除完成
    await new Promise(r => setTimeout(r, 100))
  }

  // 打开或创建数据库
  dbInstance = await openDB<MemoryDB>(DB_NAME, 2, {
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

      // Item Location Histories
      if (!db.objectStoreNames.contains('item_location_histories')) {
        const historyStore = db.createObjectStore('item_location_histories', { keyPath: 'id' })
        historyStore.createIndex('by-item', 'item_id')
        historyStore.createIndex('by-location', 'location_id')
        historyStore.createIndex('by-started', 'started_at')
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

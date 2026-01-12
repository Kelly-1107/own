import type { DBSchema } from 'idb'
import type { Item, Location, Experience, Feeling, Event, Tag, ItemLocationHistory } from '@/types'

export interface MemoryDB extends DBSchema {
  items: {
    key: string
    value: Item
    indexes: {
      'by-name': string
      'by-status': string
      'by-created': number
    }
  }
  locations: {
    key: string
    value: Location
    indexes: {
      'by-parent': string
      'by-created': number
    }
  }
  experiences: {
    key: string
    value: Experience
    indexes: {
      'by-item': string
      'by-event': string
      'by-occurred': number
      'by-created': number
    }
  }
  feelings: {
    key: string
    value: Feeling
    indexes: {
      'by-experience': string
      'by-event': string
      'by-created': number
    }
  }
  events: {
    key: string
    value: Event
    indexes: {
      'by-occurred': number
      'by-created': number
    }
  }
  tags: {
    key: string
    value: Tag
    indexes: {
      'by-name': string
      'by-created': number
    }
  }
  item_tags: {
    key: [string, string] // [item_id, tag_id]
    value: { item_id: string; tag_id: string }
  }
  experience_tags: {
    key: [string, string] // [experience_id, tag_id]
    value: { experience_id: string; tag_id: string }
  }
  item_location_histories: {
    key: string
    value: ItemLocationHistory
    indexes: {
      'by-item': string
      'by-location': string
      'by-started': number
    }
  }
}

export const DB_NAME = 'memory-assistant-db'
export const DB_VERSION = 1

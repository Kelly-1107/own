import type { Item, Location, Experience, Feeling, Event, Tag } from './entity'

// Item 相关 DTO
export interface CreateItemDTO {
  name: string
  alias?: string
  category?: string
  status?: Item['status']
  location_id?: string
}

export interface UpdateItemDTO extends Partial<CreateItemDTO> {
  id: string
}

// Location 相关 DTO
export interface CreateLocationDTO {
  name: string
  parent_id?: string
}

// Experience 相关 DTO
export interface CreateExperienceDTO {
  title?: string
  item_id?: string
  event_id?: string
  occurred_at: number
  note?: string
}

// Feeling 相关 DTO
export interface CreateFeelingDTO {
  experience_id?: string
  event_id?: string
  content: string
}

// Event 相关 DTO
export interface CreateEventDTO {
  title: string
  occurred_at: number
  note?: string
}

// Tag 相关 DTO
export interface CreateTagDTO {
  name: string
}

// 查询相关
export interface ItemQuery {
  keyword?: string
  status?: Item['status']
  location_id?: string
  tag_id?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
}

// Item（物品）
export interface Item {
  id: string
  name: string
  alias?: string           // 别名
  category?: string        // 分类
  status: ItemStatus
  created_at: number
  updated_at: number
}

export type ItemStatus = 'using' | 'idle' | 'consumed' | 'discarded'

// Location（位置）
export interface Location {
  id: string
  name: string
  parent_id?: string       // 父级位置，支持层级结构
  created_at: number
}

// Experience（体验/使用记录）
export interface Experience {
  id: string
  title?: string           // 体验标题
  item_id?: string         // 关联的物品
  event_id?: string        // 关联的事件
  occurred_at: number      // 发生时间
  note?: string            // 简述
  created_at: number
}

// Feeling（感受/情绪）
export interface Feeling {
  id: string
  experience_id?: string   // 关联的体验
  event_id?: string        // 关联的事件
  content: string          // 感受内容
  created_at: number
}

// Event（事件）
export interface Event {
  id: string
  title: string            // 事件简述
  occurred_at: number      // 发生时间
  note?: string            // 备注
  created_at: number
}

// Tag（标签）
export interface Tag {
  id: string
  name: string
  created_at: number
}

// 关联表
export interface ItemTag {
  item_id: string
  tag_id: string
}

export interface ExperienceTag {
  experience_id: string
  tag_id: string
}

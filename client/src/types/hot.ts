export interface HotItem {
  rank: number
  title: string
  url: string
  heat?: number
  platform: HotPlatform
  isTop?: boolean
  isNew?: boolean
  label?: string
}

export type HotPlatform = 'weibo' | 'zhihu' | 'bilibili' | 'baidu' | 'github' | 'huggingface'

export interface HotListResponse {
  code: number
  message: string
  data: HotItem[]
}

export interface AggregatedHotData {
  weibo?: HotItem[]
  zhihu?: HotItem[]
  bilibili?: HotItem[]
  baidu?: HotItem[]
  github?: HotItem[]
  huggingface?: HotItem[]
}

export interface HotCardProps {
  platform: HotPlatform
  sourceName: string
  listName: string
  items?: HotItem[]
  updatedAt?: Date
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}
import type { HotPlatform, HotItem } from '../types/hot'

interface ApiResponse {
  error: boolean
  items: HotItem[]
  message: string
  updatedAt?: string
}

interface PlatformData {
  source: HotPlatform
  error: boolean
  items: HotItem[]
  message: string
  updatedAt: string
}

interface AggregatedResponse {
  code: number
  message: string
  data: {
    platforms: PlatformData[]
  }
  updatedAt?: string
}

const BASE_URL = import.meta.env.VITE_API_BASE || ''

async function fetchHotPlatform(source: HotPlatform): Promise<HotItem[]> {
  const url = `${BASE_URL}/api/hot/${source}`
  const response = await fetch(url)
  const result: ApiResponse = await response.json()

  if (result.error) {
    throw new Error(result.message || 'Failed to fetch hot data')
  }

  return result.items
}

async function fetchAllHot(): Promise<Record<HotPlatform, HotItem[]>> {
  const url = `${BASE_URL}/api/hot`
  const response = await fetch(url)
  const result: AggregatedResponse = await response.json()

  if (result.code !== 0) {
    throw new Error(result.message || 'Failed to fetch all hot data')
  }

  const aggregated: Record<HotPlatform, HotItem[]> = {} as Record<HotPlatform, HotItem[]>
  result.data.platforms.forEach(platformData => {
    aggregated[platformData.source] = platformData.items || []
  })

  return aggregated
}

export { fetchHotPlatform, fetchAllHot }
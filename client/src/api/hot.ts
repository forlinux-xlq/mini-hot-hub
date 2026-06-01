import type { HotPlatform, HotItem } from '../types/hot'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
  updatedAt?: string
}

interface PlatformData {
  source: HotPlatform
  data: HotItem[]
  updatedAt: string
}

const BASE_URL = import.meta.env.VITE_API_BASE || ''

async function fetchHotPlatform(source: HotPlatform): Promise<HotItem[]> {
  const url = `${BASE_URL}/api/hot/${source}`
  const response = await fetch(url)
  const result: ApiResponse<HotItem[]> = await response.json()

  if (result.code !== 0) {
    throw new Error(result.message || 'Failed to fetch hot data')
  }

  return result.data
}

async function fetchAllHot(): Promise<Record<HotPlatform, HotItem[]>> {
  const url = `${BASE_URL}/api/hot`
  const response = await fetch(url)
  const result: ApiResponse<{ platforms: PlatformData[] }> = await response.json()

  if (result.code !== 0) {
    throw new Error(result.message || 'Failed to fetch all hot data')
  }

  const aggregated: Record<HotPlatform, HotItem[]> = {} as Record<HotPlatform, HotItem[]>
  result.data.platforms.forEach(platformData => {
    aggregated[platformData.source] = platformData.data
  })

  return aggregated
}

export { fetchHotPlatform, fetchAllHot }
import { useState, useEffect } from 'react'
import type { AggregatedHotData, HotPlatform } from '../types/hot'
import { fetchAllHot } from '../api/hot'

interface UseHotListResult {
  data: AggregatedHotData | null
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  refresh: () => void
}

export function useHotList(): UseHotListResult {
  const [data, setData] = useState<AggregatedHotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const allData = await fetchAllHot()
      setData(allData)
      setLastUpdate(new Date())
    } catch (err) {
      setError('获取热榜数据失败')
      console.error('Failed to fetch hot list:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refresh = () => {
    fetchData()
  }

  return {
    data,
    loading,
    error,
    lastUpdate,
    refresh
  }
}

export interface PlatformState {
  loading: boolean
  error: string | null
  data: AggregatedHotData[HotPlatform] | undefined
}

export function usePlatformHotList(platform: HotPlatform): PlatformState {
  const { data, loading, error } = useHotList()
  
  return {
    loading,
    error,
    data: data?.[platform]
  }
}
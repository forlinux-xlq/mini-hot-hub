import { useState, useEffect, useRef } from 'react'
import type { AggregatedHotData, HotPlatform } from '../types/hot'
import { fetchAllHot } from '../api/hot'

const AUTO_REFRESH_INTERVAL = 60000

interface UseHotListResult {
  data: AggregatedHotData | null
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  refresh: () => void
  timeUntilRefresh: number
}

export function useHotList(): UseHotListResult {
  const [data, setData] = useState<AggregatedHotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(AUTO_REFRESH_INTERVAL)
  const refreshTimerRef = useRef<number | null>(null)
  const countdownTimerRef = useRef<number | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const allData = await fetchAllHot()
      setData(allData)
      setLastUpdate(new Date())
      setTimeUntilRefresh(AUTO_REFRESH_INTERVAL)
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

  useEffect(() => {
    refreshTimerRef.current = window.setInterval(() => {
      fetchData()
    }, AUTO_REFRESH_INTERVAL)

    countdownTimerRef.current = window.setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1000) {
          return AUTO_REFRESH_INTERVAL
        }
        return prev - 1000
      })
    }, 1000)

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }
    }
  }, [])

  const refresh = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current)
    }
    fetchData()
    refreshTimerRef.current = window.setInterval(() => {
      fetchData()
    }, AUTO_REFRESH_INTERVAL)
  }

  return {
    data,
    loading,
    error,
    lastUpdate,
    refresh,
    timeUntilRefresh
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
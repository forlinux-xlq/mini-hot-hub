import { useState, useEffect } from 'react'
import HotCard from '../components/HotCard'
import { useHotList } from '../hooks/useHotList'
import type { HotPlatform } from '../types/hot'

interface PlatformConfig {
  sourceName: string
  listName: string
}

const PLATFORM_CONFIGS: Record<HotPlatform, PlatformConfig> = {
  weibo: { sourceName: '微博', listName: '热搜榜' },
  zhihu: { sourceName: '知乎', listName: '热榜' },
  bilibili: { sourceName: 'B站', listName: '热门榜' },
  baidu: { sourceName: '百度', listName: '热搜榜' },
  github: { sourceName: 'GitHub', listName: 'Trending' },
  huggingface: { sourceName: 'Hugging Face', listName: '热门模型' }
}

function Home() {
  const { data, loading, error, lastUpdate, refresh } = useHotList()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCurrentTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    })
  }

  const formatDate = (date: Date) => {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`
  }

  const formatLastUpdate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">迷你今日热榜</h1>
          <p className="subtitle">实时追踪全网热点</p>
        </div>
        {!loading && (
          <button className="refresh-btn" onClick={refresh}>
            🔄 刷新
          </button>
        )}
      </header>

      <div className="time-bar">
        <div className="time-left">
          <div className="current-time">{formatCurrentTime(currentTime)}</div>
          <div className="current-date">{formatDate(currentTime)}</div>
        </div>
        <div className="time-right">
          <div className="update-info">
            <span className="update-label">最后更新：</span>
            <span className="update-value">{lastUpdate ? formatLastUpdate(lastUpdate) : '--'}</span>
          </div>
          <div className="auto-refresh">
            <span className="refresh-label">自动刷新：</span>
            <div className="refresh-progress">
              <div className="refresh-bar"></div>
            </div>
          </div>
        </div>
      </div>

      <main className="main">
        {loading ? (
          <div className="global-loading">
            <div className="loading-spinner"></div>
            <span className="loading-text">加载热榜数据中...</span>
          </div>
        ) : error ? (
          <div className="global-error">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={refresh}>
              点击重试
            </button>
          </div>
        ) : (
          <div className="hot-grid">
            {(Object.keys(PLATFORM_CONFIGS) as HotPlatform[]).map((platform) => {
              const config = PLATFORM_CONFIGS[platform]
              const items = data?.[platform]
              return (
                <HotCard
                  key={platform}
                  platform={platform}
                  sourceName={config.sourceName}
                  listName={config.listName}
                  items={items}
                  updatedAt={lastUpdate || undefined}
                />
              )
            })}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 迷你今日热榜 · 学习项目，数据来自第三方平台 · 非商用</p>
        <p>本项目仅供学习交流使用，不涉及任何商业用途</p>
      </footer>
    </div>
  )
}

export default Home
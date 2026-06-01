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
  bilibili: { sourceName: 'B站', listName: '热门榜' }
}

function Home() {
  const { data, loading, error, lastUpdate, refresh } = useHotList()

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">迷你今日热榜</h1>
          <p className="subtitle">轻量、可自托管的多平台热搜聚合网站</p>
        </div>
        {!loading && (
          <button className="refresh-btn" onClick={refresh}>
            🔄 刷新
          </button>
        )}
      </header>

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
        <p className="update-time">
          最后更新：{lastUpdate ? lastUpdate.toLocaleString('zh-CN') : '未知'}
        </p>
      </footer>
    </div>
  )
}

export default Home

import type { HotCardProps as HotCardPropsType } from '../types/hot'

const PLATFORM_ICONS: Record<string, string> = {
  weibo: '🔥',
  zhihu: '💡',
  bilibili: '📺'
}

function HotCard({ platform, sourceName, listName, items, updatedAt, loading, error, onRetry }: HotCardPropsType) {
  const formatHeat = (heat: number): string => {
    if (heat >= 10000) {
      return `${(heat / 10000).toFixed(1)}万`
    }
    return heat.toString()
  }

  const formatUpdatedAt = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return '更新于刚刚'
    if (minutes < 60) return `更新于 ${minutes} 分钟前`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `更新于 ${hours} 小时前`
    const days = Math.floor(hours / 24)
    return `更新于 ${days} 天前`
  }

  const renderLoading = () => (
    <div className="hot-card loading-card">
      <div className="card-header">
        <span className="icon">{PLATFORM_ICONS[platform]}</span>
        <div className="header-titles">
          <h2 className="source-name">{sourceName}</h2>
          <p className="list-name">{listName}</p>
        </div>
      </div>
      <div className="loading-content">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-item">
            <div className="skeleton-rank"></div>
            <div className="skeleton-title"></div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderError = () => (
    <div className="hot-card error-card">
      <div className="card-header">
        <span className="icon">{PLATFORM_ICONS[platform]}</span>
        <div className="header-titles">
          <h2 className="source-name">{sourceName}</h2>
          <p className="list-name">{listName}</p>
        </div>
      </div>
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error || '暂时无法获取，请稍后重试'}</p>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            点击重试
          </button>
        )}
      </div>
    </div>
  )

  const renderEmpty = () => (
    <div className="hot-card empty-card">
      <div className="card-header">
        <span className="icon">{PLATFORM_ICONS[platform]}</span>
        <div className="header-titles">
          <h2 className="source-name">{sourceName}</h2>
          <p className="list-name">{listName}</p>
        </div>
      </div>
      <div className="empty-content">
        <span className="empty-icon">📭</span>
        <p className="empty-message">暂无数据</p>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="hot-card">
      <div className="card-header">
        <span className="icon">{PLATFORM_ICONS[platform]}</span>
        <div className="header-titles">
          <h2 className="source-name">{sourceName}</h2>
          <p className="list-name">{listName}</p>
        </div>
      </div>
      <ul className="hot-list">
        {items?.map((item) => {
          const isTop = item.rank <= 3
          const isTop1 = item.rank === 1
          return (
            <li 
              key={item.rank} 
              className={`hot-item ${isTop ? 'top-item' : ''} ${isTop1 ? 'top-1-item' : ''}`}
            >
              <span className={`rank ${isTop ? `top-${item.rank}` : ''}`}>
                {item.rank}
              </span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hot-link">
                {item.title}
              </a>
              {item.heat !== undefined && (
                <span className="heat">{formatHeat(item.heat)}</span>
              )}
            </li>
          )
        })}
      </ul>
      {updatedAt && (
        <div className="card-footer">
          <span className="updated-at">{formatUpdatedAt(updatedAt)}</span>
        </div>
      )}
    </div>
  )

  if (loading) return renderLoading()
  if (error) return renderError()
  if (!items || items.length === 0) return renderEmpty()
  return renderSuccess()
}

export default HotCard

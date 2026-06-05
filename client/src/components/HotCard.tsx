import type { HotCardProps as HotCardPropsType } from '../types/hot'

const PLATFORM_ICONS: Record<string, string> = {
  weibo: '🔥',
  zhihu: '💡',
  bilibili: '📺',
  baidu: '🔍',
  github: '💻',
  huggingface: '🤗'
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
    <div className={`hot-card loading-card ${platform}`}>
      <div className={`card-header ${platform}`}>
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
    <div className={`hot-card error-card ${platform}`}>
      <div className={`card-header ${platform}`}>
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
    <div className={`hot-card empty-card ${platform}`}>
      <div className={`card-header ${platform}`}>
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

  const renderSuccess = () => {
    const topItems = items?.filter(item => item.isTop) || []
    const normalItems = items?.filter(item => !item.isTop) || []

    return (
      <div className={`hot-card ${platform}`}>
        <div className={`card-header ${platform}`}>
          <span className="icon">{PLATFORM_ICONS[platform]}</span>
          <div className="header-titles">
            <h2 className="source-name">{sourceName}</h2>
            <p className="list-name">{listName}</p>
          </div>
        </div>
        <ul className="hot-list">
          {topItems.map((item, index) => (
            <li key={`top-${index}`} className="hot-item top-item">
              <span className="rank top-tag">
                <span className="tag-icon">📌</span>
                <span className="tag-text">{item.label || '置顶'}</span>
              </span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hot-link top-link">
                {item.title}
              </a>
              {item.heat !== undefined && (
                <span className="heat top-heat">{formatHeat(item.heat)}</span>
              )}
            </li>
          ))}
          {normalItems.map((item) => {
            const isTopRank = item.rank <= 3
            return (
              <li 
                key={item.rank} 
                className={`hot-item ${isTopRank ? 'top-rank-item' : ''}`}
              >
                <span className={`rank-container ${isTopRank ? `top-${item.rank}` : ''}`}>
                  {isTopRank && (
                    <span className="flame-icon">🔥</span>
                  )}
                  <span className={`rank ${isTopRank ? `top-${item.rank}` : ''}`}>
                    {item.rank}
                  </span>
                </span>
                <div className="content-area">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hot-link">
                    {item.title}
                  </a>
                  {item.isNew && (
                    <span className="label new">新</span>
                  )}
                  {item.label && !item.isNew && (
                    <span className="label hot">{item.label}</span>
                  )}
                </div>
                {item.heat !== undefined && item.heat > 0 && (
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
  }

  if (loading) return renderLoading()
  if (error) return renderError()
  if (!items || items.length === 0) return renderEmpty()
  return renderSuccess()
}

export default HotCard
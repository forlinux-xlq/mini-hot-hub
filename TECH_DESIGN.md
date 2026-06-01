# 今日热搜 · 技术设计文档

> **文档版本**：v1.0
> **更新日期**：2026-05-29

---

## 一、技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React 18 + TypeScript + Vite | 快速启动，类型安全 |
| 样式 | CSS Modules（可选 Tailwind） | 不强制 UI 库，保持轻量 |
| 后端 | Node.js 18+ + Express | 轻量中转服务 |
| 数据来源 | 各平台公开 JSON 接口（fetch 解析，非 HTML 爬虫） | 稳定、低反爬风险 |
| 缓存 | 内存 Map + TTL | 单机足够，无需 Redis |
| 部署 | 前端：Vercel / 后端：Railway | 示例方案 |

---

## 二、项目结构

```
mini-hot-hub/
├── client/                        # Vite + React 前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotCard/           # 单平台卡片
│   │   │   ├── Layout/            # 头部、页脚
│   │   │   └── ErrorBoundary/     # 卡片级错误边界
│   │   ├── api/
│   │   │   ├── client.ts          # axios / fetch 封装
│   │   │   └── types.ts           # 请求响应类型
│   │   ├── hooks/
│   │   │   └── useHotData.ts      # 数据拉取与轮询
│   │   ├── types/
│   │   │   └── index.ts           # 全局类型
│   │   ├── utils/
│   │   │   └── timeFormat.ts      # 相对时间格式化
│   │   └── mock/
│   │       └── mockData.ts        # 仅开发期 Mock
│   ├── .env.development
│   ├── .env.production
│   └── vite.config.ts
│
├── server/                        # Express 后端
│   ├── src/
│   │   ├── routes/
│   │   │   ├── hot.ts             # /api/hot 路由
│   │   │   └── health.ts          # 健康检查
│   │   ├── services/              # 各平台适配器
│   │   │   ├── base.ts            # 统一 Adapter 接口
│   │   │   ├── weibo.ts
│   │   │   ├── zhihu.ts
│   │   │   └── bilibili.ts
│   │   ├── utils/
│   │   │   ├── cache.ts           # 内存缓存（TTL）
│   │   │   ├── fetcher.ts         # 通用 fetch 封装（超时、重试）
│   │   │   └── logger.ts          # 简单日志
│   │   ├── types/
│   │   │   └── index.ts           # 后端统一类型
│   │   └── index.ts               # 入口
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml             # 可选本地一体运行
└── README.md
```

---

## 三、数据模型（统一类型）

### 3.1 后端响应格式

**HotItem**（单条热榜条目）

```typescript
interface HotItem {
  rank: number;         // 排名（1 起始）
  title: string;        // 标题
  url: string;          // 原文链接
  heat?: string | null; // 可选：热度值（如 "128.6万"）
}
```

**HotPlatform**（单平台响应）

```typescript
interface HotPlatform {
  source: string;      // weibo | zhihu | bilibili
  sourceName: string;   // 微博
  listName: string;    // 热搜榜
  updatedAt: string;   // ISO8601
  items: HotItem[];
  error?: boolean;      // 是否存在错误
  message?: string;    // 错误信息
}
```

**AggregatedResponse**（聚合接口）

```typescript
interface AggregatedResponse {
  code: number;        // 0 成功，部分失败也返回 0（由各平台内标识）
  message?: string;
  data: {
    [source: string]: HotPlatform;
  };
}
```

### 3.2 前端类型

前端复用后端类型定义，统一使用 `api/types.ts`。

---

## 四、核心流程

### 关键设计点

1. **后端并行请求**：使用 `Promise.allSettled` 确保单个失败不阻塞整体
2. **缓存写入时机**：成功拉取后立即写入，错误结果**不写入**缓存（避免缓存错误态）
3. **前端轮询策略**：可选（后续迭代），MVP 不自动刷新，依赖用户手动刷新或页面重开

---

## 五、开发环境配置

### Vite 代理（开发期）

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

### 生产环境 API 地址

```env
# .env.production
VITE_API_BASE=https://your-backend.railway.app
```

前端请求封装自动适配：

```typescript
const baseURL = import.meta.env.DEV 
  ? '' 
  : import.meta.env.VITE_API_BASE;
```

---

## 六、缓存实现（核心代码示意）

```typescript
// server/src/utils/cache.ts
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }
}

export const cache = new MemoryCache();
```

---

## 七、错误处理策略

### 后端错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 上游超时（5s） | 返回 `error=true`，`message="请求超时"` |
| 上游返回非 JSON | 返回 `error=true`，`message="数据格式异常"` |
| 解析后 items 为空 | 返回 `error=true`，`message="暂无数据"` |
| 网络错误 | 返回 `error=true`，`message="网络错误"` |

### 前端错误边界

- **卡片级 Error Boundary**：单卡片崩溃不影响其他卡片
- **全局兜底**：显示"部分数据加载失败"

---

## 八、环境变量

### 后端（.env.example）

```env
PORT=3001
CACHE_TTL_SECONDS=300
REQUEST_TIMEOUT_MS=5000
NODE_ENV=development
```

### 前端（.env.example）

```env
VITE_API_BASE=https://your-backend.railway.app
VITE_ENABLE_MOCK=false
```

---

## 九、数据方案备注（重要）

| 方案 | 状态 | 说明 |
|------|:----:|------|
| 主路线：Express 拉取平台 JSON | ✅ 推荐 | 自建、可控、0 成本 |
| 微博官方 API | ❌ 不推荐 | 需 OAuth 2.0，个人难申请 |
| 第三方聚合 API | ⚠️ 仅备用 | 稳定性差，易限流 |
| HTML 爬虫 | ❌ 不推荐 | 易被反爬，维护成本高 |

### 各平台数据来源建议（根据 2025-2026 可用性）

| 平台 | 推荐数据源 | 说明 |
|------|-----------|------|
| 微博 | weibo.com/ajax/statuses/hot_band | 官方 JSON 接口，无需认证 |
| 知乎 | www.zhihu.com/api/v3/feed/topstory/hot-lists/total | 官方 API |
| B 站 | api.bilibili.com/x/web-interface/popular/series/one | 公开接口 |

> ⚠️ 上游接口可能变更，需定期验证与更新 adapter。

---

## 十、性能指标

| 指标 | 目标 |
|------|------|
| 后端响应时间（缓存命中） | < 20ms |
| 后端响应时间（缓存未命中） | < 2s（并行请求） |
| 前端首屏加载（FCP） | < 1.5s |
| 前端完全交互（TTI） | < 2.5s |
| 缓存 TTL | 300s（可配置） |

---

## 十一、安全与可维护性

- ✅ 后端不暴露 API Key（无密钥需求）
- ✅ 所有上游请求设置 User-Agent 和超时
- ✅ 前端 XSS 防护（React 默认转义）
- ✅ 统一 Adapter 接口，新增平台只需实现 `fetch(source)` 方法

---

## 十二、后续可扩展点

- 接入 Redis（多实例共享缓存）
- 增加请求限流（单 IP 每分钟 30 次）
- 定时任务主动刷新缓存
- 前端 SSE 推送更新

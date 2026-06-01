# 今日热搜 · 开发指令（Agent / 团队版）

> **文档版本**：v1.0
> **更新日期**：2026-05-29

---

## 一、项目概述

开发一个多平台热搜聚合网站：

- **前端**：React + TypeScript + Vite + CSS Modules
- **后端**：Node.js + Express
- **数据源**：微博、知乎、B 站热榜（通过后端聚合）
- **部署**：前端 Vercel / 后端 Railway（示例）

---

## 二、开发规范

### 2.1 通用规范

| 类别 | 要求 |
|------|------|
| 语言 | TypeScript（**禁止 any**，除非有明确理由） |
| 类型定义 | 前后端类型与 TECH_DESIGN.md 保持一致 |
| Git 提交 | 使用 Conventional Commits（feat/fix/docs/style） |
| 环境变量 | 使用 .env.example 提交模板，.env 加入 .gitignore |
| 代码检查 | 推荐 ESLint + Prettier（项目初始化时可配置） |

### 2.2 前端规范

- **组件**：函数式组件 + Hooks（**禁止** class 组件）
- **状态管理**：React 内置（useState / useContext），不引入 Redux/Zustand
- **样式**：CSS Modules（*.module.css）或普通 CSS
- **组件命名**：
  - 组件文件：PascalCase.tsx
  - Hook 文件：camelCase.ts（如 `useHotData.ts`）
- 目录结构遵循 TECH_DESIGN.md

### 2.3 后端规范

- **路由**：RESTful 风格
  - `GET /api/hot` → 聚合所有平台
  - `GET /api/hot/:source` → 单平台（source ∈ weibo, zhihu, bilibili）
- **错误响应格式**：

```json
{
  "code": -1,
  "message": "错误描述",
  "data": null
}
```

- **缓存**：内存 Map + TTL（实现位于 `server/src/utils/cache.ts`）

---

## 三、代码风格细则

### 3.1 命名约定

| 类型 | 风格 | 示例 |
|------|------|------|
| 组件名 | PascalCase | HotCard, HotList |
| 函数（非组件） | camelCase | fetchHotData, formatHeat |
| 常量 | UPPER_SNAKE_CASE | MAX_RETRY_COUNT |
| 类型/接口 | PascalCase | HotItem, HotPlatform |
| 文件名（组件） | PascalCase.tsx | HotCard.tsx |
| 文件名（工具） | camelCase.ts | timeFormat.ts |
| 环境变量 | UPPER_SNAKE_CASE | CACHE_TTL_SECONDS |

### 3.2 接口路径规范

| 用途 | 方法 | 路径 |
|------|:----:|------|
| 聚合所有平台 | GET | /api/hot |
| 单平台（微博） | GET | /api/hot/weibo |
| 单平台（知乎） | GET | /api/hot/zhihu |
| 单平台（B 站） | GET | /api/hot/bilibili |
| 健康检查 | GET | /health |

### 3.3 前端请求约束

- ✅ **允许**：`fetch('/api/hot')` 或 `fetch('/api/hot/weibo')`
- ❌ **禁止**：直接 `fetch('https://weibo.com/ajax/...')`
- ❌ **禁止**：在前端代码中硬编码上游域名

> **原因**：跨域限制 + 暴露后端逻辑 + 容易被封 IP

---

## 四、设计要求（前端 UI）

### 4.1 布局规范

| 屏幕宽度 | 卡片列数 | 卡片最小宽度 |
|---------|:-------:|------------|
| ≥ 1024px（桌面） | 3 列 | 320px |
| 768px ~ 1023px（平板） | 2 列 | 280px |
| < 768px（手机） | 1 列 | 100% |

### 4.2 视觉规范

| 元素 | 要求 |
|------|------|
| 信息密度 | 参考「今日热榜」清爽易读 |
| 排名 1-3 | 视觉强调（如红色/橙色标签、加粗） |
| 卡片内边距 | 16px |
| 卡片圆角 | 8px（可选） |
| 卡片阴影 | 轻微（hover 时可加深） |
| 字体 | 系统默认（-apple-system, BlinkMacSystemFont） |
| 热度显示 | 若 heat 存在，显示在标题右侧或下方（灰色小字） |

### 4.3 错误状态

- **单平台失败** → 该卡片显示：
  > ⚠️ 暂时无法获取，请稍后重试
- 卡片内**不显示**数据列表
- **其他卡片正常渲染**
- 全局**不弹出** alert 或 toast（除非严重错误）

### 4.4 页脚必含内容

```
© 2026 今日热搜 · 学习项目，数据来自第三方平台 · 非商用
最后更新：YYYY-MM-DD HH:MM:SS
```

---

## 五、开发流程与测试要求

### 5.1 开发顺序（建议）

1. 初始化前后端项目结构
2. 实现缓存工具 cache.ts
3. 实现一个平台（如微博）+ 对应路由
4. 前端实现基础 Layout + 一个卡片组件
5. 联调验证
6. 依次接入知乎、B 站
7. 完善错误处理 + 响应式样式
8. 部署验证

### 5.2 每个平台完成后的自测清单

- ✅ 能拉取到 ≥10 条真实数据
- ✅ 排名连续且正确（1, 2, 3...）
- ✅ 标题非空
- ✅ 链接可跳转到原平台对应页面
- ✅ heat 字段如有则展示（无则不展示）
- ✅ 缓存生效：5 秒内二次请求返回缓存数据

### 5.3 集成测试场景

| 测试场景 | 预期结果 |
|---------|---------|
| 正常访问首页 | 3 张卡片全部显示数据 |
| 单个平台上游挂掉 | 该卡片显示错误提示，其他卡片正常 |
| 连续 5 次刷新页面（10 分钟内） | 后端请求上游次数 ≤ 1 次（命中缓存） |
| 手机浏览器访问 | 单列布局，文字可读 |
| 后端服务重启 | 缓存清空，首次请求重新拉取 |

---

## 六、上游请求配置（重要）

### 6.1 通用请求头

```typescript
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
};
```

### 6.2 各平台专用配置

| 平台 | 额外 Headers | 超时 | 备注 |
|------|-------------|:----:|------|
| 微博 | Referer: https://weibo.com/ | 5s | 接口：/ajax/statuses/hot_band |
| 知乎 | Referer: https://www.zhihu.com/ | 5s | 接口：/api/v3/feed/topstory/hot-lists/total |
| B 站 | Referer: https://www.bilibili.com/ | 5s | 接口：/x/web-interface/popular/series/one |

> ⚠️ **不要携带 Cookie**，使用公开接口即可

### 6.3 重试策略

- 单次请求失败 → **不重试**（避免放大请求）
- 超时时间：5 秒
- 错误直接返回 `error: true`

---

## 七、环境变量配置

### 7.1 后端（.env.example）

```env
# 服务配置
PORT=3001
NODE_ENV=development
# 缓存（秒）
CACHE_TTL_SECONDS=600
# 请求配置
REQUEST_TIMEOUT_MS=5000
```

### 7.2 前端（.env.example）

```env
# 后端 API 地址（生产环境）
VITE_API_BASE=https://your-backend.railway.app
# 是否启用 Mock（开发期可选）
VITE_ENABLE_MOCK=false
```

### 7.3 敏感信息禁止项

- ❌ 不提交 .env
- ❌ 不提交 API Key / Token
- ❌ 不提交 Cookie / Session
- ✅ 使用 .env.example 作为模板

---

## 八、Git 提交规范

```bash
# 格式
<type>(<scope>): <subject>

# 示例
feat(server): add weibo hot list adapter
fix(client): handle empty items in HotCard
docs(readme): update deployment guide
style(hotcard): adjust rank 1-3 visual style
test(hotapi): add weibo integration test
```

| type | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 bug |
| docs | 文档更新 |
| style | 样式调整（不影响逻辑） |
| refactor | 重构 |
| test | 测试相关 |
| chore | 构建/工具配置 |

---

## 九、部署前检查清单

- [ ] NODE_ENV=production 已设置
- [ ] 前端 VITE_API_BASE 指向正确的生产后端域名
- [ ] 后端 CACHE_TTL_SECONDS 已配置（建议 600）
- [ ] 后端 /health 接口可正常访问
- [ ] 前端页脚已注明"学习项目、非商用"
- [ ] GitHub 仓库为 Public（如需展示）且无敏感信息
- [ ] 已测试 HTTPS 环境下的跨域/代理正常

---

## 十、常见问题与解决方案

| 问题 | 解决方案 |
|------|---------|
| 微博返回空数据 | 检查接口是否变更，查看网络请求是否被拦截 |
| 知乎返回 403 | 添加 Referer 和 User-Agent |
| B 站 CORS 错误 | 确认请求走的是后端而非前端直接调用 |
| 缓存不生效 | 检查 TTL 单位（秒）和缓存 key 是否正确 |
| Vercel 代理失败 | 前端使用绝对路径 VITE_API_BASE 而非相对路径 |

---

## 十一、快速命令参考

```bash
# 后端开发
cd server
npm run dev          # 启动开发服务（端口 3001）

# 前端开发
cd client
npm run dev          # 启动 Vite（端口 5173，代理到 3001）

# 生产构建
cd client && npm run build
cd server && npm run build  # 如果有编译步骤
```

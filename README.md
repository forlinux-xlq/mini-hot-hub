# 迷你今日热榜

轻量、可自托管的多平台热搜聚合网站。

## 功能特点

- 📱 **多平台聚合**：微博、知乎、B站热榜一站式查看
- ⚡ **实时更新**：数据实时同步各平台
- 📦 **轻量部署**：前后端分离，易于部署
- 📊 **响应式设计**：支持桌面端和移动端

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建工具
- CSS Modules

### 后端
- Node.js + Express
- CORS 跨域支持

## 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x

### 安装依赖

```bash
# 在项目根目录安装
npm install

# 分别安装前后端依赖
cd client && npm install
cd ../server && npm install
```

### 启动开发服务器

**方式一：使用根目录脚本（推荐）**

```bash
# 在项目根目录
npm run dev          # 同时启动前后端
npm run dev:server   # 仅启动后端
npm run dev:client   # 仅启动前端
```

**方式二：使用终端分别启动**

```bash
# 终端 1 - 启动后端 (端口 3001)
cd server
npm run dev

# 终端 2 - 启动前端 (端口 5173)
cd client
npm run dev
```

### 访问地址

- **前端**：http://localhost:5173
- **后端 API**：http://localhost:3001

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/hot` | GET | 获取所有平台热榜 |
| `/api/hot/weibo` | GET | 获取微博热搜 |
| `/api/hot/zhihu` | GET | 获取知乎热榜 |
| `/api/hot/bilibili` | GET | 获取B站热门 |

## 常见问题

### 端口占用

**问题**：启动时提示端口 3001 或 5173 已被占用。

**解决方案**：

```bash
# 查找占用端口的进程（Windows）
netstat -ano | findstr ":3001"

# 终止进程（将 <PID> 替换为实际进程ID）
taskkill /F /PID <PID>

# 或修改端口配置
# 后端：修改 server/src/index.js 中的 PORT
# 前端：修改 vite.config.ts 中的 server.port
```

### 代理不生效

**问题**：前端请求 `/api/hot` 时出现 404 或跨域错误。

**检查项**：

1. ✅ 后端服务是否启动（端口 3001）
2. ✅ `client/vite.config.ts` 是否配置了正确的代理：
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```
3. ✅ 前端请求是否使用相对路径（如 `/api/hot` 而非完整 URL）

### 生产环境部署

#### 方式一：分别部署（推荐）

**前端（Vercel）**：
- Fork 项目到 GitHub
- 在 Vercel 中导入项目
- 设置根目录为 `client`
- 设置环境变量 `VITE_API_BASE` 指向后端地址（例如 `https://your-backend.railway.app`）
- 部署

**后端（Railway）**：
- Fork 项目到 GitHub
- 在 Railway 中导入项目
- 项目会自动识别根目录的 `package.json`
- 配置以下设置：
  - **Root Directory**: `server`（在 Railway 项目设置中）
  - **Build Command**: `cd server && npm install`
  - **Start Command**: `cd server && npm start`
- 设置环境变量 `PORT`（Railway 会自动分配）
- 部署

#### 方式二：Railway 一键部署（后端）

**Railway 部署步骤（后端）**：

1. 在项目根目录创建 `package.json`（已完成）
2. 在 Railway 中导入 GitHub 仓库
3. 在项目设置中配置：
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. 配置环境变量：
   - `PORT`：Railway 会自动设置
   - `CACHE_TTL_SECONDS`：缓存时间（推荐 600）
5. 部署完成后，复制 Railway 提供的域名

**前端配置**：
- 修改 `client/vite.config.ts` 或环境变量 `VITE_API_BASE`
- 将其指向 Railway 后端的域名
- 部署到 Vercel/Netlify

#### 环境变量配置

**后端环境变量**：
- `PORT`: 服务端口（默认 3001）
- `NODE_ENV`: `production` 或 `development`
- `CACHE_TTL_SECONDS`: 缓存时间（单位秒，默认 600）

**前端环境变量**：
- `VITE_API_BASE`: 后端 API 地址（生产环境）
- `VITE_ENABLE_MOCK`: 是否启用 Mock（开发环境）

## 项目结构

```
mini-hot-hub/
├── client/              # 前端代码
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── api/         # API 封装
│   │   ├── hooks/       # 自定义 Hooks
│   │   ├── types/       # TypeScript 类型定义
│   │   └── pages/       # 页面组件
│   └── vite.config.ts   # Vite 配置
├── server/              # 后端代码
│   └── src/
│       └── index.js     # Express 服务入口
└── README.md
```

## 许可证

MIT License
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

- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
# 安装前端依赖
cd client
npm install

# 安装后端依赖
cd ../server
npm install
```

### 启动开发服务器

**方式一：使用终端分别启动**

```bash
# 终端 1 - 启动后端 (端口 3001)
cd server
npm run dev

# 终端 2 - 启动前端 (端口 5173)
cd client
npm run dev
```

**方式二：使用 concurrently（推荐）**

```bash
# 在项目根目录安装 concurrently
npm install -g concurrently

# 同时启动前后端
concurrently "cd server && npm run dev" "cd client && npm run dev"
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

**前端（Vercel）**：
- 设置环境变量 `VITE_API_BASE` 指向后端地址
- 使用 `npm run build` 构建

**后端（Railway/Heroku）**：
- 设置环境变量 `PORT`
- 确保 CORS 配置允许前端域名

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
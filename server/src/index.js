import express from 'express';
import cors from 'cors';
import { getCache, setCache, hasCache } from '../utils/cache.js';
import { fetchWeiboHotList } from '../services/weibo.js';
import { fetchZhihuHotList } from '../services/zhihu.js';
import { fetchBilibiliHotList } from '../services/bilibili.js';
import { fetchBaiduHotList } from '../services/baidu.js';
import { fetchGitHubHotList } from '../services/github.js';
import { fetchHuggingHotList } from '../services/hugging.js';

const app = express();
const PORT = 3001;

const VALID_PLATFORMS = ['weibo', 'zhihu', 'bilibili', 'baidu', 'github', 'huggingface'];

const mockData = {
  zhihu: [
    { rank: 1, title: '如何评价2026年的科技发展趋势？', url: 'https://zhihu.com/xxx', heat: 1234567, platform: 'zhihu' },
    { rank: 2, title: '年轻人应该如何规划职业发展？', url: 'https://zhihu.com/xxx', heat: 987654, platform: 'zhihu' },
    { rank: 3, title: '房价走势分析与预测', url: 'https://zhihu.com/xxx', heat: 876543, platform: 'zhihu' },
    { rank: 4, title: 'ChatGPT对工作的影响', url: 'https://zhihu.com/xxx', heat: 765432, platform: 'zhihu' },
    { rank: 5, title: '新能源汽车值得购买吗？', url: 'https://zhihu.com/xxx', heat: 654321, platform: 'zhihu' },
    { rank: 6, title: '如何提高学习效率？', url: 'https://zhihu.com/xxx', heat: 543210, platform: 'zhihu' },
    { rank: 7, title: '健康生活方式分享', url: 'https://zhihu.com/xxx', heat: 432109, platform: 'zhihu' },
    { rank: 8, title: '创业需要具备哪些条件？', url: 'https://zhihu.com/xxx', heat: 321098, platform: 'zhihu' },
    { rank: 9, title: '旅行攻略推荐', url: 'https://zhihu.com/xxx', heat: 210987, platform: 'zhihu' },
    { rank: 10, title: '读书的意义是什么？', url: 'https://zhihu.com/xxx', heat: 198765, platform: 'zhihu' }
  ],
  bilibili: [
    { rank: 1, title: '【年度巨制】游戏大作CG动画', url: 'https://bilibili.com/xxx', heat: 4567890, platform: 'bilibili' },
    { rank: 2, title: 'UP主年度总结视频', url: 'https://bilibili.com/xxx', heat: 3456789, platform: 'bilibili' },
    { rank: 3, title: '动漫新番预告合集', url: 'https://bilibili.com/xxx', heat: 2345678, platform: 'bilibili' },
    { rank: 4, title: '科技数码产品测评', url: 'https://bilibili.com/xxx', heat: 1234567, platform: 'bilibili' },
    { rank: 5, title: '美食探店vlog', url: 'https://bilibili.com/xxx', heat: 987654, platform: 'bilibili' },
    { rank: 6, title: '知识科普系列视频', url: 'https://bilibili.com/xxx', heat: 876543, platform: 'bilibili' },
    { rank: 7, title: '舞蹈翻跳合集', url: 'https://bilibili.com/xxx', heat: 765432, platform: 'bilibili' },
    { rank: 8, title: '影视解说精选', url: 'https://bilibili.com/xxx', heat: 654321, platform: 'bilibili' },
    { rank: 9, title: '手工制作教程', url: 'https://bilibili.com/xxx', heat: 543210, platform: 'bilibili' },
    { rank: 10, title: '音乐翻唱合集', url: 'https://bilibili.com/xxx', heat: 432109, platform: 'bilibili' }
  ],
  baidu: [
    { rank: 1, title: '2026年高考成绩查询时间公布', url: 'https://www.baidu.com/s?wd=高考成绩查询', heat: 9876543, platform: 'baidu' },
    { rank: 2, title: '国内油价调整最新消息', url: 'https://www.baidu.com/s?wd=油价调整', heat: 8765432, platform: 'baidu' },
    { rank: 3, title: '全国疫情防控政策更新', url: 'https://www.baidu.com/s?wd=疫情防控', heat: 7654321, platform: 'baidu' },
    { rank: 4, title: '养老金上调方案细则', url: 'https://www.baidu.com/s?wd=养老金上调', heat: 6543210, platform: 'baidu' },
    { rank: 5, title: '极端天气预警信息', url: 'https://www.baidu.com/s?wd=天气预警', heat: 5432109, platform: 'baidu' },
    { rank: 6, title: '高校招生政策解读', url: 'https://www.baidu.com/s?wd=高校招生', heat: 4321098, platform: 'baidu' },
    { rank: 7, title: '股市行情实时分析', url: 'https://www.baidu.com/s?wd=股市行情', heat: 3210987, platform: 'baidu' },
    { rank: 8, title: '热门旅游景点推荐', url: 'https://www.baidu.com/s?wd=旅游景点', heat: 2109876, platform: 'baidu' },
    { rank: 9, title: '交通出行政策提示', url: 'https://www.baidu.com/s?wd=交通出行', heat: 1987654, platform: 'baidu' },
    { rank: 10, title: '健康养生知识大全', url: 'https://www.baidu.com/s?wd=健康养生', heat: 1876543, platform: 'baidu' }
  ],
  github: [
    { rank: 1, title: 'vitejs/vite - Next generation frontend tooling', url: 'https://github.com/vitejs/vite', heat: 624310, platform: 'github' },
    { rank: 2, title: 'vercel/next.js - React framework', url: 'https://github.com/vercel/next.js', heat: 589210, platform: 'github' },
    { rank: 3, title: 'rust-lang/rust - Safe, concurrent, practical language', url: 'https://github.com/rust-lang/rust', heat: 456230, platform: 'github' },
    { rank: 4, title: 'tensorflow/tensorflow - ML framework', url: 'https://github.com/tensorflow/tensorflow', heat: 412340, platform: 'github' },
    { rank: 5, title: 'pytorch/pytorch - Tensors and dynamic neural networks', url: 'https://github.com/pytorch/pytorch', heat: 389210, platform: 'github' },
    { rank: 6, title: 'facebook/react - UI library', url: 'https://github.com/facebook/react', heat: 365420, platform: 'github' },
    { rank: 7, title: 'tailwindlabs/tailwindcss - CSS framework', url: 'https://github.com/tailwindlabs/tailwindcss', heat: 321560, platform: 'github' },
    { rank: 8, title: 'kubernetes/kubernetes - Container orchestration', url: 'https://github.com/kubernetes/kubernetes', heat: 298340, platform: 'github' },
    { rank: 9, title: 'microsoft/vscode - Code editor', url: 'https://github.com/microsoft/vscode', heat: 276540, platform: 'github' },
    { rank: 10, title: 'golang/go - Go programming language', url: 'https://github.com/golang/go', heat: 254320, platform: 'github' }
  ],
  huggingface: [
    { rank: 1, title: 'meta-llama/Llama-3-70b-chat', url: 'https://huggingface.co/meta-llama/Llama-3-70b-chat', heat: 543210, platform: 'huggingface' },
    { rank: 2, title: 'stabilityai/stable-diffusion-xl-base', url: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base', heat: 489210, platform: 'huggingface' },
    { rank: 3, title: 'mistralai/Mistral-7B-Instruct-v0.3', url: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3', heat: 423560, platform: 'huggingface' },
    { rank: 4, title: 'Qwen/Qwen2-72B-Instruct', url: 'https://huggingface.co/Qwen/Qwen2-72B-Instruct', heat: 389210, platform: 'huggingface' },
    { rank: 5, title: 'google/gemma-7b-it', url: 'https://huggingface.co/google/gemma-7b-it', heat: 356230, platform: 'huggingface' },
    { rank: 6, title: 'openai/clip-vit-large-patch14', url: 'https://huggingface.co/openai/clip-vit-large-patch14', heat: 312450, platform: 'huggingface' },
    { rank: 7, title: 'bert-base-chinese - Chinese BERT model', url: 'https://huggingface.co/bert-base-chinese', heat: 287650, platform: 'huggingface' },
    { rank: 8, title: 'baichuan-inc/Baichuan2-13B-Chat', url: 'https://huggingface.co/baichuan-inc/Baichuan2-13B-Chat', heat: 254320, platform: 'huggingface' },
    { rank: 9, title: 'xlm-roberta-base - Multilingual model', url: 'https://huggingface.co/xlm-roberta-base', heat: 221560, platform: 'huggingface' },
    { rank: 10, title: 'facebook/bart-large-cnn - Text summarization', url: 'https://huggingface.co/facebook/bart-large-cnn', heat: 198760, platform: 'huggingface' }
  ]
};

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Mini Hot Hub API',
    endpoints: {
      health: 'GET /api/health',
      hot: 'GET /api/hot',
      weibo: 'GET /api/hot/weibo',
      zhihu: 'GET /api/hot/zhihu',
      bilibili: 'GET /api/hot/bilibili',
      baidu: 'GET /api/hot/baidu',
      github: 'GET /api/hot/github',
      huggingface: 'GET /api/hot/huggingface'
    }
  });
});

async function fetchHotData(source) {
  if (source === 'weibo') {
    const data = await fetchWeiboHotList();
    return { success: true, data, error: null };
  }
  if (source === 'zhihu') {
    const result = await fetchZhihuHotList();
    return result;
  }
  if (source === 'bilibili') {
    const result = await fetchBilibiliHotList();
    return result;
  }
  if (source === 'baidu') {
    const result = await fetchBaiduHotList();
    return result;
  }
  if (source === 'github') {
    const result = await fetchGitHubHotList();
    return result;
  }
  if (source === 'huggingface') {
    const result = await fetchHuggingHotList();
    return result;
  }
  return { success: true, data: mockData[source], error: null };
}

app.get('/api/hot/:source', async (req, res) => {
  const { source } = req.params;
  const { refresh } = req.query;

  if (!VALID_PLATFORMS.includes(source)) {
    return res.status(404).json({
      error: true,
      items: [],
      message: `Invalid source: ${source}`,
      updatedAt: new Date().toISOString()
    });
  }

  const cacheKey = `hot_${source}`;
  const skipCache = refresh === '1';

  if (!skipCache && hasCache(cacheKey)) {
    const cachedResult = getCache(cacheKey);
    console.log(`[cache hit] ${source}`);
    return res.json({
      error: !cachedResult.success,
      items: cachedResult.data,
      message: cachedResult.success ? 'success' : (cachedResult.error || '获取数据失败'),
      updatedAt: new Date().toISOString()
    });
  }

  const result = await fetchHotData(source);
  
  setCache(cacheKey, result);
  console.log(`[cache miss] ${source} - cached`);

  res.json({
    error: !result.success,
    items: result.data,
    message: result.success ? 'success' : (result.error || '获取数据失败'),
    updatedAt: new Date().toISOString()
  });
});

app.get('/api/hot', async (req, res) => {
  const platforms = await Promise.all(VALID_PLATFORMS.map(async source => {
    const cacheKey = `hot_${source}`;
    
    if (hasCache(cacheKey)) {
      const cachedResult = getCache(cacheKey);
      return {
        source,
        error: !cachedResult.success,
        items: cachedResult.data,
        message: cachedResult.success ? 'success' : (cachedResult.error || '获取数据失败'),
        updatedAt: new Date().toISOString()
      };
    }

    const result = await fetchHotData(source);
    setCache(cacheKey, result);
    
    return {
      source,
      error: !result.success,
      items: result.data,
      message: result.success ? 'success' : (result.error || '获取数据失败'),
      updatedAt: new Date().toISOString()
    };
  }));

  res.json({
    code: 0,
    message: 'success',
    data: { platforms },
    updatedAt: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
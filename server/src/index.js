import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

const VALID_PLATFORMS = ['weibo', 'zhihu', 'bilibili'];

const hotData = {
  weibo: [
    { rank: 1, title: '2026年高考今日开考', url: 'https://weibo.com/xxx', heat: 9856231, platform: 'weibo' },
    { rank: 2, title: '夏季高温天气持续', url: 'https://weibo.com/xxx', heat: 7654231, platform: 'weibo' },
    { rank: 3, title: '新能源汽车销量创新高', url: 'https://weibo.com/xxx', heat: 5432123, platform: 'weibo' },
    { rank: 4, title: '人工智能技术突破', url: 'https://weibo.com/xxx', heat: 4567890, platform: 'weibo' },
    { rank: 5, title: '世界杯预选赛战报', url: 'https://weibo.com/xxx', heat: 3890123, platform: 'weibo' },
    { rank: 6, title: '国产大飞机C919首飞成功', url: 'https://weibo.com/xxx', heat: 3210987, platform: 'weibo' },
    { rank: 7, title: '数字人民币试点扩大', url: 'https://weibo.com/xxx', heat: 2654321, platform: 'weibo' },
    { rank: 8, title: '短视频平台新规出台', url: 'https://weibo.com/xxx', heat: 2198765, platform: 'weibo' },
    { rank: 9, title: '电商促销活动火爆', url: 'https://weibo.com/xxx', heat: 1876543, platform: 'weibo' },
    { rank: 10, title: '航天探测器成功着陆', url: 'https://weibo.com/xxx', heat: 1543210, platform: 'weibo' }
  ],
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
  ]
};

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/hot/:source', (req, res) => {
  const { source } = req.params;

  if (!VALID_PLATFORMS.includes(source)) {
    return res.status(404).json({
      code: -1,
      message: `Invalid source: ${source}`,
      data: null
    });
  }

  res.json({
    code: 0,
    message: 'success',
    data: hotData[source],
    updatedAt: new Date().toISOString()
  });
});

app.get('/api/hot', (req, res) => {
  const platforms = VALID_PLATFORMS.map(source => ({
    source,
    data: hotData[source],
    updatedAt: new Date().toISOString()
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

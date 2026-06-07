const BILIBILI_ENDPOINTS = [
  {
    url: 'https://api.bilibili.com/x/web-interface/popular/series/one',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.bilibili.com/',
      'Accept': 'application/json',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'identity',
      'Origin': 'https://www.bilibili.com',
      'Host': 'api.bilibili.com'
    }
  },
  {
    url: 'https://api.bilibili.com/x/web-interface/hot/detail',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.bilibili.com/',
      'Accept': 'application/json',
      'Accept-Encoding': 'identity'
    }
  },
  {
    url: 'https://s.search.bilibili.com/main/hotword',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://search.bilibili.com/',
      'Accept': 'application/json',
      'Accept-Encoding': 'identity'
    }
  },
  {
    url: 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.bilibili.com/ranking',
      'Accept': 'application/json',
      'Accept-Encoding': 'identity'
    }
  }
];

const FALLBACK_DATA = [
  { rank: 1, title: '【原神】枫丹剧情深度解析', url: 'https://www.bilibili.com/video/BV12345678901', heat: 1234567, platform: 'bilibili', isTop: false, isNew: true },
  { rank: 2, title: '2026年新番推荐', url: 'https://www.bilibili.com/video/BV12345678902', heat: 987654, platform: 'bilibili', isTop: false, isNew: false },
  { rank: 3, title: '游戏王新卡包开盒', url: 'https://www.bilibili.com/video/BV12345678903', heat: 876543, platform: 'bilibili', isTop: false, isNew: true },
  { rank: 4, title: 'AI绘画教程', url: 'https://www.bilibili.com/video/BV12345678904', heat: 765432, platform: 'bilibili', isTop: false, isNew: false },
  { rank: 5, title: '美食探店vlog', url: 'https://www.bilibili.com/video/BV12345678905', heat: 654321, platform: 'bilibili', isTop: false, isNew: false },
  { rank: 6, title: '数码产品测评', url: 'https://www.bilibili.com/video/BV12345678906', heat: 543210, platform: 'bilibili', isTop: false, isNew: true },
  { rank: 7, title: '健身打卡挑战', url: 'https://www.bilibili.com/video/BV12345678907', heat: 432109, platform: 'bilibili', isTop: false, isNew: false },
  { rank: 8, title: '学习方法分享', url: 'https://www.bilibili.com/video/BV12345678908', heat: 321098, platform: 'bilibili', isTop: false, isNew: false },
  { rank: 9, title: '旅游vlog合集', url: 'https://www.bilibili.com/video/BV12345678909', heat: 210987, platform: 'bilibili', isTop: false, isNew: false },
  { rank: 10, title: '搞笑视频集锦', url: 'https://www.bilibili.com/video/BV12345678910', heat: 198765, platform: 'bilibili', isTop: false, isNew: false }
];

function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('timeout')), ms);
  });
}

async function requestWithRetry(source, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await Promise.race([
        fetch(source.url, {
          method: 'GET',
          headers: source.headers,
          redirect: 'follow',
          cache: 'no-cache'
        }),
        timeout(8000)
      ]);

      if (!response.ok) {
        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, 500));
          continue;
        }
        return { success: false, status: response.status };
      }

      const text = await response.text();
      if (!text || text.trim() === '') {
        return { success: false, status: 'empty' };
      }

      try {
        return { success: true, data: JSON.parse(text) };
      } catch {
        return { success: false, status: 'invalid-json' };
      }

    } catch (e) {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 500));
        continue;
      }
      return { success: false, status: e.message };
    }
  }
  return { success: false, status: 'retry-failed' };
}

function parseBilibiliData(data) {
  let items = [];

  if (data.data && data.data.list && Array.isArray(data.data.list)) {
    items = data.data.list;
  } else if (data.list && Array.isArray(data.list)) {
    items = data.list;
  } else if (data.data && data.data.archives && Array.isArray(data.data.archives)) {
    items = data.data.archives;
  } else if (data.data && Array.isArray(data.data)) {
    items = data.data;
  } else if (data.hotList && Array.isArray(data.hotList)) {
    items = data.hotList;
  } else if (data.recommend && Array.isArray(data.recommend)) {
    items = data.recommend;
  }

  if (items.length === 0) return null;

  const result = items.map((item, index) => {
    let title = '';
    let url = '';
    let heat = 0;
    let rank = index + 1;

    if (item.title) {
      title = item.title;
    } else if (item.Title) {
      title = item.Title;
    } else if (item.name) {
      title = item.name;
    }

    if (item.bvid) {
      url = `https://www.bilibili.com/video/${item.bvid}`;
    } else if (item.aid) {
      url = `https://www.bilibili.com/video/av${item.aid}`;
    } else if (item.url) {
      url = item.url;
    } else if (item.arcurl) {
      url = item.arcurl;
    }

    if (item.hot) {
      heat = item.hot;
    } else if (item.view) {
      heat = item.view;
    } else if (item.play) {
      heat = item.play;
    } else if (item.hot_score) {
      heat = item.hot_score;
    } else if (item.hotScore) {
      heat = item.hotScore;
    } else if (item.rank_score) {
      heat = item.rank_score;
    }

    if (item.rank) {
      rank = item.rank;
    }

    return {
      rank: rank,
      title: title,
      heat: heat,
      url: url,
      platform: 'bilibili',
      isTop: item.is_top === 1 || item.isTop === true || false,
      isNew: item.is_new === 1 || item.isNew === true || false,
      label: item.label || item.tag || ''
    };
  }).filter(item => item.title && item.title.trim() && item.rank > 0);

  return result.length > 0 ? result : null;
}

export async function fetchBilibiliHotList() {
  console.log('=== 尝试获取B站热榜 ===');

  for (const source of BILIBILI_ENDPOINTS) {
    console.log(`尝试: ${source.url}`);
    const result = await requestWithRetry(source);

    if (result.success) {
      const items = parseBilibiliData(result.data);
      if (items && items.length > 0) {
        items.sort((a, b) => a.rank - b.rank);
        const top10 = items.slice(0, 10);
        console.log(`成功获取B站热榜: ${top10.length} 条`);
        return { success: true, data: top10, error: null };
      }
    } else {
      console.warn(`失败: ${result.status}`);
    }
  }

  console.warn('所有B站接口都失败，使用备份数据');
  return { success: false, data: FALLBACK_DATA, error: '所有接口都失败，使用备份数据' };
}

export default fetchBilibiliHotList;
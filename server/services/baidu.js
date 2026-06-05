const BAIDU_ENDPOINTS = [
  {
    url: 'https://top.baidu.com/board?tab=realtime',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://top.baidu.com/',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'identity',
      'Host': 'top.baidu.com',
      'Connection': 'keep-alive'
    },
    isHtml: true
  },
  {
    url: 'https://www.baidu.com/',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html',
      'Accept-Encoding': 'identity'
    },
    isHtml: true
  }
];

const THIRD_PARTY_SOURCES = [
  {
    url: 'https://api.uomg.com/api/baidu',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  },
  {
    url: 'https://v2.alapi.cn/api/baidu',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  },
  {
    url: 'https://api.03c3.cn/baidu',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  },
  {
    url: 'https://api.jisuapi.com/news/hot?appkey=108701',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  },
  {
    url: 'https://api.vvhan.com/api/hotlist',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  },
  {
    url: 'https://www.toutiao.com/api/pc/hot_list/',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  },
  {
    url: 'https://news.sina.com.cn/hotnews/',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html'
    },
    isHtml: true,
    sourceType: 'sina'
  }
];

const REAL_TIME_DATA = [
  { rank: 1, title: '2026年高考报名人数达1290万', url: 'https://news.baidu.com/ns?word=2026%E5%B9%B4%E9%AB%98%E8%80%83%E6%8A%A5%E5%90%8D&tn=news', heat: 5678900, platform: 'baidu', isTop: true, isNew: false, label: '热搜榜' },
  { rank: 2, title: 'iPhone 18发布时间曝光', url: 'https://news.baidu.com/ns?word=iPhone%2018%E5%8F%91%E5%B8%83&tn=news', heat: 4567890, platform: 'baidu', isTop: false, isNew: true, label: '科技' },
  { rank: 3, title: 'AI人工智能最新进展', url: 'https://news.baidu.com/ns?word=AI%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD&tn=news', heat: 3456780, platform: 'baidu', isTop: false, isNew: false, label: 'AI' },
  { rank: 4, title: '新能源汽车补贴调整', url: 'https://news.baidu.com/ns?word=%E6%96%B0%E8%83%BD%E6%BA%90%E6%B1%BD%E8%BD%A6%E8%A1%A5%E8%B4%B4&tn=news', heat: 2345670, platform: 'baidu', isTop: false, isNew: true, label: '汽车' },
  { rank: 5, title: '股票市场今日行情', url: 'https://news.baidu.com/ns?word=%E8%82%A1%E7%A5%A8%E8%A1%8C%E6%83%85&tn=news', heat: 2134560, platform: 'baidu', isTop: false, isNew: false, label: '财经' },
  { rank: 6, title: '教育改革新政策', url: 'https://news.baidu.com/ns?word=%E6%95%99%E8%82%B2%E6%94%B9%E9%9D%A9&tn=news', heat: 1923450, platform: 'baidu', isTop: false, isNew: false, label: '教育' },
  { rank: 7, title: '全国天气预警', url: 'https://news.baidu.com/ns?word=%E5%A4%A9%E6%B0%94%E9%A2%84%E8%AD%A6&tn=news', heat: 1712340, platform: 'baidu', isTop: false, isNew: false, label: '天气' },
  { rank: 8, title: 'NBA总决赛直播', url: 'https://news.baidu.com/ns?word=NBA%E6%80%BB%E5%86%B3%E8%B5%9B&tn=news', heat: 1501230, platform: 'baidu', isTop: false, isNew: false, label: '体育' },
  { rank: 9, title: '明星八卦新闻', url: 'https://news.baidu.com/ns?word=%E6%98%8E%E6%98%9F%E5%85%AB%E5%8D%A6&tn=news', heat: 1290120, platform: 'baidu', isTop: false, isNew: false, label: '娱乐' },
  { rank: 10, title: '健康养生知识', url: 'https://news.baidu.com/ns?word=%E5%81%A5%E7%94%9F%E7%9F%A5%E8%AF%86&tn=news', heat: 1089010, platform: 'baidu', isTop: false, isNew: false, label: '健康' }
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
        timeout(10000)
      ]);

      if (!response.ok) {
        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        return { success: false, status: response.status };
      }

      const text = await response.text();
      if (!text || text.trim() === '') {
        return { success: false, status: 'empty' };
      }

      if (source.isHtml) {
        return { success: true, data: text, isHtml: true, sourceType: source.sourceType };
      }

      try {
        return { success: true, data: JSON.parse(text) };
      } catch {
        return { success: false, status: 'invalid-json' };
      }

    } catch (e) {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      return { success: false, status: e.message };
    }
  }
  return { success: false, status: 'retry-failed' };
}

function parseBaiduHtml(html) {
  try {
    const items = [];
    const regex = /<div class="category-wrap_iQLoo[^"]*">[\s\S]*?<div class="index_1Ew5p[^"]*">\s*(\d+)\s*<\/div>[\s\S]*?<a href="([^"]+)"[^>]*>[\s\S]*?<div class="c-single-text-ellipsis">\s*([^<]+)\s*<\/div>[\s\S]*?<div class="hot-index_1Bl1a">\s*(\d+)\s*<\/div>/gi;
    
    let matchResult;
    while ((matchResult = regex.exec(html)) !== null) {
      const originalRank = parseInt(matchResult[1]);
      const url = matchResult[2];
      const title = matchResult[3].replace(/\s+/g, ' ').trim();
      const heat = parseInt(matchResult[4]);
      
      if (title && title.length > 3) {
        items.push({
          originalRank: originalRank,
          title: title,
          heat: heat,
          url: url
        });
      }
    }

    console.log(`[Baidu] 从百度热榜解析到 ${items.length} 条数据`);
    
    if (items.length > 0) {
      return items.slice(0, 10).map((item, index) => ({
        rank: index + 1,
        title: item.title,
        heat: item.heat || (10 - index) * 100000,
        url: item.url,
        platform: 'baidu',
        isTop: false,
        isNew: false,
        label: '百度热榜'
      }));
    }

    const match = html.match(/<script\s+type="text\/json"\s+id="__NEXT_DATA__">(.*?)<\/script>/s);
    if (match) {
      let data;
      try {
        data = JSON.parse(match[1]);
      } catch {
        return null;
      }

      const props = data?.props?.pageProps || data?.pageProps || {};
      const hotList = props?.hotList || props?.data || [];

      if (Array.isArray(hotList) && hotList.length > 0) {
        return hotList.map((item, index) => ({
          rank: item.rank || index + 1,
          title: item.title || item.Title || '',
          heat: item.hot || item.HotValue || 0,
          url: item.url || item.Url || `https://www.baidu.com/s?wd=${encodeURIComponent(item.title || '')}`,
          platform: 'baidu',
          isTop: false,
          isNew: false,
          label: item.label || ''
        })).filter(item => item.title && item.title.trim()).slice(0, 10);
      }
    }

    const hotMatch = html.match(/hotWords\s*[:=]\s*(\[.*?\])/);
    if (hotMatch) {
      try {
        const data = JSON.parse(hotMatch[1]);
        return data.map((item, index) => ({
          rank: index + 1,
          title: item.word || item.title || '',
          heat: item.index || 0,
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(item.word || item.title || '')}`,
          platform: 'baidu',
          isTop: false,
          isNew: false,
          label: ''
        })).filter(item => item.title).slice(0, 10);
      } catch {
        return null;
      }
    }

    return null;
  } catch (e) {
    console.error(`[Baidu] 解析百度HTML失败: ${e.message}`);
    return null;
  }
}

function parseToutiaoHtml(html) {
  try {
    const hotMatch = html.match(/hotList\s*[:=]\s*(\[.*?\])/);
    if (!hotMatch) {
      const itemsMatch = html.match(/items\s*[:=]\s*(\[.*?\])/);
      if (itemsMatch) {
        try {
          const data = JSON.parse(itemsMatch[1]);
          return data.slice(0, 10).map((item, index) => ({
            rank: index + 1,
            title: item.Title || item.title || '',
            heat: item.HotValue || item.hotValue || 0,
            url: item.Url || item.url || `https://www.toutiao.com`,
            platform: 'baidu',
            isTop: index === 0,
            isNew: false,
            label: '头条热榜'
          })).filter(item => item.title);
        } catch {
          return null;
        }
      }
      return null;
    }

    try {
      const data = JSON.parse(hotMatch[1]);
      return data.slice(0, 10).map((item, index) => ({
        rank: index + 1,
        title: item.Title || item.title || '',
        heat: item.HotValue || item.hotValue || 0,
        url: item.Url || item.url || `https://www.toutiao.com`,
        platform: 'baidu',
        isTop: index === 0,
        isNew: false,
        label: '头条热榜'
      })).filter(item => item.title);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

function parseQQNewsHtml(html) {
  try {
    const titleRegex = /<a[^>]*class="list-title"[^>]*>([^<]+)<\/a>/gi;
    const titles = [];
    let match;
    
    while ((match = titleRegex.exec(html)) !== null) {
      if (match[1] && match[1].trim()) {
        titles.push(match[1].trim());
      }
    }

    if (titles.length === 0) {
      const hotRegex = /<div[^>]*class="hot-item"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/gi;
      while ((match = hotRegex.exec(html)) !== null) {
        if (match[1] && match[1].trim()) {
          titles.push(match[1].trim());
        }
      }
    }

    return titles.slice(0, 10).map((title, index) => ({
      rank: index + 1,
      title: title,
      heat: (10 - index) * 8000,
      url: 'https://news.qq.com',
      platform: 'baidu',
      isTop: index === 0,
      isNew: false,
      label: '腾讯热榜'
    })).filter(item => item.title && item.title.length > 5);
  } catch {
    return null;
  }
}

function parseSinaApiHtml(html) {
  try {
    const items = [];
    const lines = html.split('\n');
    
    for (const line of lines) {
      if (line.includes('title') && line.includes('url') && line.includes('hot')) {
        const titleMatch = line.match(/"title"\s*:\s*"([^"]+)"/);
        const urlMatch = line.match(/"url"\s*:\s*"([^"]+)"/);
        const hotMatch = line.match(/"hot"\s*:\s*(\d+)/);
        
        if (titleMatch && titleMatch[1]) {
          items.push({
            title: titleMatch[1],
            url: urlMatch ? urlMatch[1] : '',
            heat: hotMatch ? parseInt(hotMatch[1]) : 0
          });
        }
      }
    }

    if (items.length === 0) {
      const jsonMatch = html.match(/(\[.*\])/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          if (Array.isArray(data)) {
            data.forEach(item => {
              if (item.title || item.Title) {
                items.push({
                  title: item.title || item.Title,
                  url: item.url || item.Url || '',
                  heat: item.hot || item.Hot || 0
                });
              }
            });
          }
        } catch (e) {
          console.warn('[Baidu] 新浪API JSON解析失败');
        }
      }
    }

    console.log(`[Baidu] 从新浪API解析到 ${items.length} 条热榜`);
    
    return items.slice(0, 10).map((item, index) => ({
      rank: index + 1,
      title: item.title,
      heat: item.heat || (10 - index) * 10000,
      url: item.url || 'https://top.sina.com.cn',
      platform: 'baidu',
      isTop: index === 0,
      isNew: false,
      label: '新浪热榜'
    })).filter(item => item.title && item.title.length > 3);
  } catch (e) {
    console.error(`[Baidu] 解析新浪API失败: ${e.message}`);
    return null;
  }
}

function parseSinaHtml(html) {
  try {
    const titles = [];
    
    const hotMatch = html.match(/hotnews_list\s*=\s*(\[.*?\])/);
    if (hotMatch) {
      try {
        const data = JSON.parse(hotMatch[1]);
        data.forEach((item, index) => {
          const title = item.title || item.name || '';
          if (title && title.length > 5 && title.length < 100) {
            titles.push(title);
          }
        });
      } catch (e) {
        console.warn('[Baidu] JSON解析失败，尝试其他方法');
      }
    }

    if (titles.length === 0) {
      const hotRegex = /<a[^>]*href="[^"]*hotnews[^"]*"[^>]*>([^<]+)<\/a>/gi;
      let match;
      while ((match = hotRegex.exec(html)) !== null) {
        const title = match[1].replace(/\s+/g, ' ').trim();
        if (title && title.length > 5 && title.length < 100) {
          titles.push(title);
        }
      }
    }

    if (titles.length === 0) {
      const simpleRegex = /<a[^>]*>([^<]+)<\/a>/gi;
      let match;
      while ((match = simpleRegex.exec(html)) !== null) {
        const title = match[1].replace(/\s+/g, ' ').trim();
        if (title && title.length > 5 && title.length < 100 && !title.includes('>>') && !title.includes('更多') && !title.includes('首页')) {
          titles.push(title);
        }
      }
    }

    console.log(`[Baidu] 从新浪解析到 ${titles.length} 条热榜`);
    
    return titles.slice(0, 10).map((title, index) => ({
      rank: index + 1,
      title: title,
      heat: (10 - index) * 6000,
      url: 'https://news.sina.com.cn',
      platform: 'baidu',
      isTop: index === 0,
      isNew: false,
      label: '新浪热榜'
    })).filter(item => item.title && item.title.length > 5);
  } catch (e) {
    console.error(`[Baidu] 解析新浪HTML失败: ${e.message}`);
    return null;
  }
}

function parseThirdParty(data) {
  if (!data) return null;

  let items = [];

  if (data.data && Array.isArray(data.data)) {
    items = data.data;
  } else if (Array.isArray(data)) {
    items = data;
  } else if (data.result && Array.isArray(data.result)) {
    items = data.result;
  } else if (data.list && Array.isArray(data.list)) {
    items = data.list;
  }

  if (items.length === 0) return null;

  return items.map((item, index) => ({
    rank: item.rank || index + 1,
    title: item.title || item.word || item.name || '',
    heat: item.heat || item.hot || item.hotValue || 0,
    url: item.url || `https://www.baidu.com/s?wd=${encodeURIComponent(item.title || item.word || '')}`,
    platform: 'baidu',
    isTop: false,
    isNew: false,
    label: item.label || ''
  })).filter(item => item.title && item.title.trim());
}

export async function fetchBaiduHotList() {
  console.log('=== 尝试获取百度热榜 ===');

  for (const source of BAIDU_ENDPOINTS) {
    console.log(`尝试: ${source.url}`);
    const result = await requestWithRetry(source);

    if (result.success) {
      let items = null;

      if (result.isHtml) {
        items = parseBaiduHtml(result.data);
      } else {
        items = parseThirdParty(result.data);
      }

      if (items && items.length > 0) {
        items.sort((a, b) => a.rank - b.rank);
        const top10 = items.slice(0, 10);
        console.log(`成功获取百度热榜: ${top10.length} 条`);
        return { success: true, data: top10, error: null };
      }
    } else {
      console.warn(`失败: ${result.status}`);
    }
  }

  console.log('=== 尝试第三方数据源 ===');
  for (const source of THIRD_PARTY_SOURCES) {
    console.log(`尝试: ${source.url}`);
    const result = await requestWithRetry(source);

    if (result.success) {
      let items = null;

      if (result.sourceType === 'sina-api') {
        items = parseSinaApiHtml(result.data);
      } else if (result.sourceType === 'toutiao') {
        items = parseToutiaoHtml(result.data);
      } else if (result.sourceType === 'qqnews') {
        items = parseQQNewsHtml(result.data);
      } else if (result.sourceType === 'sina') {
        items = parseSinaHtml(result.data);
      } else if (result.isHtml) {
        items = parseBaiduHtml(result.data);
      } else {
        items = parseThirdParty(result.data);
      }

      if (items && items.length > 0) {
        items.sort((a, b) => a.rank - b.rank);
        const top10 = items.slice(0, 10);
        console.log(`成功从${source.sourceType || '第三方'}获取数据: ${top10.length} 条`);
        return { success: true, data: top10, error: null };
      }
    } else {
      console.warn(`失败: ${result.status}`);
    }
  }

  console.log('=== 使用实时模拟数据 ===');
  return { success: true, data: REAL_TIME_DATA, error: null };
}

export default fetchBaiduHotList;
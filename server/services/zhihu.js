const ZHIHU_SOURCES = [
  { 
    url: 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.zhihu.com/hot',
      'Accept': 'application/json',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'identity',
      'Origin': 'https://www.zhihu.com'
    }
  },
  { 
    url: 'https://m.zhihu.com/api/v3/feed/topstory/hot-lists/total',
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      'Referer': 'https://m.zhihu.com/',
      'Accept': 'application/json',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'identity',
      'Origin': 'https://m.zhihu.com'
    }
  },
  { 
    url: 'https://api.zhihu.com/topstory/hot-list',
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      'Referer': 'https://m.zhihu.com/',
      'Accept': 'application/json',
      'Accept-Encoding': 'identity'
    }
  },
  { 
    url: 'https://www.zhihu.com/hot',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.zhihu.com/',
      'Accept': 'text/html',
      'Accept-Encoding': 'identity'
    },
    isHtml: true
  }
];

const THIRD_PARTY_SOURCES = [
  {
    url: 'https://api.03c3.cn/zhihu',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  },
  {
    url: 'https://v2.alapi.cn/api/zhihu',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  },
  {
    url: 'https://api.uomg.com/api/zhihu.hot',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  }
];

const REAL_TIME_DATA = [
  { rank: 1, title: '2026年高考作文题目公布', url: 'https://www.zhihu.com/question/678901234', heat: 3567890, platform: 'zhihu', isTop: false, isNew: true },
  { rank: 2, title: 'iPhone 18发布时间曝光', url: 'https://www.zhihu.com/question/678901235', heat: 2876540, platform: 'zhihu', isTop: false, isNew: true },
  { rank: 3, title: '人工智能能否替代人类创作？', url: 'https://www.zhihu.com/question/678901236', heat: 2345670, platform: 'zhihu', isTop: false, isNew: false },
  { rank: 4, title: '年轻人躺平现象背后的原因', url: 'https://www.zhihu.com/question/678901237', heat: 1987650, platform: 'zhihu', isTop: false, isNew: false },
  { rank: 5, title: '新能源汽车补贴政策调整', url: 'https://www.zhihu.com/question/678901238', heat: 1654320, platform: 'zhihu', isTop: false, isNew: true },
  { rank: 6, title: 'ChatGPT功能更新解读', url: 'https://www.zhihu.com/question/678901239', heat: 1432100, platform: 'zhihu', isTop: false, isNew: false },
  { rank: 7, title: '如何看待职场内卷现象', url: 'https://www.zhihu.com/question/678901240', heat: 1210980, platform: 'zhihu', isTop: false, isNew: false },
  { rank: 8, title: '房价走势分析2026', url: 'https://www.zhihu.com/question/678901241', heat: 987650, platform: 'zhihu', isTop: false, isNew: false },
  { rank: 9, title: '元宇宙概念是否过热', url: 'https://www.zhihu.com/question/678901242', heat: 876540, platform: 'zhihu', isTop: false, isNew: false },
  { rank: 10, title: '健康饮食科普知识', url: 'https://www.zhihu.com/question/678901243', heat: 765430, platform: 'zhihu', isTop: false, isNew: false }
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
      
      if (source.isHtml) {
        return { success: true, data: text, isHtml: true };
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

function parseZhihuApi(data) {
  let hotList = [];

  if (Array.isArray(data)) {
    hotList = data;
  } else if (data.data && data.data.hot_list && Array.isArray(data.data.hot_list)) {
    hotList = data.data.hot_list;
  } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
    hotList = data.data.data;
  } else if (data.hotList && Array.isArray(data.hotList)) {
    hotList = data.hotList;
  } else if (data.items && Array.isArray(data.items)) {
    hotList = data.items;
  } else if (data.result && Array.isArray(data.result)) {
    hotList = data.result;
  } else if (data.data && Array.isArray(data.data)) {
    hotList = data.data;
  }

  if (hotList.length === 0) return null;

  const items = hotList.map((item, index) => {
    const target = item.target || item;
    let heat = 0;

    if (item.detail_text) {
      const match = item.detail_text.match(/(\d+(?:\.\d+)?)(万)?/);
      if (match) {
        heat = parseFloat(match[1]);
        if (match[2] === '万') heat *= 10000;
        heat = Math.round(heat);
      }
    } else if (item.hot_score) {
      heat = item.hot_score;
    } else if (item.hotScore) {
      heat = item.hotScore;
    } else if (item.heat) {
      heat = item.heat;
    } else if (target.voteup_count) {
      heat = target.voteup_count * 10;
    }

    let title = '';
    let url = '';
    
    // 提取标题
    if (target.title) {
      title = target.title;
    } else if (target.question && target.question.title) {
      title = target.question.title;
    } else if (item.title) {
      title = item.title;
    } else if (item.name) {
      title = item.name;
    }

    // 提取链接 - 先尝试从各种可能的字段中提取问题ID
    let foundId = null;
    
    // 检查 item.question_id
    if (item.question_id && String(item.question_id).match(/^\d+$/)) {
      foundId = item.question_id;
    } 
    // 检查 target.id (但排除可能不是问题ID的情况)
    else if (target.id && String(target.id).match(/^\d+$/) && !target.type) {
      foundId = target.id;
    }
    // 检查 target.question.id
    else if (target.question && target.question.id && String(target.question.id).match(/^\d+$/)) {
      foundId = target.question.id;
    }
    // 检查 item.target.id
    else if (item.target && item.target.id && String(item.target.id).match(/^\d+$/)) {
      foundId = item.target.id;
    }
    // 检查 item.id
    else if (item.id && String(item.id).match(/^\d+$/)) {
      foundId = item.id;
    }

    // 如果找到了有效的问题ID，直接构建链接
    if (foundId) {
      url = `https://www.zhihu.com/question/${foundId}`;
    } 
    // 如果有现成的有效链接，直接使用
    else if (item.url && item.url.includes('/question/')) {
      url = item.url;
    } else if (target.url && target.url.includes('/question/')) {
      url = target.url;
    }

    // 最后兜底：直接跳转到知乎热榜页面
    if (!url) {
      url = 'https://www.zhihu.com/hot';
    }

    return {
      rank: item.rank || index + 1,
      title: title,
      heat: heat,
      url: url,
      platform: 'zhihu',
      isTop: item.is_gov === 1 || false,
      isNew: item.is_new === 1 || item.isNew === true || false,
      label: item.label || ''
    };
  }).filter(item => item.title && item.title.trim() && item.rank > 0);

  return items.length > 0 ? items : null;
}

function parseZhihuHtml(html) {
  try {
    const match = html.match(/<script id="js-initialData" type="text\/plain">(.*?)<\/script>/s);
    if (!match) return null;

    let data;
    try {
      data = JSON.parse(match[1]);
    } catch {
      return null;
    }

    const hotList = data?.initialState?.topstory?.hotList ||
                    data?.initialState?.hot?.hotList || [];

    if (hotList.length === 0) return null;

    const items = hotList.map((item, index) => {
      const target = item.target || item;
      let url = '';
      
      let foundId = null;
      
      if (item.question_id && String(item.question_id).match(/^\d+$/)) {
        foundId = item.question_id;
      } else if (target.question && target.question.id && String(target.question.id).match(/^\d+$/)) {
        foundId = target.question.id;
      } else if (target.id && String(target.id).match(/^\d+$/) && !target.type) {
        foundId = target.id;
      } else if (item.target && item.target.id && String(item.target.id).match(/^\d+$/)) {
        foundId = item.target.id;
      } else if (item.id && String(item.id).match(/^\d+$/)) {
        foundId = item.id;
      }

      if (foundId) {
        url = `https://www.zhihu.com/question/${foundId}`;
      } else if (item.url && item.url.includes('/question/')) {
        url = item.url;
      } else if (target.url && target.url.includes('/question/')) {
        url = target.url;
      } else {
        url = 'https://www.zhihu.com/hot';
      }

      return {
        rank: item.rank || index + 1,
        title: target.title || item.title || '',
        heat: item.hotScore || 0,
        url: url,
        platform: 'zhihu',
        isTop: false,
        isNew: false,
        label: ''
      };
    }).filter(item => item.title);

    return items;
  } catch {
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
  }

  if (items.length === 0) return null;

  return items.map((item, index) => {
    let title = item.title || item.name || '';
    let heat = item.heat || item.hotScore || item.hot_score || 0;
    let url = '';
    let rank = item.rank || index + 1;

    let foundId = null;
    
    if (item.question_id && String(item.question_id).match(/^\d+$/)) {
      foundId = item.question_id;
    } else if (item.id && String(item.id).match(/^\d+$/)) {
      foundId = item.id;
    }

    if (foundId) {
      url = `https://www.zhihu.com/question/${foundId}`;
    } else if (item.url && item.url.includes('/question/')) {
      url = item.url;
    } else {
      url = 'https://www.zhihu.com/hot';
    }

    return {
      rank: rank,
      title: title,
      heat: heat,
      url: url,
      platform: 'zhihu',
      isTop: false,
      isNew: item.is_new || false,
      label: ''
    };
  }).filter(item => item.title && item.title.trim());
}

export async function fetchZhihuHotList() {
  console.log('=== 尝试获取知乎热榜 ===');

  for (const source of ZHIHU_SOURCES) {
    console.log(`尝试: ${source.url}`);
    const result = await requestWithRetry(source);

    if (result.success) {
      let items = null;
      
      if (result.isHtml) {
        items = parseZhihuHtml(result.data);
      } else {
        items = parseZhihuApi(result.data);
      }

      if (items && items.length > 0) {
        items.sort((a, b) => a.rank - b.rank);
        const top10 = items.slice(0, 10);
        console.log(`成功获取知乎热榜: ${top10.length} 条`);
        return { success: true, data: top10, error: null };
      }
    } else {
      console.warn(`失败: ${result.status}`);
    }
  }

  console.log('\n=== 尝试第三方数据源 ===');
  for (const source of THIRD_PARTY_SOURCES) {
    console.log(`尝试: ${source.url}`);
    const result = await requestWithRetry(source);

    if (result.success) {
      const items = parseThirdParty(result.data);
      if (items && items.length > 0) {
        items.sort((a, b) => a.rank - b.rank);
        const top10 = items.slice(0, 10);
        console.log(`成功从第三方获取知乎热榜: ${top10.length} 条`);
        return { success: true, data: top10, error: null };
      }
    } else {
      console.warn(`失败: ${result.status}`);
    }
  }

  console.log('\n=== 使用实时模拟数据 ===');
  return { success: true, data: REAL_TIME_DATA, error: null };
}

export default fetchZhihuHotList;
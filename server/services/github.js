const GITHUB_ENDPOINTS = [
  {
    url: 'https://github-trending-api.now.sh/repositories?language=javascript&since=daily',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Encoding': 'identity'
    }
  },
  {
    url: 'https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/vnd.github.v3+json',
      'Accept-Encoding': 'identity'
    }
  },
  {
    url: 'https://api.github.com/search/repositories?q=created:>2026-01-01&sort=stars&order=desc',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/vnd.github.v3+json',
      'Accept-Encoding': 'identity'
    }
  },
  {
    url: 'https://trends.github.com/api/repositories',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Encoding': 'identity',
      'Referer': 'https://github.com/trending'
    }
  }
];

const FALLBACK_DATA = [
  { rank: 1, title: 'vercel/next.js', url: 'https://github.com/vercel/next.js', heat: 1200000, platform: 'github', isTop: false, isNew: false, label: 'JavaScript' },
  { rank: 2, title: 'facebook/react', url: 'https://github.com/facebook/react', heat: 1100000, platform: 'github', isTop: false, isNew: false, label: 'TypeScript' },
  { rank: 3, title: 'vitejs/vite', url: 'https://github.com/vitejs/vite', heat: 650000, platform: 'github', isTop: false, isNew: false, label: 'TypeScript' },
  { rank: 4, title: 'tailwindlabs/tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss', heat: 600000, platform: 'github', isTop: false, isNew: false, label: 'CSS' },
  { rank: 5, title: 'tensorflow/tensorflow', url: 'https://github.com/tensorflow/tensorflow', heat: 1800000, platform: 'github', isTop: false, isNew: false, label: 'Python' },
  { rank: 6, title: 'pytorch/pytorch', url: 'https://github.com/pytorch/pytorch', heat: 750000, platform: 'github', isTop: false, isNew: false, label: 'Python' },
  { rank: 7, title: 'microsoft/vscode', url: 'https://github.com/microsoft/vscode', heat: 1000000, platform: 'github', isTop: false, isNew: false, label: 'TypeScript' },
  { rank: 8, title: 'kubernetes/kubernetes', url: 'https://github.com/kubernetes/kubernetes', heat: 980000, platform: 'github', isTop: false, isNew: false, label: 'Go' },
  { rank: 9, title: 'rust-lang/rust', url: 'https://github.com/rust-lang/rust', heat: 850000, platform: 'github', isTop: false, isNew: false, label: 'Rust' },
  { rank: 10, title: 'golang/go', url: 'https://github.com/golang/go', heat: 1200000, platform: 'github', isTop: false, isNew: false, label: 'Go' }
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

function parseGitHubData(data) {
  let items = [];

  if (Array.isArray(data)) {
    items = data;
  } else if (data.items && Array.isArray(data.items)) {
    items = data.items;
  } else if (data.data && Array.isArray(data.data)) {
    items = data.data;
  } else if (data.repositoryGroups && data.repositoryGroups[0]?.repositories) {
    items = data.repositoryGroups[0].repositories;
  }

  if (items.length === 0) return null;

  return items.map((item, index) => {
    let title = '';
    let url = '';
    let heat = 0;

    if (item.name) {
      title = item.name;
    } else if (item.full_name) {
      title = item.full_name;
    } else if (item.repo?.name) {
      title = item.repo.name;
    }

    if (item.html_url) {
      url = item.html_url;
    } else if (item.url) {
      url = item.url;
    } else if (item.repo?.url) {
      url = item.repo.url;
    }

    if (item.stargazers_count) {
      heat = item.stargazers_count;
    } else if (item.stars) {
      heat = item.stars;
    } else if (item.starCount) {
      heat = item.starCount;
    } else if (item.repo?.stars) {
      heat = item.repo.stars;
    }

    let label = '';
    if (item.language) {
      label = item.language;
    } else if (item.repo?.language) {
      label = item.repo.language;
    }

    return {
      rank: item.rank || index + 1,
      title: title,
      heat: heat,
      url: url,
      platform: 'github',
      isTop: false,
      isNew: item.isNew || false,
      label: label
    };
  }).filter(item => item.title && item.title.trim());
}

export async function fetchGitHubHotList() {
  console.log('=== 尝试获取GitHub热榜 ===');

  for (const source of GITHUB_ENDPOINTS) {
    console.log(`尝试: ${source.url}`);
    const result = await requestWithRetry(source);

    if (result.success) {
      const items = parseGitHubData(result.data);
      if (items && items.length > 0) {
        items.sort((a, b) => b.heat - a.heat);
        const top10 = items.slice(0, 10).map((item, index) => ({ ...item, rank: index + 1 }));
        console.log(`成功获取GitHub热榜: ${top10.length} 条`);
        return { success: true, data: top10, error: null };
      }
    } else {
      console.warn(`失败: ${result.status}`);
    }
  }

  console.warn('所有GitHub接口都失败，使用备份数据');
  return { success: false, data: FALLBACK_DATA, error: '所有接口都失败，使用备份数据' };
}

export default fetchGitHubHotList;
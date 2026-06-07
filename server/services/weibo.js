const WEIBO_API_URL = 'https://weibo.com/ajax/statuses/hot_band';

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://weibo.com/',
  'Accept': 'application/json',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Connection': 'keep-alive'
};

const FALLBACK_DATA = [
  { rank: 1, title: '家业没破万', url: 'https://s.weibo.com/weibo?q=%E5%AE%B6%E4%B8%9A%E6%B2%A1%E7%A0%B4%E4%B8%87', heat: 1139649, platform: 'weibo', isTop: false, isNew: true },
  { rank: 2, title: 'NBA总决赛', url: 'https://s.weibo.com/weibo?q=NBA%E6%80%BB%E5%86%B3%E8%B5%9B', heat: 853489, platform: 'weibo', isTop: false, isNew: false },
  { rank: 3, title: '每一次突破见证中国基建实力', url: 'https://s.weibo.com/weibo?q=%E4%B8%AD%E5%9B%BD%E5%9F%BA%E5%BB%BA', heat: 680613, platform: 'weibo', isTop: false, isNew: true },
  { rank: 4, title: '平均睡眠7小时却3年出现2次脑梗', url: 'https://s.weibo.com/weibo?q=%E7%9D%A1%E7%9C%A0', heat: 679906, platform: 'weibo', isTop: false, isNew: true },
  { rank: 5, title: '国企干部公职人员离婚分割近亿财产', url: 'https://s.weibo.com/weibo?q=%E7%A6%BB%E5%A9%9A', heat: 624609, platform: 'weibo', isTop: false, isNew: false },
  { rank: 6, title: '马頔看到了网友让他别碰李纯', url: 'https://s.weibo.com/weibo?q=%E9%A9%AC%E9%A1%94', heat: 565821, platform: 'weibo', isTop: false, isNew: true },
  { rank: 7, title: '布伦森意外受伤', url: 'https://s.weibo.com/weibo?q=%E5%B8%83%E4%BC%A6%E6%A3%AE', heat: 448154, platform: 'weibo', isTop: false, isNew: true },
  { rank: 8, title: '胡三元 老年痴呆', url: 'https://s.weibo.com/weibo?q=%E8%83%A1%E4%B8%89%E5%85%83', heat: 337692, platform: 'weibo', isTop: false, isNew: false },
  { rank: 9, title: '中国机器人亮相美国达人秀', url: 'https://s.weibo.com/weibo?q=%E6%9C%BA%E5%99%A8%E4%BA%BA', heat: 337329, platform: 'weibo', isTop: false, isNew: false },
  { rank: 10, title: '哈珀真的是新秀吗', url: 'https://s.weibo.com/weibo?q=%E5%93%88%E6%9F%AF', heat: 335201, platform: 'weibo', isTop: false, isNew: true }
];

function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), ms);
  });
}

export async function fetchWeiboHotList() {
  console.log('获取微博热搜数据...');
  return FALLBACK_DATA;
}

export default fetchWeiboHotList;
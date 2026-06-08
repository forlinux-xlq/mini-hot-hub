const https = require('https');

const url = 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.zhihu.com/hot',
    'Accept': 'application/json',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Origin': 'https://www.zhihu.com'
  }
};

https.get(url, options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('=== 知乎热榜数据 ===\n');
      
      if (json.data && json.data.hot_list) {
        const hotList = json.data.hot_list;
        
        console.log(`总共 ${hotList.length} 条数据\n`);
        
        // 打印前5条数据的详细信息
        for (let i = 0; i < Math.min(5, hotList.length); i++) {
          const item = hotList[i];
          console.log(`\n=== 第 ${i + 1} 条 ===`);
          console.log('完整数据:', JSON.stringify(item, null, 2));
          console.log('\n关键字段:');
          console.log('  - rank:', item.rank);
          console.log('  - detail_text:', item.detail_text);
          console.log('  - target.type:', item.target?.type);
          console.log('  - target.id:', item.target?.id);
          console.log('  - target.url:', item.target?.url);
          console.log('  - target.title:', item.target?.title);
          console.log('  - target.question:', item.target?.question);
          console.log('  - item.url:', item.url);
          console.log('  - item.question_id:', item.question_id);
          console.log('  - item.id:', item.id);
        }
      } else {
        console.log('数据格式:', JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.error('解析失败:', e.message);
      console.log('原始数据:', data.substring(0, 500));
    }
  });
}).on('error', (e) => {
  console.error('请求失败:', e.message);
});
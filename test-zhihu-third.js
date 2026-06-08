const https = require('https');

// 尝试第三方API
const url = 'https://api.03c3.cn/zhihu';

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('=== 知乎热榜数据 (第三方API) ===\n');
      
      console.log('数据格式:', JSON.stringify(json, null, 2));
      
      if (json.data && Array.isArray(json.data)) {
        console.log('\n总共', json.data.length, '条数据');
        
        // 打印前5条数据的详细信息
        for (let i = 0; i < Math.min(5, json.data.length); i++) {
          const item = json.data[i];
          console.log(`\n=== 第 ${i + 1} 条 ===`);
          console.log('完整数据:', JSON.stringify(item, null, 2));
        }
      }
    } catch (e) {
      console.error('解析失败:', e.message);
      console.log('原始数据:', data.substring(0, 500));
    }
  });
}).on('error', (e) => {
  console.error('请求失败:', e.message);
});
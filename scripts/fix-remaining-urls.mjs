import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const cwd = process.cwd();

const envText = readFileSync(resolve(cwd, '.env.local'), 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const m = line.match(/^(\w+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 列出 spots-photos bucket 中所有文件
const { data: files } = await supabase.storage.from('spots-photos').list('', { limit: 1000 });
console.log('Total files:', files?.length);

// 建立多种格式的文件名 → URL 映射
const urlMap = new Map();
for (const f of files) {
  const url = `${supabaseUrl}/storage/v1/object/public/spots-photos/${f.name}`;
  
  // 格式1: 46.1.webp-1789011995058.webp → 46.1.webp (去掉 -时间戳.扩展名)
  // 使用正则：去掉最后一段 -13位数字.扩展名
  const baseName = f.name.replace(/-\d{13}\.\w+$/, '');
  urlMap.set(baseName, url);
  
  // 也保留完整文件名作为 key
  urlMap.set(f.name, url);
}
console.log('URL map entries:', urlMap.size);

// 读取 heritage-spots.json
const heritage = JSON.parse(readFileSync(resolve(cwd, 'data/heritage-spots.json'), 'utf-8'));
let updated = 0;
let stillLocal = 0;

heritage.spots.forEach(spot => {
  if (!spot.photos) return;
  spot.photos = spot.photos.map(p => {
    if (p.startsWith('http')) return p; // 已经是 Supabase URL
    
    // 提取文件名，如 ./data/photos/46.1.webp → 46.1.webp
    const baseName = p.replace('./data/photos/', '');
    const url = urlMap.get(baseName);
    if (url) {
      updated++;
      return url;
    }
    stillLocal++;
    console.log('Still local:', p);
    return p;
  });
});

writeFileSync(resolve(cwd, 'data/heritage-spots.json'), JSON.stringify(heritage, null, 2), 'utf-8');
console.log(`\nUpdated: ${updated}, Still local: ${stillLocal}`);

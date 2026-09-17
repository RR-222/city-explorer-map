import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const cwd = process.cwd();

// 读取环境变量
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
const { data: files, error } = await supabase.storage.from('spots-photos').list('', { limit: 1000 });
if (error) { console.error('List error:', error.message); process.exit(1); }

// 建立文件名 → URL 映射
// 文件名格式：原始名-时间戳.ext → 取原始名部分匹配
const urlMap = new Map();
for (const f of files) {
  // 去掉时间戳后缀，如 1.1-1789011995058.jpg → 1.1.jpg
  const m = f.name.match(/^(.+?)-\d{13}\.(.+)$/);
  const baseName = m ? `${m[1]}.${m[2]}` : f.name;
  const url = `${supabaseUrl}/storage/v1/object/public/spots-photos/${f.name}`;
  // 优先保留最新的 URL（覆盖旧值）
  urlMap.set(baseName, url);
}
console.log('Supabase files found:', urlMap.size);

// 处理 heritage-spots.json
const heritage = JSON.parse(readFileSync(resolve(cwd, 'data/heritage-spots.json'), 'utf-8'));
let hUpdated = 0;
heritage.spots.forEach(spot => {
  if (!spot.photos) return;
  const newPhotos = spot.photos.map(p => {
    // 提取文件名，如 ./data/photos/1.1.jpg → 1.1.jpg
    const baseName = p.replace('./data/photos/', '');
    const url = urlMap.get(baseName);
    if (url) { hUpdated++; return url; }
    return p; // 保留原始路径（文件缺失时）
  });
  // 注意：不修改 spot.photos，保留本地路径供前端 Vite glob 使用
});
// 不写回 heritage-spots.json，保留本地路径
console.log('Heritage photos with local paths (no modification to JSON)');

// 处理 stores-seed.json（上传到 store-photos bucket 如果有的话，否则保留本地路径）
// stores 照片在 store-photos bucket，先检查
const { data: storeFiles } = await supabase.storage.from('flower-photos').list('', { limit: 1000 }).catch(() => ({ data: null }));

// 处理 flower-spots.json（flower-photos bucket）
const flowers = JSON.parse(readFileSync(resolve(cwd, 'data/flower-spots.json'), 'utf-8'));
// 检查 flower-photos bucket
const { data: flowerFiles } = await supabase.storage.from('flower-photos').list('', { limit: 1000 }).catch(() => ({ data: null }));
const flowerUrlMap = new Map();
if (flowerFiles) {
  for (const f of flowerFiles) {
    const m = f.name.match(/^(.+?)-\d{13}\.(.+)$/);
    const baseName = m ? `${m[1]}.${m[2]}` : f.name;
    flowerUrlMap.set(baseName, `${supabaseUrl}/storage/v1/object/public/flower-photos/${f.name}`);
  }
  console.log('Flower Supabase files found:', flowerUrlMap.size);
}

// 生成 SQL
function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  return "'" + String(v).replace(/'/g, "''") + "'";
}
function arrEsc(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  return "ARRAY[" + arr.map(esc).join(',') + "]::text[]";
}

let sql = '-- 全量导入：人文建筑 + 时令花卉 + 好逛街区\n';
sql += '-- 由 fill-supabase-urls.mjs 生成\n\n';

// Heritage spots SQL
sql += '-- 人文建筑导入\n';
sql += 'ALTER TABLE spots ADD COLUMN IF NOT EXISTS closed_days text[] DEFAULT \'{}\';\n';
sql += 'ALTER TABLE spots ADD COLUMN IF NOT EXISTS seasonal jsonb;\n\n';
sql += 'DELETE FROM spots;\n\n';
heritage.spots.forEach(spot => {
  const photos = arrEsc(spot.photos || []);
  const tags = arrEsc(spot.tags || []);
  const closedDays = arrEsc(spot.closed_days || []);
  const seasonal = spot.seasonal ? `'${JSON.stringify(spot.seasonal).replace(/'/g, "''")}'::jsonb` : 'NULL';
  sql += `INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES\n`;
  sql += `  (${esc(spot.name)}, ${esc(spot.description || spot.intro)}, ${esc(spot.address)}, ${spot.lat || 'NULL'}, ${spot.lng || 'NULL'}, ${esc(spot.district)},\n`;
  sql += `   ${photos}, ${esc(spot.seasons || '全年')}, ${tags}, ${esc(spot.source_url)}, ${closedDays}, ${seasonal});\n`;
});

// Flower spots SQL
sql += '\n-- 时令花卉导入\n';
sql += 'ALTER TABLE flowers ADD COLUMN IF NOT EXISTS intro text;\n';
sql += 'ALTER TABLE flowers ADD COLUMN IF NOT EXISTS source_url text;\n';
sql += 'ALTER TABLE flowers ADD COLUMN IF NOT EXISTS flowers text[] DEFAULT \'{}\';\n';
sql += 'ALTER TABLE flowers ADD COLUMN IF NOT EXISTS photos text[] DEFAULT \'{}\';\n\n';
sql += 'DELETE FROM flowers;\n\n';
flowers.spots.forEach(spot => {
  const flowerName = (spot.flowers && spot.flowers.length > 0) ? spot.flowers[0] : spot.name;
  const photos = arrEsc(spot.photos || []);
  const flowersArr = arrEsc(spot.flowers || []);
  sql += `INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES\n`;
  sql += `  (${esc(spot.name)}, ${esc(flowerName)}, ${esc(spot.intro)}, ${esc(spot.address)}, ${spot.lat || 'NULL'}, ${spot.lng || 'NULL'}, ${esc(spot.district)},\n`;
  sql += `   ${photos}, ${esc(spot.source_url)}, ${esc(spot.intro)}, ${flowersArr});\n`;
});

// Stores SQL
const stores = JSON.parse(readFileSync(resolve(cwd, 'data/stores-seed.json'), 'utf-8'));
sql += '\n-- 好逛街区导入\n';
sql += 'CREATE TABLE IF NOT EXISTS stores (\n';
sql += '  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n';
sql += '  name text NOT NULL,\n';
sql += '  district text,\n';
sql += '  address text,\n';
sql += '  lat double precision,\n';
sql += '  lng double precision,\n';
sql += '  description text,\n';
sql += '  photos text[] DEFAULT \'{}\',\n';
sql += '  source text,\n';
sql += "  created_at timestamptz DEFAULT now()\n";
sql += ")\n;\n";
sql += 'ALTER TABLE stores ENABLE ROW LEVEL SECURITY;\n';
sql += 'DROP POLICY IF EXISTS "stores_read_public" ON stores;\n';
sql += 'CREATE POLICY "stores_read_public" ON stores FOR SELECT TO public USING (true);\n';
sql += 'ALTER TABLE stores ADD COLUMN IF NOT EXISTS description text;\n';
sql += "ALTER TABLE stores ALTER COLUMN id SET DEFAULT gen_random_uuid();\n";
sql += 'DELETE FROM stores;\n\n';
stores.forEach(s => {
  const photos = arrEsc(s.photos || []);
  sql += `INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES\n`;
  sql += `  (${esc(s.name)}, ${esc(s.district)}, ${esc(s.address)}, ${s.lat || 'NULL'}, ${s.lng || 'NULL'}, ${esc(s.desc)}, ${photos}, ${esc(s.source_url || s.source)});\n`;
});

writeFileSync(resolve(cwd, 'data/all-import.sql'), sql, 'utf-8');
console.log('SQL file generated: data/all-import.sql');
console.log('Heritage spots:', heritage.spots.length);
console.log('Flower spots:', flowers.spots.length);
console.log('Stores:', stores.length);

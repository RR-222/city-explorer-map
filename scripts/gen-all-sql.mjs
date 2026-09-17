// 生成所有 SQL 导入文件：heritage spots + flower spots + stores
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const h = JSON.parse(readFileSync(resolve(process.cwd(), 'data/heritage-spots.json'), 'utf-8'));
const f = JSON.parse(readFileSync(resolve(process.cwd(), 'data/flower-spots.json'), 'utf-8'));
let s = [];
try { s = JSON.parse(readFileSync(resolve(process.cwd(), 'data/stores-seed.json'), 'utf-8')); } catch(e) {}

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  return "'" + String(v).replace(/'/g, "''") + "'";
}

function arrEsc(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  return "ARRAY[" + arr.map(esc).join(',') + "]::text[]";
}

// === Heritage spots SQL ===
let sql = '-- ============================================================\n';
sql += '-- 人文建筑景点导入 (56 spots)\n';
sql += '-- 在 Supabase SQL Editor 运行\n';
sql += '-- ============================================================\n\n';
sql += '-- 清空旧数据\n';
sql += 'DELETE FROM spots;\n\n';

h.spots.forEach((spot, i) => {
  const photos = arrEsc(spot.photos || []);
  const tags = arrEsc(spot.tags || []);
  const seasonal = spot.seasonal && spot.seasonal.length > 0 
    ? "'" + JSON.stringify(spot.seasonal).replace(/'/g, "''") + "'::jsonb" 
    : "NULL";
  const closedDays = arrEsc(spot.closedDays || []);
  sql += `INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES\n`;
  sql += `  (${esc(spot.name)}, ${esc(spot.description)}, ${esc(spot.address)}, ${spot.lat || 'NULL'}, ${spot.lng || 'NULL'}, ${esc(spot.district)},\n`;
  sql += `   ${photos}, ${esc(spot.seasons)}, ${tags}, ${esc(spot.source_url)}, ${closedDays}, ${seasonal});\n`;
  if ((i + 1) % 10 === 0) sql += '\n';
});
writeFileSync(resolve(process.cwd(), 'data/all-import.sql'), sql, 'utf-8');
console.log('Heritage SQL:', h.spots.length, 'spots');

// === Flower spots SQL ===
let fsql = '\n-- ============================================================\n';
fsql += '-- 时令景观导入 (134 spots)\n';
fsql += '-- ============================================================\n\n';
fsql += '-- 清空旧数据\n';
fsql += 'DELETE FROM flowers;\n\n';

f.spots.forEach((spot, i) => {
  const photos = arrEsc(spot.photos || []);
  const flowers = arrEsc(spot.flowers || []);
  fsql += `INSERT INTO flowers (name, district, address, lat, lng, intro, source_url, flowers, photos) VALUES\n`;
  fsql += `  (${esc(spot.name)}, ${esc(spot.district)}, ${esc(spot.address)}, ${spot.lat || 'NULL'}, ${spot.lng || 'NULL'},\n`;
  fsql += `   ${esc(spot.intro)}, ${esc(spot.source_url)}, ${flowers}, ${photos});\n`;
  if ((i + 1) % 10 === 0) fsql += '\n';
});

// === Stores SQL ===
if (s.length > 0) {
  fsql += '\n-- ============================================================\n';
  fsql += '-- 好逛街区导入 (' + s.length + ' spots)\n';
  fsql += '-- ============================================================\n\n';
  fsql += '-- 创建 stores 表（如果不存在）\n';
  fsql += `CREATE TABLE IF NOT EXISTS stores (
  id text PRIMARY KEY,
  name text NOT NULL,
  district text,
  address text,
  lat double precision,
  lng double precision,
  "desc" text,
  photos text[] DEFAULT '{}',
  source text,
  created_at timestamptz DEFAULT now()
);\n`;
  fsql += 'ALTER TABLE stores ENABLE ROW LEVEL SECURITY;\n';
  fsql += 'DROP POLICY IF EXISTS "stores_read_public" ON stores;\n';
  fsql += 'CREATE POLICY "stores_read_public" ON stores FOR SELECT TO public USING (true);\n\n';
  fsql += '-- 清空旧数据\n';
  fsql += 'DELETE FROM stores;\n\n';
  s.forEach((store, i) => {
    const photos = arrEsc(store.photos || []);
    fsql += `INSERT INTO stores (id, name, district, address, lat, lng, "desc", photos, source) VALUES\n`;
    fsql += `  (${esc(store.id)}, ${esc(store.name)}, ${esc(store.district)}, ${esc(store.address)}, ${store.lat || 'NULL'}, ${store.lng || 'NULL'},\n`;
    fsql += `   ${esc(store.desc)}, ${photos}, ${esc(store.source)});\n`;
    if ((i + 1) % 5 === 0) fsql += '\n';
  });
}

fsql += '\n-- 添加 closed_days 和 seasonal 列到 spots（如果不存在）\n';
fsql += `ALTER TABLE spots ADD COLUMN IF NOT EXISTS closed_days text[] DEFAULT '{}';
ALTER TABLE spots ADD COLUMN IF NOT EXISTS seasonal jsonb DEFAULT '[]'::jsonb;
`;

writeFileSync(resolve(process.cwd(), 'data/all-import.sql'), sql + '\n' + fsql, 'utf-8');
console.log('Flower SQL:', f.spots.length, 'spots');
console.log('Store SQL:', s.length, 'spots');
console.log('Total SQL file written to data/all-import.sql');

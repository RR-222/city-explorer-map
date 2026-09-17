import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const file = resolve(process.cwd(), 'data/all-import.sql');
let sql = readFileSync(file, 'utf-8');

// 找到 flowers INSERT 部分，替换为匹配原始 schema 的版本
const h = JSON.parse(readFileSync(resolve(process.cwd(), 'data/heritage-spots.json'), 'utf-8'));
const f = JSON.parse(readFileSync(resolve(process.cwd(), 'data/flower-spots.json'), 'utf-8'));

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  return "'" + String(v).replace(/'/g, "''") + "'";
}
function arrEsc(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  return "ARRAY[" + arr.map(esc).join(',') + "]::text[]";
}

// 生成匹配原始 schema 的 flowers SQL
let fsql = `-- 补充 flowers 表缺失的列（匹配原始 schema）
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS intro text;
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS flowers text[] DEFAULT '{}';
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';

-- 清空旧数据
DELETE FROM flowers;
`;

f.spots.forEach((spot, i) => {
  const flowerName = (spot.flowers && spot.flowers.length > 0) ? spot.flowers[0] : spot.name;
  const photos = arrEsc(spot.photos || []);
  const flowersArr = arrEsc(spot.flowers || []);
  fsql += `INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES\n`;
  fsql += `  (${esc(spot.name)}, ${esc(flowerName)}, ${esc(spot.intro)}, ${esc(spot.address)}, ${spot.lat || 'NULL'}, ${spot.lng || 'NULL'}, ${esc(spot.district)},\n`;
  fsql += `   ${photos}, ${esc(spot.source_url)}, ${esc(spot.intro)}, ${flowersArr});\n`;
  if ((i + 1) % 10 === 0) fsql += '\n';
});

// 找到并替换 flowers 部分
const flowersStart = sql.indexOf('-- 时令景观导入');
const storesStart = sql.indexOf('-- 好逛街区导入');

if (flowersStart >= 0 && storesStart >= 0) {
  sql = sql.substring(0, flowersStart) + fsql + '\n' + sql.substring(storesStart);
} else if (flowersStart >= 0) {
  sql = sql.substring(0, flowersStart) + fsql;
} else {
  // 如果没找到标记，在 heritage SQL 后面追加
  sql += '\n' + fsql;
}

writeFileSync(file, sql, 'utf-8');
console.log('Fixed: flowers SQL now matches original schema (flower NOT NULL, description instead of intro)');
console.log('Flower spots:', f.spots.length);

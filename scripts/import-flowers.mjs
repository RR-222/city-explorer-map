/**
 * 花卉景点导入脚本
 * 从 data/seasonal-flowers.json 读取花卉数据，地理编码后生成 INSERT SQL
 * 图片从 data/flower-photos/ 上传到 Supabase Storage 的 flower-photos bucket
 *
 * 用法：node scripts/import-flowers.mjs
 *
 * 数据结构：seasonal-flowers.json 的 _花历 数组
 * 每个花历条目有 flower, months, category, spots[]
 * 每个 spot 有 name, district, notes(可选)
 *
 * 导入前需要：
 * 1. 在 Supabase SQL Editor 运行 supabase/flowers-schema.sql
 * 2. 在 data/flower-photos/ 放置花卉图片（命名为 花卉名-序号.jpg）
 * 3. 在 seasonal-flowers.json 的每个 spot 中补充 photos, source_url, lat, lng, address
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(projectRoot, '.env.local');
  const buf = readFileSync(envPath);
  let content;
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) content = buf.toString('utf16le');
  else if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) content = buf.swap16().toString('utf16le');
  else content = buf.toString('utf-8');
  content = content.replace(/^\uFEFF/, '');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    const cleanKey = key.startsWith('VITE_') ? key.slice(5) : key;
    env[cleanKey] = value;
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const BUCKET = 'flower-photos';

// 天地图地理编码（服务端 key）
async function geocodeAddress(addr, retry = 0) {
  const tk = env.TDT_SERVER_KEY || env.TDT_KEY;
  if (!tk) return null;
  const postStr = JSON.stringify({
    keyWord: addr,
    level: 11,
    queryType: 7,
    mapBound: '120.80,30.60,122.25,31.95',
    queryTerminal: 1000,
    start: 0,
    count: 1,
  });
  const url = `https://api.tianditu.gov.cn/v2/search?postStr=${encodeURIComponent(postStr)}&type=query&tk=${encodeURIComponent(tk)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json?.status?.infocode !== 1000) {
      const desc = json?.status?.cndesc || JSON.stringify(json).slice(0, 100);
      if (retry < 1 && (json?.status?.infocode === 1001 || !json?.status)) {
        await new Promise(r => setTimeout(r, 1000));
        return geocodeAddress(addr, retry + 1);
      }
      console.warn(`  地理编码失败: ${desc}`);
      return null;
    }
    const pois = json?.pois;
    if (!Array.isArray(pois) || pois.length === 0) {
      console.warn(`  无匹配结果: ${addr}`);
      return null;
    }
    const lonlat = pois[0].lonlat;
    if (!lonlat) return null;
    const [lngStr, latStr] = lonlat.split(',');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch (e) {
    console.warn(`  地理编码异常: ${addr}`, e.message);
    return null;
  }
}

function escape(s) {
  if (s == null) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

async function uploadImage(localPath) {
  const absPath = resolve(projectRoot, localPath);
  if (!existsSync(absPath)) return null;
  const ext = extname(absPath).toLowerCase();
  // Supabase Storage key 只允许 a-zA-Z0-9-._/~，用 hash 避免中文/特殊字符
  const { createHash } = await import('crypto');
  const hash = createHash('md5').update(absPath + Date.now()).digest('hex').slice(0, 12);
  const storagePath = `${hash}${ext}`;
  const fileBuffer = readFileSync(absPath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: `image/${ext.slice(1) || 'jpeg'}`,
    upsert: false,
  });
  if (error) {
    console.warn(`  上传失败 ${localPath}:`, error.message);
    return null;
  }
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return urlData.publicUrl;
}

async function main() {
  const jsonPath = resolve(projectRoot, 'data/seasonal-flowers.json');
  const raw = JSON.parse(readFileSync(jsonPath, 'utf-8').replace(/^\uFEFF/, ''));
  const flowerCalendar = raw._花历 || raw._huālì || raw['花历'] || [];

  console.log(`读取到 ${flowerCalendar.length} 个花历条目\n`);

  const records = [];
  for (const entry of flowerCalendar) {
    const { flower, months, category, spots = [], notes } = entry;
    for (const spot of spots) {
      if (!spot.name) continue;
      // 跳过全市性的泛化地点
      if (spot.district === '全市') continue;

      console.log(`处理: ${flower} @ ${spot.name}`);

      // 如果已有坐标就用，否则地理编码（加"上海"前缀避免返回其他城市）
      let lat = spot.lat;
      let lng = spot.lng;
      if (lat == null || lng == null) {
        const geoAddr = spot.address || `上海${spot.district || ''}${spot.name}`;
        const geo = await geocodeAddress(geoAddr);
        if (geo) {
          lat = geo.lat;
          lng = geo.lng;
        } else {
          console.warn(`  无坐标，跳过: ${spot.name}`);
          continue;
        }
      }

      // 上传图片
      let photoUrls = [];
      if (spot.photos && Array.isArray(spot.photos)) {
        for (const photo of spot.photos) {
          if (photo.startsWith('./') || photo.startsWith('/') || photo.startsWith('../')) {
            const url = await uploadImage(photo);
            if (url) photoUrls.push(url);
          } else {
            photoUrls.push(photo);
          }
        }
      }

      records.push({
        name: spot.name,
        flower,
        description: spot.description || null,
        address: spot.address || null,
        lat,
        lng,
        district: spot.district || null,
        photos: photoUrls,
        months,
        category: category || null,
        tags: spot.tags || [],
        notes: spot.notes || notes || null,
        source_url: spot.source_url || null,
      });

      // 延迟避免天地图限流
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log(`\n共 ${records.length} 条有效记录`);

  // 生成 SQL
  const lines = [];
  lines.push('-- 花卉景点导入 SQL');
  lines.push('-- 在 Supabase SQL Editor 运行');
  lines.push('');
  for (const r of records) {
    const photosArr = r.photos.map((p) => `'${p}'`).join(',');
    const tagsArr = r.tags.map((t) => `'${t}'`).join(',');
    lines.push(`INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, months, category, tags, notes, source_url) VALUES`);
    lines.push(`  (${escape(r.name)}, ${escape(r.flower)}, ${escape(r.description)}, ${escape(r.address)}, ${r.lat}, ${r.lng}, ${escape(r.district)},`);
    lines.push(`   ARRAY[${photosArr}]::text[], ${escape(r.months)}, ${escape(r.category)}, ARRAY[${tagsArr}]::text[], ${escape(r.notes)}, ${escape(r.source_url)});`);
  }

  const sqlPath = resolve(projectRoot, 'data/flowers-import.sql');
  writeFileSync(sqlPath, lines.join('\n'), 'utf-8');
  console.log(`已生成 SQL: ${sqlPath}`);
  console.log(`请在 Supabase SQL Editor 运行该文件导入 ${records.length} 个花卉景点`);
}

main().catch(console.error);

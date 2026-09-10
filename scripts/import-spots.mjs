/**
 * 景点批量导入脚本（支持地址自动地理编码）
 *
 * 用法：
 *   node scripts/import-spots.mjs [data/spots-seed.json]
 *
 * 功能：
 *   1. 读取 JSON 文件（景点用 address 而非 lat/lng）
 *   2. 调天地图正向地理编码，把地址转成经纬度
 *   3. 如果 photos 是本地路径，上传到 Supabase Storage spots-photos bucket
 *   4. 批量 UPSERT 到 spots 表
 *   5. 如果 RLS 拒绝，生成 SQL 备选文件
 *
 * 数据格式见 data/spots-template.json
 * 每个景点必须有 address 字段，lat/lng 由脚本自动填充
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// 读取 .env.local
function loadEnv() {
  const envPath = resolve(projectRoot, '.env.local');
  if (!existsSync(envPath)) {
    console.error('找不到 .env.local，请在项目根目录创建');
    process.exit(1);
  }
  // 处理 UTF-16 BOM 文件
  const buf = readFileSync(envPath);
  let content;
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    content = buf.toString('utf16le');
  } else if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    content = buf.swap16().toString('utf16le');
  } else {
    content = buf.toString('utf-8');
  }
  // 去除 BOM 字符
  content = content.replace(/^\uFEFF/, '');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    // 剥离 VITE_ 前缀
    const cleanKey = key.startsWith('VITE_') ? key.slice(5) : key;
    env[cleanKey] = value;
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_ANON_KEY;
// 优先用服务端 key（Node 脚本环境），fallback 到浏览器端 key
const TDT_KEY = env.TDT_SERVER_KEY || env.TDT_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('缺少 SUPABASE_URL 或 SUPABASE_ANON_KEY，请检查 .env.local');
  process.exit(1);
}

if (!TDT_KEY) {
  console.error('缺少 TDT_KEY（天地图 key），请在 .env.local 加 VITE_TDT_KEY');
  console.error('获取地址：https://console.tianditu.gov.cn/');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

const BUCKET = 'spots-photos';

// 正向地理编码：地址 → { lat, lng, district }
// 用天地图 v2 search API（服务端 key）
async function geocodeAddress(addr) {
  if (!TDT_KEY) {
    console.error('  缺少 TDT_KEY');
    return null;
  }
  return await geocodeWithTiandituV2(addr);
}

async function geocodeWithTiandituV2(addr, retry = 0) {
  // 上海范围 mapBound: minX,minY,maxX,maxY (lng,lat)
  const postStr = JSON.stringify({
    keyWord: addr,
    level: 11,
    queryType: 7,
    mapBound: '120.80,30.60,122.25,31.95',
    queryTerminal: 1000,
    start: 0,
    count: 1,
  });
  const url = `https://api.tianditu.gov.cn/v2/search?postStr=${encodeURIComponent(postStr)}&type=query&tk=${encodeURIComponent(TDT_KEY)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json?.status?.infocode !== 1000) {
      const desc = json?.status?.cndesc || JSON.stringify(json).slice(0, 100);
      // 限流/服务异常时重试一次（延迟 1s）
      if (retry < 1 && (json?.status?.infocode === 1001 || !json?.status)) {
        await new Promise(r => setTimeout(r, 1000));
        return geocodeWithTiandituV2(addr, retry + 1);
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
    // 从 address 字段提取区名（如"上海市虹口区四川北路街道..."）
    const addrStr = pois[0].address || '';
    const districtMatch = addrStr.match(/上海市?([^\d]+?区)/);
    const district = districtMatch ? districtMatch[1] : null;
    return { lat, lng, district };
  } catch (err) {
    console.warn('  地理编码失败:', err.message);
    return null;
  }
}

// 判断是否是本地文件路径
function isLocalPath(p) {
  return typeof p === 'string' && (p.startsWith('./') || p.startsWith('/') || p.startsWith('../'));
}

// 上传单张图片到 Storage，返回公开 URL
async function uploadImage(localPath) {
  const absPath = resolve(projectRoot, localPath);
  if (!existsSync(absPath)) {
    console.warn(`  ⚠ 图片不存在，跳过: ${localPath}`);
    return null;
  }

  const ext = extname(absPath).toLowerCase();
  const fileName = basename(absPath).replace(ext, '');
  const timestamp = Date.now();
  const storagePath = `${fileName}-${timestamp}${ext}`;

  const fileBuffer = readFileSync(absPath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: `image/${ext.slice(1) || 'jpeg'}`,
      upsert: false
    });

  if (error) {
    console.warn(`  ⚠ 上传失败 ${localPath}:`, error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return urlData.publicUrl;
}

// 处理单个景点的 photos
async function processPhotos(spot) {
  if (!spot.photos || !Array.isArray(spot.photos)) return spot;
  const processedPhotos = [];
  for (const photo of spot.photos) {
    if (isLocalPath(photo)) {
      console.log(`  📷 上传图片: ${photo}`);
      const url = await uploadImage(photo);
      if (url) processedPhotos.push(url);
    } else {
      processedPhotos.push(photo);
    }
  }
  return { ...spot, photos: processedPhotos };
}

// 处理机位的地址（如果有 address 但没有 lat/lng）
async function processShootSpots(shootSpots, parentAddress) {
  if (!Array.isArray(shootSpots)) return [];
  const result = [];
  for (const s of shootSpots) {
    if (s.lat != null && s.lng != null) {
      result.push(s);
      continue;
    }
    if (s.address) {
      // 拼接父地址提高精度
      const fullAddr = parentAddress ? `${parentAddress} ${s.address}` : s.address;
      console.log(`  🎯 机位地理编码: ${s.address}`);
      const geo = await geocodeAddress(fullAddr);
      if (geo) {
        result.push({ ...s, lat: geo.lat, lng: geo.lng });
      } else {
        result.push(s);
      }
    } else {
      result.push(s);
    }
  }
  return result;
}

// 导入单个景点
// 返回 { ok: boolean, processed?: object }
// processed 包含已上传图片的 URL 和地理编码后的坐标，用于生成 SQL 备选
async function importSpot(spot, index) {
  console.log(`\n[${index + 1}] 处理: ${spot.name}`);

  // 1. 地理编码：如果有 lat/lng 直接用，否则用 address 查
  let lat = spot.lat;
  let lng = spot.lng;
  let district = spot.district;

  if ((lat == null || lng == null) && spot.address) {
    console.log(`  📍 地理编码: ${spot.address}`);
    const geo = await geocodeAddress(spot.address);
    if (geo) {
      lat = geo.lat;
      lng = geo.lng;
      if (!district && geo.district) district = geo.district;
      console.log(`  ✓ 坐标: ${lat.toFixed(6)}, ${lng.toFixed(6)}${district ? ' (' + district + ')' : ''}`);
    } else {
      console.error(`  ✗ 地理编码失败，跳过该景点`);
      return { ok: false };
    }
  }

  if (lat == null || lng == null) {
    console.error(`  ✗ 缺少坐标且无 address，跳过`);
    return { ok: false };
  }

  // 2. 处理图片（上传到 Storage，替换为公开 URL）
  const processed = await processPhotos(spot);

  // 构造处理后的完整数据（包含已上传的图片 URL 和坐标，用于 SQL 备选）
  const processedFull = {
    ...processed,
    lat,
    lng,
    district: district || processed.district,
  };

  const payload = {
    name: processed.name,
    description: processed.description || null,
    address: processed.address || null,
    lat,
    lng,
    district: district || null,
    photos: processed.photos || [],
    seasons: processed.seasons || null,
    tags: processed.tags || [],
    source_url: processed.source_url || null,
  };

  // 3. 写入数据库
  if (processed.id) {
    payload.id = processed.id;
    const { error } = await supabase.from('spots').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error(`  ✗ 导入失败: ${error.message}`);
      return { ok: false, processed: processedFull };
    }
  } else {
    const { error } = await supabase.from('spots').insert(payload);
    if (error) {
      if (error.message.includes('row-level security') || error.code === '42501') {
        console.error(`  ✗ RLS 拒绝写入：spots 表只允许 SELECT，将生成 SQL 备选文件`);
      } else {
        console.error(`  ✗ 导入失败: ${error.message}`);
      }
      return { ok: false, processed: processedFull };
    }
  }

  console.log(`  ✓ 成功`);
  return { ok: true };
}

// 生成 SQL INSERT 语句（RLS 备选方案）
function generateSQL(spots) {
  const lines = [];
  lines.push('-- 自动生成的景点导入 SQL');
  lines.push('-- 在 Supabase SQL Editor 运行');
  lines.push('');

  for (const spot of spots) {
    const escape = (s) => s ? `'${s.replace(/'/g, "''")}'` : 'NULL';
    const photosArr = (spot.photos || []).map(p => `'${p}'`).join(',');
    const tagsArr = (spot.tags || []).map(t => `'${t}'`).join(',');

    // 注意：这里 lat/lng 应该已经被地理编码填充了（generateSQL 接收处理后的 spots）
    const lat = spot.lat != null ? spot.lat : 'NULL';
    const lng = spot.lng != null ? spot.lng : 'NULL';

    lines.push(`INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url) VALUES`);
    lines.push(`  (${escape(spot.name)}, ${escape(spot.description)}, ${escape(spot.address)}, ${lat}, ${lng}, ${escape(spot.district)},`);
    lines.push(`   ARRAY[${photosArr}]::text[], ${escape(spot.seasons)}, ARRAY[${tagsArr}]::text[],`);
    lines.push(`   ${escape(spot.source_url)});`);
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const jsonPath = process.argv[2] || resolve(projectRoot, 'data/spots-seed.json');

  if (!existsSync(jsonPath)) {
    console.error(`找不到数据文件: ${jsonPath}`);
    console.error('请先创建 data/spots-seed.json，格式参考 data/spots-template.json');
    process.exit(1);
  }

  console.log(`读取数据: ${jsonPath}`);
  const spots = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  if (!Array.isArray(spots)) {
    console.error('JSON 必须是数组格式');
    process.exit(1);
  }

  console.log(`共 ${spots.length} 个景点\n`);

  let success = 0;
  let failed = 0;
  const failedSpots = [];

  for (let i = 0; i < spots.length; i++) {
    const result = await importSpot(spots[i], i);
    if (result.ok) {
      success++;
    } else {
      failed++;
      // 优先用处理后的数据（含已上传图片 URL 和地理编码坐标），否则用原始数据
      failedSpots.push(result.processed || spots[i]);
    }
    // 景点间延迟 300ms，避免天地图 API QPS 限制
    if (i < spots.length - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\n==========`);
  console.log(`成功: ${success}，失败: ${failed}`);

  // 如果有失败（通常是 RLS），生成 SQL 备选
  if (failed > 0) {
    const sqlPath = resolve(projectRoot, 'data/spots-import.sql');
    const sql = generateSQL(failedSpots);
    writeFileSync(sqlPath, sql, 'utf-8');
    console.log(`\n部分导入失败，已生成 SQL 备选文件: ${sqlPath}`);
    console.log(`请在 Supabase SQL Editor 运行该文件`);
    console.log(`注意：SQL 文件里的 lat/lng 需要脚本先地理编码成功才会填充`);
  }
}

main().catch(console.error);

/**
 * 批量更新已有景点的 photos 和 source_url
 * 用于补充已导入景点（无 id）的图片和原文链接
 *
 * 用法：node scripts/update-spots-photos.mjs [startIndex] [endIndex]
 * 默认处理第 8-27 个景点（索引 7-26）
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
const BUCKET = 'spots-photos';

function isLocalPath(p) {
  return typeof p === 'string' && (p.startsWith('./') || p.startsWith('/') || p.startsWith('../'));
}

async function uploadImage(localPath) {
  const absPath = resolve(projectRoot, localPath);
  if (!existsSync(absPath)) {
    console.warn(`  ⚠ 图片不存在: ${localPath}`);
    return null;
  }
  const ext = extname(absPath).toLowerCase();
  const fileName = basename(absPath).replace(ext, '');
  const timestamp = Date.now();
  const storagePath = `${fileName}-${timestamp}${ext}`;
  const fileBuffer = readFileSync(absPath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: `image/${ext.slice(1) || 'jpeg'}`,
    upsert: false,
  });
  if (error) {
    console.warn(`  ⚠ 上传失败 ${localPath}:`, error.message);
    return null;
  }
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return urlData.publicUrl;
}

async function processPhotos(spot) {
  if (!spot.photos || !Array.isArray(spot.photos)) return [];
  const urls = [];
  for (const photo of spot.photos) {
    if (isLocalPath(photo)) {
      console.log(`  📷 上传: ${photo}`);
      const url = await uploadImage(photo);
      if (url) urls.push(url);
    } else {
      urls.push(photo);
    }
  }
  return urls;
}

function escape(s) {
  if (s == null) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

async function main() {
  const startIdx = parseInt(process.argv[2] || '7', 10);  // 默认第 8 个（索引 7）
  const endIdx = parseInt(process.argv[3] || '26', 10);   // 默认第 27 个（索引 26）

  const jsonPath = resolve(projectRoot, 'data/spots-seed.json');
  const spots = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  console.log(`处理景点索引 ${startIdx}-${endIdx}（共 ${endIdx - startIdx + 1} 个）\n`);

  const updates = [];
  for (let i = startIdx; i <= endIdx; i++) {
    const spot = spots[i];
    if (!spot) {
      console.warn(`[${i}] 不存在，跳过`);
      continue;
    }
    console.log(`[${i + 1}] ${spot.name}`);
    const photoUrls = await processPhotos(spot);
    updates.push({
      name: spot.name,
      photos: photoUrls,
      source_url: spot.source_url || null,
    });
    console.log(`  ✓ 图片 ${photoUrls.length} 张, source_url=${spot.source_url ? '有' : '无'}`);
  }

  // 生成 UPDATE SQL（按 name 匹配）
  const lines = [];
  lines.push('-- 批量更新景点 photos 和 source_url（按 name 匹配）');
  lines.push('-- 在 Supabase SQL Editor 运行');
  lines.push('');
  for (const u of updates) {
    const photosArr = u.photos.map(p => `'${p}'`).join(',');
    lines.push(`UPDATE spots SET photos = ARRAY[${photosArr}]::text[], source_url = ${escape(u.source_url)} WHERE name = ${escape(u.name)};`);
  }

  const sqlPath = resolve(projectRoot, 'data/spots-update-photos.sql');
  writeFileSync(sqlPath, lines.join('\n'), 'utf-8');
  console.log(`\n已生成 SQL: ${sqlPath}`);
  console.log(`请在 Supabase SQL Editor 运行该文件更新 ${updates.length} 个景点`);
}

main().catch(console.error);

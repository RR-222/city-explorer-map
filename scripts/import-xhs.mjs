/**
 * 小红书「人文建筑 / 好逛店铺」数据导入器（骨架，可重复运行）
 *
 * 用法：
 *   node scripts/import-xhs.mjs --inbox data/imports/inbox.json --category heritage
 *   node scripts/import-xhs.mjs --inbox data/imports/inbox.json --category store --geocode --merge
 *
 * 管线：
 *   inbox（小红书链接清单 / 手填字段）
 *     → ① 解析占位：TODO 接浏览器自动化（bu）批量打开小红书笔记链接提取正文/图片/地点
 *     → ② 规范化字段：默认值、字段名对齐、数组化
 *     → ③ 地理编码：缺 lat/lng 的条目用天地图 TDT_SERVER_KEY 批量补（--geocode）
 *     → ④ 校验：必填字段、名称查重、坐标范围
 *     → ⑤ merge 入库：按 name 去重写入目标栏目文件（--merge 才写库；默认 dry-run）
 *
 * 目标文件：
 *   --category heritage → data/heritage-spots.json（{_说明, spots}）
 *   --category store    → data/stores-seed.json  （{_说明, stores}）
 *
 * inbox.json 结构（数组）：
 *   [{ "url": "小红书分享链接（将成为 source_url）",
 *      "name": "店铺/建筑名称", "district": "行政区", "address": "详细地址",
 *      "intro": "一句话简介", "description": "详细描述（可选）",
 *      "tags": ["咖啡馆"], "hours": "10:00-22:00", "price": 45,
 *      "featured": ["招牌手冲"], "photos": [] }]
 */
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// ---- CLI 解析 ----
const args = process.argv.slice(2);
function arg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}
const has = (name) => args.includes(`--${name}`);
const CATEGORY = arg('category') || 'heritage';
const INBOX = arg('inbox') || 'data/imports/inbox.json';
const GEOCODE = has('geocode');
const MERGE = has('merge');

if (!['heritage', 'store'].includes(CATEGORY)) {
  console.error('--category 必须是 heritage 或 store');
  process.exit(1);
}

// ---- 目标文件 ----
const TARGET = CATEGORY === 'heritage'
  ? { path: 'data/heritage-spots.json', key: 'spots' }
  : { path: 'data/stores-seed.json', key: 'stores' };

// ---- 工具：加载 .env.local（兼容 UTF-16 BOM）----
function loadEnv() {
  const envPath = resolve(projectRoot, '.env.local');
  if (!existsSync(envPath)) return {};
  const buf = readFileSync(envPath);
  let content = buf.toString('utf-8');
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) content = buf.toString('utf16le');
  content = content.replace(/^\uFEFF/, '');
  const env = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return env;
}

// ---- 工具：天地图地理编码（服务端 key，上海范围）----
async function geocodeAddress(addr, tk) {
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
    if (json?.status?.infocode !== 1000 || !Array.isArray(json?.pois) || json.pois.length === 0) return null;
    const [lngStr, latStr] = (json.pois[0].lonlat || '').split(',');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

// ---- ① 解析占位（TODO：接 browser-use 批量解析小红书链接）----
// 骨架阶段先接受「字段已填好」的 inbox；链接解析后续接 bu 批量打开
// explore 链接，提取 标题/正文/地点/图片URL 后回填到 pending 文件再走 ②-⑤。
function parseNotes(items) {
  return items.map((it) => ({ ...it }));
}

// ---- ② 规范化 ----
function normalize(item) {
  const out = { ...item };
  out.source_url = out.source_url || out.url || '';
  delete out.url;
  out.tags = Array.isArray(out.tags) ? out.tags : (out.tags ? [String(out.tags)] : []);
  out.featured = Array.isArray(out.featured) ? out.featured : (out.featured ? [String(out.featured)] : []);
  out.photos = Array.isArray(out.photos) ? out.photos : [];
  if (out.price != null && typeof out.price !== 'number') out.price = parseFloat(out.price);
  return out;
}

// ---- ④ 校验 ----
function validate(items, existingNames) {
  const errors = [];
  const seen = new Set();
  for (const it of items) {
    if (!it.name) errors.push(`「${it.name || '(无名)'}」缺少 name`);
    if (!it.address) errors.push(`「${it.name}」缺少 address`);
    if (!it.source_url) errors.push(`「${it.name}」缺少 source_url（小红书链接）`);
    if (it.lat != null && (it.lat < 30.5 || it.lat > 32.5)) errors.push(`「${it.name}」纬度异常 ${it.lat}`);
    if (it.lng != null && (it.lng < 120.5 || it.lng > 122.5)) errors.push(`「${it.name}」经度异常 ${it.lng}`);
    if (existingNames.has(it.name)) errors.push(`「${it.name}」已在目标文件存在（重复导入）`);
    if (seen.has(it.name)) errors.push(`「${it.name}」在本次清单内重复`);
    seen.add(it.name);
  }
  return errors;
}

// ---- 主流程 ----
async function main() {
  const inboxPath = resolve(projectRoot, INBOX);
  if (!existsSync(inboxPath)) {
    console.error(`找不到清单文件 ${INBOX}`);
    process.exit(1);
  }
  const items = parseNotes(JSON.parse(readFileSync(inboxPath, 'utf-8')));
  console.log(`清单 ${items.length} 条 → 目标 ${CATEGORY}（${TARGET.path}）`);

  // 规范化
  const normalized = items.map(normalize);
  const needGeo = normalized.filter((it) => it.lat == null && it.address);
  console.log(`待地理编码 ${needGeo.length} 条`);

  // ③ 地理编码
  if (GEOCODE && needGeo.length > 0) {
    const env = loadEnv();
    const tk = env.TDT_SERVER_KEY || env.TDT_KEY;
    if (!tk) {
      console.error('缺少 TDT_SERVER_KEY（.env.local），无法地理编码');
    } else {
      for (const it of needGeo) {
        const g = await geocodeAddress(it.address, tk);
        if (g) {
          it.lat = g.lat;
          it.lng = g.lng;
          console.log(`  ✓ ${it.name} → ${g.lat.toFixed(5)}, ${g.lng.toFixed(5)}`);
        } else {
          console.warn(`  ✗ ${it.name} 编码失败，待人工补充坐标（${it.address}）`);
        }
      }
    }
  }

  // ④ 校验
  const targetFile = JSON.parse(readFileSync(resolve(projectRoot, TARGET.path), 'utf-8'));
  const existingNames = new Set(targetFile[TARGET.key].map((x) => x.name));
  const errors = validate(normalized, existingNames);
  if (errors.length > 0) {
    console.error('\n校验未通过：');
    errors.forEach((e) => console.error('  - ' + e));
    console.error('未写入任何数据，请修正后重跑。');
    process.exit(1);
  }

  // ⑤ merge 入库（dry-run 默认）
  const toAdd = normalized.filter((it) => !existingNames.has(it.name));
  console.log(`\n校验通过，待入库 ${toAdd.length} 条（目标文件现有 ${targetFile[TARGET.key].length} 条）`);
  if (MERGE) {
    targetFile[TARGET.key].push(...toAdd);
    writeFileSync(resolve(projectRoot, TARGET.path), JSON.stringify(targetFile, null, 2) + '\n', 'utf-8');
    console.log(`已合并写入 ${TARGET.path}（+${toAdd.length} 条）`);
  } else {
    console.log('（dry-run，未写库；确认无误加 --merge 执行）');
    toAdd.forEach((it) => console.log(`  + ${it.name} | ${it.district || '?'} | ${it.source_url.slice(0, 60)}`));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

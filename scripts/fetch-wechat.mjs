#!/usr/bin/env node
/**
 * 文旅情报抓取脚本 v2（方案1：搜狗微信搜索 + 文章页直抓）
 *
 * 流程：
 *   1. 对每个公众号 × 若干文旅关键词，调搜狗微信文章搜索（type=2）
 *   2. 按公众号名过滤 → 按发布时间过滤（默认最近 14 天）→ 标题正/负关键词过滤
 *   3. 解析搜狗 /link 跳转，还原 mp.weixin.qq.com 文章页地址
 *   4. 抓文章页提取标题/发布时间/封面/摘要，并取稳定身份键 __biz/mid/idx
 *   5. 以 (biz,mid,idx) 为去重键 upsert 到 Supabase（同文新抓会自动刷新链接）
 *      并合并写入 data/wechat-articles.json 作为离线快照
 *
 * 用法：
 *   node scripts/fetch-wechat.mjs [天数]                 # 天数默认 3（近三天）
 *   node scripts/fetch-wechat.mjs --urls "链接1,链接2"   # 手动导入指定文章（搜狗未收录的账号用）
 *
 * 置顶逻辑：每月/每周汇总、重要节日类文章自动识别并置顶（pinned_until 到期前）
 * 保留规则：普通文章保留 3 天，置顶文章保留到置顶到期。
 *
 * 说明：搜狗 /link 还原的 URL 带一次性签名，随每次运行变化，
 *       因此去重键不用 URL，而用文章页里的 __biz/mid/idx（微信文章的稳定身份）。
 *
 * 注意：搜狗有反爬，脚本内置随机延迟与验证码退避；请勿缩短延迟或高频运行。
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// ---------- 配置 ----------
// strict=true：标题需命中文旅白名单（用于混民生内容的政务号/本地生活号）
// strict=false：仅按账号+时间+负向词过滤（用于纯文旅号，避免误杀演唱会/巡游等）
const ACCOUNTS = [
  { name: '上海发布',     queries: ['', '展览', '演出', '演唱会', '文旅', '旅游', '活动', '开馆', '花车', '巡游'], strict: true },
  { name: '上海本地宝',   queries: ['', '展览', '演出', '演唱会', '旅游', '活动', '市集', '攻略'], strict: true },
  { name: '乐游上海',     queries: ['', '活动', '展览', '演出', '演唱会', '旅游', '市集', '打卡', '花车', '巡游'], strict: false },
  { name: 'ShanghaiLOOK', queries: ['', '展览', '演出', '活动', '探店', '打卡'],                strict: false },
];
const ACCOUNT_NAMES = new Set(ACCOUNTS.map((a) => a.name));

// 标题文旅关键词（软过滤，命中其一即保留；仅对 strict 账号生效）
const WENLV_KEYWORDS = [
  '展', '演出', '演唱会', '音乐会', '话剧', '舞剧', '音乐剧', '戏曲', '评弹', '戏剧',
  '博物馆', '美术馆', '艺术馆', '艺术', '文化', '文旅', '旅游', '巡游', '花车',
  '公园', '景区', '活动', '讲座', '市集', '集市', '非遗', '剧场', '书展', '阅读',
  '打卡', '定档', '开唱', '音乐节', '嘉年华', '灯会', '庙会', '游园', '露营',
  '赏花', '花展', '电影节', '马拉松', '赛事', '骑行', '走读', '开馆', '首发',
  '上新', '攻略', '预告', '汇总', '盘点', '夜市', '夜游', '灯展', '烟花',
];

// 负向关键词（民生/非文旅内容，命中其一即剔除，全账号生效）
const NEGATIVE_KEYWORDS = [
  '就业', '招聘', '落户', '社保', '公积金', '养老金', '退休', '工资', '补贴',
  '限购', '房价', '物业', '水电', '燃气', '地铁', '公交', '交通管制', '天气',
  '台风', '医疗', '医院', '疫苗', '疫情', '中考', '高考', '招生', '幼儿园',
  '身份证', '机动车', '驾驶证', '医保', '油价', '停电', '停水', '核酸',
];

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const SNAPSHOT_PATH = resolve(projectRoot, 'data/wechat-articles.json');
const COVER_DIR = resolve(projectRoot, 'public/wechat-covers');
const RETAIN_DAYS = 3; // 普通文章保留天数（置顶文章不受限）

// ---------- 工具 ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.floor(min + Math.random() * (max - min));

function decodeEntities(str) {
  return String(str || '')
    .replace(/&rarr;/g, '→')
    .replace(/&larr;/g, '←')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 读取 .env.local（兼容 UTF-16 BOM）
function loadEnv() {
  const envPath = resolve(projectRoot, '.env.local');
  if (!existsSync(envPath)) return {};
  const buf = readFileSync(envPath);
  let content;
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) content = buf.toString('utf16le');
  else if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) content = buf.swap16().toString('utf16le');
  else content = buf.toString('utf-8');
  content = content.replace(/^\uFEFF/, '');
  const env = {};
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    env[key.startsWith('VITE_') ? key.slice(5) : key] = val;
  }
  return env;
}

// ---------- 搜狗客户端 ----------
let cookieJar = '';
function absorbCookies(res) {
  try {
    for (const c of (res.headers.getSetCookie ? res.headers.getSetCookie() : [])) {
      const kv = c.split(';')[0];
      if (kv && !cookieJar.includes(kv.split('=')[0] + '=')) cookieJar += kv + '; ';
    }
  } catch (e) { /* ignore */ }
}

async function sogouGet(url, referer) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Cookie: cookieJar, Referer: referer || 'https://weixin.sogou.com/' },
    redirect: 'manual',
  });
  absorbCookies(res);
  return res;
}

function isBlockedPage(html) {
  return /antispider|请输入验证码|userVerify|seccode/i.test(html);
}

// 解析搜狗 /link 跳转页里的 JS 拼接 URL
function extractRealUrl(linkHtml) {
  const frags = [...linkHtml.matchAll(/url\s*\+?=\s*'([^']*)'/g)].map((m) => m[1]);
  if (frags.length === 0) return null;
  return frags.join('');
}

// 解析一页文章搜索结果
function parseSearchItems(html) {
  const items = [];
  const liRe = /<li[^>]*id="sogou_vr_[^"]*_box_\d+"[^>]*>[\s\S]*?<\/li>/g;
  let m;
  while ((m = liRe.exec(html)) !== null) {
    const block = m[0];
    const linkHref = block.match(/href="(\/link\?url=[^"]+)"/);
    const title = block.match(/<h3>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/h3>/);
    const account = block.match(/<span class="all-time-y2">([^<]+)<\/span>/);
    const ts = block.match(/timeConvert\('(\d{10})'\)/);
    const cover = block.match(/class="img-box">[\s\S]*?src="(\/\/img01\.sogoucdn\.com[^"]+)"/);
    if (!linkHref || !title || !account || !ts) continue;
    items.push({
      linkHref: linkHref[1].replace(/&amp;/g, '&'),
      title: decodeEntities(title[1]),
      account: account[1].trim(),
      ts: parseInt(ts[1], 10),
      cover: cover ? ('https:' + cover[1]).replace(/&amp;/g, '&') : null,
    });
  }
  return items;
}

// ---------- 抓取主逻辑 ----------
async function searchQuery(query, attempt = 0) {
  const url = `https://weixin.sogou.com/weixin?type=2&query=${encodeURIComponent(query)}&ie=utf8&s_from=input&_sug_=n&_sug_type_=`;
  const res = await sogouGet(url);
  const html = await res.text();
  if (isBlockedPage(html) || !html.includes('sogou_vr_')) {
    if (attempt >= 2) throw new Error(`连续触发反爬：${query}`);
    const wait = 30000 + rand(0, 20000);
    console.warn(`  ⚠ 触发搜狗反爬，等待 ${Math.round(wait / 1000)}s 后重试（${attempt + 1}/3）`);
    await sleep(wait);
    return searchQuery(query, attempt + 1);
  }
  return parseSearchItems(html);
}

async function resolveLink(linkHref) {
  const res = await sogouGet('https://weixin.sogou.com' + linkHref);
  const loc = res.headers.get('location');
  if (loc) return loc;
  const body = await res.text();
  return extractRealUrl(body);
}

// 抓文章页，返回结构化字段（含稳定身份键 biz/mid/idx）
async function fetchArticle(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Referer: 'https://mp.weixin.qq.com/' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`文章页 HTTP ${res.status}`);
  const html = await res.text();

  const titleMatch = html.match(/<h1[^>]*id="activity-name"[^>]*>([\s\S]*?)<\/h1>/) ||
    html.match(/var msg_title\s*=\s*"((?:[^"\\]|\\.)*)"/);
  if (!titleMatch) throw new Error('未解析到标题');
  const title = decodeEntities(titleMatch[1]).trim();

  const nicknameMatch = html.match(/var nickname\s*=\s*(?:htmlDecode\()?"((?:[^"\\]|\\.)*)"/) ||
    html.match(/<a[^>]*id="js_name"[^>]*>([\s\S]*?)<\/a>/) ||
    html.match(/var user_name\s*=\s*"((?:[^"\\]|\\.)*)"/);
  let nickname = '';
  if (nicknameMatch) {
    try { nickname = JSON.parse('"' + nicknameMatch[1].replace(/"/g, '\\"') + '"') || ''; } catch (e) { nickname = decodeEntities(nicknameMatch[1]); }
  }
  nickname = nickname.replace(/<[^>]+>/g, '').trim();

  if (/该内容已被发布者删除|此内容因违规无法查看|此内容被投诉/.test(title)) {
    throw new Error('文章已删除/不可见');
  }

  const ctMatch = html.match(/var ct\s*=\s*"?(\d{10})"?/);
  const ts = ctMatch ? parseInt(ctMatch[1], 10) : null;

  const biz = html.match(/var biz\s*=\s*"([^"]*)"/);
  const mid = html.match(/var mid\s*=\s*"([^"]*)"/);
  const idx = html.match(/var idx\s*=\s*"?(\d+)"?/);
  if (!biz || !mid || !idx) throw new Error('未解析到文章身份键');
  const bizVal = biz[1].replace(/\\\//g, '/');
  const midVal = mid[1];
  const idxVal = parseInt(idx[1], 10);

  const descMatch = html.match(/var msg_desc\s*=\s*"((?:[^"\\]|\\.)*)"/);
  let desc = descMatch ? descMatch[1] : '';
  try { desc = decodeEntities(JSON.parse('"' + desc.replace(/"/g, '\\"') + '"') || ''); } catch (e) { desc = decodeEntities(desc); }

  let contentText = '';
  const contentStart = html.indexOf('id="js_content"');
  if (contentStart !== -1) {
    const tagEnd = html.indexOf('>', contentStart);
    if (tagEnd !== -1) {
      const segEnd = html.indexOf('<script', tagEnd);
      const seg = segEnd === -1 ? html.slice(tagEnd + 1) : html.slice(tagEnd + 1, segEnd);
      contentText = seg
        .replace(/此图片来自微信公众平台|未经允许不可引用/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }
  const summary = (contentText || desc || title).slice(0, 140);

  const coverMatch = html.match(/var msg_cdn_url\s*=\s*"([^"]*)"/) ||
    html.match(/<meta property="og:image" content="([^"]+)"/);
  const cover = coverMatch ? coverMatch[1].replace(/^\/\//, 'https://') : null;

  return { title, ts, summary, cover, biz: bizVal, mid: midVal, idx: idxVal, nickname };
}

// 稳定身份键（去重用）
const rowKey = (r) => (r.biz && r.mid && r.idx != null ? `${r.biz}|${r.mid}|${r.idx}` : r.url);

// ---------- 置顶识别 ----------
// 每月/每周汇总、重要节日类文章 → 置顶到该月/该周/活动结束
const FESTIVALS_2026 = [
  { names: ['上海旅游节', '旅游节'], end: '2026-10-06' },
  { names: ['中秋'],                 end: '2026-09-27' },
  { names: ['国庆'],                 end: '2026-10-07' },
  { names: ['春节'],                 end: '2026-02-24' },
  { names: ['元旦'],                 end: '2026-01-03' },
  { names: ['五一', '劳动节'],       end: '2026-05-05' },
  { names: ['端午'],                 end: '2026-06-21' },
  { names: ['教师节'],               end: '2026-09-10' },
  { names: ['上海书展', '书展'],     end: '2026-08-18' },
  { names: ['上海国际电影节', '电影节'], end: '2026-06-21' },
  { names: ['元宵'],                 end: '2026-03-05' },
];

function detectPin(title, summary, publishTs) {
  const text = `${title || ''} ${summary || ''}`;
  // 1) 重要节日优先（置顶到活动结束日）
  for (const f of FESTIVALS_2026) {
    if (f.names.some((n) => text.includes(n))) {
      return { category: 'festival', category_name: f.names[0], pinned_until: `${f.end}T23:59:59+08:00` };
    }
  }
  // 2) 标题里可解析的活动日期范围（如 9月1日-10月6日 / 9.1-10.6）→ 置顶到结束日
  const rangeRe = /(\d{1,2})[月./](\d{1,2})日?[至到\-~—–]+(\d{1,2})[月./]?(\d{1,2})日?/;
  const rm = text.match(rangeRe);
  if (rm) {
    const m2 = +rm[3], d2 = +rm[4];
    const year = new Date(publishTs * 1000).getFullYear();
    const end = new Date(year, m2 - 1, d2);
    if (!Number.isNaN(end.getTime()) && end.getTime() > Date.now()) {
      end.setHours(23, 59, 59, 0);
      return { category: 'festival', category_name: `${+rm[1]}月${+rm[2]}日-${m2}月${d2}日`, pinned_until: end.toISOString() };
    }
  }
  // 3) 每周/每月汇总预告 → 置顶到该周/该月末
  const aggRe = /(预告|汇总|盘点|推荐|指南|攻略|上新|清单|合集|必看)/;
  const weeklyRe = /(本?周|每周|周[一二三四五六日天末])/;
  const monthlyRe = /(本?月|每月)/;
  const pub = new Date(publishTs * 1000);
  if (weeklyRe.test(text) && aggRe.test(text)) {
    const sun = new Date(pub);
    const daysToSun = pub.getDay() === 0 ? 0 : 7 - pub.getDay();
    sun.setDate(sun.getDate() + daysToSun);
    sun.setHours(23, 59, 59, 0);
    return { category: 'weekly', category_name: '每周汇总/预告', pinned_until: sun.toISOString() };
  }
  if (monthlyRe.test(text) && aggRe.test(text)) {
    const end = new Date(pub.getFullYear(), pub.getMonth() + 1, 1);
    end.setHours(0, 0, 0, 0);
    return { category: 'monthly', category_name: '每月汇总/预告', pinned_until: end.toISOString() };
  }
  return { category: null, category_name: null, pinned_until: null };
}

// ---------- 封面本地化 ----------
// 搜狗缩略图在浏览器端会被 Chrome ORB（跨域拦截）拦掉，页面显示不出封面。
// 方案：抓取时把封面下载到 public/wechat-covers/（以身份键命名，同文不重复下载），
//       cover 字段存同源相对路径；下载失败才回退绝对 URL。
async function localizeCover(row, fallbackCover) {
  try {
    const rel = `wechat-covers/${row.biz}-${row.mid}-${row.idx}.jpg`;
    const abs = resolve(COVER_DIR, `${row.biz}-${row.mid}-${row.idx}.jpg`);
    if (existsSync(abs)) return `/${rel}`;
    const srcUrl = row.cover || fallbackCover;
    if (!srcUrl || !/^https?:\/\//.test(srcUrl)) return row.cover || fallbackCover;
    const res = await fetch(srcUrl, { headers: { 'User-Agent': USER_AGENT }, redirect: 'follow' });
    if (!res.ok) return srcUrl;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) return srcUrl;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('image/')) return srcUrl;
    const { mkdirSync, writeFileSync } = await import('fs');
    mkdirSync(COVER_DIR, { recursive: true });
    writeFileSync(abs, buf);
    return `/${rel}`;
  } catch (e) {
    return row.cover || fallbackCover;
  }
}

// 手动链接导入：直接抓 mp.weixin.qq.com 文章链接入库（用于搜狗未收录的账号，如「上海艺术展览」）
async function importManual(urls) {
  const rows = [];
  const fetchedKeys = new Set();
  console.log(`\n手动导入模式：${urls.length} 条链接`);
  for (let i = 0; i < urls.length; i++) {
    const raw = urls[i].split('#')[0];
    process.stdout.write(`  [${i + 1}/${urls.length}] ${raw.slice(0, 72)}... `);
    try {
      await sleep(rand(800, 1500));
      const art = await fetchArticle(raw);
      const pin = detectPin(art.title, art.summary, art.ts || Math.floor(Date.now() / 1000));
      const row = {
        account: art.nickname || '未知公众号',
        title: art.title,
        url: raw,
        biz: art.biz,
        mid: art.mid,
        idx: art.idx,
        cover: await localizeCover({ biz: art.biz, mid: art.mid, idx: art.idx, cover: art.cover }, null),
        summary: art.summary,
        publish_at: new Date((art.ts || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
        category: pin.category,
        category_name: pin.category_name,
        pinned_until: pin.pinned_until,
      };
      const key = rowKey(row);
      if (fetchedKeys.has(key)) { console.log('跳过（重复）'); continue; }
      fetchedKeys.add(key);
      rows.push(row);
      console.log(`✓ ${row.account} ${new Date(row.publish_at).toLocaleDateString('zh-CN')}`);
    } catch (e) {
      console.log(`跳过（${e.message.slice(0, 40)}）`);
    }
  }
  return rows;
}

// 合并历史快照 + 写快照 + 写库（步骤 5-6）
async function persist(rows, supabase) {
  const existing = [];
  if (existsSync(SNAPSHOT_PATH)) {
    try {
      const snap = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf-8'));
      existing.push(...(snap.articles || []));
    } catch (e) { /* ignore */ }
  }
  const merged = new Map();
  for (const r of existing) if (r.biz && r.mid && r.idx != null) merged.set(rowKey(r), r);
  for (const r of rows) if (r.url) merged.set(rowKey(r), r);
  // 自愈：剔除命中负向关键词的历史误抓条目；历史行的绝对封面链接也一并本地化
  const mergedArr = Array.from(merged.values());
  for (const r of mergedArr) {
    if (r.biz && r.mid && r.idx != null && r.cover && r.cover.startsWith('http')) {
      r.cover = await localizeCover(r, null);
    }
  }
  // 保留规则：普通文章保留最近 RETAIN_DAYS 天；置顶文章保留到置顶到期
  const retainCutoff = Date.now() - RETAIN_DAYS * 86400000;
  const all = mergedArr
    .filter((r) => {
      if (NEGATIVE_KEYWORDS.some((k) => (r.title || '').includes(k))) return false;
      const pinned = r.pinned_until && new Date(r.pinned_until).getTime() > Date.now();
      if (pinned) return true;
      return r.publish_at && new Date(r.publish_at).getTime() >= retainCutoff;
    })
    .sort((a, b) => (a.publish_at < b.publish_at ? 1 : -1))
    .slice(0, 300);
  writeFileSync(SNAPSHOT_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), articles: all }, null, 2), 'utf-8');
  console.log(`\n快照已写入: ${SNAPSHOT_PATH}（共 ${all.length} 条，本轮刷新 ${rows.length} 条）`);

  if (supabase) {
    // 清理超出保留期的旧数据（置顶未到期的不删）
    const delRes = await supabase
      .from('wechat_articles')
      .delete()
      .lt('publish_at', new Date(retainCutoff).toISOString())
      .or(`pinned_until.is.null,pinned_until.lt.${new Date().toISOString()}`);
    if (delRes.error && !/Could not find the table/.test(delRes.error.message)) {
      console.warn('  ⚠ 清理旧数据失败:', delRes.error.message);
    }
  }
  if (supabase && rows.length > 0) {
    // 与快照同规则过滤后再写库，避免旧文（超出保留期且无有效置顶）被 upsert 重新引入
    const writeCutoff = Date.now() - RETAIN_DAYS * 86400000;
    const keep = rows.filter((r) => {
      if (NEGATIVE_KEYWORDS.some((k) => (r.title || '').includes(k))) return false;
      const pinned = r.pinned_until && new Date(r.pinned_until).getTime() > Date.now();
      if (pinned) return true;
      return r.publish_at && new Date(r.publish_at).getTime() >= writeCutoff;
    });
    if (keep.length > 0) {
      const { error } = await supabase.from('wechat_articles').upsert(keep, { onConflict: 'biz,mid,idx' });
      if (error) {
        console.error('  ✗ 写入 Supabase 失败:', error.message);
        console.error('    请先在 Supabase Dashboard → SQL Editor 运行（更新版）supabase/wechat-articles-schema.sql');
      } else {
        console.log(`  ✓ 已写入 Supabase wechat_articles（${keep.length} 条，过滤 ${rows.length - keep.length} 条超期旧文）`);
      }
    } else {
      console.log(`  ✓ 无可写数据（${rows.length} 条均超期）`);
    }
  }
}

// ---------- 主流程 ----------
async function main() {
  const env = loadEnv();

  let supabase = null;
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  } else {
    console.warn('  ⚠ 缺少 SUPABASE_URL / SUPABASE_ANON_KEY，本次仅生成 JSON 快照');
  }

  // 手动链接导入模式：node scripts/fetch-wechat.mjs --urls "url1,url2"
  if (process.argv.includes('--urls')) {
    const urls = (process.argv[process.argv.indexOf('--urls') + 1] || '').split(/[,\s]+/).filter((u) => u.startsWith('http'));
    const rows = await importManual(urls);
    await persist(rows, supabase);
    console.log('\n完成。');
    return;
  }

  const keepDays = parseInt(process.argv[2] || '3', 10);
  const cutoff = Math.floor(Date.now() / 1000) - keepDays * 86400;

  // 1. 先种搜狗 cookie
  await sogouGet('https://weixin.sogou.com/');
  await sleep(rand(800, 1500));

  // 2. 搜索收集候选
  const candidates = [];
  let searchCount = 0;
  for (const acct of ACCOUNTS) {
    for (const q of acct.queries) {
      searchCount++;
      try {
        const items = await searchQuery(`${acct.name}${q ? ' ' + q : ''}`);
        console.log(`  [搜索 ${searchCount}] ${acct.name} ×「${q || '账号名'}」→ ${items.length} 条`);
        for (const it of items) {
          if (!ACCOUNT_NAMES.has(it.account)) continue;
          if (it.ts < cutoff) continue;
          if (NEGATIVE_KEYWORDS.some((k) => it.title.includes(k))) continue;
          if (acct.strict && !WENLV_KEYWORDS.some((k) => it.title.includes(k))) continue;
          candidates.push(it);
        }
      } catch (e) {
        console.warn(`  ✗ 搜索失败（${acct.name} ×「${q || '账号名'}」）:`, e.message);
      }
      await sleep(rand(2200, 4200));
    }
  }
  console.log(`\n候选（目标账号+近期+文旅关键词）: ${candidates.length} 条`);

  // 3. 去重（账号+标题+时间）
  const seen = new Set();
  const uniq = [];
  for (const it of candidates) {
    const key = `${it.account}|${it.title}|${it.ts}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(it);
  }
  console.log(`去重后: ${uniq.length} 条`);

  // 4. 逐个解析链接 + 抓正文
  const rows = [];
  const fetchedKeys = new Set();
  for (let i = 0; i < uniq.length; i++) {
    const it = uniq[i];
    process.stdout.write(`  [${i + 1}/${uniq.length}] ${it.account}「${it.title.slice(0, 24)}」... `);
    try {
      await sleep(rand(1200, 2200));
      const realUrl = await resolveLink(it.linkHref);
      if (!realUrl || !realUrl.includes('mp.weixin.qq.com')) {
        console.log('跳过（链接解析失败）');
        continue;
      }
      const urlKey = realUrl.split('#')[0];
      await sleep(rand(1000, 1800));
      const art = await fetchArticle(urlKey);
      const pin = detectPin(art.title, art.summary, art.ts || it.ts);
      const row = {
        account: it.account,
        title: art.title || it.title,
        url: urlKey,
        biz: art.biz,
        mid: art.mid,
        idx: art.idx,
        // 封面：搜狗缩略图在浏览器会被 ORB 拦截，改为下载到本地同源路径
        cover: await localizeCover({ biz: art.biz, mid: art.mid, idx: art.idx, cover: it.cover }, art.cover),
        summary: art.summary,
        publish_at: new Date((art.ts || it.ts) * 1000).toISOString(),
        category: pin.category,
        category_name: pin.category_name,
        pinned_until: pin.pinned_until,
      };
      const key = rowKey(row);
      if (fetchedKeys.has(key)) { console.log('跳过（本轮重复）'); continue; }
      fetchedKeys.add(key);
      rows.push(row);
      console.log(`✓ ${new Date(row.publish_at).toLocaleDateString('zh-CN')}`);
    } catch (e) {
      console.log(`跳过（${e.message.slice(0, 40)}）`);
    }
  }

  // 5-6. 合并快照 + 写库
  await persist(rows, supabase);

  console.log('\n完成。');
}

main().catch((e) => { console.error('脚本异常:', e); process.exit(1); });

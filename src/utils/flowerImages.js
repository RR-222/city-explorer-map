// 时令花卉经典图片获取工具
// 1) 优先使用本地 classic-photos 经典图（已从网上批量下载打包，稳定可用）
// 2) 其次尝试维基百科 / Wikimedia Commons 搜索“网上经典图片”
// 3) 最后回退到本地 flower-photos 照片（经 Vite glob 打包为可访问 URL）

import flowerCalendar from '../../data/seasonal-flowers.json';

// 本地照片目录经 Vite 静态打包，key 为相对项目根的完整路径
// 如 '/data/flower-photos/樱花/龙华寺.jpg' -> 可访问 URL
const localPhotoUrls = import.meta.glob('/data/flower-photos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
  as: 'url',
  eager: true,
});

// 网上搜索下载的经典花图（每花 1 张）
const classicPhotoUrls = import.meta.glob('/data/classic-photos/**/*.jpg', {
  as: 'url',
  eager: true,
});

// heritage-spots.json 建筑照片（data/photos/）
const seedPhotoUrls = import.meta.glob('/data/photos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
  as: 'url',
  eager: true,
});

// stores-seed.json 好逛街区照片（data/store-photos/）
const storePhotoUrls = import.meta.glob('/data/store-photos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}', {
  as: 'url',
  eager: true,
});

/** 把 heritage-spots.json 中的建筑照片相对路径（./data/photos/...）转为可访问 URL */
export function getSeedPhotoUrl(relPath) {
  if (!relPath) return null;
  const key = relPath.startsWith('./') ? relPath.slice(1) : relPath;
  return seedPhotoUrls[key] || null;
}

/** 把 stores-seed.json 中的街区照片相对路径（./data/store-photos/...）转为可访问 URL */
export function getStorePhotoUrl(relPath) {
  if (!relPath) return null;
  const key = relPath.startsWith('./') ? relPath.slice(1) : relPath;
  return storePhotoUrls[key] || null;
}

/** 把 seasonal-flowers.json 中的相对照片路径（./data/...）转为可访问 URL */
export function getLocalPhotoUrl(relPath) {
  if (!relPath) return null;
  const key = relPath.startsWith('./') ? relPath.slice(1) : relPath;
  return localPhotoUrls[key] || null;
}

/** 取某花种的第一张本地照片 URL（列表/详情兜底用） */
export function getLocalFlowerPhoto(flowerName) {
  if (!flowerName) return null;
  const calendar = flowerCalendar._花历 || flowerCalendar['花历'] || [];
  const entry =
    calendar.find((e) => e.flower === flowerName) ||
    calendar.find((e) => e.flower.startsWith(flowerName) || flowerName.startsWith(e.flower));
  const firstPhoto = entry?.spots?.[0]?.photos?.[0];
  return firstPhoto ? getLocalPhotoUrl(firstPhoto) : null;
}

/** 文件名规范化：与 classic-photos 目录命名一致 */
function classicFileName(name) {
  return String(name || '')
    .replace('/', '_')
    .replace('（', '(')
    .replace('）', ')');
}

/** 取某花种的本地经典图 URL（网上搜索下载，稳定优先） */
export function getClassicPhotoUrl(flowerName) {
  if (!flowerName) return null;
  const key = `/data/classic-photos/${classicFileName(flowerName)}.jpg`;
  return classicPhotoUrls[key] || null;
}

/**
 * 同步获取花卉展示图：经典图（本地打包）优先，其次本地照片
 */
export function getFlowerImage(name) {
  return getClassicPhotoUrl(name) || getLocalFlowerPhoto(name) || null;
}

// ---- 经典网络图 ----

// 部分花名在中文维基没有独立条目 / 首图不理想，手工映射到更合适的条目
const WIKI_TITLE = {
  '白玉兰 / 二乔玉兰': '玉兰',
  '腊梅': '蜡梅',
  '梧桐': '悬铃木',
  '水杉 落羽杉': '落羽杉',
  '喜林草': '粉蝶花',
  '鲁冰花': '羽扇豆',
  '彼岸花（石蒜，含多色石蒜）': '石蒜',
  '虞美人': '虞美人',
  '二月兰': '诸葛菜',
  '地肤（绿）': '地肤',
  '地肤（黄）': '地肤',
  '紫薇': '紫薇',
  '木绣球': '绣球荚蒾',
  '石榴花': '石榴',
};

/** 把花名规整成适合搜索的词语 */
function normalizeSearchName(name) {
  let n = String(name || '').trim();
  n = n.replace(/[（(].*?[）)]/g, ''); // 去括号注释
  n = n.split('、')[0]; // 只取第一个并列名
  n = n.split('/')[0]; // 只取斜杠前主名
  return n.trim();
}

const imageCache = new Map();

/**
 * 异步获取花卉“经典图片”（网上搜索）
 * 依次尝试：中文维基条目配图 -> Wikimedia Commons 搜索 -> null
 * @returns {Promise<string|null>}
 */
export function fetchClassicFlowerImage(flowerName) {
  if (imageCache.has(flowerName)) return imageCache.get(flowerName);
  const promise = (async () => {
    const title = WIKI_TITLE[flowerName] || normalizeSearchName(flowerName);
    // 1) 中文维基条目配图（质量最高）
    try {
      const url = new URL('https://zh.wikipedia.org/w/api.php');
      url.search = new URLSearchParams({
        action: 'query',
        titles: title,
        prop: 'pageimages',
        format: 'json',
        origin: '*',
        redirects: '1',
        pithumbsize: '900',
      });
      const res = await fetch(url);
      const json = await res.json();
      const pages = json?.query?.pages || {};
      const page = Object.values(pages)[0];
      if (page?.thumbnail?.source) return page.thumbnail.source;
    } catch (err) {
      console.warn('维基配图获取失败', err?.message || err);
    }
    // 2) Wikimedia Commons 搜索
    try {
      const url = new URL('https://commons.wikimedia.org/w/api.php');
      url.search = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: `${title} 花`,
        gsrnamespace: '6',
        gsrlimit: '4',
        prop: 'imageinfo',
        iiprop: 'url|mime',
        iiurlwidth: '900',
        format: 'json',
        origin: '*',
      });
      const res = await fetch(url);
      const json = await res.json();
      const pages = json?.query?.pages || {};
      for (const page of Object.values(pages)) {
        const info = page?.imageinfo?.[0];
        if (info?.thumburl && info.mime?.startsWith('image/')) return info.thumburl;
      }
    } catch (err) {
      console.warn('Commons 搜索失败', err?.message || err);
    }
    return null;
  })();
  imageCache.set(flowerName, promise);
  return promise;
}

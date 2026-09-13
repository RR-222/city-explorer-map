// 重建 data/heritage-spots.json 中每处人文建筑的 seasonal 时令关联（可重复运行）
//
// 数据源：
//   data/heritage-spots.json       人文建筑（含 lat/lng/closedDays）
//   data/flower-spots.json         129 个赏花点
//   data/seasonal-flowers.json     _花历：花种 → 月份
//   data/flower-spots-geo.json     赏花点坐标缓存（缺失条目会用天地图 TDT_SERVER_KEY 补）
//   data/heritage-flower-aliases.json  人工维护的「异名同址」映射
//
// 匹配规则（按优先级）：
//   1. 别名表命中（人工核对）        → source=同名，无距离
//   2. 名称归一化后互相包含          → source=同名，无距离
//   3. 坐标距离 ≤ NEARBY_KM（1.2km）→ source=邻近，带 distanceKm
//
// 说明：
//   - 同一花种+赏花点去重，同名优先于邻近；
//   - 「闭馆的时令点降级、不置顶」为前端运行时规则（closedDays+seasonal 均已提供）；
//   - 本脚本不修改 closedDays / district / 其余字段，只维护 seasonal。
import { readFileSync, writeFileSync } from 'fs';

const NEARBY_KM = 1.2;

const spotsPath = new URL('../data/heritage-spots.json', import.meta.url);
const heritageFile = JSON.parse(readFileSync(spotsPath, 'utf-8'));
const heritage = heritageFile.spots;
const flower = JSON.parse(readFileSync(new URL('../data/flower-spots.json', import.meta.url), 'utf-8')).spots;
const seasonalCal = JSON.parse(readFileSync(new URL('../data/seasonal-flowers.json', import.meta.url), 'utf-8'))._花历;
const geoPath = new URL('../data/flower-spots-geo.json', import.meta.url);
const geo = JSON.parse(readFileSync(geoPath, 'utf-8'));
const aliases = JSON.parse(readFileSync(new URL('../data/heritage-flower-aliases.json', import.meta.url), 'utf-8'));

// ---- 工具 ----
const calByFlower = new Map(seasonalCal.map((x) => [x.flower, x]));
function monthsOf(flowers) {
  const out = new Set();
  for (const fl of flowers) {
    const ent = calByFlower.get(fl);
    if (!ent) continue;
    String(ent.months).split(',').forEach((m) => out.add(parseInt(m, 10)));
  }
  return [...out].filter((m) => !isNaN(m)).sort((a, b) => a - b);
}
function categoryOf(flowerName) {
  const ent = calByFlower.get(flowerName);
  return ent?.category || flowerName;
}
function normName(s) {
  return (s || '')
    .replace(/[（(].*?[)）]/g, '') // 去括号及括号内容
    .replace(/现[:：].*$/g, '')
    .replace(/[·•\s，,。.、'']/g, '')
    .trim();
}
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---- 赏花点索引 ----
const flowerByName = new Map(flower.map((f) => [f.name, f]));

// 缺失坐标的赏花点（跳过并提示；梧桐黄叶街道等道路类无法定位）
const missingGeo = flower.filter((f) => geo[f.name]?.lat == null);
if (missingGeo.length) {
  console.log(`[跳过无坐标] ${missingGeo.length} 个: ${missingGeo.map((f) => f.name).join('、')}`);
}

// ---- 生成每个建筑的新 seasonal ----
let report = [];
let nameHits = 0;
let nearHits = 0;

// 向 entries 添加一条时令关联；旧版无 spotName 的同花种条目自动升级为同名
function addEntry(entries, seen, flowerName, months, source, spotName, distanceKm) {
  const legacyKey = flowerName; // 旧版条目 key（无 spotName）
  const fullKey = `${flowerName}@${spotName}`;
  if (seen.has(fullKey)) return false;
  if (seen.has(legacyKey)) {
    // 升级旧条目为同名关联
    const old = entries.find((e) => e.flower === flowerName && !e.spotName);
    if (old) {
      old.source = '同名';
      old.spotName = spotName;
      if (old.months?.length && JSON.stringify(old.months) !== JSON.stringify(months)) {
        old.months = months; // 以花历为准
      }
      old.category = categoryOf(flowerName);
      seen.delete(legacyKey);
      seen.add(fullKey);
      return true;
    }
  }
  const entry = { flower: flowerName, months, category: categoryOf(flowerName), source, spotName };
  if (source === '邻近') entry.distanceKm = distanceKm;
  entries.push(entry);
  seen.add(fullKey);
  return true;
}

for (const h of heritage) {
  // 只保留无 spotName 的手工旧条目（如德莱蒙德樱花），其余全量重建，保证幂等
  const existing = Array.isArray(h.seasonal) ? h.seasonal : [];
  const entries = existing.filter((e) => !e.spotName).map((e) => ({ ...e }));
  const seen = new Set();
  for (const e of entries) seen.add(e.flower);

  const hNorm = normName(h.name);
  const hAliasTarget = aliases[h.name];

  // 1) 别名 + 2) 名称包含 → 同名关联（每种花各一条）
  for (const f of flower) {
    const isAlias = hAliasTarget && hAliasTarget === f.name;
    const fNorm = normName(f.name);
    const isContain =
      !isAlias && hNorm.length >= 2 && fNorm.length >= 2 && (hNorm.includes(fNorm) || fNorm.includes(hNorm));
    if (!isAlias && !isContain) continue;

    for (const fl of f.flowers) {
      const months = monthsOf([fl]);
      if (!months.length) continue;
      if (addEntry(entries, seen, fl, months, '同名', f.name)) nameHits++;
    }
  }

  // 3) 距离 → 邻近关联
  if (h.lat != null && h.lng != null) {
    const near = flower
      .filter((f) => geo[f.name]?.lat != null)
      .map((f) => {
        const g = geo[f.name];
        return { f, d: haversineKm(h.lat, h.lng, g.lat, g.lng) };
      })
      .filter((x) => x.d <= NEARBY_KM)
      .sort((a, b) => a.d - b.d);

    for (const { f, d } of near) {
      for (const fl of f.flowers) {
        const months = monthsOf([fl]);
        if (!months.length) continue;
        if (addEntry(entries, seen, fl, months, '邻近', f.name, Math.round(d * 1000) / 1000)) nearHits++;
      }
    }
  }

  // 同名在前，邻近按距离升序
  entries.sort((a, b) => {
    const sa = a.source === '同名' ? 0 : 1;
    const sb = b.source === '同名' ? 0 : 1;
    if (sa !== sb) return sa - sb;
    return (a.distanceKm ?? 0) - (b.distanceKm ?? 0);
  });

  h.seasonal = entries;
  if (entries.length) {
    report.push(
      `【${h.name}】(${h.district}) ${entries
        .map((e) => {
          const tag = e.source === '同名' ? '[同名]' : `[邻近${Math.round((e.distanceKm ?? 0) * 1000)}m]`;
          return `${e.flower}(${e.months.join('/')}月)${tag}`;
        })
        .join('  ')}`
    );
  }
}

heritageFile.spots = heritage;
writeFileSync(spotsPath, JSON.stringify(heritageFile, null, 2) + '\n', 'utf-8');

console.log(`\n已写回 ${spotsPath.pathname.split('/').pop()}`);
console.log(`同名关联新增 ${nameHits} 条，邻近关联新增 ${nearHits} 条`);
console.log(`\n=== 关联清单（${report.length}/${heritage.length} 个建筑有时令关联）===`);
for (const line of report) console.log(line);
const noLink = heritage.filter((h) => !h.seasonal?.length).map((h) => h.name);
console.log(`\n无时令关联的建筑（${noLink.length}）: ${noLink.join('、')}`);

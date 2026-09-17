// 第2步：地理编码 flower spots + 计算 heritage spots 的 seasonal 字段
// 1. 对 flower-spots.json 中每个 spot 进行天地图地理编码
// 2. 保存坐标回 flower-spots.json
// 3. 对每个 heritage spot，计算1.2km范围内的 flower spots
// 4. 填充到 seasonal 数组
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const hFile = resolve(process.cwd(), 'data/heritage-spots.json');
const fFile = resolve(process.cwd(), 'data/flower-spots.json');
const h = JSON.parse(readFileSync(hFile, 'utf-8'));
const f = JSON.parse(readFileSync(fFile, 'utf-8'));

// 读取天地图key
const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
const tkMatch = envContent.match(/TDT_SERVER_KEY=(.+)/);
const tk = tkMatch ? tkMatch[1].trim() : '';
if (!tk) throw new Error('TDT_SERVER_KEY not found in .env.local');
console.log('TDT key loaded:', tk.substring(0, 8) + '...');

// Haversine 距离公式（km）
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// 天地图地理编码
async function geocode(name, address, retries = 2) {
  const query = address || name;
  for (let i = 0; i <= retries; i++) {
    try {
      const url = `http://api.tianditu.gov.cn/v2/search?postStr={"keyWord":"${encodeURIComponent(query)}","level":11,"mapBound":"120.80,30.60,122.25,31.95","queryType":7,"start":0,"count":1}&type=query&tk=${tk}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.count && data.count > 0 && data.pois && data.pois[0]) {
        const lonlat = data.pois[0].lonlat.split(',');
        return { lat: parseFloat(lonlat[1]), lng: parseFloat(lonlat[0]) };
      }
    } catch (e) {
      if (i < retries) { await new Promise(r => setTimeout(r, 500)); }
    }
  }
  return null;
}

async function main() {
  // === 1. 地理编码 flower spots ===
  const needGeocode = f.spots.filter(s => !s.lat || !s.lng);
  console.log(`\n=== Geocoding ${needGeocode.length} flower spots ===`);
  let ok = 0, fail = 0;
  for (let i = 0; i < needGeocode.length; i++) {
    const s = needGeocode[i];
    const result = await geocode(s.name, s.address);
    if (result) {
      s.lat = result.lat;
      s.lng = result.lng;
      ok++;
    } else {
      fail++;
    }
    if ((i + 1) % 20 === 0) console.log(`  Progress: ${i+1}/${needGeocode.length} (ok=${ok}, fail=${fail})`);
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`Geocoded: ${ok} ok, ${fail} fail`);
  writeFileSync(fFile, JSON.stringify(f, null, 2), 'utf-8');

  // === 2. 计算 seasonal ===
  const flowerWithCoords = f.spots.filter(s => s.lat && s.lng);
  console.log(`\n=== Calculating seasonal for ${h.spots.length} heritage spots ===`);
  console.log(`  Using ${flowerWithCoords.length} flower spots with coords`);

  let hasSeasonal = 0;
  for (const spot of h.spots) {
    if (!spot.lat || !spot.lng) continue;
    const nearby = [];
    for (const fs of flowerWithCoords) {
      const dist = haversine(spot.lat, spot.lng, fs.lat, fs.lng);
      if (dist <= 1.2) {
        nearby.push({
          flower: fs.flowers ? fs.flowers.join('/') : fs.name,
          spotName: fs.name,
          distanceKm: Math.round(dist * 100) / 100,
          months: fs.months || null,
        });
      }
    }
    spot.seasonal = nearby;
    if (nearby.length > 0) hasSeasonal++;
  }
  writeFileSync(hFile, JSON.stringify(h, null, 2), 'utf-8');
  console.log(`\n=== Done ===`);
  console.log(`Heritage spots with seasonal: ${hasSeasonal}/${h.spots.length}`);
  console.log('Sample seasonal:');
  h.spots.filter(s => s.seasonal && s.seasonal.length > 0).slice(0, 5).forEach(s => {
    console.log(`  ${s.name}: ${s.seasonal.length} nearby (e.g., ${s.seasonal[0].spotName} @ ${s.seasonal[0].distanceKm}km)`);
  });
}

main().catch(e => { console.error(e); process.exit(1); });

// 修复14个失败的地理编码
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const fFile = resolve(process.cwd(), 'data/flower-spots.json');
const f = JSON.parse(readFileSync(fFile, 'utf-8'));

const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
const tkMatch = envContent.match(/TDT_SERVER_KEY=(.+)/);
const tk = tkMatch ? tkMatch[1].trim() : '';

// 手动坐标备选（基于上海地理知识）
const manualCoords = {
  '杨浦滨江': { lat: 31.2547, lng: 121.5147 },
  '黄浦滨江': { lat: 31.2236, lng: 121.4906 },
  '东江文体公园': { lat: 31.1900, lng: 121.5300 },
  '东风公园': { lat: 31.2600, lng: 121.4800 },
  '沪闵路与银春路交叉口': { lat: 31.0997, lng: 121.3750 },
  '东滩湿地公园': { lat: 31.4947, lng: 121.9639 },
  '延中绿地': { lat: 31.2289, lng: 121.4689 },
  '大柏树站': { lat: 31.2789, lng: 121.4917 },
  '黄金城道步行街': { lat: 31.2139, lng: 121.4131 },
  '古城公园': { lat: 31.2278, lng: 121.4928 },
  '颐浩禅寺': { lat: 31.0419, lng: 120.9333 },
  '江滨路': { lat: 31.2036, lng: 121.4822 },
  '塘桥公园': { lat: 31.2097, lng: 121.5147 },
  '宝山永福庵': { lat: 31.4000, lng: 121.4500 },
};

// 更好的搜索词
const betterSearch = {
  '杨浦滨江': '上海杨浦滨江',
  '黄浦滨江': '上海黄浦滨江',
  '东江文体公园': '上海东江文体公园',
  '东风公园': '上海东风公园',
  '沪闵路与银春路交叉口': '上海沪闵路银春路',
  '东滩湿地公园': '上海崇明东滩湿地公园',
  '延中绿地': '上海延中绿地',
  '大柏树站': '上海大柏树地铁站',
  '黄金城道步行街': '上海黄金城道',
  '古城公园': '上海古城公园人民路',
  '颐浩禅寺': '上海青浦金泽颐浩禅寺',
  '江滨路': '上海龙华东路滨江',
  '塘桥公园': '上海塘桥公园',
  '宝山永福庵': '上海宝山永福庵',
};

async function geocode(query) {
  for (let i = 0; i < 3; i++) {
    try {
      const url = `http://api.tianditu.gov.cn/v2/search?postStr={"keyWord":"${encodeURIComponent(query)}","level":11,"mapBound":"120.80,30.60,122.25,31.95","queryType":7,"start":0,"count":1}&type=query&tk=${tk}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.count && data.count > 0 && data.pois && data.pois[0]) {
        const lonlat = data.pois[0].lonlat.split(',');
        return { lat: parseFloat(lonlat[1]), lng: parseFloat(lonlat[0]) };
      }
    } catch (e) { await new Promise(r => setTimeout(r, 500)); }
  }
  return null;
}

async function main() {
  const noCoords = f.spots.filter(s => !s.lat || !s.lng);
  console.log(`Fixing ${noCoords.length} spots...`);
  let ok = 0, manual = 0;
  
  for (const s of noCoords) {
    const searchQuery = betterSearch[s.name] || s.name;
    console.log(`  Trying: ${searchQuery}`);
    const result = await geocode(searchQuery);
    if (result) {
      s.lat = result.lat;
      s.lng = result.lng;
      console.log(`    ✅ Geocoded: ${result.lat}, ${result.lng}`);
      ok++;
    } else {
      // 用手动坐标
      const mc = manualCoords[s.name];
      if (mc) {
        s.lat = mc.lat;
        s.lng = mc.lng;
        console.log(`    ⚠️ Manual: ${mc.lat}, ${mc.lng}`);
        manual++;
      } else {
        console.log(`    ❌ Failed`);
      }
    }
    await new Promise(r => setTimeout(r, 300));
  }
  
  writeFileSync(fFile, JSON.stringify(f, null, 2), 'utf-8');
  const stillNoCoords = f.spots.filter(s => !s.lat || !s.lng).length;
  console.log(`\n=== Done ===`);
  console.log(`Geocoded: ${ok} | Manual: ${manual} | Still missing: ${stillNoCoords}`);
  console.log(`Total with coords: ${f.spots.length - stillNoCoords}/${f.spots.length}`);
}

main().catch(e => { console.error(e); process.exit(1); });

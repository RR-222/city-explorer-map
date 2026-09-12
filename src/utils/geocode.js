// 天地图地理编码工具
// 正向：地址 → 经纬度
// 逆向：经纬度 → 区名

const getTdtKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TDT_KEY) {
    return import.meta.env.VITE_TDT_KEY;
  }
  if (typeof document !== 'undefined') {
    const el = document.querySelector('meta[name="VITE_TDT_KEY"]');
    if (el) return el.getAttribute('content');
  }
  return '';
};

// 正向地理编码：地址 → { lat, lng, district }
// 使用天地图 v2 搜索接口（与 scripts/import-spots.mjs 一致），keyWord 加"上海市"前缀避免命中外省同名地点
export async function geocodeAddress(addr, retry = 0) {
  const tk = getTdtKey();
  if (!tk) return null;

  const keyWord = /^(上海|上海市)/.test(addr) ? addr : `上海市${addr}`;
  const postStr = JSON.stringify({
    keyWord,
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
      // 限流/服务异常时重试一次（延迟 1s）
      if (retry < 1 && (json?.status?.infocode === 1001 || !json?.status)) {
        await new Promise((r) => setTimeout(r, 1000));
        return geocodeAddress(addr, retry + 1);
      }
      console.warn('正向地理编码失败:', json?.status?.cndesc || JSON.stringify(json).slice(0, 100));
      return null;
    }
    const pois = json?.pois;
    if (!Array.isArray(pois) || pois.length === 0) return null;
    const lonlat = pois[0].lonlat;
    if (!lonlat) return null;
    const [lngStr, latStr] = lonlat.split(',');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return null;

    // 从 address 提取区名（如"上海市浦东新区世博大道2200号"）
    const addrStr = pois[0].address || '';
    const districtMatch = addrStr.match(/上海市?([^\d]+?区)/);
    return {
      lat,
      lng,
      district: districtMatch ? districtMatch[1] : null,
    };
  } catch (err) {
    console.warn('正向地理编码失败:', err.message);
    return null;
  }
}

// 逆地理编码：返回区名（如 "浦东新区"），失败返回 null
export async function getDistrict(lat, lng) {
  const tk = getTdtKey();
  if (!tk) return null;
  const postStr = JSON.stringify({ lon: lng, lat, ver: 1 });
  const url = `https://api.tianditu.gov.cn/geocoder?postStr=${encodeURIComponent(postStr)}&type=geocode&tk=${encodeURIComponent(tk)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    // 返回结构: { status, result: { addressComponent: { province, city, county, ... } } }
    const county = json?.result?.addressComponent?.county;
    return county || null;
  } catch (err) {
    console.warn('逆地理编码失败', err);
    return null;
  }
}

// 上海 16 个区
export const SHANGHAI_DISTRICTS = [
  '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区',
  '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区',
  '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区',
];

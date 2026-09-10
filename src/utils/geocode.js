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
// addr 示例："上海市徐汇区武康路113号" 或 "武康大楼"
export async function geocodeAddress(addr) {
  const tk = getTdtKey();
  if (!tk) return null;

  // 天地图正向地理编码：type=query 需指定 query 参数
  const postStr = JSON.stringify({ keyWord: addr, queryLatitude: '39.904030', queryLongitude: '116.427030' });
  const url = `https://api.tianditu.gov.cn/geocoder?postStr=${encodeURIComponent(postStr)}&type=query&tk=${encodeURIComponent(tk)}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    // 返回结构: { status, location: { lon, lat }, result: { addressComponent: { county } } }
    const loc = json?.location;
    if (!loc || loc.lat == null || loc.lon == null) return null;

    return {
      lat: loc.lat,
      lng: loc.lon,
      district: json?.result?.addressComponent?.county || null,
    };
  } catch (err) {
    console.warn('正向地理编码失败', err);
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

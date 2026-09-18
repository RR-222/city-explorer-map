// 上海当前天气获取（Open-Meteo 免费API，无需key）
// 火烧云鲜艳度算法参考 sunsetbot.top 方法论：
//   鲜艳度 = 中高云反射分 + 低云遮挡扣分 + 云量适中分 + 气溶胶扣分
//   数据源：GFS 多层云量 + CAMS 气溶胶光学厚度

// 上海市中心坐标
export const SHANGHAI_COORDS = { lat: 31.2304, lng: 121.4737 };

// Open-Meteo weathercode -> 中文天气关键词
const WEATHER_CODE_MAP = {
  0: '晴天',
  1: '多云', 2: '多云', 3: '多云',
  45: '雾天', 48: '雾天',
  51: '雨天', 53: '雨天', 55: '雨天',
  56: '雨天', 57: '雨天',
  61: '雨天', 63: '雨天', 65: '雨天',
  66: '雨天', 67: '雨天',
  71: '雪天', 73: '雪天', 75: '雪天', 77: '雪天',
  80: '雨天', 81: '雨天', 82: '雨天',
  85: '雪天', 86: '雪天',
  95: '雷雨', 96: '雷雨', 99: '雷雨',
};

function formatTime(isoStr) {
  if (!isoStr) return null;
  const timePart = isoStr.split('T')[1];
  if (!timePart) return null;
  return timePart.slice(0, 5);
}

/**
 * 火烧云鲜艳度计算（参考 sunsetbot.top 方法论）
 *
 * 核心物理原理：
 * - 日出/日落时阳光低角度照射，红橙光散射到云底
 * - 中云（高积云）和高云（卷云）是最佳反射体
 * - 低云（层积云）遮挡阳光，不利
 * - 云量 30-70% 最理想（有云反射 + 有缝隙透光）
 * - 气溶胶（AOD）高时天空浑浊，颜色饱和度下降
 *
 * @returns { vividity: number, prob: number, level: string }
 *   vividity: 0-2.5+ 鲜艳度（与 sunsetbot 对齐）
 *   prob: 0-100 概率百分比
 *   level: '微烧'|'小烧'|'中等烧'|'中到大烧'|'大烧'
 */
function calcFireCloud(targetIso, hourlyTimes, cloudLow, cloudMid, cloudHigh, aodArr) {
  if (!targetIso || !hourlyTimes.length) return null;

  // 找最接近日出/日落时刻的小时索引
  const target = new Date(targetIso);
  const targetTs = target.getTime();
  let bestIdx = -1;
  let bestDiff = Infinity;
  for (let i = 0; i < hourlyTimes.length; i++) {
    const diff = Math.abs(new Date(hourlyTimes[i]).getTime() - targetTs);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  if (bestIdx < 0) return null;

  const low = cloudLow?.[bestIdx] ?? 0;
  const mid = cloudMid?.[bestIdx] ?? 0;
  const high = cloudHigh?.[bestIdx] ?? 0;
  const aod = aodArr?.[bestIdx] ?? 0.1;
  const total = Math.min(100, low + mid + high);

  // 1. 中高云反射分 (0 ~ 1.3)
  //    中云是最理想的反射体，高云次之
  const reflector = Math.max(mid, high * 0.85);
  const reflectorScore = Math.min(1.3, (reflector / 100) * 1.6);

  // 2. 低云遮挡扣分 (-0.5 ~ 0)
  //    低云遮住阳光，严重不利
  const lowPenalty = -Math.min(0.5, (low / 100) * 0.6);

  // 3. 云量适中分 (0 ~ 0.5)
  //    30-70% 最佳，太少无云可烧，太多全遮
  let gapScore;
  if (total >= 30 && total <= 70) {
    gapScore = 0.5 - Math.abs(total - 50) * 0.01;
  } else if (total > 70 && total <= 85) {
    gapScore = 0.2;
  } else if (total < 30) {
    gapScore = (total / 30) * 0.3;
  } else {
    gapScore = 0;
  }

  // 4. 气溶胶扣分 (-0.3 ~ 0)
  //    AOD > 0.3 开始明显影响
  const aodPenalty = -Math.min(0.3, Math.max(0, aod - 0.1) * 0.5);

  const vividity = Math.max(0, reflectorScore + lowPenalty + gapScore + aodPenalty);

  // 鲜艳度 → 概率百分比
  const prob = Math.min(100, Math.round(vividity * 55));

  // 档位（与 sunsetbot 对齐）
  let level;
  if (vividity >= 0.8) level = '大烧';
  else if (vividity >= 0.6) level = '中到大烧';
  else if (vividity >= 0.4) level = '中等烧';
  else if (vividity >= 0.2) level = '小烧';
  else level = '微烧';

  return {
    vividity: parseFloat(vividity.toFixed(3)),
    prob,
    level,
  };
}

/**
 * 获取上海当前天气 + 火烧云预报
 */
export async function fetchShanghaiWeather() {
  const { lat, lng } = SHANGHAI_COORDS;

  // 天气 API：多层云量
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=weather_code,temperature_2m` +
    `&hourly=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high` +
    `&daily=sunrise,sunset&timezone=Asia%2FShanghai&forecast_days=2`;

  // 空气质量 API：气溶胶光学厚度
  const aodUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}` +
    `&hourly=aerosol_optical_depth&timezone=Asia%2FShanghai&forecast_days=2`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const [weatherRes, aodRes] = await Promise.all([
      fetch(weatherUrl, { signal: controller.signal }),
      fetch(aodUrl, { signal: controller.signal }).catch(() => null),
    ]);
    clearTimeout(timer);

    const json = await weatherRes.json();
    let aodJson = null;
    try {
      if (aodRes?.ok) aodJson = await aodRes.json();
    } catch (_) { /* CAMS 降级不影响主流程 */ }

    const code = json?.current?.weather_code;
    const temp = json?.current?.temperature_2m;
    const sunriseIso = json?.daily?.sunrise?.[0];
    const sunsetIso = json?.daily?.sunset?.[0];
    const tomorrowSunriseIso = json?.daily?.sunrise?.[1];

    const keyword = WEATHER_CODE_MAP[code] || '多云';

    const now = new Date();
    const hour = now.getHours();
    const lightConditions = [];
    if (hour >= 5 && hour <= 8) lightConditions.push('日出');
    if (hour >= 17 && hour <= 20) lightConditions.push('日落');
    if (hour >= 20 || hour < 5) lightConditions.push('夜景');

    const pad = (n) => String(n).padStart(2, '0');
    const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const hourlyTimes = json?.hourly?.time || [];
    const cloudLow = json?.hourly?.cloud_cover_low || [];
    const cloudMid = json?.hourly?.cloud_cover_mid || [];
    const cloudHigh = json?.hourly?.cloud_cover_high || [];
    const aodArr = aodJson?.hourly?.aerosol_optical_depth || [];

    // 今日日落火烧云 / 明日日出火烧云
    const sunsetGlow = calcFireCloud(sunsetIso, hourlyTimes, cloudLow, cloudMid, cloudHigh, aodArr);
    const sunriseGlow = calcFireCloud(tomorrowSunriseIso, hourlyTimes, cloudLow, cloudMid, cloudHigh, aodArr);

    return {
      keyword,
      temp: temp != null ? Math.round(temp) : null,
      sunrise: sunriseIso,
      sunset: sunsetIso,
      sunriseStr: formatTime(sunriseIso),
      sunsetStr: formatTime(sunsetIso),
      hour,
      lightConditions,
      coords: { lat, lng },
      currentTimeStr,
      sunsetGlow,
      sunriseGlow,
    };
  } catch (err) {
    if (err?.name !== 'AbortError') console.error('获取天气失败', err);
    const now = new Date();
    const hour = now.getHours();
    const lightConditions = [];
    if (hour >= 5 && hour <= 8) lightConditions.push('日出');
    if (hour >= 17 && hour <= 20) lightConditions.push('日落');
    if (hour >= 20 || hour < 5) lightConditions.push('夜景');

    const pad = (n) => String(n).padStart(2, '0');
    const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    return {
      keyword: '多云',
      temp: null,
      sunrise: null,
      sunset: null,
      sunriseStr: null,
      sunsetStr: null,
      hour,
      lightConditions,
      coords: { lat, lng },
      currentTimeStr,
      sunsetGlow: null,
      sunriseGlow: null,
    };
  }
}

export function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

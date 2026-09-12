// 上海当前天气获取（Open-Meteo 免费API，无需key）
// 文档：https://open-meteo.com/en/docs

// 上海市中心坐标
export const SHANGHAI_COORDS = { lat: 31.2304, lng: 121.4737 };

// Open-Meteo weathercode -> 中文天气关键词（与 spots.weather_tags 对齐）
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

// 将 ISO 字符串（如 "2026-09-09T05:38"）格式化为 "05:38"
function formatTime(isoStr) {
  if (!isoStr) return null;
  // 取 T 后面的 HH:mm 部分
  const timePart = isoStr.split('T')[1];
  if (!timePart) return null;
  // 处理可能带秒/时区的情况，只保留 HH:mm
  return timePart.slice(0, 5);
}

/**
 * 获取上海当前天气
 * 返回: {
 *   keyword, temp, sunrise, sunset, sunriseStr, sunsetStr,
 *   hour, lightConditions, coords, currentTimeStr
 * }
 */
export async function fetchShanghaiWeather() {
  const { lat, lng } = SHANGHAI_COORDS;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=weather_code,temperature_2m` +
    `&daily=sunrise,sunset&timezone=Asia%2FShanghai&forecast_days=1`;

  try {
    // 8 秒超时保护：网络异常时快速降级，不阻塞推荐加载
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let res;
    try {
      res = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
    const json = await res.json();

    const code = json?.current?.weather_code;
    const temp = json?.current?.temperature_2m;
    const sunriseIso = json?.daily?.sunrise?.[0];
    const sunsetIso = json?.daily?.sunset?.[0];

    const keyword = WEATHER_CODE_MAP[code] || '多云';

    // 判断光线条件
    const now = new Date();
    const hour = now.getHours();
    const lightConditions = [];

    // 日出：5-7点且天气晴
    if (hour >= 5 && hour <= 8) lightConditions.push('日出');
    // 日落：17-19点
    if (hour >= 17 && hour <= 20) lightConditions.push('日落');
    // 夜景：20点后或5点前
    if (hour >= 20 || hour < 5) lightConditions.push('夜景');

    // 当前时间 HH:mm
    const pad = (n) => String(n).padStart(2, '0');
    const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    return {
      keyword,
      temp: temp != null ? Math.round(temp) : null,
      sunrise: sunriseIso,
      sunset: sunsetIso,
      sunriseStr: formatTime(sunriseIso),    // "05:38"
      sunsetStr: formatTime(sunsetIso),       // "18:12"
      hour,
      lightConditions,
      coords: { lat, lng },
      currentTimeStr,
    };
  } catch (err) {
    console.error('获取天气失败', err);
    // 降级：返回默认值，不阻断推荐
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
    };
  }
}

// 获取当前月份（1-12）
export function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

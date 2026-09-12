// 季节问候 + 月份特点 + 当季花卉工具

import { getCurrentMonth } from './weather';
import flowerCalendarData from '../../data/seasonal-flowers.json';

// 月份特点描述
const MONTH_FEATURES = {
  1: { season: '隆冬', desc: '寒意料峭，腊梅暗香浮动', color: '#90a4ae' },
  2: { season: '初春', desc: '春意萌动，梅花凌寒独放', color: '#e8a0bf' },
  3: { season: '仲春', desc: '百花争艳，樱花如云似霞', color: '#f48fb1' },
  4: { season: '暮春', desc: '春色满园，牡丹紫藤争奇斗艳', color: '#ce93d8' },
  5: { season: '初夏', desc: '初夏将至，薰衣草石榴绽放', color: '#81c784' },
  6: { season: '盛夏', desc: '荷花映日，百子莲亭亭玉立', color: '#4db6ac' },
  7: { season: '酷暑', desc: '烈日炎炎，荷花向日葵竞相绽放', color: '#ffb74d' },
  8: { season: '夏末', desc: '暑气渐消，紫薇百日红正盛', color: '#ff8a65' },
  9: { season: '初秋', desc: '金风送爽，彼岸花石蒜绽放', color: '#a1887f' },
  10: { season: '深秋', desc: '秋色斑斓，桂花飘香粉黛朦胧', color: '#ff7043' },
  11: { season: '暮秋', desc: '层林尽染，红枫银杏秋意浓', color: '#d84315' },
  12: { season: '入冬', desc: '冬意渐浓，红枫银杏水杉依旧斑斓', color: '#78909c' },
};

// 时段问候
function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了，注意休息';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了，注意休息';
}

// 获取某月当季花卉列表（去重）
function getFlowersForMonth(month) {
  const calendar = flowerCalendarData._花历 || flowerCalendarData['花历'] || [];
  const result = [];
  const seen = new Set();
  for (const entry of calendar) {
    const months = entry.months || '';
    const monthList = months.split(',').map(m => parseInt(m.trim(), 10)).filter(n => n >= 1 && n <= 12);
    if (monthList.includes(month) && !seen.has(entry.flower)) {
      seen.add(entry.flower);
      result.push({
        flower: entry.flower,
        months: entry.months,
        category: entry.category,
        spotCount: (entry.spots || []).filter(s => s.district !== '全市').length,
      });
    }
  }
  return result;
}

// 生成完整问候信息
export function getSeasonalGreeting() {
  const month = getCurrentMonth();
  const hour = new Date().getHours();
  const greeting = getTimeGreeting();
  const feature = MONTH_FEATURES[month] || MONTH_FEATURES[1];
  const inSeasonFlowers = getFlowersForMonth(month);
  return {
    greeting,
    month,
    monthFeature: feature,
    inSeasonFlowers,
  };
}

// 获取所有花历条目（去重花名）
export function getAllFlowerEntries() {
  const calendar = flowerCalendarData._花历 || flowerCalendarData['花历'] || [];
  const result = [];
  const seen = new Set();
  for (const entry of calendar) {
    if (!seen.has(entry.flower)) {
      seen.add(entry.flower);
      result.push(entry);
    }
  }
  return result;
}

// 获取按月份分组的花历
export function getFlowerCalendarByMonth() {
  const calendar = flowerCalendarData._花历 || flowerCalendarData['花历'] || [];
  const byMonth = {};
  for (let m = 1; m <= 12; m++) byMonth[m] = [];
  for (const entry of calendar) {
    const months = entry.months || '';
    const monthList = months.split(',').map(m => parseInt(m.trim(), 10)).filter(n => n >= 1 && n <= 12);
    for (const m of monthList) {
      byMonth[m].push(entry);
    }
  }
  return byMonth;
}



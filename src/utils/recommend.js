// 推荐逻辑：根据月份 + 天气 + 光线条件筛选并评分景点

/**
 * 推荐景点
 * @param {Array} spots - 所有预设景点
 * @param {Object} weather - fetchShanghaiWeather 返回的天气对象
 * @param {number} month - 当前月份 1-12
 * @returns {Array} 排序后的推荐景点数组，每个景点带 matchScore 和 matchReasons
 */
export function recommendSpots(spots, weather, month) {
  if (!spots || spots.length === 0) return [];

  const { keyword, lightConditions = [] } = weather || {};

  // 合并所有天气/光线标签：天气关键词 + 当前光线条件
  const allWeatherTags = [keyword, ...lightConditions].filter(Boolean);

  return spots
    .map((spot) => {
      let score = 0;
      const reasons = [];

      // 1. 月份匹配（权重 40）
      // seasons 为字符串："全年" 或 "3,4,5"（逗号分隔月份）
      const seasons = spot.seasons;
      let monthMatch = false;
      if (!seasons || seasons === '全年') {
        monthMatch = true;
      } else {
        const months = seasons.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => n >= 1 && n <= 12);
        monthMatch = months.includes(month);
      }
      if (monthMatch) {
        score += 40;
        reasons.push('当季');
      }

      // 2. 天气/光线匹配（权重每项 20）
      const spotWeatherTags = spot.weather_tags || [];
      const matchedWeather = allWeatherTags.filter((t) => spotWeatherTags.includes(t));
      if (matchedWeather.length > 0) {
        score += matchedWeather.length * 20;
        reasons.push(...matchedWeather);
      }

      return { ...spot, matchScore: score, matchReasons: reasons };
    })
    .filter((s) => s.matchScore > 0) // 至少匹配一项
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * 根据区筛选景点
 */
export function filterByDistrict(spots, district) {
  if (!district || district === '全部') return spots;
  return spots.filter((s) => s.district === district);
}

/**
 * 根据标签筛选
 */
export function filterByTag(spots, tag) {
  if (!tag || tag === '全部') return spots;
  return spots.filter((s) => (s.tags || []).includes(tag));
}

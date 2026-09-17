import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { SHANGHAI_DISTRICTS } from '../utils/geocode';
import { getSeedPhotoUrl } from '../utils/flowerImages';
import heritageData from '../../data/heritage-spots.json';
import flowerCalendarData from '../../data/seasonal-flowers.json';

const flowerCalendar = flowerCalendarData._花历 || flowerCalendarData['花历'] || [];

const seedSpots = heritageData.spots;

// 中文星期（new Date().getDay(): 0=周日）
const WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// 2026 年法定节假日（国务院办公厅《关于2026年部分节假日安排的通知》）。
// 闭馆规则在法定假日期间豁免（例如清明恰逢周一，周一闭馆的场馆照常开放）。
// 跨年后需按新年度放假安排更新本表。
const HOLIDAY_RANGES = [
  ['2026-01-01', '2026-01-03'], // 元旦
  ['2026-02-15', '2026-02-23'], // 春节
  ['2026-04-04', '2026-04-06'], // 清明
  ['2026-05-01', '2026-05-05'], // 劳动节
  ['2026-06-19', '2026-06-21'], // 端午
  ['2026-09-25', '2026-09-27'], // 中秋
  ['2026-10-01', '2026-10-07'], // 国庆
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function dayKey(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function isHoliday(d) {
  const k = dayKey(d);
  return HOLIDAY_RANGES.some(([a, b]) => k >= a && k <= b);
}

export default function HeritagePage() {
  const [district, setDistrict] = useState('全部');
  const [tag, setTag] = useState('全部');

  // 今日基准：月份（时令重合）、星期（闭馆）、是否法定假日（豁免）
  const today = useMemo(() => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      weekday: WEEK_CN[now.getDay()],
      holiday: isHoliday(now),
    };
  }, []);

  // 全部标签
  const allTags = useMemo(() => {
    const set = new Set();
    seedSpots.forEach((s) => (s.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  // 排序管线（第一权重：周边时令花树数量）：
  //   1. 统计 seasonal 数组里 distanceKm ≤ 1.2 的有效条数
  //   2. 今日闭馆的景点沉底（组2），不推荐
  //   3. 开放的景点按 nearbyFlowerCount 降序排列，附近花树越多越靠前
  const { filtered, sorted } = useMemo(() => {
    const list = seedSpots.filter(
      (s) =>
        (district === '全部' || s.district === district) &&
        (tag === '全部' || (s.tags || []).includes(tag))
    );

    // 当季花卉集合（按月筛选）
    const inSeasonFlowers = new Set(
      flowerCalendar
        .filter((e) => {
          const months = (e.months || '').split(',').map((m) => parseInt(m.trim(), 10)).filter((n) => n >= 1 && n <= 12);
          return months.includes(today.month);
        })
        .flatMap((e) => e.flower.split('/').map((f) => f.trim()))
    );

    const rows = list.map((s) => {
      // 统计 distanceKm ≤ 1.2 且花卉当季的有效时令点位
      const nearbyFlowers = (s.seasonal || [])
        .filter((se) => se.distanceKm != null && se.distanceKm <= 1.2)
        .filter((se) => {
          const flowers = (se.flower || '').split('/').map((f) => f.trim());
          return flowers.some((f) => inSeasonFlowers.has(f));
        });
      const nearbyFlowerCount = nearbyFlowers.length;
      const nearbyFlowerNames = [...new Set(nearbyFlowers.map((se) => se.flower).filter(Boolean))]
        .slice(0, 3);
      const closedToday = !today.holiday && (s.closedDays || []).includes(today.weekday);
      const group = closedToday ? 2 : 1;
      return { s, nearbyFlowerCount, nearbyFlowerNames, closedToday, group };
    });
    // 闭馆沉底，开放组内按 nearbyFlowerCount 降序
    rows.sort((a, b) => {
      if (a.group !== b.group) return a.group - b.group;
      return b.nearbyFlowerCount - a.nearbyFlowerCount;
    });
    return { filtered: list, sorted: rows };
  }, [district, tag, today]);

  return (
    <div className="app-root">
      <TopBar />

      <div className="seasonal-page" id="main" tabIndex={-1}>
        <div className="page-header">
          <h2 className="page-title">人文建筑</h2>
          <p className="text-muted">上海经典老建筑与地标，点击建筑查看详细介绍与地图定位。</p>
        </div>

        {/* 区筛选 */}
        <div className="district-filter">
          <button
            className={`district-btn ${district === '全部' ? 'active' : ''}`}
            onClick={() => setDistrict('全部')}
          >全部</button>
          {SHANGHAI_DISTRICTS.map((d) => (
            <button
              key={d}
              className={`district-btn ${district === d ? 'active' : ''}`}
              onClick={() => setDistrict(d)}
            >{d}</button>
          ))}
        </div>

        {/* 标签筛选 */}
        <div className="tag-filter">
          <button
            className={`tag-btn ${tag === '全部' ? 'active' : ''}`}
            onClick={() => setTag('全部')}
          >全部</button>
          {allTags.map((t) => (
            <button
              key={t}
              className={`tag-btn ${tag === t ? 'active' : ''}`}
              onClick={() => setTag(t)}
            >{t}</button>
          ))}
        </div>

        <div className="heritage-grid">
          {sorted.map(({ s, nearbyFlowerCount, nearbyFlowerNames, closedToday }) => {
            const photo = s.photos?.[0] ? getSeedPhotoUrl(s.photos[0]) : null;
            const seasonalLabel = nearbyFlowerCount > 0
              ? (nearbyFlowerCount > 3
                  ? `${nearbyFlowerNames.join(' / ')} 等${nearbyFlowerCount}处`
                  : nearbyFlowerNames.join(' / '))
              : null;
            const cardClass = closedToday
              ? 'heritage-card heritage-card-closed'
              : nearbyFlowerCount > 0
                ? 'heritage-card heritage-card-seasonal'
                : 'heritage-card';
            return (
              <Link
                key={s.name}
                to={`/building/${encodeURIComponent(s.name)}`}
                className={cardClass}
              >
                {photo ? (
                  <img src={photo} alt={s.name} className="heritage-img" loading="lazy" />
                ) : (
                  <div className="heritage-img-placeholder">🏛</div>
                )}
                <div className="heritage-body">
                  {closedToday && (
                    <span className="heritage-closed-badge">今日闭馆 · 可外观</span>
                  )}
                  {seasonalLabel && (
                    <span
                      className={`heritage-seasonal-badge${closedToday ? ' heritage-seasonal-badge-muted' : ''}`}
                    >
                      附近{nearbyFlowerCount}处花树 · {seasonalLabel}
                    </span>
                  )}
                  <div className="heritage-name">{s.name}</div>
                  {s.district && <span className="heritage-district">{s.district}</span>}
                  {s.description && <p className="heritage-desc">{s.description}</p>}
                  {s.tags && s.tags.length > 0 && (
                    <div className="card-reasons">
                      {s.tags.slice(0, 4).map((t) => (
                        <span key={t} className="reason-chip">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-muted">该条件下暂无建筑收录。</p>
        )}
      </div>
    </div>
  );
}

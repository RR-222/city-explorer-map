import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import FlowerImage from '../components/FlowerImage';
import { getCurrentMonth } from '../utils/weather';
import { getFlowerCalendarByMonth } from '../utils/seasonalGreeting';

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

/** 花期字符串 -> 展示文本，如 "3,4" -> "3-4月" */
function formatMonths(months) {
  if (!months) return '';
  const list = String(months)
    .split(',')
    .map((m) => parseInt(m.trim(), 10))
    .filter((n) => n >= 1 && n <= 12);
  if (list.length === 0) return '';
  if (list.length === 1) return `${list[0]}月`;
  const sorted = [...list].sort((a, b) => a - b);
  return `${sorted[0]}-${sorted[sorted.length - 1]}月`;
}

export default function SeasonalFlowersPage() {
  const currentMonth = getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const byMonth = useMemo(() => getFlowerCalendarByMonth(), []);
  const flowers = byMonth[selectedMonth] || [];

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand asLink to="/" />
        <div className="user-area">
          <Link to="/" className="link">地图</Link>
          <Link to="/recommend" className="link">今日推荐</Link>
          <Link to="/seasonal" className="link active">时令景观</Link>
          <Link to="/heritage" className="link">人文建筑</Link>
          <Link to="/wechat" className="link">文旅情报</Link>
          <Link to="/achievements" className="link">成就</Link>
          <Link to="/profile" className="link">个人中心</Link>
        </div>
      </div>

      <div className="seasonal-page" id="main" tabIndex={-1}>
        <div className="page-header">
          <h2 className="page-title">时令景观</h2>
          <p className="text-muted text-small">按月份浏览上海当季花卉，点击花卉查看赏花地点与详细介绍</p>
        </div>

        {/* 月份选择器 */}
        <div className="month-selector">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <button
              key={m}
              className={`month-btn ${m === selectedMonth ? 'active' : ''}`}
              onClick={() => setSelectedMonth(m)}
            >
              {MONTH_NAMES[m]}
            </button>
          ))}
        </div>

        {/* 当前月份花卉列表 */}
        {flowers.length === 0 ? (
          <div className="empty-state">
            <p>{MONTH_NAMES[selectedMonth]}暂无时令花卉数据</p>
          </div>
        ) : (
          <div className="flower-grid">
            {flowers.map((f, idx) => (
              <Link
                key={`${f.flower}-${idx}`}
                to={`/seasonal/${encodeURIComponent(f.flower)}`}
                className="flower-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="flower-card-img-wrap">
                  <FlowerImage
                    name={f.flower}
                    className="flower-card-img"
                    alt={f.flower}
                  />
                  <div className="flower-card-overlay" />
                </div>
                <div className="flower-card-body">
                  <h3 className="flower-card-name">{f.flower}</h3>
                  <div className="flower-card-meta">
                    {f.category && <span className="flower-card-category">{f.category}</span>}
                    {f.months && <span className="flower-card-month">{formatMonths(f.months)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

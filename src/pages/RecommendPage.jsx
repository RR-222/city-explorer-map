import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Brand from '../components/Brand';
import EmptyState from '../components/EmptyState';
import { RecommendSkeleton } from '../components/Skeleton';
import { fetchShanghaiWeather, getCurrentMonth } from '../utils/weather';
import { recommendSpots, filterByDistrict } from '../utils/recommend';
import { filterVisibleSpots } from '../utils/spotsFilter';
import { SHANGHAI_DISTRICTS } from '../utils/geocode';

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const WEATHER_EMOJI = {
  '晴天': '☀️', '多云': '⛅', '雨天': '🌧️', '雾天': '🌫️',
  '雪天': '❄️', '雷雨': '⛈️', '日出': '🌅', '日落': '🌇', '夜景': '🌃',
};

export default function RecommendPage() {
  const [spots, setSpots] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('全部');

  const month = getCurrentMonth();

  // 加载景点 + 天气
  useEffect(() => {
    const load = async () => {
      try {
        const [spotsRes, w] = await Promise.all([
          supabase.from('spots').select('*'),
          fetchShanghaiWeather(),
        ]);
        setSpots(filterVisibleSpots(spotsRes.data || []));
        setWeather(w);
      } catch (err) {
        console.error('加载失败', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 推荐列表（先按区筛选，再推荐评分）
  const recommendations = useMemo(() => {
    const filtered = filterByDistrict(spots, district);
    return recommendSpots(filtered, weather, month);
  }, [spots, weather, month, district]);

  // 所有标签（用于筛选）
  const allTags = useMemo(() => {
    const set = new Set();
    spots.forEach((s) => (s.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [spots]);

  if (loading) {
    return (
      <div className="app-root">
        <div className="topbar"><Brand asLink to="/" /></div>
        <div className="recommend-page">
          <RecommendSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand asLink to="/" />
        <div className="user-area">
          <Link to="/" className="link">地图</Link>
          <Link to="/achievements" className="link">成就</Link>
          <Link to="/profile" className="link">个人中心</Link>
        </div>
      </div>

      <div className="recommend-page">
        {/* 天气状态条 */}
        {weather && (
          <div className="weather-bar">
            <span className="weather-now">
              {WEATHER_EMOJI[weather.keyword] || '🌤️'} {weather.keyword}
            </span>
            {weather.temp != null && <span className="weather-temp">{weather.temp}°C</span>}
            <span className="weather-month">{MONTH_NAMES[month]}</span>

            {/* 当前时间 */}
            {weather.currentTimeStr && (
              <span className="weather-sun">🕐 当前 {weather.currentTimeStr}</span>
            )}

            {/* 精确日出日落 */}
            {weather.sunriseStr && (
              <span className="weather-sun">🌅 日出 {weather.sunriseStr}</span>
            )}
            {weather.sunsetStr && (
              <span className="weather-sun">🌇 日落 {weather.sunsetStr}</span>
            )}

            {weather.lightConditions.length > 0 && (
              <span className="weather-light">
                {weather.lightConditions.map((l) => WEATHER_EMOJI[l] || '').join(' ')} {weather.lightConditions.join('/')}
              </span>
            )}

            {/* 坐标 */}
            {weather.coords && (
              <span className="weather-coord">
                📍 {weather.coords.lat.toFixed(4)}°N, {weather.coords.lng.toFixed(4)}°E
              </span>
            )}
          </div>
        )}

        <div className="page-header">
          <h2 className="page-title">今日推荐打卡点</h2>
          <p className="text-muted text-small">
            根据{MONTH_NAMES[month]}的上海天气，为你筛选最合适的拍摄景点
          </p>
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

        {/* 推荐列表 */}
        {recommendations.length === 0 ? (
          <EmptyState
            title="暂无推荐"
            description="当前条件下没有匹配的景点。试试切换区域，或等天气条件变化后再来看看。"
          />
        ) : (
          <div className="recommend-grid">
            {recommendations.map((spot, idx) => (
              <Link
                key={spot.id}
                to={`/spots/${spot.id}`}
                className="recommend-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {/* 排名徽章 */}
                {idx < 3 && (
                  <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}</span>
                )}

                {/* 样片 */}
                {spot.photos && spot.photos.length > 0 ? (
                  <img src={spot.photos[0]} alt={spot.name} className="card-img" />
                ) : (
                  <div className="card-img-placeholder">📷</div>
                )}

                <div className="card-body">
                  <div className="card-title">{spot.name}</div>
                  {spot.district && <span className="card-district">{spot.district}</span>}

                  {/* 匹配原因 */}
                  <div className="card-reasons">
                    {spot.matchReasons.map((r) => (
                      <span key={r} className="reason-chip">
                        {WEATHER_EMOJI[r] || ''} {r}
                      </span>
                    ))}
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

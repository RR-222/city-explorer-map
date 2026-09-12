import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import { RecommendSkeleton } from '../components/Skeleton';
import { fetchShanghaiWeather, getCurrentMonth } from '../utils/weather';
import { getSeasonalGreeting } from '../utils/seasonalGreeting';
import { SHANGHAI_DISTRICTS } from '../utils/geocode';
import { getSeedPhotoUrl } from '../utils/flowerImages';
import FlowerImage from '../components/FlowerImage';
import seedSpots from '../../data/spots-seed.json';

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const WEATHER_EMOJI = {
  '晴天': '☀️', '多云': '⛅', '雨天': '🌧️', '雾天': '🌫️',
  '雪天': '❄️', '雷雨': '⛈️', '日出': '🌅', '日落': '🌇', '夜景': '🌃',
};

export default function RecommendPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('全部');

  const month = getCurrentMonth();
  const greetingInfo = getSeasonalGreeting();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const w = await fetchShanghaiWeather();
        if (mounted) setWeather(w);
      } catch (err) {
        console.error('加载天气失败', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 左栏：当季时令花卉（时令景观）
  const seasonalRecs = greetingInfo.inSeasonFlowers.map((f, i) => ({
    id: `seasonal-${f.flower}`,
    _type: 'seasonal',
    flower: f.flower,
    name: f.flower,
    category: f.category,
    months: f.months,
    matchReasons: ['当季限定'],
    rank: i + 1,
  }));

  // 右栏：人文建筑（spots-seed.json，按区筛选）
  const heritageSpots = seedSpots.filter(
    (s) => district === '全部' || s.district === district
  );

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
          <Link to="/recommend" className="link active">今日推荐</Link>
          <Link to="/seasonal" className="link">时令景观</Link>
          <Link to="/heritage" className="link">人文建筑</Link>
          <Link to="/wechat" className="link">文旅情报</Link>
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
            {weather.currentTimeStr && (
              <span className="weather-sun">🕐 当前 {weather.currentTimeStr}</span>
            )}
            {weather.sunriseStr && <span className="weather-sun">🌅 日出 {weather.sunriseStr}</span>}
            {weather.sunsetStr && <span className="weather-sun">🌇 日落 {weather.sunsetStr}</span>}
            {weather.lightConditions.length > 0 && (
              <span className="weather-light">
                {weather.lightConditions.map((l) => WEATHER_EMOJI[l] || '').join(' ')} {weather.lightConditions.join('/')}
              </span>
            )}
          </div>
        )}

        <div className="page-header">
          <h2 className="page-title">今日推荐打卡点</h2>
          {/* 季节问候 */}
          <div className="recommend-greeting">
            <p className="recommend-greeting-text">
              {greetingInfo.greeting}！{MONTH_NAMES[greetingInfo.month]}是上海的{greetingInfo.monthFeature.season}，{greetingInfo.monthFeature.desc}。
            </p>
            {greetingInfo.inSeasonFlowers.length > 0 && (
              <div className="recommend-greeting-flowers">
                <span className="recommend-greeting-label">🌸 当季花卉：</span>
                {greetingInfo.inSeasonFlowers.map((f) => (
                  <Link
                    key={f.flower}
                    to={`/seasonal/${encodeURIComponent(f.flower)}`}
                    className="recommend-greeting-flower-chip"
                  >
                    {f.flower}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <p className="text-muted text-small">
            根据{MONTH_NAMES[month]}的上海天气，为你筛选最合适的拍摄景点
          </p>
        </div>

        {/* 区筛选（作用于人文建筑栏） */}
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

        {/* 两栏：时令景观 | 人文建筑 */}
        <div className="recommend-split">
          {/* 左栏：时令景观 */}
          <section className="recommend-col seasonal-col">
            <h3 className="col-title">🌸 时令景观</h3>
            <p className="col-subtitle">本月当季花卉，正值盛放</p>
            <div className="recommend-grid">
              {seasonalRecs.map((spot) => (
                <Link
                  key={spot.id}
                  to={`/seasonal/${encodeURIComponent(spot.flower)}`}
                  className="recommend-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <span className="rank-badge rank-1">{spot.rank}</span>
                  <span className="card-seasonal-badge">当季限定</span>
                  <FlowerImage name={spot.flower} className="card-img" alt={spot.name} />
                  <div className="card-body">
                    <div className="card-title">{spot.name}</div>
                    {spot.category && <span className="card-district">{spot.category}</span>}
                    {spot.months && <span className="card-months">📅 {spot.months}月</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 右栏：人文建筑 */}
          <section className="recommend-col heritage-col">
            <h3 className="col-title">🏛 人文建筑</h3>
            <p className="col-subtitle">
              {district === '全部' ? '上海经典老建筑与地标' : `${district}的经典建筑与地标`}
            </p>
            {heritageSpots.length === 0 ? (
              <p className="text-muted text-small">该区暂无建筑收录。</p>
            ) : (
              <div className="recommend-grid">
                {heritageSpots.map((s, idx) => {
                  const photo = s.photos?.[0] ? getSeedPhotoUrl(s.photos[0]) : null;
                  return (
                    <Link
                      key={s.name}
                      to={`/building/${encodeURIComponent(s.name)}`}
                      className="recommend-card"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {idx < 3 && <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}</span>}
                      {photo ? (
                        <img src={photo} alt={s.name} className="card-img" />
                      ) : (
                        <div className="card-img-placeholder">🏛</div>
                      )}
                      <div className="card-body">
                        <div className="card-title">{s.name}</div>
                        {s.district && <span className="card-district">{s.district}</span>}
                        {s.tags && s.tags.length > 0 && (
                          <div className="card-reasons">
                            {s.tags.slice(0, 3).map((t) => (
                              <span key={t} className="reason-chip">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

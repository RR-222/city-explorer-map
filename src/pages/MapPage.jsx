import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import AddPlaceModal from '../components/AddPlaceModal';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import FlowerImage from '../components/FlowerImage';
import { supabase } from '../supabaseClient';
import { fetchShanghaiWeather, getCurrentMonth } from '../utils/weather';
import { getSeasonalGreeting } from '../utils/seasonalGreeting';
import { recommendSpots } from '../utils/recommend';
import { filterVisibleSpots } from '../utils/spotsFilter';

const WEATHER_EMOJI = {
  '晴天': '☀️', '多云': '⛅', '雨天': '🌧️', '雾天': '🌫️',
  '雪天': '❄️', '雷雨': '⛈️', '日出': '🌅', '日落': '🌇', '夜景': '🌃',
};

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [spots, setSpots] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [addingCoords, setAddingCoords] = useState(null);
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const month = getCurrentMonth();
  const greetingInfo = getSeasonalGreeting();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
    })();

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 加载预设建筑景点（公开可读）并过滤隐藏项
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const { data, error } = await supabase
          .from('spots')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setSpots(filterVisibleSpots(data || []));
      } catch (err) {
        console.error('load spots error', err);
      }
    };
    fetchSpots();
  }, []);

  // 加载时令花卉景点（公开可读）
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const { data, error } = await supabase
          .from('flowers')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setFlowers(data || []);
      } catch (err) {
        // flowers 表可能尚未创建，静默处理
        console.warn('load flowers error', err?.message || err);
      }
    };
    fetchFlowers();
  }, []);

  // 加载当前天气并计算今日推荐
  useEffect(() => {
    const loadWeatherAndRecs = async () => {
      try {
        setLoadingRecs(true);
        const w = await fetchShanghaiWeather();
        setWeather(w);
      } catch (err) {
        console.error('weather error', err);
      } finally {
        setLoadingRecs(false);
      }
    };
    loadWeatherAndRecs();
  }, []);

  // 用户打卡记录
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        if (!user) {
          setPlaces([]);
          return;
        }
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setPlaces(data || []);
      } catch (err) {
        console.error('load places error', err);
      }
    };
    fetchPlaces();
  }, [user]);

  // 合并建筑景点 + 花卉景点（花卉的 months 映射为 seasons 以兼容推荐逻辑）
  const allSpots = useMemo(() => {
    const normalizedFlowers = flowers.map((f) => ({
      ...f,
      _type: 'flower',
      seasons: f.months || '全年',
      tags: [...(f.tags || []), f.flower].filter(Boolean),
    }));
    return [...spots, ...normalizedFlowers];
  }, [spots, flowers]);

  const todayRecommendations = useMemo(() => {
    // 当季时令植物并入今日推荐（排在最前）
    const seasonalRecs = greetingInfo.inSeasonFlowers.map((f, i) => ({
      id: `seasonal-${f.flower}`,
      _type: 'seasonal',
      flower: f.flower,
      name: f.flower,
      category: f.category,
      district: '',
      months: f.months,
      photos: [],
      matchScore: 1000 - i,
      matchReasons: ['当季限定'],
    }));
    return [...seasonalRecs, ...recommendSpots(allSpots, weather, month)].slice(0, 8);
  }, [allSpots, weather, month, greetingInfo.inSeasonFlowers]);

  const handleMapClick = (coords) => setAddingCoords(coords);

  const handleSelectSpot = (spot) => {
    // 当季时令植物：直接跳转花卉详情页
    if (spot._type === 'seasonal') {
      navigate(`/seasonal/${encodeURIComponent(spot.flower)}`);
      return;
    }
    setSelectedSpot(spot);
  };

  const handleSaved = (newPlace) => {
    setPlaces((p) => [newPlace, ...p]);
  };

  return (
    <div className="app-root">
      <TopBar
        user={user}
        onLogout={async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }}
      />

      <div className="home-layout" id="main" tabIndex={-1}>
        {/* 今日推荐面板 */}
        <aside className="home-recommend">
          <div className="home-recommend-header">
            <h2 className="home-recommend-title">今日推荐</h2>
            {weather && (
              <div className="home-recommend-weather">
                <span className="home-recommend-now">
                  {WEATHER_EMOJI[weather.keyword] || '🌤️'} {weather.keyword}
                </span>
                {weather.temp != null && (
                  <span className="home-recommend-temp">{weather.temp}°C</span>
                )}
                <span className="home-recommend-month">{MONTH_NAMES[month]}</span>
              </div>
            )}
          </div>

          {/* 季节问候 */}
          <div className="home-greeting">
            <p className="home-greeting-text">
              {greetingInfo.greeting}！{MONTH_NAMES[greetingInfo.month]}是上海的{greetingInfo.monthFeature.season}，{greetingInfo.monthFeature.desc}。
            </p>
            {greetingInfo.inSeasonFlowers.length > 0 && (
              <div className="home-greeting-flowers">
                <span className="home-greeting-label">🌸 当季花卉：</span>
                {greetingInfo.inSeasonFlowers.map((f) => (
                  <Link
                    key={f.flower}
                    to={`/seasonal/${encodeURIComponent(f.flower)}`}
                    className="home-greeting-flower-chip"
                  >
                    {f.flower}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <p className="home-recommend-subtitle">
            根据当前天气和季节，挑选适合今天打卡的拍摄点。点击卡片在地图上查看位置。
          </p>

          {loadingRecs ? (
            <div className="home-recommend-loading">正在生成推荐…</div>
          ) : todayRecommendations.length === 0 ? (
            <EmptyState
              title="暂无今日推荐"
              description="当前天气下没有特别匹配的景点，可以去地图自由探索。"
            />
          ) : (
            <div className="home-recommend-list">
              {todayRecommendations.map((spot, idx) => {
                const isSeasonal = spot._type === 'seasonal';
                const isSelected = !isSeasonal && selectedSpot?.id === spot.id;
                return (
                  <div
                    key={spot.id}
                    className={`home-recommend-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectSpot(spot)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleSelectSpot(spot);
                    }}
                  >
                    <span className={`home-recommend-rank rank-${idx + 1}`}>{idx + 1}</span>
                    {isSeasonal ? (
                      <FlowerImage name={spot.flower} className="home-recommend-img" alt={spot.name} />
                    ) : spot.photos && spot.photos.length > 0 ? (
                      <img src={spot.photos[0]} alt={spot.name} className="home-recommend-img" />
                    ) : (
                      <div className="home-recommend-img-placeholder">📷</div>
                    )}
                    <div className="home-recommend-body">
                      <div className="home-recommend-name">{spot.name}</div>
                      {spot.district && <div className="home-recommend-district">{spot.district}</div>}
                      {spot.matchReasons && spot.matchReasons.length > 0 && (
                        <div className="home-recommend-reasons">
                          {spot.matchReasons.slice(0, 2).map((r) => (
                            <span key={r} className="reason-chip">
                              {WEATHER_EMOJI[r] || ''} {r}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link
                        to={isSeasonal
                          ? `/seasonal/${encodeURIComponent(spot.flower)}`
                          : spot._type === 'flower'
                            ? `/flowers/${spot.id}`
                            : `/spots/${spot.id}`}
                        className="home-recommend-detail"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {isSeasonal ? '查看花卉 →' : '查看详情 →'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link to="/recommend" className="home-recommend-more">
            查看全部推荐 →
          </Link>
        </aside>

        {/* 地图区域 */}
        <main className="home-map">
          <MapView
            spots={spots}
            flowers={flowers}
            places={places}
            onMapClick={user ? handleMapClick : null}
            highlightSpot={selectedSpot}
          />
        </main>
      </div>

      {addingCoords && (
        <AddPlaceModal
          coords={addingCoords}
          onClose={() => setAddingCoords(null)}
          onSaved={(p) => {
            handleSaved(p);
            setAddingCoords(null);
          }}
        />
      )}
    </div>
  );
}

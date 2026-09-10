import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView';
import AddPlaceModal from '../components/AddPlaceModal';
import Brand from '../components/Brand';
import EmptyState from '../components/EmptyState';
import { supabase } from '../supabaseClient';
import { fetchShanghaiWeather, getCurrentMonth } from '../utils/weather';
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
  const [addingCoords, setAddingCoords] = useState(null);
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const month = getCurrentMonth();

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

  // 加载预设景点（公开可读）并过滤隐藏项
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

  const todayRecommendations = useMemo(() => {
    return recommendSpots(spots, weather, month).slice(0, 3);
  }, [spots, weather, month]);

  const handleMapClick = (coords) => setAddingCoords(coords);

  const handleSaved = (newPlace) => {
    setPlaces((p) => [newPlace, ...p]);
  };

  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
  };

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand />
        <div className="user-area">
          {user ? (
            <>
              <span>{user.email}</span>
              <Link to="/recommend" className="link">今日推荐</Link>
              <Link to="/achievements" className="link">成就</Link>
              <Link to="/profile" className="link">个人中心</Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="link"
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link">登录</Link>
              <Link to="/register" className="link">注册</Link>
            </>
          )}
        </div>
      </div>

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
                const isSelected = selectedSpot?.id === spot.id;
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
                    {spot.photos && spot.photos.length > 0 ? (
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
                        to={`/spots/${spot.id}`}
                        className="home-recommend-detail"
                        onClick={(e) => e.stopPropagation()}
                      >
                        查看详情 →
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

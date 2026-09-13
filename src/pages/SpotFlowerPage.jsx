import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import Brand from '../components/Brand';
import MarkButtons from '../components/MarkButtons';
import { useToast } from '../components/Toast';
import { supabase } from '../supabaseClient';
import { geocodeAddress } from '../utils/geocode';
import { getLocalPhotoUrl } from '../utils/flowerImages';
import { fetchMarks, setMark } from '../utils/marks';
import flowerSpots from '../../data/flower-spots.json';
import seedSpots from '../../data/spots-seed.json';

// 默认图标（与 SpotDetailPage 一致）
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 时令景点主标记：橙色圆点
const flowerSpotIcon = L.divIcon({
  className: 'flower-spot-marker',
  html: '<div class="flower-spot-dot"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// 附近建筑标记：青色圆点
const nearbyIcon = L.divIcon({
  className: 'flower-nearby-marker',
  html: '<div class="flower-nearby-dot"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const TDT_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TDT_KEY) ||
  (typeof document !== 'undefined'
    ? document.querySelector('meta[name="VITE_TDT_KEY"]')?.getAttribute('content')
    : undefined) ||
  '';

// 与首页 MapView 相同的天地图矢量底图 + 中文注记层
const tdtVecUrl = `https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TDT_KEY)}`;
const tdtCvaUrl = `https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TDT_KEY)}`;

/** haversine 距离（km） */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** 街道路线存在时：缩放到覆盖全部路线；否则居中到景点坐标 */
function FitRoutes({ routes, fallbackCenter, fallbackZoom }) {
  const map = useMap();
  useEffect(() => {
    if (routes && routes.length > 0) {
      const all = routes.flatMap((r) => r.paths.flat());
      if (all.length === 0) return;
      const lats = all.map((p) => p[0]);
      const lngs = all.map((p) => p[1]);
      map.fitBounds(
        [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ],
        { padding: [36, 36], duration: 0.8 }
      );
      return;
    }
    if (fallbackCenter) map.flyTo(fallbackCenter, fallbackZoom || 14, { duration: 0.6 });
  }, [map, routes, fallbackCenter, fallbackZoom]);
  return null;
}

export default function SpotFlowerPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const spotName = decodeURIComponent(name || '');
  const spot = flowerSpots.spots.find((s) => s.id === spotName) || null;

  const [coords, setCoords] = useState(null); // { lat, lng }
  const [locating, setLocating] = useState(true);
  const [showNearby, setShowNearby] = useState(false);
  const [focused, setFocused] = useState(null); // 附近建筑聚焦
  const [visibleRoutes, setVisibleRoutes] = useState({}); // 街道图层开关（默认全部隐藏，避免地图过乱）

  // 当前用户 + 想去/去过标记
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
      if (data?.user) {
        const m = await fetchMarks(data.user.id);
        if (!mounted) return;
        setMarks(m.__error ? {} : m);
      }
    })();
    const { subscription } = supabase.auth.onAuthStateChange(async (_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const m = await fetchMarks(session.user.id);
        if (mounted) setMarks(m.__error ? {} : m);
      } else if (mounted) {
        setMarks({});
      }
    });
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleMarkChange = async (key, status) => {
    if (!user) {
      toast.info('请先登录后再标记');
      navigate('/login');
      return;
    }
    if (!spot) return;
    const prev = marks[key];
    setMarks((m) => ({ ...m, [key]: status }));
    const { error } = await setMark(user.id, 'spot', spot.id, status);
    if (error) {
      setMarks((m) => ({ ...m, [key]: prev }));
      const msg = String(error.message || '');
      if (msg.includes('does not exist') || msg.includes('marks')) {
        toast.error('标记功能需要先初始化数据库，请执行 supabase/marks-schema.sql');
      } else {
        toast.error('操作失败，请重试');
      }
    }
  };

  // 定位景点坐标：优先同名 seed 建筑，否则天地图正向地理编码
  useEffect(() => {
    let mounted = true;
    setLocating(true);
    setCoords(null);
    setShowNearby(false);
    setFocused(null);
    setVisibleRoutes({});
    (async () => {
      let c = null;
      if (spot) {
        if (spot.lat != null && spot.lng != null) {
          c = { lat: spot.lat, lng: spot.lng };
        } else {
          const sameName = seedSpots.find(
            (b) => b.name === spot.name || b.name.startsWith(spot.name) || spot.name.startsWith(b.name)
          );
          if (sameName?.lat != null && sameName?.lng != null) {
            c = { lat: sameName.lat, lng: sameName.lng };
          } else {
            c = (await geocodeAddress(spot.name)) || (await geocodeAddress(spot.address)) || null;
          }
        }
      }
      if (!mounted) return;
      setCoords(c);
      setLocating(false);
    })();
    return () => {
      mounted = false;
    };
  }, [spot]);

  // 看看附近：距离最近的 5 个 seed 建筑
  const nearby = useMemo(() => {
    if (!coords) return [];
    return seedSpots
      .map((b) => ({
        ...b,
        distanceKm: haversineKm(coords.lat, coords.lng, b.lat, b.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);
  }, [coords]);

  // 当前可见的街道图层（用于折线渲染与自动缩放）
  const visibleRouteList = useMemo(
    () => (spot?.street_routes || []).filter((_, i) => visibleRoutes[i]),
    [spot, visibleRoutes]
  );

  const mainPhoto = spot?.photos?.[0] ? getLocalPhotoUrl(spot.photos[0]) : null;

  if (!spot) {
    return (
      <div className="app-root">
        <div className="topbar"><Brand asLink to="/" /></div>
        <div className="error-screen">
          <p>未找到该赏花景点</p>
          <Link to="/seasonal" className="link">返回时令景观</Link>
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
          <Link to="/recommend" className="link">今日推荐</Link>
          <Link to="/seasonal" className="link active">时令景观</Link>
          <Link to="/heritage" className="link">人文建筑</Link>
          <Link to="/wechat" className="link">文旅情报</Link>
          <Link to="/achievements" className="link">成就</Link>
          <Link to="/profile" className="link">个人中心</Link>
        </div>
      </div>

      <div className="home-layout flower-spot-layout" id="main" tabIndex={-1}>
        {/* 侧栏：景点介绍 */}
        <aside className="home-recommend flower-spot-sidebar">
          <Link to="/seasonal" className="back-link">← 返回时令景观</Link>
          <h2 className="flower-spot-title">{spot.name}</h2>
          <MarkButtons
            type="spot"
            targetKey={spot.id}
            marks={marks}
            onChange={handleMarkChange}
          />
          <div className="spot-meta">
            {spot.district && <span className="meta-chip">{spot.district}</span>}
            {spot.flowers.slice(0, 4).map((f) => (
              <Link key={f} to={`/seasonal/${encodeURIComponent(f)}`} className="meta-chip tag">
                {f}
              </Link>
            ))}
            {spot.flowers.length > 4 && <span className="meta-chip">+{spot.flowers.length - 4}</span>}
          </div>
          {spot.address && <div className="spot-address">📍 {spot.address}</div>}

          {mainPhoto && (
            <img src={mainPhoto} alt={spot.name} className="flower-spot-main-photo" loading="lazy" />
          )}

          {spot.intro && (
            <div className="spot-section">
              <h3>景点介绍</h3>
              <p className="spot-desc">{spot.intro}</p>
              {spot.flowers.length > 0 && (
                <p className="spot-desc flower-spot-extra">
                  这里可同时观赏 {spot.flowers.join('、')} 等 {spot.flowers.length} 种时令花卉，位于{spot.district}。
                </p>
              )}
            </div>
          )}

          {/* 查看原文（与景点详情页模式一致） */}
          {spot.source_url && (
            <div className="spot-section">
              <a href={spot.source_url} target="_blank" rel="noreferrer" className="source-btn">
                查看原文 →
              </a>
            </div>
          )}

          {/* 看看附近 */}
          <div className="spot-section">
            <h3>看看附近</h3>
            {!coords ? (
              <p className="text-muted">{locating ? '正在定位该景点…' : '暂时无法定位该景点，无法计算附近建筑。'}</p>
            ) : (
              <>
                <button
                  className={`nearby-btn ${showNearby ? 'active' : ''}`}
                  onClick={() => setShowNearby((v) => !v)}
                >
                  {showNearby ? '收起附近建筑' : `看看附近（最近 5 个建筑）`}
                </button>
                {showNearby && (
                  <div className="nearby-list">
                    {nearby.map((b, i) => (
                      <button
                        key={b.name}
                        className={`nearby-card ${focused === b.name ? 'active' : ''}`}
                        onClick={() => setFocused(b.name)}
                      >
                        <span className="nearby-rank">{i + 1}</span>
                        <span className="nearby-name">{b.name}</span>
                        <span className="nearby-dist">{b.distanceKm.toFixed(1)} km</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* 右侧地图 */}
        <main className="home-map">
          <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            {coords ? (
              <MapContainer
                center={coords}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom
              >
                <TileLayer url={tdtVecUrl} attribution="&copy; 天地图" />
                <TileLayer url={tdtCvaUrl} attribution="" />
                <FitRoutes
                  routes={visibleRouteList}
                  fallbackCenter={coords}
                  fallbackZoom={showNearby ? 13 : 14}
                />

                {/* 街道路线（按开关逐组显示，能贯通的同色） */}
                {spot.street_routes?.map((r, i) =>
                  visibleRoutes[i] ? (
                    <Polyline
                      key={`street-${i}`}
                      positions={r.paths}
                      pathOptions={{ color: r.color, weight: 5, opacity: 0.9 }}
                    />
                  ) : null
                )}

                {/* 景点本体（带状景点不显示单点标记） */}
                {!spot.street_routes && (
                  <Marker position={[coords.lat, coords.lng]} icon={flowerSpotIcon}>
                    <Popup>
                      <div style={{ fontWeight: 600 }}>{spot.name}</div>
                      <div style={{ fontSize: 12 }}>{spot.district}</div>
                    </Popup>
                  </Marker>
                )}
                {/* 附近建筑 */}
                {showNearby &&
                  nearby.map((b) => (
                    <Marker
                      key={b.name}
                      position={[b.lat, b.lng]}
                      icon={nearbyIcon}
                      eventHandlers={{ click: () => setFocused(b.name) }}
                    >
                      <Popup>
                        <div>
                          <div style={{ fontWeight: 600 }}>{b.name}</div>
                          <div style={{ fontSize: 12 }}>
                            {b.district} · 距 {spot.name} 约 {b.distanceKm.toFixed(1)} km
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            ) : (
              <div className="map-placeholder">
                {locating ? '正在定位景点…' : '地图加载中'}
              </div>
            )}

            {/* 街道图层开关（复用主地图图层按钮样式，可逐组开关） */}
            {spot.street_routes && coords && (
              <div className="map-layer-bar">
                {spot.street_routes.map((r, i) => (
                  <button
                    key={r.color}
                    type="button"
                    className={`map-layer-btn ${visibleRoutes[i] ? 'active' : ''}`}
                    onClick={() => setVisibleRoutes((v) => ({ ...v, [i]: !v[i] }))}
                    aria-pressed={!!visibleRoutes[i]}
                    title={r.label}
                    aria-label={r.label}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        display: 'inline-block',
                        background: r.color,
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.18)',
                      }}
                    />
                    <span className="map-layer-tooltip">{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

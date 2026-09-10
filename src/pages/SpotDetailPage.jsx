import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Brand from '../components/Brand';
import { SpotDetailSkeleton } from '../components/Skeleton';
import { supabase } from '../supabaseClient';

// 默认图标
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 机位图标：红色相机
const shootSpotIcon = L.divIcon({
  className: 'shoot-marker',
  html: '<div style="font-size:20px; line-height:1; transform:translate(-2px,-2px);">🎯</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

// 读取天地图 key：import.meta.env -> index.html meta
const getMeta = (name) => {
  if (typeof document === 'undefined') return undefined;
  const el = document.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute('content') : undefined;
};
const TDT_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TDT_KEY) || getMeta('VITE_TDT_KEY') || '';

export default function SpotDetailPage() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const { data, error } = await supabase
          .from('spots')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setSpot(data);
      } catch (err) {
        setError('景点未找到');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpot();
  }, [id]);

  if (loading) return (
    <div className="app-root">
      <div className="topbar"><Brand asLink to="/" /></div>
      <SpotDetailSkeleton />
    </div>
  );

  if (error || !spot) return (
    <div className="app-root">
      <div className="topbar"><Brand asLink to="/" /></div>
      <div className="error-screen">
        <p>{error || '未找到该景点'}</p>
        <Link to="/" className="link">返回地图</Link>
      </div>
    </div>
  );

  const photos = spot.photos || [];
  const shootSpots = Array.isArray(spot.shoot_spots) ? spot.shoot_spots : [];
  const weatherTags = spot.weather_tags || [];
  const tags = spot.tags || [];

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand asLink to="/" />
      </div>

      <div className="spot-detail" id="main" tabIndex={-1}>
        {/* 标题区 */}
        <div className="spot-header">
          <h1>{spot.name}</h1>
          <div className="spot-meta">
            {spot.district && <span className="meta-chip">{spot.district}</span>}
            {tags.map((t) => <span key={t} className="meta-chip tag">{t}</span>)}
          </div>
          {spot.address && (
            <div className="spot-address">📍 {spot.address}</div>
          )}
        </div>

        {/* 图片画廊 */}
        {photos.length > 0 && (
          <div className="spot-gallery">
            <div className="gallery-main">
              <img src={photos[activePhoto]} alt={spot.name} />
            </div>
            {photos.length > 1 && (
              <div className="gallery-thumbs">
                {photos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`thumb-${i}`}
                    className={i === activePhoto ? 'thumb active' : 'thumb'}
                    onClick={() => setActivePhoto(i)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 描述 */}
        {spot.description && (
          <div className="spot-section">
            <h3>景点介绍</h3>
            <p className="spot-desc">{spot.description}</p>
          </div>
        )}

        {/* 最佳时节 */}
        {spot.seasons && (
          <div className="spot-section">
            <h3>最佳时节</h3>
            {spot.seasons === '全年' ? (
              <span className="season-badge">全年适宜</span>
            ) : (
              <div className="month-grid">
                {spot.seasons.split(',').map((m) => parseInt(m.trim(), 10)).filter((n) => n >= 1 && n <= 12).map((month) => (
                  <span key={month} className="month-chip active">{MONTH_NAMES[month]}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 推荐天气/光线 */}
        {weatherTags.length > 0 && (
          <div className="spot-section">
            <h3>推荐天气/光线</h3>
            <div className="weather-tags">
              {weatherTags.map((w) => <span key={w} className="weather-chip">{w}</span>)}
            </div>
          </div>
        )}

        {/* 机位列表 */}
        {shootSpots.length > 0 && (
          <div className="spot-section">
            <h3>推荐机位（{shootSpots.length}）</h3>
            <div className="shoot-spots-list">
              {shootSpots.map((s, i) => (
                <div key={i} className="shoot-spot-card">
                  <div className="shoot-spot-title">机位 {i + 1}{s.title ? ` · ${s.title}` : ''}</div>
                  {s.tip && <div className="shoot-spot-tip">{s.tip}</div>}
                  {s.best_hour && <div className="shoot-spot-hour">最佳时段：{s.best_hour}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 机位小地图 */}
        {shootSpots.length > 0 && (
          <div className="spot-section">
            <h3>机位地图</h3>
            <div className="spot-mini-map">
              <MapContainer
                center={[spot.lat, spot.lng]}
                zoom={15}
                style={{ height: 300, width: '100%' }}
              >
                <TileLayer
                  url={`https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TDT_KEY)}`}
                  attribution="&copy; 天地图"
                />
                <Marker position={[spot.lat, spot.lng]}>
                  <Popup>{spot.name}</Popup>
                </Marker>
                {shootSpots.filter(s => s.lat != null && s.lng != null).map((s, i) => (
                  <Marker key={i} position={[s.lat, s.lng]} icon={shootSpotIcon}>
                    <Popup>
                      <div>
                        <div style={{ fontWeight: 600 }}>机位 {i + 1}{s.title ? ` · ${s.title}` : ''}</div>
                        {s.tip && <div style={{ fontSize: 12 }}>{s.tip}</div>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* 查看原文 */}
        {spot.source_url && (
          <div className="spot-section">
            <a href={spot.source_url} target="_blank" rel="noreferrer" className="source-btn">查看原文 →</a>
          </div>
        )}
      </div>
    </div>
  );
}

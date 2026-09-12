import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Brand from '../components/Brand';
import { SpotDetailSkeleton } from '../components/Skeleton';
import { supabase } from '../supabaseClient';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const flowerIcon = L.divIcon({
  className: 'map-marker-root',
  html: '<div style="font-size:18px;">🌸</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const getMeta = (name) => {
  if (typeof document === 'undefined') return undefined;
  const el = document.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute('content') : undefined;
};
const TDT_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TDT_KEY) || getMeta('VITE_TDT_KEY') || '';

export default function FlowerDetailPage() {
  const { id } = useParams();
  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const { data, error } = await supabase
          .from('flowers')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (!data) {
          setError('花卉景点未找到');
        } else {
          setFlower(data);
        }
      } catch (err) {
        setError('花卉景点未找到');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlower();
  }, [id]);

  if (loading) return (
    <div className="app-root">
      <div className="topbar"><Brand asLink to="/" /></div>
      <SpotDetailSkeleton />
    </div>
  );

  if (error || !flower) return (
    <div className="app-root">
      <div className="topbar"><Brand asLink to="/" /></div>
      <div className="error-screen">
        <p>{error || '未找到该花卉景点'}</p>
        <Link to="/" className="link">返回地图</Link>
      </div>
    </div>
  );

  const photos = flower.photos || [];
  const tags = flower.tags || [];
  const months = flower.months;

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand asLink to="/" />
      </div>

      <div className="spot-detail" id="main" tabIndex={-1}>
        {/* 标题区 */}
        <div className="spot-header">
          <h1>🌸 {flower.name}</h1>
          <div className="spot-meta">
            {flower.flower && <span className="meta-chip">{flower.flower}</span>}
            {flower.district && <span className="meta-chip">{flower.district}</span>}
            {flower.category && <span className="meta-chip tag">{flower.category}</span>}
            {tags.map((t) => <span key={t} className="meta-chip tag">{t}</span>)}
          </div>
          {flower.address && (
            <div className="spot-address">📍 {flower.address}</div>
          )}
        </div>

        {/* 图片画廊 */}
        {photos.length > 0 && (
          <div className="spot-gallery">
            <div className="gallery-main">
              <img src={photos[activePhoto]} alt={flower.name} />
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
        {flower.description && (
          <div className="spot-section">
            <h3>景点介绍</h3>
            <p className="spot-desc">{flower.description}</p>
          </div>
        )}

        {/* 最佳时节 */}
        {months && (
          <div className="spot-section">
            <h3>花期</h3>
            {months === '全年' ? (
              <span className="season-badge">全年适宜</span>
            ) : (
              <div className="month-grid">
                {months.split(',').map((m) => parseInt(m.trim(), 10)).filter((n) => n >= 1 && n <= 12).map((month) => (
                  <span key={month} className="month-chip active">{MONTH_NAMES[month]}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 备注 */}
        {flower.notes && (
          <div className="spot-section">
            <h3>备注</h3>
            <p className="spot-desc">{flower.notes}</p>
          </div>
        )}

        {/* 小地图 */}
        {flower.lat != null && flower.lng != null && (
          <div className="spot-section">
            <h3>位置</h3>
            <div className="spot-mini-map">
              <MapContainer
                center={[flower.lat, flower.lng]}
                zoom={15}
                style={{ height: 300, width: '100%' }}
              >
                <TileLayer
                  url={`https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TDT_KEY)}`}
                  attribution="&copy; 天地图"
                />
                <Marker position={[flower.lat, flower.lng]} icon={flowerIcon}>
                  <Popup>🌸 {flower.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {/* 查看原文 */}
        {flower.source_url && (
          <div className="spot-section">
            <a href={flower.source_url} target="_blank" rel="noreferrer" className="source-btn">查看原文 →</a>
          </div>
        )}
      </div>
    </div>
  );
}

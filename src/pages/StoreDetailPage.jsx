import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Brand from '../components/Brand';
import TopBar from '../components/TopBar';
import MarkButtons from '../components/MarkButtons';
import { useToast } from '../components/Toast';
import { supabase } from '../supabaseClient';
import { getStorePhotoUrl } from '../utils/flowerImages';
import { fetchMarks, setMark } from '../utils/marks';
import storesData from '../../data/stores-seed.json';

const seedSpots = Array.isArray(storesData) ? storesData : (storesData.stores || []);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMeta = (name) => {
  if (typeof document === 'undefined') return undefined;
  const el = document.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute('content') : undefined;
};
const TDT_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TDT_KEY) || getMeta('VITE_TDT_KEY') || '';

const tdtVecUrl = `https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TDT_KEY)}`;
const tdtCvaUrl = `https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TDT_KEY)}`;

export default function StoreDetailPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const storeName = decodeURIComponent(name || '');
  const store = seedSpots.find((s) => s.name === storeName) || null;
  const [activePhoto, setActivePhoto] = useState(0);
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
    return () => { mounted = false; subscription?.unsubscribe(); };
  }, []);

  const handleMarkChange = async (key, status) => {
    if (!user) { toast.info('请先登录后再标记'); navigate('/login'); return; }
    if (!store) return;
    const prev = marks[key];
    setMarks((m) => ({ ...m, [key]: status }));
    const { error } = await setMark(user.id, 'store', store.name, status);
    if (error) {
      setMarks((m) => ({ ...m, [key]: prev }));
      const msg = String(error.message || '');
      if (msg.includes('does not exist') || msg.includes('marks')) {
        toast.error('标记功能需要先初始化数据库，请执行 supabase/marks-schema.sql');
      } else { toast.error('操作失败，请重试'); }
    }
  };

  useEffect(() => { setActivePhoto(0); }, [storeName]);

  // 移动端进入详情页时强制滚到顶部，确保先看到图片而非地图
  useEffect(() => { window.scrollTo(0, 0); }, [storeName]);

  if (!store) {
    return (
      <div className="app-root">
        <div className="topbar"><Brand asLink to="/" /></div>
        <div className="error-screen">
          <p>未找到该街区</p>
          <Link to="/stores" className="link">返回好逛街区</Link>
        </div>
      </div>
    );
  }

  const photos = (store.photos || []).map((p) => getStorePhotoUrl(p)).filter(Boolean);
  const tags = store.tags || [];
  const featured = store.featured || [];
  const hasMap = store.lat != null && store.lng != null;

  return (
    <div className="app-root">
      <TopBar />
      <div className="building-detail" id="main" tabIndex={-1}>
        <aside className="building-info">
          <button className="back-link-btn" onClick={() => navigate(-1)}>← 返回</button>
          <h1 className="building-title">{store.name}</h1>
          <MarkButtons type="store" targetKey={store.name} marks={marks} onChange={handleMarkChange} />
          <div className="spot-meta">
            {store.district && <span className="meta-chip">{store.district}</span>}
            {tags.map((t) => <span key={t} className="meta-chip tag">{t}</span>)}
          </div>
          {store.address && <div className="spot-address">📍 {store.address}</div>}
          {(store.hours || store.price != null) && (
            <div className="store-info-row">
              {store.hours && <span className="store-info-chip">🕒 {store.hours}</span>}
              {store.price != null && <span className="store-info-chip">💰 人均 ¥{store.price}</span>}
            </div>
          )}
          {photos.length > 0 && (
            <div className="building-photo-main"><img src={photos[activePhoto]} alt={store.name} /></div>
          )}
          {photos.length > 1 && (
            <div className="building-photo-thumbs">
              {photos.map((url, i) => (
                <img key={i} src={url} alt={`thumb-${i}`} className={i === activePhoto ? 'thumb active' : 'thumb'} onClick={() => setActivePhoto(i)} />
              ))}
            </div>
          )}
          {store.desc && (
            <div className="building-section"><h3>街区介绍</h3><p className="building-desc">{store.desc}</p></div>
          )}
          {featured.length > 0 && (
            <div className="building-section"><h3>特色亮点</h3>
              <div className="weather-tags">{featured.map((f) => <span key={f} className="weather-chip">{f}</span>)}</div>
            </div>
          )}
          {store.source_url && (
            <div className="building-section">
              <a href={store.source_url} target="_blank" rel="noreferrer" className="source-btn">查看原文 →</a>
            </div>
          )}
        </aside>
        <main className="building-map">
          {hasMap ? (
            <MapContainer center={[store.lat, store.lng]} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
              <TileLayer url={tdtVecUrl} attribution="&copy; 天地图" />
              <TileLayer url={tdtCvaUrl} attribution="" />
              <Marker position={[store.lat, store.lng]}>
                <Popup><div style={{ fontWeight: 600 }}>{store.name}</div><div style={{ fontSize: 12 }}>{store.district}</div></Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="map-placeholder">暂无位置信息</div>
          )}
        </main>
      </div>
    </div>
  );
}

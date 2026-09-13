import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Brand from '../components/Brand';
import MarkButtons from '../components/MarkButtons';
import { useToast } from '../components/Toast';
import { supabase } from '../supabaseClient';
import { getSeedPhotoUrl } from '../utils/flowerImages';
import { fetchMarks, setMark } from '../utils/marks';
import seedSpots from '../../data/spots-seed.json';

// 默认图标
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

/** 从 description 拆出 历史 / 特色 / 文化影响 分节 */
function parseBuildingDesc(desc) {
  if (!desc) return [];
  const labels = ['历史：', '特色：', '文化影响：'];
  const lines = String(desc).split('\n').map((l) => l.trim()).filter(Boolean);
  const sections = [];
  let cur = null;
  for (const line of lines) {
    const hit = labels.find((lb) => line.startsWith(lb));
    if (hit) {
      cur = { label: hit.slice(0, -1), text: line.slice(hit.length) };
      sections.push(cur);
    } else if (cur) {
      cur.text += '\n' + line;
    } else {
      sections.push({ label: '', text: line });
    }
  }
  return sections;
}

const getMeta = (name) => {
  if (typeof document === 'undefined') return undefined;
  const el = document.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute('content') : undefined;
};
const TDT_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TDT_KEY) || getMeta('VITE_TDT_KEY') || '';

// 与首页相同的天地图矢量底图 + 中文注记层
const tdtVecUrl = `https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TDT_KEY)}`;
const tdtCvaUrl = `https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(TDT_KEY)}`;

export default function BuildingDetailPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const buildingName = decodeURIComponent(name || '');
  const building = seedSpots.find((b) => b.name === buildingName) || null;
  const [activePhoto, setActivePhoto] = useState(0);

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
    if (!building) return;
    const prev = marks[key];
    setMarks((m) => ({ ...m, [key]: status }));
    const { error } = await setMark(user.id, 'building', building.name, status);
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

  useEffect(() => {
    setActivePhoto(0);
  }, [buildingName]);

  if (!building) {
    return (
      <div className="app-root">
        <div className="topbar"><Brand asLink to="/" /></div>
        <div className="error-screen">
          <p>未找到该建筑</p>
          <Link to="/heritage" className="link">返回人文建筑</Link>
        </div>
      </div>
    );
  }

  const photos = (building.photos || []).map((p) => getSeedPhotoUrl(p)).filter(Boolean);
  const tags = building.tags || [];
  const hasMap = building.lat != null && building.lng != null;

  // 最佳时节：全年 → 不展示"全年适宜"文字；具体月份 → 月份网格
  const seasonMonths =
    building.seasons && building.seasons !== '全年'
      ? building.seasons.split(',').map((m) => parseInt(m.trim(), 10)).filter((n) => n >= 1 && n <= 12)
      : [];

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand asLink to="/" />
        <div className="user-area">
          <Link to="/" className="link">地图</Link>
          <Link to="/recommend" className="link">今日推荐</Link>
          <Link to="/seasonal" className="link">时令景观</Link>
          <Link to="/heritage" className="link active">人文建筑</Link>
          <Link to="/wechat" className="link">文旅情报</Link>
          <Link to="/achievements" className="link">成就</Link>
          <Link to="/profile" className="link">个人中心</Link>
        </div>
      </div>

      <div className="building-detail" id="main" tabIndex={-1}>
        {/* 侧栏：介绍占比大 */}
        <aside className="building-info">
          <button className="back-link-btn" onClick={() => navigate(-1)}>← 返回</button>
          <h1 className="building-title">{building.name}</h1>
          <MarkButtons
            type="building"
            targetKey={building.name}
            marks={marks}
            onChange={handleMarkChange}
          />
          <div className="spot-meta">
            {building.district && <span className="meta-chip">{building.district}</span>}
            {tags.map((t) => <span key={t} className="meta-chip tag">{t}</span>)}
          </div>
          {building.address && <div className="spot-address">📍 {building.address}</div>}

          {/* 大图 */}
          {photos.length > 0 && (
            <div className="building-photo-main">
              <img src={photos[activePhoto]} alt={building.name} />
            </div>
          )}
          {photos.length > 1 && (
            <div className="building-photo-thumbs">
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

          {/* 大段介绍：历史 / 特色 / 文化影响分节 */}
          {building.description && (
            <div className="building-section">
              <h3>景点介绍</h3>
              {parseBuildingDesc(building.description).map((sec, idx) => (
                <div className="building-desc-block" key={idx}>
                  {sec.label && <span className="building-desc-label">{sec.label}</span>}
                  <p className="building-desc">{sec.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* 最佳时节（全年不展示"全年适宜"） */}
          {seasonMonths.length > 0 && (
            <div className="building-section">
              <h3>最佳时节</h3>
              <div className="month-grid">
                {seasonMonths.map((m) => (
                  <span key={m} className="month-chip active">{MONTH_NAMES[m]}</span>
                ))}
              </div>
            </div>
          )}

          {/* 查看原文 */}
          {building.source_url && (
            <div className="building-section">
              <a href={building.source_url} target="_blank" rel="noreferrer" className="source-btn">
                查看原文 →
              </a>
            </div>
          )}
        </aside>

        {/* 右侧地图 */}
        <main className="building-map">
          {hasMap ? (
            <MapContainer
              center={[building.lat, building.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom
            >
              <TileLayer url={tdtVecUrl} attribution="&copy; 天地图" />
              <TileLayer url={tdtCvaUrl} attribution="" />
              <Marker position={[building.lat, building.lng]}>
                <Popup>
                  <div style={{ fontWeight: 600 }}>{building.name}</div>
                  <div style={{ fontSize: 12 }}>{building.district}</div>
                </Popup>
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

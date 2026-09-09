import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

// Fix default icon paths for Leaflet (CDN images)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ClickAdd({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// 热力图层组件：用 useMap 拿到地图实例，再调用 L.heatLayer
function HeatmapLayer({ points, show }) {
  const map = useMap();

  useEffect(() => {
    let layer = null;
    if (show && points.length > 0) {
      // 格式：[lat, lng, intensity]，intensity 用 1，半径/模糊由参数控制
      const data = points.map((p) => [p.lat, p.lng, 1]);
      layer = L.heatLayer(data, { radius: 40, blur: 50, maxZoom: 15 }).addTo(map);
    }
    return () => {
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [map, points, show]);

  return null;
}

// 一组日期对应的颜色（用于不同天的路线）
const ROUTE_COLORS = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
];

function getDateKey(place) {
  const ts = place.time_start || place.created_at;
  if (!ts) return 'unknown';
  return ts.slice(0, 10);
}

export default function MapView({ places = [], onMapClick }) {
  // Read Tianditu key with fallback: import.meta.env -> index.html meta
  const getMeta = (name) => {
    if (typeof document === 'undefined') return undefined;
    const el = document.querySelector(`meta[name="${name}"]`);
    return el ? el.getAttribute('content') : undefined;
  };

  const tdtKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TDT_KEY) || getMeta('VITE_TDT_KEY');

  if (!tdtKey) console.error('TDT key missing: please set VITE_TDT_KEY in .env.local or index.html meta');

  const tdtVecUrl = `https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(tdtKey)}`;
  const tdtCvaUrl = `https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(tdtKey)}`;

  // 上海行政区域边界（含崇明岛），稍微外扩让边缘可见
  const shanghaiBounds = [
    [30.60, 120.80], // 西南
    [31.95, 122.25], // 东北
  ];

  const [showRoute, setShowRoute] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // 按日期分组地点，并按时间排序，生成路线
  const routeGroups = React.useMemo(() => {
    if (!showRoute) return [];
    const groups = {};
    places.forEach((p) => {
      if (p.lat == null || p.lng == null) return;
      const key = getDateKey(p);
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return Object.values(groups)
      .map((arr) =>
        arr
          .slice()
          .sort((a, b) => new Date(a.time_start || a.created_at) - new Date(b.time_start || b.created_at))
          .map((p) => [p.lat, p.lng])
      )
      .filter((line) => line.length >= 2);
  }, [places, showRoute]);

  // 热力图数据点
  const heatPoints = React.useMemo(
    () => places.filter((p) => p.lat != null && p.lng != null).map((p) => ({ lat: p.lat, lng: p.lng })),
    [places]
  );

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {/* 图层切换控件 */}
      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <label style={{
          background: '#fff', padding: '6px 10px', borderRadius: 6,
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <input type="checkbox" checked={showRoute} onChange={(e) => setShowRoute(e.target.checked)} />
          足迹路线
        </label>
        <label style={{
          background: '#fff', padding: '6px 10px', borderRadius: 6,
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <input type="checkbox" checked={showHeatmap} onChange={(e) => setShowHeatmap(e.target.checked)} />
          探索热力图
        </label>
      </div>

      <MapContainer
        center={[31.2304, 121.4737]}
        zoom={12}
        minZoom={10}
        maxBounds={shanghaiBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Tianditu 矢量底图（中文） */}
        <TileLayer url={tdtVecUrl} attribution="&copy; 天地图" />

        {/* 注记层（让中文标签显示） */}
        <TileLayer url={tdtCvaUrl} attribution="" />

        {onMapClick && <ClickAdd onAdd={onMapClick} />}

        {/* 足迹路线：按日期分组，每组一种颜色 */}
        {routeGroups.map((positions, idx) => (
          <Polyline
            key={`route-${idx}`}
            positions={positions}
            color={ROUTE_COLORS[idx % ROUTE_COLORS.length]}
            weight={4}
            opacity={0.7}
          />
        ))}

        {/* 探索热力图 */}
        <HeatmapLayer points={heatPoints} show={showHeatmap} />

        {places.map((p) => (
          <Marker key={p.id ?? `${p.lat}-${p.lng}-${Math.random()}`} position={[p.lat, p.lng]}>
            <Popup>
              <div style={{ maxWidth: 240 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#444' }}>{p.description}</div>
                {p.photos && p.photos.length > 0 && (
                  <img src={p.photos[0]} alt="thumb" style={{ width: '100%', marginTop: 8, borderRadius: 6 }} />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

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

  return (
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
  );
}

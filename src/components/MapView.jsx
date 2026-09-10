import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

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

// 自定义定位针 SVG
const PIN_SVG = `
  <svg class="map-marker-shape" viewBox="0 0 32 40" aria-hidden="true">
    <path
      d="M16 0C7.16 0 0 7.16 0 16c0 11 16 24 16 24s16-13 16-24C32 7.16 24.84 0 16 0z"
      fill="var(--card)"
      stroke="var(--primary)"
      stroke-width="2"
    />
    <circle cx="16" cy="15" r="5" fill="var(--primary)" />
  </svg>
`;

const CAMERA_ICON = `
  <svg class="map-marker-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 7h-2.5l-1.5-2h-7L7.5 7H5C3.9 7 3 7.9 3 9v8c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM12 17a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" fill="currentColor" />
  </svg>
`;

const CHECK_ICON = `
  <svg class="map-marker-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
  </svg>
`;

function createMarkerHtml(innerIcon) {
  return `
    <div class="map-marker">
      ${PIN_SVG}
      ${innerIcon}
    </div>
  `;
}

const spotIcon = L.divIcon({
  className: 'map-marker-root',
  html: createMarkerHtml(CAMERA_ICON),
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -34],
});

const userIcon = L.divIcon({
  className: 'map-marker-root',
  html: createMarkerHtml(CHECK_ICON),
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -34],
});

// 地图图层切换按钮图标
function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 7h-2.5l-1.5-2h-7L7.5 7H5C3.9 7 3 7.9 3 9v8c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM12 17a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19l5-5 4 4 7-7" />
    </svg>
  );
}

function HeatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2s-4 5-4 9a4 4 0 0 0 8 0c0-4-4-9-4-9z" />
    </svg>
  );
}

function LayerButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      className={`map-layer-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      title={label}
    >
      <Icon />
      <span className="map-layer-tooltip">{label}</span>
    </button>
  );
}

export default function MapView({
  spots = [],
  places = [],
  onMapClick,
  onSpotClick,
  showUserPlaces = true,
}) {
  const navigate = useNavigate();

  const getMeta = (name) => {
    if (typeof document === 'undefined') return undefined;
    const el = document.querySelector(`meta[name="${name}"]`);
    return el ? el.getAttribute('content') : undefined;
  };

  const tdtKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TDT_KEY) || getMeta('VITE_TDT_KEY');
  if (!tdtKey) console.error('TDT key missing: please set VITE_TDT_KEY in .env.local or index.html meta');

  const tdtVecUrl = `https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(tdtKey)}`;
  const tdtCvaUrl = `https://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${encodeURIComponent(tdtKey)}`;

  const shanghaiBounds = [
    [30.60, 120.80],
    [31.95, 122.25],
  ];

  const [showRoute, setShowRoute] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSpots, setShowSpots] = useState(true);
  const [showUserMarks, setShowUserMarks] = useState(showUserPlaces);

  const routeGroups = useMemo(() => {
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

  const heatPoints = useMemo(
    () => places.filter((p) => p.lat != null && p.lng != null).map((p) => ({ lat: p.lat, lng: p.lng })),
    [places]
  );

  const layers = [
    { key: 'spots', label: '景点', icon: CameraIcon, active: showSpots, toggle: () => setShowSpots((v) => !v) },
    { key: 'places', label: '我的打卡', icon: CheckIcon, active: showUserMarks, toggle: () => setShowUserMarks((v) => !v) },
    { key: 'route', label: '足迹路线', icon: RouteIcon, active: showRoute, toggle: () => setShowRoute((v) => !v) },
    { key: 'heatmap', label: '探索热力图', icon: HeatIcon, active: showHeatmap, toggle: () => setShowHeatmap((v) => !v) },
  ];

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {/* 图层切换控件 */}
      <div className="map-layer-bar">
        {layers.map((layer) => (
          <LayerButton
            key={layer.key}
            active={layer.active}
            icon={layer.icon}
            label={layer.label}
            onClick={layer.toggle}
          />
        ))}
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

        {/* 注记层 */}
        <TileLayer url={tdtCvaUrl} attribution="" />

        {onMapClick && <ClickAdd onAdd={onMapClick} />}

        {/* 预设景点图层 */}
        {showSpots && spots.map((s) => (
          <Marker
            key={`spot-${s.id}`}
            position={[s.lat, s.lng]}
            icon={spotIcon}
            eventHandlers={{
              click: () => onSpotClick && onSpotClick(s),
            }}
          >
            <Popup>
              <div className="map-popup">
                <div className="map-popup-title">{s.name}</div>
                {s.district && <div className="map-popup-district">{s.district}</div>}
                {s.description && <div className="map-popup-desc">{s.description}</div>}
                {s.photos && s.photos.length > 0 && (
                  <img className="map-popup-img" src={s.photos[0]} alt={s.name} />
                )}
                {s.weather_tags && s.weather_tags.length > 0 && (
                  <div className="map-popup-tags">
                    {s.weather_tags.map((t) => (
                      <span key={t} className="map-popup-tag">{t}</span>
                    ))}
                  </div>
                )}
                {onSpotClick && (
                  <button
                    className="map-popup-link"
                    onClick={() => navigate(`/spots/${s.id}`)}
                  >
                    查看详情 →
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 用户打卡图层 */}
        {showUserMarks && places.map((p) => (
          <Marker
            key={p.id ?? `p-${p.lat}-${p.lng}`}
            position={[p.lat, p.lng]}
            icon={userIcon}
          >
            <Popup>
              <div className="map-popup">
                <div className="map-popup-title">{p.name}</div>
                {p.description && <div className="map-popup-desc">{p.description}</div>}
                {p.photos && p.photos.length > 0 && (
                  <img className="map-popup-img" src={p.photos[0]} alt={p.name} />
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 足迹路线 */}
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
      </MapContainer>
    </div>
  );
}

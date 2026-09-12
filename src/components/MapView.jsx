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

// 当选中推荐景点时，平滑移动到目标位置
function MapCenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], 15, { duration: 0.8 });
    }
  }, [map, lat, lng]);
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

// 自定义定位针 SVG：浅色简约
const PIN_SVG = `
  <svg class="map-marker-shape" viewBox="0 0 26 34" aria-hidden="true">
    <path
      d="M13 0C5.82 0 0 5.82 0 13c0 8.84 13 21 13 21s13-12.16 13-21C26 5.82 20.18 0 13 0z"
      fill="rgba(245, 245, 245, 0.95)"
      stroke="var(--primary)"
      stroke-width="1.5"
    />
    <circle cx="13" cy="12" r="3.5" fill="var(--primary)" />
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

const FLOWER_ICON = `
  <svg class="map-marker-icon" viewBox="0 0 24 24" aria-hidden="true" style="color:#e91e63;">
    <path d="M12 22c-1.25 0-2.25-1-2.25-2.25 0-.29.06-.56.16-.81-1.01.36-2.16.06-2.87-.65-.72-.72-1.01-1.87-.65-2.88-.25.1-.52.16-.81.16C4.34 15.75 3.34 14.75 3.34 13.5s1-2.25 2.25-2.25c.29 0 .56.06.81.16-.36-1.01-.06-2.16.65-2.88.72-.71 1.87-1.01 2.88-.65-.1-.25-.16-.52-.16-.81 0-1.25 1-2.25 2.25-2.25s2.25 1 2.25 2.25c0 .29-.06.56-.16.81 1.01-.36 2.16-.06 2.88.65.71.72 1.01 1.87.65 2.88.25-.1.52-.16.81-.16 1.25 0 2.25 1 2.25 2.25s-1 2.25-2.25 2.25c-.29 0-.56-.06-.81-.16.36 1.01.06 2.16-.65 2.88-.72.71-1.87 1.01-2.88.65.1.25.16.52.16.81 0 1.25-1 2.25-2.25 2.25zM12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" fill="currentColor"/>
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
  iconSize: [26, 34],
  iconAnchor: [13, 34],
  popupAnchor: [0, -28],
});

const userIcon = L.divIcon({
  className: 'map-marker-root',
  html: createMarkerHtml(CHECK_ICON),
  iconSize: [26, 34],
  iconAnchor: [13, 34],
  popupAnchor: [0, -28],
});

const flowerIcon = L.divIcon({
  className: 'map-marker-root',
  html: createMarkerHtml(FLOWER_ICON),
  iconSize: [26, 34],
  iconAnchor: [13, 34],
  popupAnchor: [0, -28],
});

// 地图图层切换按钮图标
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
  flowers = [],
  places = [],
  onMapClick,
  onSpotClick,
  showUserPlaces = false,
  highlightSpot,
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

        {/* 高亮选中的推荐景点 */}
        {highlightSpot && (
          <>
            <MapCenter lat={highlightSpot.lat} lng={highlightSpot.lng} />
            <Marker
              key={`highlight-${highlightSpot.id}`}
              position={[highlightSpot.lat, highlightSpot.lng]}
              icon={spotIcon}
              eventHandlers={{
                click: () => onSpotClick && onSpotClick(highlightSpot),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <div className="map-popup-title">{highlightSpot.name}</div>
                  {highlightSpot.district && <div className="map-popup-district">{highlightSpot.district}</div>}
                  {highlightSpot.description && <div className="map-popup-desc">{highlightSpot.description}</div>}
                  {highlightSpot.photos && highlightSpot.photos.length > 0 && (
                    <img className="map-popup-img" src={highlightSpot.photos[0]} alt={highlightSpot.name} />
                  )}
                  {highlightSpot.weather_tags && highlightSpot.weather_tags.length > 0 && (
                    <div className="map-popup-tags">
                      {highlightSpot.weather_tags.map((t) => (
                        <span key={t} className="map-popup-tag">{t}</span>
                      ))}
                    </div>
                  )}
                  {onSpotClick && (
                    <button
                      className="map-popup-link"
                      onClick={() => navigate(`/spots/${highlightSpot.id}`)}
                    >
                      查看详情 →
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* 花卉景点图层 */}
        {flowers.map((f) => (
          <Marker
            key={`flower-${f.id}`}
            position={[f.lat, f.lng]}
            icon={flowerIcon}
            eventHandlers={{
              click: () => onSpotClick && onSpotClick({ ...f, _type: 'flower' }),
            }}
          >
            <Popup>
              <div className="map-popup">
                <div className="map-popup-title">🌸 {f.name}</div>
                {f.flower && <div className="map-popup-district">{f.flower}</div>}
                {f.district && <div className="map-popup-district">{f.district}</div>}
                {f.description && <div className="map-popup-desc">{f.description}</div>}
                {f.photos && f.photos.length > 0 && (
                  <img className="map-popup-img" src={f.photos[0]} alt={f.name} />
                )}
                <button
                  className="map-popup-link"
                  onClick={() => navigate(`/flowers/${f.id}`)}
                >
                  查看详情 →
                </button>
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

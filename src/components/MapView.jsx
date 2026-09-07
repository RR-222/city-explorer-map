import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon issue in some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ClickAdd({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

export default function MapView({ places = [], onMapClick }) {
  return (
    <MapContainer center={[31.2304, 121.4737]} zoom={13} style={{ height: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {onMapClick && <ClickAdd onAdd={onMapClick} />}
      {places.map((p) => (
        <Marker key={p.id || `${p.lat}-${p.lng}-${Math.random()}`} position={[p.lat, p.lng]}>
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

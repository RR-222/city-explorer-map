import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import AddPlaceModal from './components/AddPlaceModal';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { supabase } from './supabaseClient';

export default function App() {
  const [addingCoords, setAddingCoords] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('places').select('*');
      if (error) console.error('load places error', error);
      else setPlaces(data || []);
    }
    load();
  }, []);

  const handleMapClick = (coords) => {
    setAddingCoords(coords);
  };

  const handleSaved = (newPlace) => {
    // newPlace may be the inserted row returned from Supabase or payload
    setPlaces((prev) => {
      const np = newPlace && newPlace.id ? newPlace : (newPlace && newPlace[0]) || newPlace;
      return [ ...(prev || []), np ];
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-indigo-600 text-white">
        <h1 className="text-xl font-semibold">City Explorer Map (Local Prototype)</h1>
      </header>
      <main className="flex-1">
        <MapView places={places} onMapClick={handleMapClick} />
      </main>

      {addingCoords && (
        <AddPlaceModal
          coords={addingCoords}
          onClose={() => setAddingCoords(null)}
          onSaved={(p) => {
            handleSaved(p);
            setAddingCoords(null);
          }}
        />
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import AddPlaceModal from '../components/AddPlaceModal';
import { supabase } from '../supabaseClient';

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [addingCoords, setAddingCoords] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
    })();

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // load initial places for current user if authenticated
    const fetchPlaces = async () => {
      try {
        if (!user) {
          setPlaces([]);
          return;
        }
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setPlaces(data || []);
      } catch (err) {
        console.error('load places error', err);
      }
    };
    fetchPlaces();
  }, [user]);

  const handleMapClick = (coords) => setAddingCoords(coords);

  const handleSaved = (newPlace) => {
    // append to state
    setPlaces((p) => [newPlace, ...p]);
  };

  return (
    <div className="app-root">
      <div className="topbar">
        <div className="brand">探索上海</div>
        <div className="user-area">
          {user ? (
            <>
              <span>{user.email}</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="link"
              >
                登出
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="map-container">
        <MapView places={places} onMapClick={handleMapClick} />
      </div>

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

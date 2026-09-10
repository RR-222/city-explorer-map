import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MapView from '../components/MapView';
import AddPlaceModal from '../components/AddPlaceModal';
import Brand from '../components/Brand';
import { supabase } from '../supabaseClient';

export default function MapPage() {
  const [places, setPlaces] = useState([]);
  const [spots, setSpots] = useState([]);
  const [addingCoords, setAddingCoords] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
    });

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 加载预设景点（spots，公开可读，不依赖登录）
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const { data, error } = await supabase
          .from('spots')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setSpots(data || []);
      } catch (err) {
        console.error('load spots error', err);
      }
    };
    fetchSpots();
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

  // 点击景点标记：先弹 popup，后续可跳详情页
  const handleSpotClick = (spot) => {
    // TODO: 后续接景点详情页 navigate(`/spots/${spot.id}`)
    console.log('spot clicked', spot.name);
  };

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand />
        <div className="user-area">
          {user ? (
            <>
              <span>{user.email}</span>
              <Link to="/recommend" className="link">今日推荐</Link>
              <Link to="/achievements" className="link">成就</Link>
              <Link to="/profile" className="link">个人中心</Link>
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
          ) : (
            <>
              <Link to="/login" className="link">登录</Link>
              <Link to="/register" className="link">注册</Link>
            </>
          )}
        </div>
      </div>

      <div className="map-container" id="main" tabIndex={-1}>
        <MapView
          spots={spots}
          places={places}
          onMapClick={user ? handleMapClick : null}
          onSpotClick={handleSpotClick}
        />
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

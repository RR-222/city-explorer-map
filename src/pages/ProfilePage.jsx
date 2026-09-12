import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddPlaceModal from '../components/AddPlaceModal';
import Brand from '../components/Brand';
import { useToast } from '../components/Toast';
import { PlaceListSkeleton } from '../components/Skeleton';
import { supabase } from '../supabaseClient';
import EmptyState from '../components/EmptyState';

export default function ProfilePage() {
  const toast = useToast();
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);
  const [deleting, setDeleting] = useState(null);

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
    const fetchPlaces = async () => {
      if (!user) {
        setPlaces([]);
        setPlacesLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('load places error', error);
      } else {
        setPlaces(data || []);
      }
      setPlacesLoading(false);
    };
    fetchPlaces();
  }, [user]);

  const handleDelete = async (place) => {
    if (!window.confirm(`确认删除「${place.name}」？此操作不可撤销。`)) return;
    setDeleting(place.id);
    try {
      if (place.photos?.length) {
        const paths = place.photos
          .map((url) => {
            const m = url.match(/places-photos\/(.+?)(\?|$)/);
            return m ? m[1] : null;
          })
          .filter(Boolean);
        if (paths.length) {
          const { error: storageErr } = await supabase.storage.from('places-photos').remove(paths);
          if (storageErr) console.warn('storage cleanup error', storageErr);
        }
      }
      const { error } = await supabase.from('places').delete().eq('id', place.id);
      if (error) throw error;
      setPlaces((prev) => prev.filter((p) => p.id !== place.id));
    } catch (err) {
      console.error('删除失败', err);
      toast.error('删除失败: ' + (err.message || ''));
    } finally {
      setDeleting(null);
    }
  };

  const handleSaved = (updatedPlace) => {
    setPlaces((prev) => prev.map((p) => (p.id === updatedPlace.id ? updatedPlace : p)));
    setEditingPlace(null);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString('zh-CN');
    } catch {
      return iso;
    }
  };

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand asLink to="/" />
        <div className="user-area">
          {user ? (
            <>
              <Link to="/wechat" className="link">文旅情报</Link>
              <Link to="/achievements" className="link">成就</Link>
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

      <div className="page" id="main" tabIndex={-1}>
        <div className="page-header">
          <h2 className="page-title">我的地点</h2>
        </div>

        {placesLoading ? (
          <PlaceListSkeleton />
        ) : places.length === 0 ? (
          <EmptyState
            title="还没有地点"
            description="在地图上标记你去过的地方，开始记录城市足迹。"
          >
            <Link to="/" className="primary">去地图添加</Link>
          </EmptyState>
        ) : (
          <div className="place-list">
            {places.map((place) => (
              <div key={place.id} className="place-card">
                <div className="place-card-photos">
                  {place.photos?.length ? (
                    place.photos.slice(0, 4).map((url) => (
                      <img key={url} src={url} alt={place.name} />
                    ))
                  ) : (
                    <div className="photo-placeholder">无图</div>
                  )}
                </div>
                <div className="place-card-info">
                  <h4>{place.name}</h4>
                  {place.description && <div className="description">{place.description}</div>}
                  {(place.tags?.length ?? 0) > 0 && (
                    <div style={{ marginTop: 6 }}>
                      {place.tags.map((t) => (
                        <span key={t} className="tag-chip">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="meta">
                    {(place.time_start || place.time_end) && (
                      <div>
                        {place.time_start ? formatDate(place.time_start) : '?'} ~ {place.time_end ? formatDate(place.time_end) : '?'}
                      </div>
                    )}
                    {place.cost != null && <div>花费: {place.cost}</div>}
                    <div>可见性: {place.visibility === 'public' ? '公开' : '私有'}</div>
                    <div>坐标: {Number(place.lat).toFixed(5)}, {Number(place.lng).toFixed(5)}</div>
                    <div>创建: {formatDate(place.created_at)}</div>
                  </div>
                </div>
                <div className="place-actions">
                  <button onClick={() => setEditingPlace(place)} className="link">编辑</button>
                  <button
                    onClick={() => handleDelete(place)}
                    disabled={deleting === place.id}
                    className="link danger"
                  >
                    {deleting === place.id ? '删除中...' : '删除'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingPlace && (
        <AddPlaceModal
          place={editingPlace}
          onClose={() => setEditingPlace(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

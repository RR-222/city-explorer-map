import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { SHANGHAI_DISTRICTS, getDistrict } from '../utils/geocode';

// 徽章定义：按已解锁区数触发
const BADGES = [
  { id: 1, name: '初出茅庐', desc: '探索 1 个区', threshold: 1, icon: '🌱' },
  { id: 2, name: '浦西探索者', desc: '探索 5 个区', threshold: 5, icon: '🚶' },
  { id: 3, name: '区域达人', desc: '探索 10 个区', threshold: 10, icon: '🗺️' },
  { id: 4, name: '上海通', desc: '探索 13 个区', threshold: 13, icon: '⭐' },
  { id: 5, name: '走遍上海', desc: '解锁全部 16 个区', threshold: 16, icon: '🏆' },
];

export default function AchievementsPage() {
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [enriching, setEnriching] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
    })();
    const { subscription } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        console.error('load places error', error);
        return;
      }
      setPlaces(data || []);
    };
    fetchPlaces();
  }, [user]);

  // 按区统计地点数
  const districtCounts = useMemo(() => {
    const counts = {};
    places.forEach((p) => {
      const d = p.district;
      if (d) counts[d] = (counts[d] || 0) + 1;
    });
    return counts;
  }, [places]);

  const visitedDistricts = useMemo(
    () => Object.keys(districtCounts).filter((d) => SHANGHAI_DISTRICTS.includes(d)),
    [districtCounts]
  );

  const visitedCount = visitedDistricts.length;
  const progress = Math.round((visitedCount / SHANGHAI_DISTRICTS.length) * 100);

  const unlockedBadges = useMemo(
    () => BADGES.filter((b) => visitedCount >= b.threshold),
    [visitedCount]
  );

  // 对缺少 district 的地点做逆地理编码补全，并更新数据库
  const enrichMissingDistricts = async () => {
    const missing = places.filter((p) => !p.district && p.lat != null && p.lng != null);
    if (missing.length === 0) return;
    setEnriching(true);
    let updated = 0;
    for (const p of missing) {
      const district = await getDistrict(p.lat, p.lng);
      if (district) {
        const { error } = await supabase.from('places').update({ district }).eq('id', p.id);
        if (!error) {
          updated += 1;
          setPlaces((prev) => prev.map((x) => (x.id === p.id ? { ...x, district } : x)));
        }
      }
    }
    setEnriching(false);
    if (updated > 0) alert(`已补全 ${updated} 个地点的区域信息`);
    else alert('没有可补全的区域信息');
  };

  return (
    <div className="app-root">
      <div className="topbar">
        <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>← 返回地图</Link>
        <div className="user-area">
          {user ? (
            <>
              <Link to="/profile" className="link">个人中心</Link>
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

      <div className="profile-page">
        <h2 style={{ marginTop: 0 }}>区域成就</h2>

        {/* 进度总览 */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>已解锁 {visitedCount} / {SHANGHAI_DISTRICTS.length} 个区</span>
            <span style={{ color: '#888', fontSize: 13 }}>{progress}%</span>
          </div>
          <div style={{ height: 10, background: '#eee', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, #3b82f6, #10b981)',
              transition: 'width 0.3s',
            }} />
          </div>
          {places.some((p) => !p.district) && (
            <div style={{ marginTop: 12 }}>
              <button
                onClick={enrichMissingDistricts}
                disabled={enriching}
                className="primary"
              >
                {enriching ? '补全中...' : '补全历史地点区域'}
              </button>
              <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>
                （旧数据无区域信息，点击调用逆地理编码补全）
              </span>
            </div>
          )}
        </div>

        {/* 徽章区 */}
        <h3 style={{ marginBottom: 8 }}>徽章</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20 }}>
          {BADGES.map((b) => {
            const unlocked = visitedCount >= b.threshold;
            return (
              <div
                key={b.id}
                style={{
                  background: unlocked ? '#fff' : '#f5f5f5',
                  border: `2px solid ${unlocked ? '#f59e0b' : '#ddd'}`,
                  borderRadius: 6,
                  padding: '10px 4px',
                  textAlign: 'center',
                  opacity: unlocked ? 1 : 0.45,
                }}
              >
                <div style={{ fontSize: 26 }}>{unlocked ? b.icon : '🔒'}</div>
                <div style={{ fontWeight: 600, marginTop: 2, fontSize: 14 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{b.desc}</div>
              </div>
            );
          })}
        </div>

        {/* 16 区网格 */}
        <h3 style={{ marginBottom: 8 }}>上海 16 区</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
          {SHANGHAI_DISTRICTS.map((d) => {
            const count = districtCounts[d] || 0;
            const visited = count > 0;
            return (
              <div
                key={d}
                style={{
                  background: visited ? '#dbeafe' : '#fff',
                  border: `1px solid ${visited ? '#3b82f6' : '#eee'}`,
                  borderRadius: 5,
                  padding: '10px 4px',
                  textAlign: 'center',
                  color: visited ? '#1e40af' : '#888',
                }}
              >
                <div style={{ fontWeight: visited ? 600 : 400, fontSize: 13 }}>{d}</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>
                  {visited ? `${count}个` : '未解锁'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

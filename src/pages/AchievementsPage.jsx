import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useToast } from '../components/Toast';
import TopBar from '../components/TopBar';
import { fetchMarks } from '../utils/marks';
import { SHANGHAI_DISTRICTS, getDistrict } from '../utils/geocode';

// 徽章定义：按已解锁区数触发
const BADGES = [
  { id: 1, name: '初出茅庐', desc: '探索 1 个区', threshold: 1, icon: '🌱' },
  { id: 2, name: '浦西探索者', desc: '探索 5 个区', threshold: 5, icon: '🚶' },
  { id: 3, name: '区域达人', desc: '探索 10 个区', threshold: 10, icon: '🗺️' },
  { id: 4, name: '上海通', desc: '探索 13 个区', threshold: 13, icon: '⭐' },
  { id: 5, name: '走遍上海', desc: '解锁全部 16 个区', threshold: 16, icon: '🏆' },
];

// 花事足迹徽章：由「想去 / 去过」标记触发
const FLOWER_BADGES = [
  { id: 'fw1', name: '心动花开', desc: '想去 3 种时令花卉', metric: 'wishFlowers', threshold: 3, icon: '💭' },
  { id: 'fw2', name: '追花青年', desc: '想去 10 种时令花卉', metric: 'wishFlowers', threshold: 10, icon: '🌸' },
  { id: 'fs1', name: '初探花径', desc: '去过 3 个赏花景点', metric: 'visitedSpots', threshold: 3, icon: '🥾' },
  { id: 'fs2', name: '赏花达人', desc: '去过 10 个赏花景点', metric: 'visitedSpots', threshold: 10, icon: '📷' },
  { id: 'fs3', name: '城市花痴', desc: '去过 25 个赏花景点', metric: 'visitedSpots', threshold: 25, icon: '🏵️' },
  { id: 'fb1', name: '建筑巡礼', desc: '去过 10 处人文建筑', metric: 'visitedBuildings', threshold: 10, icon: '🏛️' },
  { id: 'fb2', name: '全城足迹', desc: '去过 20 处人文建筑', metric: 'visitedBuildings', threshold: 20, icon: '🗼' },
];

export default function AchievementsPage() {
  const toast = useToast();
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [enriching, setEnriching] = useState(false);
  const [marks, setMarks] = useState({});
  const [tab, setTab] = useState('district'); // 'district' | 'flower'

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

  // 加载想去 / 去过标记
  useEffect(() => {
    const load = async () => {
      if (!user) {
        setMarks({});
        return;
      }
      const m = await fetchMarks(user.id);
      if (m.__error) {
        console.warn('marks 表未初始化，跳过花事成就：', m.__error?.message);
        setMarks({});
        return;
      }
      setMarks(m);
    };
    load();
  }, [user]);

  // 标记统计
  const markStats = useMemo(() => {
    const stats = { wishFlowers: 0, visitedFlowers: 0, visitedSpots: 0, visitedBuildings: 0 };
    Object.entries(marks).forEach(([key, status]) => {
      const sep = key.indexOf(':');
      if (sep < 0) return;
      const type = key.slice(0, sep);
      if (status !== 'wish' && status !== 'visited') return;
      if (type === 'flower') {
        if (status === 'wish') stats.wishFlowers += 1;
        else stats.visitedFlowers += 1;
      } else if (type === 'spot' && status === 'visited') {
        stats.visitedSpots += 1;
      } else if (type === 'building' && status === 'visited') {
        stats.visitedBuildings += 1;
      }
    });
    return stats;
  }, [marks]);

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

  const unlockedFlowerBadges = useMemo(
    () => FLOWER_BADGES.filter((b) => markStats[b.metric] >= b.threshold),
    [markStats]
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
    if (updated > 0) toast.success(`已补全 ${updated} 个地点的区域信息`);
    else toast.info('没有可补全的区域信息');
  };

  return (
    <div className="app-root">
      <TopBar
        user={user}
        onLogout={async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }}
      />

      <div className="page" id="main" tabIndex={-1}>
        <div className="page-header">
          <h2 className="page-title">成就</h2>
          <p className="text-muted text-small">用脚步丈量上海，解锁城区徽章；标记想去 / 去过，收获花事足迹。</p>
        </div>

        {/* Tab 切换 */}
        <div className="achievement-tabs">
          <button
            className={`achievement-tab ${tab === 'district' ? 'active' : ''}`}
            onClick={() => setTab('district')}
          >
            区域成就
          </button>
          <button
            className={`achievement-tab ${tab === 'flower' ? 'active' : ''}`}
            onClick={() => setTab('flower')}
          >
            花事足迹
          </button>
        </div>

        {tab === 'district' ? (
          <>
            {/* 数据总览 */}
            <div className="achievements-stats">
              <div className="stat-box">
                <span className="stat-value">{visitedCount}</span>
                <span className="stat-label">已解锁区</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{places.length}</span>
                <span className="stat-label">打卡地点</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{unlockedBadges.length}</span>
                <span className="stat-label">获得徽章</span>
              </div>
              <div className="stat-box highlight">
                <span className="stat-value">{progress}%</span>
                <span className="stat-label">总进度</span>
              </div>
            </div>

            {/* 进度总览 */}
            <div className="progress-card">
              <div className="progress-header">
                <span className="progress-title">解锁进度</span>
                <span className="progress-value">{visitedCount} / {SHANGHAI_DISTRICTS.length} 区</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              {places.some((p) => !p.district) && (
                <div className="progress-note">
                  <button
                    onClick={enrichMissingDistricts}
                    disabled={enriching}
                    className="primary"
                  >
                    {enriching ? '补全中...' : '补全历史地点区域'}
                  </button>
                  <span>旧数据无区域信息，点击调用逆地理编码补全</span>
                </div>
              )}
            </div>

            {/* 徽章区 */}
            <h3 className="section-title">徽章</h3>
            <div className="badge-grid">
              {BADGES.map((b) => {
                const unlocked = visitedCount >= b.threshold;
                return (
                  <div
                    key={b.id}
                    className={`badge-card ${unlocked ? 'unlocked' : ''}`}
                  >
                    {unlocked && <span className="badge-check">✓</span>}
                    <div className="badge-icon">{unlocked ? b.icon : '🔒'}</div>
                    <div className="badge-name">{b.name}</div>
                    <div className="badge-desc">{b.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* 16 区网格 */}
            <h3 className="section-title">上海 16 区</h3>
            <div className="district-grid">
              {SHANGHAI_DISTRICTS.map((d) => {
                const count = districtCounts[d] || 0;
                const visited = count > 0;
                return (
                  <div
                    key={d}
                    className={`district-cell ${visited ? 'visited' : ''}`}
                  >
                    <div className="district-name">{d}</div>
                    <div className="district-count">
                      {visited ? `${count}个地点` : '未解锁'}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* 花事足迹总览 */}
            <div className="achievements-stats">
              <div className="stat-box">
                <span className="stat-value">{markStats.wishFlowers}</span>
                <span className="stat-label">想去花卉</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{markStats.visitedFlowers}</span>
                <span className="stat-label">去过花卉</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{markStats.visitedSpots}</span>
                <span className="stat-label">去过赏花景点</span>
              </div>
              <div className="stat-box highlight">
                <span className="stat-value">{markStats.visitedBuildings}</span>
                <span className="stat-label">去过人文建筑</span>
              </div>
            </div>

            <p className="text-muted text-small">
              在花卉详情、赏花景点或建筑详情页点击「想去 / 去过」即可积累花事足迹。
              {!user && <Link to="/login" className="link"> 登录后开始记录 →</Link>}
            </p>

            {/* 花事徽章 */}
            <h3 className="section-title">花事徽章</h3>
            <div className="badge-grid">
              {FLOWER_BADGES.map((b) => {
                const unlocked = markStats[b.metric] >= b.threshold;
                return (
                  <div
                    key={b.id}
                    className={`badge-card ${unlocked ? 'unlocked' : ''}`}
                  >
                    {unlocked && <span className="badge-check">✓</span>}
                    <div className="badge-icon">{unlocked ? b.icon : '🔒'}</div>
                    <div className="badge-name">{b.name}</div>
                    <div className="badge-desc">{b.desc}</div>
                  </div>
                );
              })}
            </div>
            <div className="badge-progress-note">
              <div className="badge-progress-row"><span>想去花卉</span><b>{markStats.wishFlowers}</b><i>目标 3 / 10</i></div>
              <div className="badge-progress-row"><span>去过景点</span><b>{markStats.visitedSpots}</b><i>目标 3 / 10 / 25</i></div>
              <div className="badge-progress-row"><span>去过建筑</span><b>{markStats.visitedBuildings}</b><i>目标 10 / 20</i></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import FlowerImage from '../components/FlowerImage';
import MarkButtons from '../components/MarkButtons';
import { useToast } from '../components/Toast';
import { supabase } from '../supabaseClient';
import { getLocalPhotoUrl } from '../utils/flowerImages';
import { fetchMarks, setMark } from '../utils/marks';
import { getFlowerInfo } from '../data/flowerInfo';
import flowerCalendar from '../../data/seasonal-flowers.json';

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

/** 花期字符串 -> 展示文本 */
function formatMonths(months) {
  if (!months) return '';
  const list = String(months)
    .split(',')
    .map((m) => parseInt(m.trim(), 10))
    .filter((n) => n >= 1 && n <= 12);
  if (list.length === 0) return '';
  if (list.length === 1) return `${list[0]}月`;
  const sorted = [...list].sort((a, b) => a - b);
  return `${sorted[0]}-${sorted[sorted.length - 1]}月`;
}

/** 从 notes 中拆出"介绍"与"观赏注意点" */
function parseNotes(notes) {
  if (!notes) return { intro: '', tips: '' };
  const lines = String(notes).split('\n').map((l) => l.trim()).filter(Boolean);
  let intro = '';
  let tips = '';
  let inIntro = false;
  for (const line of lines) {
    if (line.startsWith('介绍：')) {
      inIntro = true;
      intro += (intro ? '\n' : '') + line.slice(3);
    } else if (line.startsWith('观赏注意点：')) {
      inIntro = false;
      tips += (tips ? '\n' : '') + line.slice(6);
    } else if (inIntro) {
      intro += (intro ? '\n' : '') + line;
    } else if (!intro) {
      intro += line;
    } else {
      tips += (tips ? '\n' : '') + line;
    }
  }
  return { intro, tips };
}

export default function SeasonalFlowerDetailPage() {
  const { flower } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const flowerName = decodeURIComponent(flower || '');

  // 当前用户 + 想去/去过标记
  const [user, setUser] = useState(null);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
      if (data?.user) {
        const m = await fetchMarks(data.user.id);
        if (!mounted) return;
        setMarks(m.__error ? {} : m);
      }
    })();
    const { subscription } = supabase.auth.onAuthStateChange(async (_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const m = await fetchMarks(session.user.id);
        if (mounted) setMarks(m.__error ? {} : m);
      } else if (mounted) {
        setMarks({});
      }
    });
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleMarkChange = async (key, status) => {
    if (!user) {
      toast.info('请先登录后再标记');
      navigate('/login');
      return;
    }
    const prev = marks[key];
    setMarks((m) => ({ ...m, [key]: status })); // 乐观更新
    const { error } = await setMark(user.id, 'flower', flowerName, status);
    if (error) {
      setMarks((m) => ({ ...m, [key]: prev }));
      const msg = String(error.message || '');
      if (msg.includes('does not exist') || msg.includes('marks')) {
        toast.error('标记功能需要先初始化数据库，请执行 supabase/marks-schema.sql');
      } else {
        toast.error('操作失败，请重试');
      }
    }
  };

  // 从 seasonal-flowers.json 取该花卉条目（景点选择 + 详细介绍）
  const calendar = flowerCalendar._花历 || flowerCalendar['花历'] || [];
  const entry =
    calendar.find((e) => e.flower === flowerName) ||
    calendar.find((e) => e.flower.startsWith(flowerName) || flowerName.startsWith(e.flower));

  const info = getFlowerInfo(entry?.flower || flowerName);
  const parsed = parseNotes(entry?.notes);
  const intro = parsed.intro || info.intro;
  const watchTips = parsed.tips;
  const spots = entry?.spots || [];

  return (
    <div className="app-root">
      <TopBar />

      <div className="seasonal-flower-detail" id="main" tabIndex={-1}>
        {/* 花卉标题 */}
        <div className="flower-detail-header">
          <h1>{entry?.flower || flowerName}</h1>
          {info.latin && <span className="flower-latin">{info.latin}</span>}
          <div className="flower-detail-meta">
            {entry?.months && <span className="meta-chip">📅 花期 {formatMonths(entry.months)}</span>}
            <MarkButtons
              type="flower"
              targetKey={entry?.flower || flowerName}
              marks={marks}
              onChange={handleMarkChange}
            />
            <button className="flower-back-btn" onClick={() => navigate('/seasonal')}>← 返回时令景观</button>
          </div>
        </div>

        <div className="flower-detail-split">
          {/* 左侧：大图 + 花卉介绍 */}
          <div className="flower-detail-main">
            {/* 经典大图 */}
            <div className="flower-detail-hero">
              <FlowerImage name={entry?.flower || flowerName} className="flower-hero-img" alt={entry?.flower || flowerName} />
            </div>

            {/* 花卉介绍 */}
            {intro && (
              <div className="spot-section">
                <h3>花卉介绍</h3>
                <p className="spot-desc">{intro}</p>
              </div>
            )}

            {/* 观赏注意点 */}
            {watchTips && (
              <div className="spot-section">
                <h3>🪧 观赏注意点</h3>
                <p className="spot-desc">{watchTips}</p>
              </div>
            )}

            {/* 拍摄建议 */}
            {info.tips && (
              <div className="spot-section">
                <h3>📷 拍摄建议</h3>
                <p className="spot-desc">{info.tips}</p>
              </div>
            )}
          </div>

          {/* 右侧：赏花地点 */}
          <aside className="flower-detail-spots">
            <h3 className="flower-spots-title">📍 赏花地点（{spots.length} 个）</h3>
            <p className="flower-spots-note">
              ⚠️ 花卉花期每年受气温与气候影响会有波动，且景点植物可能存在移栽、更新等情况，请结合当年的实际花讯安排行程。
            </p>
            {spots.length === 0 ? (
              <p className="text-muted">暂无赏花地点数据，后续将补充。</p>
            ) : (
              <div className="flower-spots-grid">
                {spots.map((s, i) => {
                  const localPhoto = s.photos?.[0] ? getLocalPhotoUrl(s.photos[0]) : null;
                  return (
                    <div
                      key={`${s.name}-${i}`}
                      className="flower-spot-card clickable"
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/flower-spot/${encodeURIComponent(s.name)}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') navigate(`/flower-spot/${encodeURIComponent(s.name)}`);
                      }}
                    >
                      {localPhoto ? (
                        <img src={localPhoto} alt={s.name} className="flower-spot-img" loading="lazy" />
                      ) : (
                        <div className="flower-spot-img-placeholder">🌸</div>
                      )}
                      <div className="flower-spot-body">
                        <div className="flower-spot-name">{s.name}</div>
                        {s.district && <span className="flower-spot-district">{s.district}</span>}
                        {s.source_url && (
                          <a
                            href={s.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flower-spot-original"
                            onClick={(e) => e.stopPropagation()}
                          >
                            查看原文 →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

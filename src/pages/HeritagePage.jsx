import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import { SHANGHAI_DISTRICTS } from '../utils/geocode';
import { getSeedPhotoUrl } from '../utils/flowerImages';
import seedSpots from '../../data/spots-seed.json';

export default function HeritagePage() {
  const [district, setDistrict] = useState('全部');
  const [tag, setTag] = useState('全部');

  // 全部标签
  const allTags = useMemo(() => {
    const set = new Set();
    seedSpots.forEach((s) => (s.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  const filtered = seedSpots.filter(
    (s) =>
      (district === '全部' || s.district === district) &&
      (tag === '全部' || (s.tags || []).includes(tag))
  );

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand asLink to="/" />
        <div className="user-area">
          <Link to="/" className="link">地图</Link>
          <Link to="/recommend" className="link">今日推荐</Link>
          <Link to="/seasonal" className="link">时令景观</Link>
          <Link to="/heritage" className="link active">人文建筑</Link>
          <Link to="/wechat" className="link">文旅情报</Link>
          <Link to="/achievements" className="link">成就</Link>
          <Link to="/profile" className="link">个人中心</Link>
        </div>
      </div>

      <div className="seasonal-page" id="main" tabIndex={-1}>
        <div className="page-header">
          <h2 className="page-title">人文建筑</h2>
          <p className="text-muted">上海经典老建筑与地标，点击建筑查看详细介绍与地图定位。</p>
        </div>

        {/* 区筛选 */}
        <div className="district-filter">
          <button
            className={`district-btn ${district === '全部' ? 'active' : ''}`}
            onClick={() => setDistrict('全部')}
          >全部</button>
          {SHANGHAI_DISTRICTS.map((d) => (
            <button
              key={d}
              className={`district-btn ${district === d ? 'active' : ''}`}
              onClick={() => setDistrict(d)}
            >{d}</button>
          ))}
        </div>

        {/* 标签筛选 */}
        <div className="tag-filter">
          <button
            className={`tag-btn ${tag === '全部' ? 'active' : ''}`}
            onClick={() => setTag('全部')}
          >全部</button>
          {allTags.map((t) => (
            <button
              key={t}
              className={`tag-btn ${tag === t ? 'active' : ''}`}
              onClick={() => setTag(t)}
            >{t}</button>
          ))}
        </div>

        <div className="heritage-grid">
          {filtered.map((s) => {
            const photo = s.photos?.[0] ? getSeedPhotoUrl(s.photos[0]) : null;
            return (
              <Link
                key={s.name}
                to={`/building/${encodeURIComponent(s.name)}`}
                className="heritage-card"
              >
                {photo ? (
                  <img src={photo} alt={s.name} className="heritage-img" loading="lazy" />
                ) : (
                  <div className="heritage-img-placeholder">🏛</div>
                )}
                <div className="heritage-body">
                  <div className="heritage-name">{s.name}</div>
                  {s.district && <span className="heritage-district">{s.district}</span>}
                  {s.description && <p className="heritage-desc">{s.description}</p>}
                  {s.tags && s.tags.length > 0 && (
                    <div className="card-reasons">
                      {s.tags.slice(0, 4).map((t) => (
                        <span key={t} className="reason-chip">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-muted">该条件下暂无建筑收录。</p>
        )}
      </div>
    </div>
  );
}

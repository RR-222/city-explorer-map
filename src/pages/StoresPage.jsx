import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { SHANGHAI_DISTRICTS } from '../utils/geocode';
import { getStorePhotoUrl } from '../utils/flowerImages';
import storesData from '../../data/stores-seed.json';

export default function StoresPage() {
  const [district, setDistrict] = useState('全部');
  const [tag, setTag] = useState('全部');

  const stores = Array.isArray(storesData) ? storesData : (storesData.stores || []);

  // 全部标签
  const allTags = useMemo(() => {
    const set = new Set();
    stores.forEach((s) => (s.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [stores]);

  const filtered = stores.filter(
    (s) =>
      (district === '全部' || s.district === district) &&
      (tag === '全部' || (s.tags || []).includes(tag))
  );

  return (
    <div className="app-root">
      <TopBar />

      <div className="seasonal-page" id="main" tabIndex={-1}>
        <div className="page-header">
          <h2 className="page-title">好逛街区</h2>
          <p className="text-muted">小红书上的宝藏街区、文创园区与好逛空间，点击卡片查看原文与地图定位。</p>
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
        {allTags.length > 0 && (
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
        )}

        <div className="heritage-grid">
          {filtered.map((s) => {
            const photo = s.photos?.[0] ? getStorePhotoUrl(s.photos[0]) : null;
            const content = (
              <>
                {photo ? (
                  <img src={photo} alt={s.name} className="heritage-img" loading="lazy" />
                ) : (
                  <div className="heritage-img-placeholder">🛍</div>
                )}
                <div className="heritage-body">
                  {s.hours && <span className="heritage-closed-badge">{s.hours}</span>}
                  {s.price != null && <span className="heritage-district">人均 ¥{s.price}</span>}
                  <div className="heritage-name">{s.name}</div>
                  {s.district && <span className="heritage-district">{s.district}</span>}
                  {s.desc && <p className="heritage-desc">{s.desc}</p>}
                  {s.featured && s.featured.length > 0 && (
                    <div className="card-reasons">
                      {s.featured.slice(0, 4).map((f) => (
                        <span key={f} className="reason-chip">{f}</span>
                      ))}
                    </div>
                  )}
                  {s.tags && s.tags.length > 0 && (
                    <div className="card-reasons">
                      {s.tags.slice(0, 4).map((t) => (
                        <span key={t} className="reason-chip tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
            // 有原文链接则整卡跳小红书原文（新窗口），否则静态卡片
            return (
              <Link
                key={s.name}
                to={`/store/${encodeURIComponent(s.name)}`}
                className="heritage-card"
              >
                {content}
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-muted">该条件下暂无街区收录。数据正在导入中，可先从人文建筑逛逛。</p>
        )}
      </div>
    </div>
  );
}

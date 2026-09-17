import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import glowData from '../../data/glow-spots.json';

// 朝霞 / 晚霞观赏点页面
// 数据格式（data/glow-spots.json）：
// {
//   "sunrise": [{ name, district, address, description, photos, lat, lng, source_url }],
//   "sunset":  [{ name, district, address, description, photos, lat, lng, source_url }]
// }

export default function GlowSpotsPage() {
  const [tab, setTab] = useState('sunset'); // 默认晚霞

  const sunriseSpots = glowData.sunrise || [];
  const sunsetSpots = glowData.sunset || [];
  const currentSpots = tab === 'sunrise' ? sunriseSpots : sunsetSpots;

  return (
    <div className="app-root">
      <TopBar />

      <div className="seasonal-page" id="main" tabIndex={-1}>
        <div className="page-header">
          <h2 className="page-title">朝霞 / 晚霞观赏点</h2>
          <p className="text-muted text-small">
            根据云量概率，精选上海适合拍摄朝霞与晚霞的地点。
          </p>
        </div>

        {/* 朝霞 / 晚霞 切换 */}
        <div className="glow-tabs">
          <button
            className={`glow-tab ${tab === 'sunrise' ? 'active' : ''}`}
            onClick={() => setTab('sunrise')}
          >
            🌅 朝霞观赏点
            {sunriseSpots.length > 0 && (
              <span className="glow-tab-count">{sunriseSpots.length}</span>
            )}
          </button>
          <button
            className={`glow-tab ${tab === 'sunset' ? 'active' : ''}`}
            onClick={() => setTab('sunset')}
          >
            🌇 晚霞观赏点
            {sunsetSpots.length > 0 && (
              <span className="glow-tab-count">{sunsetSpots.length}</span>
            )}
          </button>
        </div>

        {currentSpots.length === 0 ? (
          <EmptyState
            title="数据整理中"
            description="观赏点信息即将上线，敬请期待。"
          />
        ) : (
          <div className="flower-grid">
            {currentSpots.map((spot) => (
              <div key={spot.name} className="flower-card">
                <div className="flower-card-img-wrap">
                  {spot.photos && spot.photos.length > 0 ? (
                    <img
                      src={spot.photos[0]}
                      alt={spot.name}
                      className="flower-card-img"
                    />
                  ) : (
                    <div className="flower-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                      {tab === 'sunrise' ? '🌅' : '🌇'}
                    </div>
                  )}
                </div>
                <div style={{ padding: 'var(--s-3) var(--s-4)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                    {spot.name}
                  </div>
                  {spot.district && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '4px' }}>{spot.district}</div>
                  )}
                  {spot.address && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '4px' }}>📍 {spot.address}</div>
                  )}
                  {spot.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', lineHeight: 1.5, marginTop: 'var(--s-2)' }}>
                      {spot.description}
                    </p>
                  )}
                  {spot.source_url && (
                    <a
                      href={spot.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-btn"
                      style={{ display: 'inline-block', marginTop: 'var(--s-3)', fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      查看原文 →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

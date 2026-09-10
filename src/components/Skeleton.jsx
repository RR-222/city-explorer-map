import React from 'react';

// 基础骨架块
export function Skeleton({ width, height, className = '', style }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

// 推荐页：网格占位
export function RecommendSkeleton({ count = 6 }) {
  return (
    <div className="recommend-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="recommend-card" key={i}>
          <Skeleton width="100%" height={260} />
          <div className="card-body">
            <Skeleton width="70%" height={18} />
            <Skeleton width="40%" height={13} style={{ marginTop: 6 }} />
            <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
              <Skeleton width={60} height={18} />
              <Skeleton width={50} height={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 景点详情页：内容占位
export function SpotDetailSkeleton() {
  return (
    <div className="spot-detail">
      <Skeleton width="60%" height={32} />
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <Skeleton width={60} height={20} />
        <Skeleton width={50} height={20} />
      </div>
      <Skeleton width="100%" height={420} style={{ marginTop: 20 }} />
      <Skeleton width="90%" height={14} style={{ marginTop: 28 }} />
      <Skeleton width="85%" height={14} style={{ marginTop: 6 }} />
      <Skeleton width="70%" height={14} style={{ marginTop: 6 }} />
    </div>
  );
}

// 个人中心：地点卡片占位
export function PlaceListSkeleton({ count = 3 }) {
  return (
    <div className="place-list">
      {Array.from({ length: count }).map((_, i) => (
        <div className="place-card" key={i}>
          <div className="place-card-photos">
            <Skeleton width={80} height={80} />
            <Skeleton width={80} height={80} />
          </div>
          <div className="place-card-info">
            <Skeleton width="50%" height={18} />
            <Skeleton width="80%" height={14} style={{ marginTop: 8 }} />
            <Skeleton width="60%" height={13} style={{ marginTop: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

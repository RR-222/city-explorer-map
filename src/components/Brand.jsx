import React from 'react';
import { Link } from 'react-router-dom';

// 品牌定位针 SVG 图标（橙色填充，适配深色主题）
function BrandIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 4.25 5.5 11.5 7 13.5 1.5-2 7-9.25 7-13.5 0-3.87-3.13-7-7-7z"
        fill="var(--primary)"
      />
      <circle cx="12" cy="9" r="2.5" fill="var(--background)" />
    </svg>
  );
}

// 统一品牌标识：logo + "探索上海"
// asLink=true 时渲染为 Link，to 指定目标路径
export default function Brand({ asLink = false, to = '/', size = 22 }) {
  const content = (
    <>
      <BrandIcon size={size} />
      <span>探索上海</span>
    </>
  );

  if (asLink) {
    return (
      <Link to={to} className="brand">
        {content}
      </Link>
    );
  }

  return <div className="brand">{content}</div>;
}

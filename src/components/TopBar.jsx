import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Brand from './Brand';

// 全站统一顶部导航（所有页面共用）。
// 新增栏目只需在这里加一行，无需逐页修改。
const NAV_LINKS = [
  { to: '/', label: '地图' },
  { to: '/recommend', label: '今日推荐' },
  { to: '/seasonal', label: '时令景观' },
  { to: '/heritage', label: '人文建筑' },
  { to: '/stores', label: '好逛店铺' },
  { to: '/wechat', label: '文旅情报' },
  { to: '/achievements', label: '成就' },
  { to: '/profile', label: '个人中心' },
];

// 当前页高亮：/ 精确匹配，其余按前缀（/building/xx 高亮人文建筑）
function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function TopBar({ user, onLogout }) {
  const { pathname } = useLocation();
  // user 为 undefined（公开页不传）→ 不渲染登录区；
  // user 为 null → 显示 登录/注册；user 为对象 → email + 退出。
  const hasAuth = user !== undefined;

  return (
    <div className="topbar">
      <Brand asLink to="/" />
      <div className="user-area">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`link${isActive(pathname, l.to) ? ' active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
        {hasAuth && user && (
          <>
            <span>{user.email}</span>
            {onLogout && (
              <button onClick={onLogout} className="link">退出</button>
            )}
          </>
        )}
        {hasAuth && !user && (
          <>
            <Link to="/login" className="link">登录</Link>
            <Link to="/register" className="link">注册</Link>
          </>
        )}
      </div>
    </div>
  );
}

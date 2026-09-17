import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Brand from './Brand';
import { supabase } from '../supabaseClient';

// 全站统一顶部导航（所有页面共用）。
// 新增栏目只需在这里加一行，无需逐页修改。
const NAV_LINKS = [
  { to: '/', label: '地图' },
  { to: '/recommend', label: '今日推荐' },
  { to: '/seasonal', label: '时令景观' },
  { to: '/heritage', label: '人文建筑' },
  { to: '/stores', label: '好逛街区' },
  { to: '/wechat', label: '文旅情报' },
  { to: '/achievements', label: '成就' },
  { to: '/profile', label: '个人中心' },
];

// 当前页高亮：/ 精确匹配，其余按前缀（/building/xx 高亮人文建筑）
function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function TopBar() {
  const { pathname } = useLocation();
  // 移动端汉堡菜单展开状态
  const [menuOpen, setMenuOpen] = useState(false);
  // 自管登录状态：所有页面都能显示登录/退出
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    const { subscription } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // 路由切换时自动关闭移动端菜单
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // 菜单展开时锁定 body 滚动，避免背景误滚
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className="topbar">
      <Brand asLink to="/" />

      {/* 桌面端：内联导航 */}
      <div className="user-area topbar-nav-desktop">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`link${isActive(pathname, l.to) ? ' active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
        {user ? (
          <>
            <span className="topbar-user-email">{user.email}</span>
            <button onClick={handleLogout} className="link topbar-logout-btn">退出登录</button>
          </>
        ) : (
          <>
            <Link to="/login" className="link">登录</Link>
            <Link to="/register" className="link">注册</Link>
          </>
        )}
      </div>

      {/* 移动端：汉堡按钮（≤640px 显示） */}
      <button
        type="button"
        className={`topbar-hamburger${menuOpen ? ' open' : ''}`}
        aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* 移动端：抽屉菜单 */}
      {menuOpen && (
        <div className="topbar-mobile-menu" onClick={() => setMenuOpen(false)}>
          <nav className="topbar-mobile-nav" onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.filter((l) => l.to !== '/').map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`topbar-mobile-link${isActive(pathname, l.to) ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="topbar-mobile-divider" />
            {user ? (
              <>
                <div className="topbar-mobile-email">{user.email}</div>
                <button
                  className="topbar-mobile-link topbar-logout-btn"
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="topbar-mobile-link" onClick={() => setMenuOpen(false)}>登录</Link>
                <Link to="/register" className="topbar-mobile-link" onClick={() => setMenuOpen(false)}>注册</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

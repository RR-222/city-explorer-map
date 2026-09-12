import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import SpotFlowerPage from './pages/SpotFlowerPage';
import ProfilePage from './pages/ProfilePage';
import AchievementsPage from './pages/AchievementsPage';
import SpotDetailPage from './pages/SpotDetailPage';
import HeritagePage from './pages/HeritagePage';
import BuildingDetailPage from './pages/BuildingDetailPage';
import FlowerDetailPage from './pages/FlowerDetailPage';
import SeasonalFlowersPage from './pages/SeasonalFlowersPage';
import SeasonalFlowerDetailPage from './pages/SeasonalFlowerDetailPage';
import RecommendPage from './pages/RecommendPage';
import WechatArticlesPage from './pages/WechatArticlesPage';
import { ToastProvider } from './components/Toast';
import { supabase } from './supabaseClient';

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // 优先从本地存储读取 session(同步恢复,避免网页刷新后被错误重定向到注册页)
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;
      const sessionUser = sessionData?.session?.user ?? null;
      setUser(sessionUser);
      setReady(true);
      // 再用 getUser 校验 session 是否仍有效(若已过期会被清除)
      const { data: userData } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(userData?.user ?? sessionUser);
    })();

    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      // 处理关键事件:登录、登出、token 刷新、密码恢复
      if (['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'USER_UPDATED', 'PASSWORD_RECOVERY'].includes(event)) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (!ready) return <div />;

  return (
    <ToastProvider>
      <HashRouter>
        <a href="#main" className="skip-link">跳到主要内容</a>
        <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={user ? <MapPage /> : <Navigate to="/register" replace />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/register" replace />}
        />
        <Route
          path="/achievements"
          element={user ? <AchievementsPage /> : <Navigate to="/register" replace />}
        />
        <Route path="/spots/:id" element={<SpotDetailPage />} />
        <Route path="/heritage" element={<HeritagePage />} />
        <Route path="/wechat" element={<WechatArticlesPage />} />
        <Route path="/building/:name" element={<BuildingDetailPage />} />
        <Route path="/flowers/:id" element={<FlowerDetailPage />} />
        <Route path="/seasonal" element={<SeasonalFlowersPage />} />
        <Route path="/seasonal/:flower" element={<SeasonalFlowerDetailPage />} />
        <Route path="/flower-spot/:name" element={<SpotFlowerPage />} />
        <Route path="/recommend" element={<RecommendPage />} />
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}

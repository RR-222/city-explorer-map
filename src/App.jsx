import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import { supabase } from './supabaseClient';

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
      setReady(true);
    })();

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (!ready) return <div />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={user ? <MapPage /> : <Navigate to="/register" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

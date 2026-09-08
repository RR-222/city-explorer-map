import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) navigate('/', { replace: true });
    })();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>登录</h2>
        <input
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          placeholder="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="auth-actions">
          <button onClick={handleLogin} disabled={loading} className="primary">
            {loading ? '登录中...' : '登录'}
          </button>
        </div>
      </div>
    </div>
  );
}

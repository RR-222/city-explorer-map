import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // if already logged in, redirect to map
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) navigate('/', { replace: true });
    })();
  }, [navigate]);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // signUp may require email confirmation. Try to get user session
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        navigate('/', { replace: true });
      } else {
        alert('注册成功，请查看邮箱完成验证（如果需要），然后登录。');
        navigate('/login', { replace: true });
      }
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
        <h2>注册</h2>
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
          <button onClick={handleRegister} disabled={loading} className="primary">
            {loading ? '注册中...' : '注册'}
          </button>
        </div>
      </div>
    </div>
  );
}

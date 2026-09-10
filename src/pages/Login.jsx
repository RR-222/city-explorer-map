import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import AuthLayout from '../components/AuthLayout';

// 将 Supabase 错误信息翻译为用户友好的中文提示
function formatAuthError(err) {
  const msg = (err?.message || '').toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return '邮箱或密码错误';
  }
  if (msg.includes('email not confirmed')) {
    return '邮箱尚未验证,请先去邮箱(含垃圾邮件)点击验证链接';
  }
  if (msg.includes('no user found') || msg.includes('user not found')) {
    return '账号不存在,请先注册';
  }
  if (msg.includes('rate limit') || msg.includes('over request') || msg.includes('too many')) {
    return '登录尝试过于频繁,请稍后再试';
  }
  return err?.message || '登录失败';
}

export default function Login() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needVerify, setNeedVerify] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) navigate('/', { replace: true });
    })();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast.warning('请输入邮箱和密码');
      return;
    }
    setLoading(true);
    setNeedVerify(false);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('登录成功');
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      // 邮箱未验证场景:提供重新发送验证邮件的入口
      if (/email not confirmed/i.test(err.message || '')) {
        setNeedVerify(true);
      }
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      toast.warning('请先输入注册邮箱');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: window.location.origin + '/' }
      });
      if (error) throw error;
      toast.success('验证邮件已重新发送,请检查邮箱(含垃圾邮件)');
    } catch (err) {
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast.warning('请先输入注册邮箱');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/'
      });
      if (error) throw error;
      toast.success('重置密码邮件已发送,请检查邮箱(含垃圾邮件)');
    } catch (err) {
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="login"
      hero="欢迎回来"
      heroSub="继续探索上海的美好角落"
    >
      <div className="auth-form-header">
        <h2 className="auth-form-title">登录</h2>
        <p className="auth-form-desc">使用账号密码登录</p>
      </div>

      <div className="auth-field">
        <label htmlFor="login-email">邮箱</label>
        <input
          id="login-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="login-password">密码</label>
        <input
          id="login-password"
          type="password"
          placeholder="输入登录密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
        />
      </div>

      <div className="auth-actions">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="auth-primary-btn"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: 0.85 }}>
        <button
          type="button"
          onClick={handleResetPassword}
          disabled={loading}
          style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', padding: 0, textDecoration: 'underline' }}
        >
          忘记密码?
        </button>
        {needVerify && (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            重新发送验证邮件
          </button>
        )}
      </div>
    </AuthLayout>
  );
}

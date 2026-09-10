import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import AuthLayout from '../components/AuthLayout';

// 将 Supabase 错误信息翻译为用户友好的中文提示
function formatAuthError(err) {
  const msg = (err?.message || '').toLowerCase();
  if (msg.includes('user already registered') || msg.includes('already been registered') || msg.includes('already registered')) {
    return '该邮箱已注册,请直接前往登录';
  }
  if (msg.includes('password') && msg.includes('weak')) {
    return '密码强度不足,请使用至少 6 位密码';
  }
  if (msg.includes('rate limit') || msg.includes('over request') || msg.includes('too many')) {
    return '操作过于频繁,请稍后再试';
  }
  if (msg.includes('unable to validate email') || msg.includes('invalid email')) {
    return '邮箱格式不正确';
  }
  return err?.message || '注册失败,请稍后再试';
}

export default function Register() {
  const toast = useToast();
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
    if (!email.trim() || !password) {
      toast.warning('请输入邮箱和密码');
      return;
    }
    if (password.length < 6) {
      toast.warning('密码至少需要 6 位');
      return;
    }
    setLoading(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;

      // signUp 成功返回 session -> 注册即登录,跳转首页
      if (signUpData?.session && signUpData?.user) {
        toast.success('注册成功,正在进入地图...');
        navigate('/', { replace: true });
        return;
      }

      // 兜底:尝试立即用相同凭证登录
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (!signInError && signInData?.user) {
        toast.success('注册成功,正在进入地图...');
        navigate('/', { replace: true });
        return;
      }

      // 登录失败 -> 跳转到登录页让用户尝试
      toast.info('注册完成,请前往登录');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      // 已注册邮箱 -> 引导去登录
      const isDuplicate = /already registered|already been registered/i.test(err.message || '');
      if (isDuplicate) {
        toast.warning('该邮箱已注册,正在跳转登录页...');
        setTimeout(() => navigate('/login', { replace: true }), 800);
        return;
      }
      toast.error(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="register"
      hero="探索上海"
      heroSub="发现上海的城市记忆与隐藏风景"
    >
      <div className="auth-form-header">
        <h2 className="auth-form-title">创建账号</h2>
        <p className="auth-form-desc">开启你的城市探索之旅</p>
      </div>

      <div className="auth-field">
        <label htmlFor="register-email">邮箱</label>
        <input
          id="register-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="register-password">密码</label>
        <input
          id="register-password"
          type="password"
          placeholder="设置登录密码(至少 6 位)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRegister();
          }}
        />
      </div>

      <div className="auth-actions">
        <button
          onClick={handleRegister}
          disabled={loading}
          className="auth-primary-btn"
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </div>
    </AuthLayout>
  );
}

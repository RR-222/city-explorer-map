import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

// type: 'success' | 'error' | 'info' | 'warning'
const ToastContext = createContext(null);

let _id = 0;
const nextId = () => ++_id;

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '!',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback((message, type = 'info', duration = 3500) => {
    const id = nextId();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      timers.current[id] = setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  // 稳定 API：toast(msg) 等价 info；toast.success/error/info/warning(msg)
  const api = useMemo(() => {
    const fn = (message, type = 'info', duration) => push(message, type, duration);
    fn.success = (m, d) => push(m, 'success', d);
    fn.error = (m, d) => push(m, 'error', d);
    fn.info = (m, d) => push(m, 'info', d);
    fn.warning = (m, d) => push(m, 'warning', d);
    fn.dismiss = dismiss;
    return fn;
  }, [push, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{ICONS[t.type] || ''}</span>
            <span className="toast-msg">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="关闭"
            >×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
import { supabase } from '../supabaseClient';
import snapshot from '../../data/wechat-articles.json';

const ACCOUNTS = ['上海发布', '上海本地宝', '乐游上海', 'ShanghaiLOOK'];

const ACCOUNT_COLORS = {
  '上海发布': '#60a5fa',
  '上海本地宝': '#4ade80',
  '乐游上海': '#fb923c',
  'ShanghaiLOOK': '#22d3ee',
};

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  const mmdd = `${d.getMonth() + 1}月${d.getDate()}日`;
  if (diffDays === 0) return `今天 ${mmdd}`;
  if (diffDays === 1) return `昨天 ${mmdd}`;
  return mmdd;
}

// 置顶徽标文案：节日显示到期日，每周/每月显示到本周末/本月末
function pinLabel(item) {
  if (!item.pinned_until || new Date(item.pinned_until).getTime() <= Date.now()) return null;
  const name = item.category_name || '重要';
  if (item.category === 'festival') {
    const d = new Date(item.pinned_until);
    return `置顶 · ${name} · 至${d.getMonth() + 1}月${d.getDate()}日`;
  }
  if (item.category === 'monthly') return `置顶 · ${name} · 至本月末`;
  if (item.category === 'weekly') return `置顶 · ${name} · 至本周末`;
  return `置顶 · ${name}`;
}

function WechatCard({ item }) {
  const color = ACCOUNT_COLORS[item.account] || '#a1a1aa';
  const pin = pinLabel(item);
  return (
    <a
      className={`wechat-card${pin ? ' wechat-card-pinned' : ''}`}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {item.cover ? (
        <div className="wechat-card-cover">
          <img src={item.cover} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      ) : (
        <div className="wechat-card-cover wechat-card-cover-empty">📰</div>
      )}
      <div className="wechat-card-body">
        <div className="wechat-card-meta">
          <span className="wechat-badge" style={{ color, borderColor: color }}>{item.account}</span>
          <span className="wechat-date">{formatDate(item.publish_at)}</span>
        </div>
        {pin && <span className="wechat-pin-badge">{pin}</span>}
        <h3 className="wechat-card-title">{item.title}</h3>
        {item.summary && <p className="wechat-card-summary">{item.summary}</p>}
        <span className="wechat-read-more">阅读原文 →</span>
      </div>
    </a>
  );
}

export default function WechatArticlesPage() {
  const [articles, setArticles] = useState(null);
  const [account, setAccount] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('wechat_articles')
          .select('*')
          .limit(300);
        if (error) throw error;
        // 仅当数据库已升级到 v2（含置顶字段）才以数据库为准，否则回落本地快照
        const isV2 = data && data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], 'pinned_until');
        if (isV2) {
          if (mounted) {
            setArticles(data);
            const times = data.map((r) => r.fetched_at).filter(Boolean);
            if (times.length) setUpdatedAt(new Date(Math.max(...times.map((t) => new Date(t).getTime()))));
          }
          return;
        }
      } catch (e) {
        console.warn('读取 Supabase 失败，使用本地快照:', e.message);
      }
      if (mounted) {
        setArticles(snapshot.articles || []);
        if (snapshot.updatedAt) setUpdatedAt(new Date(snapshot.updatedAt));
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!articles) return [];
    const kw = keyword.trim().toLowerCase();
    const now = Date.now();
    const list = articles.filter((a) => {
      if (account !== '全部' && a.account !== account) return false;
      if (kw && !(`${a.title}${a.summary || ''}`.toLowerCase().includes(kw))) return false;
      // 防御性过滤：仅显示有效置顶或近三天内的文章（防止库中残留的超期行出现在页面）
      const pinned = a.pinned_until && new Date(a.pinned_until).getTime() > now;
      if (pinned) return true;
      return a.publish_at && now - new Date(a.publish_at).getTime() <= 3 * 86400000;
    });
    // 置顶优先：置顶文章按到期时间升序（最先到期的最靠前），其余按发布时间倒序
    return [...list].sort((a, b) => {
      const pa = a.pinned_until && new Date(a.pinned_until).getTime() > now;
      const pb = b.pinned_until && new Date(b.pinned_until).getTime() > now;
      if (pa && pb) return new Date(a.pinned_until) - new Date(b.pinned_until);
      if (pa) return -1;
      if (pb) return 1;
      return new Date(b.publish_at) - new Date(a.publish_at);
    });
  }, [articles, account, keyword]);

  return (
    <div className="app-root">
      <div className="topbar">
        <Brand asLink to="/" />
        <div className="user-area">
          <Link to="/" className="link">地图</Link>
          <Link to="/recommend" className="link">今日推荐</Link>
          <Link to="/seasonal" className="link">时令景观</Link>
          <Link to="/heritage" className="link">人文建筑</Link>
          <Link to="/wechat" className="link active">文旅情报</Link>
          <Link to="/achievements" className="link">成就</Link>
          <Link to="/profile" className="link">个人中心</Link>
        </div>
      </div>

      <div className="wechat-page" id="main" tabIndex={-1}>
        <div className="page-header">
          <h2 className="page-title">文旅情报</h2>
          <p className="text-muted">
            聚合「上海发布 · 上海本地宝 · 乐游上海 · ShanghaiLOOK」四个公众号的文旅相关内容，
            每天两次自动抓取（近三天内容），每月/每周汇总与重要节日文章自动置顶至结束。
            {updatedAt && <span className="wechat-updated">数据更新于 {updatedAt.toLocaleDateString('zh-CN')}</span>}
          </p>
        </div>

        <div className="district-filter">
          <button
            className={`district-btn ${account === '全部' ? 'active' : ''}`}
            onClick={() => setAccount('全部')}
          >全部</button>
          {ACCOUNTS.map((a) => (
            <button
              key={a}
              className={`district-btn ${account === a ? 'active' : ''}`}
              onClick={() => setAccount(a)}
            >{a}</button>
          ))}
          <input
            className="wechat-search"
            type="search"
            placeholder="搜索标题 / 摘要…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {!articles ? (
          <div className="wechat-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="wechat-card wechat-card-skeleton">
                <div className="skeleton-block cover" />
                <div className="skeleton-block line" />
                <div className="skeleton-block line short" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-box">
            <p>暂无符合条件的文旅内容，试试切换账号或清空搜索词。</p>
          </div>
        ) : (
          <>
            <p className="wechat-count">共 {filtered.length} 条</p>
            <div className="wechat-grid">
              {filtered.map((item) => (
                <WechatCard key={item.url || `${item.biz}-${item.mid}-${item.idx}`} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

-- ============================================================
-- 文旅情报：微信公众号文章聚合表（更新版，可重复运行）
-- 在 Supabase Dashboard → SQL Editor 运行一次即可
-- 相比 v1 新增：category / category_name / pinned_until（置顶字段）
--              + anon DELETE 策略（脚本自动清理过期数据）
-- ============================================================

CREATE TABLE IF NOT EXISTS wechat_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account text NOT NULL,              -- 公众号名称：上海艺术展览/上海发布/上海本地宝/乐游上海/ShanghaiLOOK
  title text NOT NULL,
  url text NOT NULL,                  -- mp.weixin.qq.com 当前可访问链接（带签名，会随刷新更新）
  biz text NOT NULL,                  -- 微信文章稳定身份键 __biz
  mid text NOT NULL,                  -- 微信文章稳定身份键 mid
  idx integer NOT NULL,               -- 微信文章稳定身份键 idx
  cover text,                         -- 封面图 URL（本地化路径 /wechat-covers/...）
  summary text,                       -- 正文摘要（前 ~140 字）
  publish_at timestamptz NOT NULL,    -- 公众号发布时间
  fetched_at timestamptz DEFAULT now(),
  source text DEFAULT 'sogou-weixin', -- 抓取来源
  category text,                      -- 置顶分类：weekly / monthly / festival
  category_name text,                 -- 分类显示名（如 上海旅游节 / 每周汇总/预告）
  pinned_until timestamptz,           -- 置顶到期时间，到期前页面置顶显示
  UNIQUE (biz, mid, idx)              -- 同文（biz,mid,idx）唯一，抓取刷新时覆盖
);

-- 旧表升级：补置顶字段（幂等）
ALTER TABLE wechat_articles ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE wechat_articles ADD COLUMN IF NOT EXISTS category_name text;
ALTER TABLE wechat_articles ADD COLUMN IF NOT EXISTS pinned_until timestamptz;

CREATE INDEX IF NOT EXISTS idx_wechat_articles_publish_at
  ON wechat_articles (publish_at DESC);

CREATE INDEX IF NOT EXISTS idx_wechat_articles_pinned_until
  ON wechat_articles (pinned_until);

-- RLS：公开可读（网页直接查）
ALTER TABLE wechat_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wechat_articles_read_public" ON wechat_articles;
CREATE POLICY "wechat_articles_read_public"
  ON wechat_articles FOR SELECT
  TO public
  USING (true);

-- 允许脚本用 anon key 写入（本地定时脚本用，个人项目可接受；
-- 若担心任意访客灌数据，可后续改为 service_role key 写库）
DROP POLICY IF EXISTS "wechat_articles_write_anon" ON wechat_articles;
CREATE POLICY "wechat_articles_write_anon"
  ON wechat_articles FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "wechat_articles_update_anon" ON wechat_articles;
CREATE POLICY "wechat_articles_update_anon"
  ON wechat_articles FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 脚本自动清理过期数据需要
DROP POLICY IF EXISTS "wechat_articles_delete_anon" ON wechat_articles;
CREATE POLICY "wechat_articles_delete_anon"
  ON wechat_articles FOR DELETE
  TO anon
  USING (true);

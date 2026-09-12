-- ============================================================
-- 上海四季赏花时令景点 - 数据库 Schema
-- 在 Supabase Dashboard → SQL Editor 运行
-- ============================================================

-- 1. 新建花卉时令景点表 flowers
CREATE TABLE IF NOT EXISTS flowers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                          -- 景点名称
  flower text NOT NULL,                        -- 花卉名称（如"梅花""樱花"）
  description text,                             -- 描述
  address text,                                -- 地址
  lat double precision NOT NULL,                -- 纬度
  lng double precision NOT NULL,                -- 经度
  district text,                               -- 所属区
  photos text[] DEFAULT '{}',                   -- 花卉图片 URL 数组
  months text,                                  -- 适合月份："2,3" 或 "全年"
  category text,                                -- 分类：传统名花/樱花/水生花卉/草甸花海/彩叶/...
  tags text[] DEFAULT '{}',                     -- 标签
  notes text,                                   -- 备注（如"含夜樱""莫奈风睡莲池"）
  source_url text,                              -- 来源链接
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. flowers 表 RLS：公开可读，不允许前端写
ALTER TABLE flowers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "flowers_read_public"
ON flowers FOR SELECT
TO public
USING (true);

-- 3. 创建 flower-photos bucket（如不存在）
INSERT INTO storage.buckets (id, name, public)
VALUES ('flower-photos', 'flower-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 4. flower-photos bucket RLS 策略
DROP POLICY IF EXISTS "flower-photos-insert" ON storage.objects;
CREATE POLICY "flower-photos-insert"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'flower-photos');

DROP POLICY IF EXISTS "flower-photos-read" ON storage.objects;
CREATE POLICY "flower-photos-read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'flower-photos');

-- 5. 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS flowers_updated_at ON flowers;
CREATE TRIGGER flowers_updated_at
BEFORE UPDATE ON flowers
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. 索引：按月份和花卉名查询
CREATE INDEX IF NOT EXISTS idx_flowers_months ON flowers(months);
CREATE INDEX IF NOT EXISTS idx_flowers_flower ON flowers(flower);
CREATE INDEX IF NOT EXISTS idx_flowers_district ON flowers(district);

-- ============================================================
-- 上海小众摄影景点平台 - 数据库改造脚本
-- 在 Supabase Dashboard → SQL Editor 运行
-- ============================================================

-- 1. 新建预设景点表 spots
CREATE TABLE IF NOT EXISTS spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text,                       -- 地址（如"上海市徐汇区武康路113号"）
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  district text,                     -- 所属区（黄浦区/浦东新区…）
  photos text[] DEFAULT '{}',         -- 景点样片 URL 数组
  shoot_spots jsonb DEFAULT '[]'::jsonb, -- 机位数组：[{title, address, lat, lng, tip, best_hour}]
  seasons text,                       -- 适合时节："全年" 或 "3,4,5"
  weather_tags text[] DEFAULT '{}',   -- ['晴天','多云','雨天','雾天','日出','日落','夜景']
  tags text[] DEFAULT '{}',           -- ['老建筑','江景','弄堂','涂鸦'…]
  source text,                        -- 来源说明
  source_url text,                     -- 来源链接
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. spots 表 RLS：公开可读，不允许前端写（只通过后台/SQL 导入）
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "spots_read_public"
ON spots FOR SELECT
TO public
USING (true);

-- 3. places 表加列：关联预设景点 + 打卡扩展字段
ALTER TABLE places ADD COLUMN IF NOT EXISTS spot_id uuid REFERENCES spots(id);
ALTER TABLE places ADD COLUMN IF NOT EXISTS visit_date date;
ALTER TABLE places ADD COLUMN IF NOT EXISTS weather_actual text;
ALTER TABLE places ADD COLUMN IF NOT EXISTS note text;

-- 4. 插入几条示例景点数据（方便先跑通流程）
INSERT INTO spots (name, description, lat, lng, district, seasons, weather_tags, tags) VALUES
  ('武康大楼', '上海标志性历史建筑，街拍热门机位', 31.2155, 121.4373, '徐汇区',
   '全年', ARRAY['晴天','日落','夜景'], ARRAY['老建筑','街拍']),
  ('外滩源', '外滩北端历史建筑群，人少机位多', 31.2428, 121.4905, '黄浦区',
   '全年', ARRAY['日出','夜景','晴天'], ARRAY['老建筑','江景']),
  ('西岸美术馆大道', '滨江步道+工业遗存，适合漫步拍摄', 31.1965, 121.4455, '徐汇区',
   '全年', ARRAY['晴天','多云','日落'], ARRAY['江景','工业风']),
  ('田子坊弄堂', '石库门里弄文艺街区', 31.2102, 121.4667, '黄浦区',
   '全年', ARRAY['晴天','多云'], ARRAY['弄堂','文艺'])
ON CONFLICT DO NOTHING;

-- 5. 如果表已存在，补加/迁移列
ALTER TABLE spots ADD COLUMN IF NOT EXISTS address text;
-- 如果 seasons 是 int[] 类型，迁移为 text
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spots' AND column_name = 'seasons'
      AND data_type = 'ARRAY'
  ) THEN
    ALTER TABLE spots DROP COLUMN seasons;
    ALTER TABLE spots ADD COLUMN seasons text;
  END IF;
END $$;

-- 6. 更新时间触发器（可选）
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS spots_updated_at ON spots;
CREATE TRIGGER spots_updated_at
BEFORE UPDATE ON spots
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

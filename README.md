# city-explorer-map
City Explorer Map — a starter web app to mark everyday non-travel places with time, cost, photos and notes (React + Supabase + Leaflet)

## 文旅情报页（/wechat）

聚合「上海艺术展览 / 上海发布 / 上海本地宝 / 乐游上海 / ShanghaiLOOK」五个公众号的文旅相关内容，卡片跳转原文。
每月/每周汇总、重要节日类文章自动识别并**置顶**到该月/该周/活动结束；普通文章保留近三天内容。

- 抓取脚本：`scripts/fetch-wechat.mjs`（搜狗微信文章搜索 → 按账号/时间/关键词过滤 → 解析 /link → 抓文章页提取标题/时间/封面/摘要；封面下载到 `public/wechat-covers/` 同源展示，绕开浏览器跨域拦截）
  - 用法：`node scripts/fetch-wechat.mjs [天数]`，默认最近 3 天；输出 `data/wechat-articles.json` 并写入 Supabase
  - 手动导入（搜狗未收录的账号，如「上海艺术展览」）：`node scripts/fetch-wechat.mjs --urls "https://mp.weixin.qq.com/s/...，..."`（微信里打开文章 → 右上角 … → 复制链接）
  - 去重键：微信文章稳定身份键 `(biz, mid, idx)`；链接为搜狗签名链接，每次运行自动刷新
- 数据库：先运行一次（更新版）`supabase/wechat-articles-schema.sql`（Supabase Dashboard → SQL Editor），脚本会自动清理超出保留期的旧数据
- 定时任务：每天两次 `CityExplorer-WechatFetcher-AM`（08:00）、`CityExplorer-WechatFetcher-PM`（20:00）
  - 删除：`schtasks /Delete /TN "CityExplorer-WechatFetcher-AM" /F` 与 `-PM` 同理
- 数据源注意：搜狗对部分账号收录有延迟（如「上海艺术展览」近期无收录时该号不会出现新条目，可用 `--urls` 手动导入）；搜狗有反爬，脚本内置随机延迟与退避，勿高频运行。

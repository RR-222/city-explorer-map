# City Explorer Map（上海城市探索地图）

一个深色主题的上海城市漫游 Web 应用：在地图上标记与发现「时令花卉」与「人文建筑」两条内容线，配合今日推荐、天气感知、文旅情报与成就系统，帮你随时决定"这个季节去哪看什么"。

React 18 + Vite 5 前端，Supabase 认证与数据，Leaflet + 天地图底图，纯静态构建可部署。

---

## ✨ 功能总览（当前完成度）

| 模块 | 路由 | 完成度 | 说明 |
|---|---|---|---|
| 首页 · 地图 | `/` | ✅ 完成 | 天地图底图，个人地点标记、添加地点、天气感知、时令推荐入口 |
| 今日推荐 | `/recommend` | ✅ 完成 | 时间问候 + 月份特点 + 时令植物，推荐按"时令景观 / 人文建筑"两栏展示 |
| 时令景观 | `/seasonal` | ✅ 完成 | 45 种时令植物按月展示，花本身 + 经典图 + 花期 |
| 花卉详情 | `/seasonal/:flower` | ✅ 完成 | 形态特征 / 植物文化 / 主要品种三段式介绍 + 观赏注意点 + 赏花地点 |
| 赏花地点 | `/flower-spot/:name` | ✅ 完成 | 景点地址、介绍、所在区、查看原文，右侧地图标注 + 看看附近 5 个建筑 |
| 人文建筑 | `/heritage` | ✅ 完成 | 41 处上海经典建筑，按区 / 标签筛选 |
| 建筑详情 | `/building/:name` | ✅ 完成 | 历史 / 特色 / 文化影响分段介绍 + 地图标注 + 查看原文 |
| 文旅情报 | `/wechat` | ✅ 完成 | 聚合 5 个上海文旅公众号文章，节日/重要内容自动置顶 |
| 成就系统 | `/achievements` | ✅ 完成 | 打卡行为成就 |
| 个人中心 | `/profile` | ✅ 完成 | 账号与我的地点 |
| 登录 / 注册 | `/login` `/register` | ✅ 完成 | Supabase 邮箱认证 |

---

## 🗺️ 页面功能

### 首页 · 地图（`/`）
- 天地图矢量底图 + 中文注记层（与全站一致）
- 用户在地图上标记"个人地点"（时间、花费、照片、备注），支持编辑与删除
- 按月份 + 天气 + 光线条件对预设景点自动评分推荐
- 顶部显示时令问候（早上好 / 下午好…）与当月植物特点

### 今日推荐（`/recommend`）
- 问候语放大展示，含当前月份特点与对应时令植物
- 推荐分为 **时令景观** 与 **人文建筑** 两栏，各提供多项可选
- 点击植物跳转花卉详情，点击建筑跳转建筑详情

### 时令景观（`/seasonal` + `/seasonal/:flower` + `/flower-spot/:name`）
- 45 种时令植物按月整理（梅花、樱花、郁金香、绣球、荷花、银杏、水杉落羽杉……）
- 列表页：花的经典图 + 花期；详情页：大图 + **形态特征 / 植物文化 / 主要品种** 三段式介绍 + 观赏注意点 + 拍摄建议
- 赏花地点：129 个上海景点（含地址、所在区、介绍、小红书原文链接），选中后进入景点页：右侧地图标注该景点，侧栏为景点介绍，可"看看附近"——地图上显示距离最近的 5 个建筑（取自 `spots-seed.json`）
- 「查看原文」按钮与人文建筑详情页模式一致

### 人文建筑（`/heritage` + `/building/:name`）
- 41 处上海经典建筑（外滩源、武康路、衡复风貌区、工业遗存……）
- 按区（黄浦、徐汇、静安……）与标签（老建筑、名人故居、宗教建筑、工业风……）双维筛选
- 建筑详情页：**历史 / 特色 / 文化影响** 分段介绍 + 最佳时节月份 + 地图标注 + 查看原文

### 文旅情报（`/wechat`）
- 聚合「上海发布 / 上海本地宝 / 乐游上海 / ShanghaiLOOK」四个公众号的文旅内容
- 每月 / 每周汇总、重要节日类文章自动识别并置顶到该月 / 该周 / 活动结束；普通文章保留近三天
- 卡片跳转原文，封面同源展示

### 个人中心（`/profile`）与成就（`/achievements`）
- 账号信息、我的地点管理；打卡行为驱动成就徽章

---

## 🛠️ 技术栈

| 层 | 选型 |
|---|---|
| 框架 | React 18 + React Router 6 |
| 构建 | Vite 5 |
| 地图 | Leaflet + react-leaflet + **天地图**（矢量底图 + 中文注记） |
| 后端 / 认证 | Supabase（Auth 邮箱密码 + PostgreSQL） |
| 样式 | 原生 CSS（深色主题 + 橙色强调，CSS 变量） |
| 数据脚本 | Node.js（`.mjs`）+ SQL（Supabase schema） |

---

## 📦 数据与资源

### 数据文件（`data/`）

| 文件 | 内容 | 规模 |
|---|---|---|
| `seasonal-flowers.json` | 时令花历：45 种植物，含花期月份、分类、三段式介绍（形态特征/植物文化/主要品种）、观赏注意点、赏花地点与照片路径 | 45 条 |
| `flower-spots.json` | 赏花景点汇总（由花历合并去重）：地址、所在区、介绍、关联花卉、小红书原文链接、本地照片 | 129 个 |
| `spots-seed.json` | 人文建筑：41 处，含地址、历史/特色/文化影响分段介绍、坐标、照片、季节、标签、来源 | 41 处 |
| `wechat-articles.json` | 文旅情报文章（抓取产物） | 动态 |
| `flowers-import.sql` / `spots-import.sql` / `spots-update-photos.sql` | Supabase 建表与导入 SQL | — |

### 图片资源

| 目录 | 内容 | 规模 |
|---|---|---|
| `data/classic-photos/` | 每花 1 张网上经典图（时令景观列表/详情主图） | 45 张 |
| `data/flower-photos/` | 按花分目录的赏花地点实拍照片 | 299 张 |
| `data/photos/` | 人文建筑照片（对应 spots-seed.json） | 80 张 |

> 图片经 Vite `import.meta.glob` 打包为可访问 URL；展示优先级：经典图 → 维基共享搜索兜底 → 本地照片回退。

---

## 🚀 快速开始

### 环境要求
- Node.js 18+，npm

### 环境变量（`.env.local`）
| 变量 | 说明 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase 项目地址 |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key（前端） |
| `VITE_TDT_KEY` | 天地图浏览器端 token（底图） |
| `TDT_SERVER_KEY` | 天地图服务端密钥（数据脚本用） |

### 安装与运行
```bash
npm install
npm run dev       # 开发模式 http://localhost:5173
npm run build     # 生产构建 → dist/
npm run preview   # 本地预览 http://localhost:4173
```

### 数据库初始化（Supabase Dashboard → SQL Editor）
按序执行 `supabase/` 下的 schema：
- `spots-schema.sql` —— 人文建筑表
- `flowers-schema.sql` —— 时令花卉表
- `wechat-articles-schema.sql` —— 文旅文章表（含去重键）

---

## 📥 数据导入脚本（`scripts/`）

| 脚本 | 用途 |
|---|---|
| `import-spots.mjs` | 导入人文建筑数据到 Supabase |
| `import-flowers.mjs` | 导入时令花卉数据到 Supabase |
| `update-spots-8-27.mjs` / `update-spots-28-45.mjs` | 分批补充建筑照片与来源 |
| `update-spots-photos.mjs` | 更新建筑照片字段 |
| `fetch-wechat.mjs` | 文旅情报抓取（见下） |

---

## 📰 文旅情报抓取（`/wechat`）

聚合「上海发布 / 上海本地宝 / 乐游上海 / ShanghaiLOOK」四个公众号的文旅相关内容，卡片跳转原文。
每月/每周汇总、重要节日类文章自动识别并**置顶**到该月/该周/活动结束；普通文章保留近三天内容。

- 抓取脚本：`scripts/fetch-wechat.mjs`（搜狗微信文章搜索 → 按账号/时间/关键词过滤 → 解析 /link → 抓文章页提取标题/时间/封面/摘要；封面下载到 `public/wechat-covers/` 同源展示，绕开浏览器跨域拦截）
  - 用法：`node scripts/fetch-wechat.mjs [天数]`，默认最近 3 天；输出 `data/wechat-articles.json` 并写入 Supabase
  - 手动导入（搜狗未收录的账号）：`node scripts/fetch-wechat.mjs --urls "https://mp.weixin.qq.com/s/...，..."`（微信里打开文章 → 右上角 … → 复制链接）
  - 去重键：微信文章稳定身份键 `(biz, mid, idx)`；链接为搜狗签名链接，每次运行自动刷新
- 数据库：先运行一次（更新版）`supabase/wechat-articles-schema.sql`（Supabase Dashboard → SQL Editor），脚本会自动清理超出保留期的旧数据
- 定时任务：每天两次 `CityExplorer-WechatFetcher-AM`（08:00）、`CityExplorer-WechatFetcher-PM`（20:00）
  - 删除：`schtasks /Delete /TN "CityExplorer-WechatFetcher-AM" /F` 与 `-PM` 同理
- 数据源注意：搜狗对部分账号收录有延迟，未收录的账号可用 `--urls` 手动导入；搜狗有反爬，脚本内置随机延迟与退避，勿高频运行。

---

## 📁 项目结构

```
city-explorer-map/
├── data/                  # 数据与图片资源
│   ├── seasonal-flowers.json   # 时令花历（45 种）
│   ├── flower-spots.json       # 赏花景点汇总（129 个）
│   ├── spots-seed.json         # 人文建筑（41 处）
│   ├── classic-photos/         # 花卉经典图
│   ├── flower-photos/          # 按花分目录的赏花照片
│   └── photos/                 # 建筑照片
├── src/
│   ├── pages/             # 14 个页面（Map / Recommend / Seasonal / Heritage / Wechat …）
│   ├── components/        # MapView / AddPlaceModal / FlowerImage / Toast …
│   ├── utils/             # recommend / weather / seasonalGreeting / flowerImages / geocode / spotsFilter
│   ├── App.jsx            # 路由与登录守卫
│   └── supabaseClient.js  # Supabase 客户端
├── scripts/               # 数据导入 / 文旅抓取脚本
├── supabase/              # 数据库 schema SQL
└── public/                # 静态资源（微信封面等）
```

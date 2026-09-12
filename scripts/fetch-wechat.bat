@echo off
rem WeChat article fetcher (called by Windows scheduled tasks, 08:00 / 20:00)
cd /d D:\city-explorer-map
node scripts\fetch-wechat.mjs 3 >> data\fetch-wechat.log 2>&1

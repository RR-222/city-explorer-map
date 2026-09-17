// 合并 stores-seed.json：保留现有 9 个园区 + 追加上传文件中的 22 条街道
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();

// 1. 读取现有 stores-seed.json（9 条）
const existing = JSON.parse(readFileSync(resolve(cwd, 'data/stores-seed.json'), 'utf-8'));
console.log('Existing stores:', existing.length);

// 2. 读取上传文件（22 条）— 路径见 attachments
const uploadedPath = resolve(
  'c:\\Users\\26748\\.trae-cn\\attachments\\6a9fe728db47f399313de851\\5228baba-5c93-431e-a340-f3da13449c80_92562a81-8161-4f1c-a983-8f80b0db3c0f_[__ {__....txt'
);
const uploadedRaw = readFileSync(uploadedPath, 'utf-8');
const uploaded = JSON.parse(uploadedRaw);
console.log('Uploaded stores:', uploaded.length);

// 3. 检查 ID 冲突
const existingIds = new Set(existing.map(s => s.id));
const conflicts = uploaded.filter(s => existingIds.has(s.id));
if (conflicts.length > 0) {
  console.error('ID conflicts:', conflicts.map(s => s.id));
  process.exit(1);
}

// 4. 合并：现有 9 条 + 新 22 条
const merged = [...existing, ...uploaded];
console.log('Merged total:', merged.length);

// 5. 写回 stores-seed.json
writeFileSync(
  resolve(cwd, 'data/stores-seed.json'),
  JSON.stringify(merged, null, 2),
  'utf-8'
);
console.log('stores-seed.json updated with', merged.length, 'stores');

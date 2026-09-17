// 基于 git HEAD 的原始路径，给每个路径补全正确的扩展名
// 这样可以保留原始的图片编号（1.1, 1.2 等），避免重复
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';

const cwd = process.cwd();
const photosDir = resolve(cwd, 'data/photos');

// 1. 从 git HEAD 取原始 heritage-spots.json
const headContent = execSync('git show HEAD:data/heritage-spots.json', { cwd, encoding: 'utf-8' });
const head = JSON.parse(headContent);

// 2. 列出所有实际文件，建立 "不带扩展名" → "完整文件名" 的映射
const files = readdirSync(photosDir);
const nameMap = new Map();
for (const f of files) {
  const dot = f.lastIndexOf('.');
  if (dot > 0) {
    const base = f.slice(0, dot);
    if (!nameMap.has(base)) nameMap.set(base, f);
  }
}

// 3. 用 HEAD 的原始路径 + 实际文件名扩展，重新构造 photos 数组
let fixed = 0;
let missing = 0;
const missingList = [];

head.spots.forEach(spot => {
  if (!spot.photos) return;
  spot.photos = spot.photos.map(p => {
    // 已经是完整路径（含扩展名）
    if (/\.(jpg|jpeg|png|webp)$/i.test(p)) return p;
    const baseName = p.replace('./data/photos/', '');
    const actual = nameMap.get(baseName);
    if (actual) {
      fixed++;
      return `./data/photos/${actual}`;
    }
    missing++;
    missingList.push(`${spot.name}: ${p}`);
    return p;
  });
});

// 4. 写回 JSON
writeFileSync(
  resolve(cwd, 'data/heritage-spots.json'),
  JSON.stringify(head, null, 2),
  'utf-8'
);

console.log(`Fixed: ${fixed} paths`);
console.log(`Missing: ${missing} paths`);
if (missingList.length > 0) {
  console.log('Missing list:');
  missingList.forEach(m => console.log('  -', m));
}

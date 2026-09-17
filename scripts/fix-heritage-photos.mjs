// 修复 heritage-spots.json 中缺失的图片扩展名
// 把 ./data/photos/1.1 修复为 ./data/photos/1.1.jpg（根据实际文件名）
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();
const photosDir = resolve(cwd, 'data/photos');

// 列出所有文件，建立 "不带扩展名" → "完整文件名" 的映射
const files = readdirSync(photosDir);
const nameMap = new Map();
for (const f of files) {
  // 提取不带扩展名的部分，如 "1.1.jpg" → "1.1"
  const dot = f.lastIndexOf('.');
  if (dot > 0) {
    const base = f.slice(0, dot);
    // 如果有多个同名（如 1.1.jpg 和 1.1.webp），保留第一个
    if (!nameMap.has(base)) nameMap.set(base, f);
  }
}
console.log('Found', nameMap.size, 'unique photo files');

// 读取 JSON
const heritage = JSON.parse(readFileSync(resolve(cwd, 'data/heritage-spots.json'), 'utf-8'));

let fixed = 0;
let missing = 0;
const missingList = [];

heritage.spots.forEach(spot => {
  if (!spot.photos) return;
  spot.photos = spot.photos.map(p => {
    // 已经是完整路径（含扩展名）
    if (/\.(jpg|jpeg|png|webp)$/i.test(p)) return p;
    // 提取文件名部分，如 "./data/photos/1.1" → "1.1"
    const baseName = p.replace('./data/photos/', '');
    const actual = nameMap.get(baseName);
    if (actual) {
      fixed++;
      return `./data/photos/${actual}`;
    }
    missing++;
    missingList.push(`${spot.name}: ${p}`);
    return p; // 保留原路径
  });
});

// 写回 JSON
writeFileSync(
  resolve(cwd, 'data/heritage-spots.json'),
  JSON.stringify(heritage, null, 2),
  'utf-8'
);

console.log(`Fixed: ${fixed} paths`);
console.log(`Missing: ${missing} paths`);
if (missingList.length > 0) {
  console.log('Missing list:');
  missingList.forEach(m => console.log('  -', m));
}

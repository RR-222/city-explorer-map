// 网站图片批量压缩：JPG -> quality 78 + 最长边 1600px；PNG -> 无损重编码
// 用法：node scripts/optimize-images.mjs
// 原图均已提交在 git 中，如需恢复：git checkout -- data/flower-photos data/classic-photos data/photos public/wechat-covers
import sharp from 'sharp';
import { readdir, stat, writeFile as fsWriteFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOTS = ['data/flower-photos', 'data/classic-photos', 'data/photos', 'public/wechat-covers'];
const MAX_DIM = 1600;
const JPG_QUALITY = 78;
const PNG_LEVEL = 9;
const MIN_GAIN = 1024; // 节省不足 1KB 不写回

// 原子写入：先写临时文件再重命名，失败自动重试；绝不破坏原文件
async function atomicWrite(file, buf, tries = 3) {
  const tmp = `${file}.tmp-${process.pid}`;
  for (let i = 1; i <= tries; i++) {
    try {
      await fsWriteFile(tmp, buf);
      await rename(tmp, file);
      return true;
    } catch (e) {
      await rm(tmp, { force: true }).catch(() => {});
      if (i === tries) {
        console.warn('  跳过(写入失败):', file.replace(/\\/g, '/'), '-', e.message);
        return false;
      }
      await new Promise((r) => setTimeout(r, 500 * i));
    }
  }
  return false;
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

let grandBefore = 0;
let grandAfter = 0;
let grandCount = 0;
let grandSkipped = 0;

for (const root of ROOTS) {
  const files = await walk(path.resolve(root));
  if (!files.length) continue;
  let before = 0;
  let after = 0;
  let done = 0;
  let skipped = 0;
  const bigSavings = [];
  for (const f of files) {
    const info = await stat(f);
    before += info.size;
    const isPng = /\.png$/i.test(f);
    const pipeline = sharp(f);
    const meta = await pipeline.metadata();
    const maxDim = Math.max(meta.width || 0, meta.height || 0);
    let buf;
    try {
      if (maxDim > MAX_DIM) {
        buf = await pipeline
          .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
          [isPng ? 'png' : 'jpeg'](isPng ? { compressionLevel: PNG_LEVEL } : { quality: JPG_QUALITY, mozjpeg: true, progressive: true })
          .toBuffer();
      } else {
        buf = await pipeline
          [isPng ? 'png' : 'jpeg'](isPng ? { compressionLevel: PNG_LEVEL } : { quality: JPG_QUALITY, mozjpeg: true, progressive: true })
          .toBuffer();
      }
    } catch (e) {
      console.warn('跳过(处理失败):', f, e.message);
      skipped++;
      after += info.size;
      continue;
    }
    const saved = info.size - buf.length;
    if (saved > MIN_GAIN) {
      const ok = await atomicWrite(f, buf);
      if (ok) {
        after += buf.length;
        done++;
        if (saved > 200 * 1024) {
          bigSavings.push(`  -${(saved / 1024).toFixed(0)}KB  ${f.replace(/\\/g, '/')}`);
        }
      } else {
        skipped++;
        after += info.size;
      }
    } else {
      skipped++;
      after += info.size;
    }
  }
  const pct = before > 0 ? ((1 - after / before) * 100).toFixed(1) : 0;
  console.log(`\n[${root}] ${files.length} 个文件 -> 压缩 ${done} 个 / 跳过 ${skipped} 个`);
  console.log(`  体积: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB (-${pct}%)`);
  bigSavings.slice(0, 5).forEach((l) => console.log(l));
  grandBefore += before;
  grandAfter += after;
  grandCount += done;
  grandSkipped += skipped;
}

console.log(`\n===== 总计 =====`);
console.log(`压缩 ${grandCount} 个 / 跳过 ${grandSkipped} 个`);
console.log(`体积: ${(grandBefore / 1048576).toFixed(1)}MB -> ${(grandAfter / 1048576).toFixed(1)}MB (-${((1 - grandAfter / grandBefore) * 100).toFixed(1)}%)`);

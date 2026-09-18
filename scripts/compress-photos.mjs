// 批量压缩图片：缩小到最大 1200px 宽，降低质量到 78
// 保持原文件名和格式，不破坏 JSON 引用路径
import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs';
import { join, extname } from 'path';

const DIRS = [
  'data/store-photos',
  'data/photos',
  'data/flower-photos',
];

const MAX_WIDTH = 1200;
const QUALITY = 78;

async function processDir(dir) {
  const files = readdirSync(dir, { recursive: true })
    .filter(f => {
      const ext = extname(f).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.png';
    });

  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const f of files) {
    const fullPath = join(dir, f);
    const stat = statSync(fullPath);
    totalBefore += stat.size;

    const ext = extname(f).toLowerCase();
    try {
      const inputBuf = readFileSync(fullPath);
      const img = sharp(inputBuf, { failOnError: false });
      const meta = await img.metadata();

      let pipeline = img;
      if (meta.width > MAX_WIDTH) {
        pipeline = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }

      let outBuf;
      if (ext === '.webp') {
        outBuf = await pipeline.webp({ quality: QUALITY }).toBuffer();
      } else if (ext === '.png') {
        outBuf = await pipeline.png({ quality: QUALITY, compressionLevel: 9 }).toBuffer();
      } else {
        outBuf = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
      }

      writeFileSync(fullPath, outBuf);
      totalAfter += outBuf.length;
      count++;
    } catch (e) {
      console.error(`SKIP: ${f} (${e.message})`);
      totalAfter += stat.size;
    }
  }

  const saved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`${dir}: ${count} files, ${Math.round(totalBefore/1024/1024)}MB -> ${Math.round(totalAfter/1024/1024)}MB (saved ${saved}%)`);
}

for (const dir of DIRS) {
  await processDir(dir);
}
console.log('Done!');

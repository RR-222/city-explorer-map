import { readFileSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { resolve, basename } from 'path';

const cwd = process.cwd();

// 读取环境变量
const envText = readFileSync(resolve(cwd, '.env.local'), 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const m = line.match(/^(\w+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 读取 heritage-spots.json
const heritage = JSON.parse(readFileSync(resolve(cwd, 'data/heritage-spots.json'), 'utf-8'));

// 收集所有照片路径
const allPhotos = [];
heritage.spots.forEach(spot => {
  (spot.photos || []).forEach(photo => {
    const localPath = photo.replace('./', '');
    const fullPath = resolve(cwd, localPath);
    if (existsSync(fullPath)) {
      allPhotos.push({ spot: spot.name, localPath, fullPath, fileName: basename(fullPath) });
    } else {
      console.log('SKIP (not found):', photo);
    }
  });
});

console.log(`Found ${allPhotos.length} photos to upload`);

// 上传到 spots-photos bucket
let uploaded = 0;
let failed = 0;

for (const photo of allPhotos) {
  const fileBuffer = readFileSync(photo.fullPath);
  const ext = photo.fileName.split('.').pop();
  const uploadName = `${photo.fileName}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('spots-photos')
    .upload(uploadName, fileBuffer, {
      contentType: ext === 'webp' ? 'image/webp' : `image/${ext}`,
      upsert: false,
    });

  if (error) {
    if (error.message.includes('already')) {
      console.log(`SKIP (exists): ${photo.fileName}`);
      uploaded++;
    } else {
      console.error(`FAIL: ${photo.fileName} - ${error.message}`);
      failed++;
    }
  } else {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/spots-photos/${uploadName}`;
    console.log(`OK [${++uploaded}]: ${photo.fileName} → ${publicUrl.substring(0, 80)}...`);
  }

  // 300ms 延迟避免限流
  await new Promise(r => setTimeout(r, 300));
}

console.log(`\nDone: ${uploaded} uploaded, ${failed} failed`);

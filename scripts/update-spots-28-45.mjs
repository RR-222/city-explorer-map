// 批量更新 spots 28-45 的 photos，spots 28-44 的 source_url
import fs from 'node:fs';

const file = 'data/spots-seed.json';
const spots = JSON.parse(fs.readFileSync(file, 'utf-8').replace(/^\uFEFF/, ''));

// 17 个 source_url（对应 spots 28-44，索引 27-43）
const sourceUrls = [
  'https://www.xiaohongshu.com/explore/69dcf709000000002200fe06?xsec_token=ABMYyUKYzT_i8f4zpDvKzTb6FO-ZalmghDDnk2E4oqHMg=&xsec_source=pc_search&source=web_user_page',
  'https://www.xiaohongshu.com/explore/69cb5cff0000000023022758?xsec_token=ABnCcqa3KCMURUtyCYojwCZkPUk3cCxbOGnVG7abXKIt0=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69c24e0d000000002100552b?xsec_token=ABKIhBRyoQoh6_bmPBtBCPUOwSPT3djRRN-7Tf57bgdWY=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69ca36b2000000002200f0d1?xsec_token=ABWPKEsHxwurHiD33TeP1JxgMMWFXhua9GF6F1T32HR7I=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69bbdc670000000021007a88?xsec_token=AB2dfkp8s77oEfVDuRJUADXiiGcB4mZu6rTp2K_UBiZoE=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69ba75310000000023022ebc?xsec_token=AB_n1I1fVjt-3obvwX1PU1xk7iZHNJHuPl2G_YPPAOcbo=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69b8dc00000000001d01e9b6?xsec_token=ABqP0PUqvYuiB-6S59YfwdansyUGKC7ZXavvM7YgPZhuk=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69b13f1c000000002603ffce?xsec_token=ABGJMw-3O4U4h0KRxm1xWz0CSLq5mF8igG81hFUKB73_s=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69aec1fe00000000220201dd?xsec_token=ABkeWAjPUF1rAfZPfH9S-wh4pn5woRODQGXPrCsIIyQHk=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69a12ec2000000002603e3a8?xsec_token=ABkaw1SDsBGikPhAOPl4xltnO7GKlPTir_csCiOjPhAfI=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/699e66c5000000002603dadf?xsec_token=ABhDXpHcF88Mu2tvaMjQ7KsY5abkjW2YC-QSzHHV5i8s0=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/698c3239000000000a02e6fd?xsec_token=ABo4p2mSl-pMGQ7sTNVkZOxGEUEpvYLyHII7odhjZS0zg=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/698d705e000000000903b310?xsec_token=ABlwgoSX-tPgxc592ooeYy4T5HftruiQbXCW3XINHQ0ec=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/699584f1000000000a02f850?xsec_token=ABoIMxJ9W4LJU5Lwh7Q6wbJ_yiIeughICPPJbRRpuUOLI=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/699a8b4a000000000a03d4bf?xsec_token=ABQbPCkL2K8tI8NlZtZBbA8yDDv0zdGo8NcZQHvuyU0HI=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/69ae966a0000000023038f17?xsec_token=ABkeWAjPUF1rAfZPfH9S-wh8X9tFQJxOVevblYUkH9KZU=&xsec_source=pc_search',
  'https://www.xiaohongshu.com/explore/698184e6000000000a03d75e?xsec_token=ABqxo7Dgdlg4C7YhtVAi6QO0Cof_l0t5p1P5mjMhAoAPg=&xsec_source=pc_search',
];

// 照片映射：spot index (0-based) -> 文件名数组
// spots 28-45 → 索引 27-44
const photoMap = {
  27: ['28.jpg'],
  28: ['29.1.jpg', '29.2.jpg'],
  29: ['30.1.jpg', '30.2.jpg'],
  30: ['31.1.jpg', '31.2.jpg'],
  31: ['32.1.jpg', '32.2.jpg'],
  32: ['33.1.jpg', '33.2.jpg'],
  33: ['34.1.jpg', '34.2.jpg'],
  34: ['35.jpg'],
  35: ['36.1.jpg', '36.2.jpg'],
  36: ['37.1.jpg', '37.2.jpg'],
  37: ['38.1.jpg', '38.2.jpg'],
  38: ['39.1.jpg', '39.2.jpg'],
  39: ['40.1.jpg', '40.2.jpg'],
  40: ['41.1.jpg', '41.2.jpg'],
  41: ['42.1.jpg', '42.2.jpg'],
  42: ['43.1.jpg', '43.2.jpg'],
  43: ['44.1.jpg', '44.2.jpg'],
  44: ['45.1.jpg', '45.2.jpg'],  // spot 45 有图但无 URL
};

let updated = 0;
for (const [idxStr, photos] of Object.entries(photoMap)) {
  const idx = parseInt(idxStr, 10);
  const spot = spots[idx];
  if (!spot) continue;
  spot.photos = photos.map((f) => `./data/photos/${f}`);
  // spot 28-44 (idx 27-43) 有 source_url，spot 45 (idx 44) 没有
  if (idx <= 43) {
    spot.source_url = sourceUrls[idx - 27];
  }
  updated++;
}

fs.writeFileSync(file, JSON.stringify(spots, null, 2), 'utf-8');
console.log(`已更新 ${updated} 个景点（索引 27-44，即第 28-45 个）`);
console.log(`其中 ${sourceUrls.length} 个有 source_url，spot 45 仅图片无 URL`);

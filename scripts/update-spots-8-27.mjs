// 批量更新 spots 8-27 的 photos 和 source_url
import fs from 'node:fs';

const file = 'data/spots-seed.json';
const raw = fs.readFileSync(file, 'utf-8').replace(/^\uFEFF/, '');
const spots = JSON.parse(raw);

// 20 个 source_url（对应 spots 8-27，索引 7-26）
const sourceUrls = [
  'https://www.xiaohongshu.com/explore/6a6984cf000000000f0311d6?xsec_token=ABxCv9f2ro2FNDET3q7MaAs1DK9AjZHTRFxQe42UUPU7o=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a6b2a71000000002c004ac0?xsec_token=ABKY1VY2FNes334Tbn-EBsWyruwSMQsDisoSC-wc6LKpg=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a60b132000000000f01f716?xsec_token=ABtqQgOf6Za5HrdicKSuhqIsTqghAvX72-ViyxDLds0jE=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a549438000000001102f806?xsec_token=ABAK38NGW4sZxPuvkVZ4RuWRZp7Z2xA817KGESHoesCV4=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a4caa06000000000f0066dc?xsec_token=AB-acjZu6hfrYvJxNIUAQMGTz5uxjKhE_HukUEVhNAcQM=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a4f7de0000000000f01e535?xsec_token=ABtchr2qyteJEH1ZQ1WWHWJXzKNjzII4acB8Sl0bhBg8A=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a4fad1a000000000f033ad1?xsec_token=ABtchr2qyteJEH1ZQ1WWHWJRZPIw1Gbc2a5-Pmb1JABrE=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a44af9300000000110117b5?xsec_token=ABT9QjVj8na5hTCP8WcSlWjP355gsDARpgx7NUD1hxjmg=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a1f81580000000022028aa8?xsec_token=ABCesYgFvSSk2JSdY6ZINSNd0y7ObcvoiCISm9BMOJJio=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a1530910000000036001c96?xsec_token=ABx7f1kWbSxXOdilTt2jwk36qDkPmtBD0QPpl-buJj84c=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a16c5670000000035025eab?xsec_token=ABU1Gi-ND4kBGjiwWBLALhbf4JOwd87NDq7qGLKGgI1UU=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a0ea176000000003502fcc6?xsec_token=ABaStjBHazgxI4esD8Uy4j9385qqapxkn-VPA-SNQRmkI=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a02e829000000003502adba?xsec_token=ABwiVgYo9DYH2zpWgEl5Wyadq77oITj42AhKLvR3s_rLg=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/6a0587070000000036001e0f?xsec_token=AB3lynxmweVzpMpznEDk-5kpK_L3Wzqj8XbLwdGpQeWmU=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/69fc4c130000000035021b6e?xsec_token=AB-S8lGchXxtWrKQmoBpsmSyM-jRTijy7G1evZcKOehKU=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/69fde82e0000000035025f0a?xsec_token=AByG9CFlvlWNfsznURImrVZxzTu4Zem1YKqPsk7_Ny0-0=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/69ddc30f00000000210044a1?xsec_token=ABjOkItNGUMwsIGNJANHBqy91u1xfoCKQy0Ox1BeukDPw=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/69e9c83f0000000013030803?xsec_token=ABrsL83qwDlhDUE-HUrAAdd8UQq0LQhfrGMm40mTi7ubI=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/69e71472000000001d019fc8?xsec_token=AB_DZyYdYX6JNri0d-Qy9Uhy4j9aeBvXqgxNiVSv3WRzM=&xsec_source=pc_feed',
  'https://www.xiaohongshu.com/explore/69d5efc80000000023022152?xsec_token=ABHXsqsO8mKAykXeS0qU_wEjzDG2P5Ix9Iuf0THWTHZls=&xsec_source=pc_feed',
];

// 照片映射：spot index (0-based) -> 文件名数组
const photoMap = {
  7: ['8.jpg'],
  8: ['9.1.jpg', '9.2.jpg'],
  9: ['10.1.jpg', '10.2.jpg'],
  10: ['11.1.jpg', '11.2.jpg'],
  11: ['12.1.jpg', '12.2.jpg'],
  12: ['13.1.jpg', '13.2.jpg'],
  13: ['14.png'],
  14: ['15.jpg'],
  15: ['16.1.jpg', '16.2.jpg'],
  16: ['17.1.jpg', '17.2.jpg'],
  17: ['18.1.jpg', '18.2.jpg'],
  18: ['19.1.jpg', '19.2.jpg'],
  19: ['20.1.jpg', '20.2.jpg'],
  20: ['21.1.jpg', '21.2.jpg'],
  21: ['22.1.jpg'],
  22: ['23.1.jpg', '23.2.jpg'],
  23: ['24.1.jpg', '24.2.jpg'],
  24: ['25.jpg'],
  25: ['26.1.jpg', '26.2.jpg'],
  26: ['27.1.jpg', '27.2.jpg'],
};

let updated = 0;
for (const [idxStr, photos] of Object.entries(photoMap)) {
  const idx = parseInt(idxStr, 10);
  const spot = spots[idx];
  if (!spot) continue;
  spot.photos = photos.map((f) => `./data/photos/${f}`);
  spot.source_url = sourceUrls[idx - 7];
  updated++;
}

fs.writeFileSync(file, JSON.stringify(spots, null, 2), 'utf-8');
console.log(`已更新 ${updated} 个景点（索引 7-26，即第 8-27 个）`);

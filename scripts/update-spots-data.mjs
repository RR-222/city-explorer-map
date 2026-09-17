// 第1步：数据更新
// 1. 修正4个时令景观URL
// 2. 把宝山永福庵从heritage移到flower
// 3. 给heritage的15个新景点补充source_url
// 4. 新增音宇宙 LIVERSE 剧场
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const hFile = resolve(process.cwd(), 'data/heritage-spots.json');
const fFile = resolve(process.cwd(), 'data/flower-spots.json');
const h = JSON.parse(readFileSync(hFile, 'utf-8'));
const f = JSON.parse(readFileSync(fFile, 'utf-8'));

// === 1. 修正4个时令景观URL ===
const flowerUrls = {
  '交大徐汇校区樱花': 'https://www.xiaohongshu.com/explore/67daafca0000000003029f80?xsec_token=ABVFIyLcJp77Dwv1o8K-CwlcFx1vb7bVuZNhT-LVLPCYM=&xsec_source=pc_search',
  '上理工秋景': 'https://www.xiaohongshu.com/explore/67cd1720000000000900df43?xsec_token=AB18S2LpR9dvbmElul_5KtaxRm7V_d66-pq5o86iI1MzI=&xsec_source=pc_search',
  '上外松江校区秋景': 'https://www.xiaohongshu.com/explore/67c3a3fb000000000e005a33?xsec_token=ABfI97Yy_CegJDX92fNGpqcoo0Z5OC7jGZ5cEvbA_NYMo=&xsec_source=pc_search',
  '松江袜子弄悬铃木大道': 'https://www.xiaohongshu.com/explore/673f25400000000002039643?xsec_token=ABaCNW4Z0e6lDlhbyUEyONmV6Ea8jaH-wil-8CbwVPQdw=&xsec_source=pc_search',
};
f.spots.forEach(s => {
  if (flowerUrls[s.name]) s.source_url = flowerUrls[s.name];
});

// === 2. 把宝山永福庵从heritage移到flower ===
const yongfuIdx = h.spots.findIndex(s => s.name === '宝山永福庵');
if (yongfuIdx >= 0) {
  const yongfu = h.spots.splice(yongfuIdx, 1)[0];
  // 添加到flower spots
  f.spots.push({
    id: '宝山永福庵',
    name: '宝山永福庵',
    district: '宝山区',
    address: '上海市宝山区（地址待核验）',
    intro: '宝山郊野的佛教庵堂，2-3月红梅盛放时为最佳拍摄时机，古建筑与红梅相映，兼具人文建筑与时令花景的双重价值。',
    source_url: 'https://www.xiaohongshu.com/explore/6948faf7000000000d03edf0?xsec_token=AB81Wny_2EoI2_rkD8_Nq3WRJvBiiUaou5bMusBgCSWLQ=&xsec_source=pc_search',
    flowers: ['梅花'],
    photos: yongfu.photos || [],
  });
  console.log('Moved 宝山永福庵 from heritage to flower');
}

// === 3. 给heritage的15个新景点补充source_url ===
const heritageUrls = {
  '汇丰银行大楼（现浦发银行）': 'https://www.xiaohongshu.com/explore/6aa260ee000000002900da6a?xsec_token=ABHYy9zc42ikCJ3uELzM5SO1XzZn4wlmG1rPdFzPfnpTg=&xsec_source=pc_search',
  '张朴桥天主堂': 'https://www.xiaohongshu.com/explore/6aa0a64300000000250369b7?xsec_token=ABUxtOoNaukd_moxDPjRIdgjVwoEhsYJpvCeILufWAukc=&xsec_source=pc_search',
  '七宝天主堂': 'https://www.xiaohongshu.com/explore/6a9b81b7000000002502f968?xsec_token=ABr5_muJ_Lj0neWnqm3IXVqkEQVe2R1TjpyrqxyMzwcyc=&xsec_source=pc_search',
  '佘山天主教堂': 'https://www.xiaohongshu.com/explore/6a9a42cc0000000011036390?xsec_token=ABGkIZple-6LgJfrNJ_eKp71KOIn0u5jUJnYIRdu1L1Ng=&xsec_source=pc_search',
  '东林寺': 'https://www.xiaohongshu.com/explore/6a9017cf0000000020033dd5?xsec_token=ABpqV2mWDS94aNbSZjfi87Cz3f298KC7xUx9xd6XrVBN8=&xsec_source=pc_search',
  '真如寺': 'https://www.xiaohongshu.com/explore/6a274c9000000000160276bd?xsec_token=ABb-G8BuPf1vFzz-M5qIxZKhU7aBDxB8KjgA37OKZG7T8=&xsec_source=pc_search',
  '和平饭店': 'https://www.xiaohongshu.com/explore/6a225daf00000000360310ff?xsec_token=ABUAMT9VXvVV8z-T-UeBmlzET4-TfE6tZMZbes-A2UoyNM=&xsec_source=pc_search',
  '外滩华尔道夫': 'https://www.xiaohongshu.com/explore/6a1fbd71000000003603063e?xsec_token=ABCesYgFvSSk2JSdY6ZINSNXVSuJiQSazDmsxw29F7LPU=&xsec_source=pc_search',
  '上海交响音乐博物馆': 'https://www.xiaohongshu.com/explore/6a1e356c000000003802199f?xsec_token=ABqfSrgK8l_Ds7nAWGSbj84QsifUslMEepVYQPfdStfx4=&xsec_source=pc_search',
  '泗泾舣园': 'https://www.xiaohongshu.com/explore/6a0fa2ff000000003700e641?xsec_token=ABVbMdrX4vrzf8e2Kq87xUUcGnKjT1CECGpLlR9UPT0qk=&xsec_source=pc_search',
  '言子书院': 'https://www.xiaohongshu.com/explore/69d7082a000000001a0311fe?xsec_token=ABnlptH4BY8MC8xD4rpL_Vg5S-A9BDgOeU_S0-D3-PZ3Y=&xsec_source=pc_search',
  '张江科学会堂': 'https://www.xiaohongshu.com/explore/696c2f12000000002102a8eb?xsec_token=AB7Hm77cfN7x3a3zn26FoL5kVPHQn5JsXnonGRu6LNUmo=&xsec_source=pc_search',
  '天马射电望远镜': 'https://www.xiaohongshu.com/explore/696ad197000000002102916e?xsec_token=ABG6fmbB8tFrlbjrWAiQK-B9sZINj2LtzLh5aZefcirds=&xsec_source=pc_search',
  '前滩四方城莫比乌斯环': 'https://www.xiaohongshu.com/explore/695f86530000000022008d75?xsec_token=ABO-0qjh9jLZtk4QWvDx6asUVcbLlW5tX9CgP-XtOLpf4=&xsec_source=pc_search',
};
h.spots.forEach(s => {
  if (heritageUrls[s.name]) s.source_url = heritageUrls[s.name];
});

// === 4. 新增音宇宙 LIVERSE 剧场 ===
const newSpot = {
  name: '音宇宙 LIVERSE 剧场',
  address: '上海市徐汇区漕宝路261号鑫耀·光环Live',
  description: '由隈研吾设计的飘带剧场，以音宇宙（LIVERSE）为概念，将声学、光影与建筑融为一体。飘带造型屋顶与清水混凝土体量构成独特空间，是徐汇新晋的文化地标与建筑摄影机位。',
  district: '徐汇区',
  lat: 31.17472,
  lng: 121.41361,
  photos: [],
  seasons: '全年',
  tags: ['新建筑', '文艺', '地标'],
  source_url: 'https://www.xiaohongshu.com/explore/6863314e0000000013012422?xsec_token=AB5hLelb_mSFIx2JnjdzGFlH_RO2Si6O5qaJD8G-1AecM=&xsec_source=pc_search',
  closedDays: [],
  seasonal: [],
};
h.spots.push(newSpot);

writeFileSync(hFile, JSON.stringify(h, null, 2), 'utf-8');
writeFileSync(fFile, JSON.stringify(f, null, 2), 'utf-8');

console.log('=== Done ===');
console.log('Heritage spots:', h.spots.length, '(removed 永福庵, added 音宇宙)');
console.log('Flower spots:', f.spots.length, '(added 永福庵)');
console.log('URL fixed for 4 flower spots');
console.log('URL added for', Object.keys(heritageUrls).length, 'heritage spots');

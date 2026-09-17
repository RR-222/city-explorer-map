import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();

// 读取三个 JSON 文件
const heritage = JSON.parse(readFileSync(resolve(cwd, 'data/heritage-spots.json'), 'utf-8'));
const flowers = JSON.parse(readFileSync(resolve(cwd, 'data/flower-spots.json'), 'utf-8'));
const stores = JSON.parse(readFileSync(resolve(cwd, 'data/stores-seed.json'), 'utf-8'));

// 列出 store-photos 文件
const storePhotoFiles = readdirSync(resolve(cwd, 'data/store-photos'));
console.log('Store photos found:', storePhotoFiles.length);

// Heritage spots 1-15 的更新数据
const heritageUpdates = [
  { name: '汇丰银行大楼（现浦发银行）', address: '上海市黄浦区中山东一路12号', source_url: 'https://www.xiaohongshu.com/explore/6aa260ee000000002900da6a?xsec_token=ABHYy9zc42ikCJ3uELzM5SO1XzZn4wlmG1rPdFzPfnpTg=&xsec_source=pc_search' },
  { name: '张朴桥天主堂', address: '上海市松江区佘山镇张朴村427号', source_url: 'https://www.xiaohongshu.com/explore/6a9017cf0000000020033dd5?xsec_token=ABpqV2mWDS94aNbSZjfi87Cz3f298KC7xUx9xd6XrVBN8=&xsec_source=pc_search' },
  { name: '七宝天主堂', address: '上海市闵行区七宝南街50号', source_url: 'https://www.xiaohongshu.com/explore/6a274c9000000000160276bd?xsec_token=ABb-G8BuPf1vFzz-M5qIxZKhU7aBDxB8KjgA37OKZG7T8=&xsec_source=pc_search' },
  { name: '佘山天主教堂', address: '上海市松江区外青松公路9142号', source_url: 'https://www.xiaohongshu.com/explore/696c2f12000000002102a8eb?xsec_token=AB7Hm77cfN7x3a3zn26FoL5kVPHQn5JsXnonGRu6LNUmo=&xsec_source=pc_search' },
  { name: '东林寺', address: '上海市金山区朱泾镇东林街150号', source_url: 'https://www.xiaohongshu.com/explore/673f25400000000002039643?xsec_token=ABaCNW4Z0e6lDlhbyUEyONmV6Ea8jaH-wil-8CbwVPQdw=&xsec_source=pc_search' },
  { name: '真如寺', address: '上海市普陀区兰溪路399号', source_url: 'https://www.xiaohongshu.com/explore/672e07fb000000001d039bd3?xsec_token=ABuCa9r5FeXiA0hRUoShu9cxukgqGJFWqPHx_5uxnJSyM=&xsec_source=pc_user' },
  { name: '和平饭店', address: '上海市黄浦区南京东路20号', source_url: 'https://www.xiaohongshu.com/explore/68450c43000000000f03295e?xsec_token=ABi7QLotnxgHKryEz5KgI6vMJ9eXhKHvBLmSNi_wMbw8o=&xsec_source=pc_search' },
  { name: '外滩华尔道夫', address: '上海市黄浦区中山东一路2号', source_url: 'https://www.xiaohongshu.com/explore/68411ad2000000000303d4d7?xsec_token=ABezuMNr3piIJ5WLfvXxeFWBVdfgBx1CZumN89Uh60P2E=&xsec_source=pc_search' },
  { name: '上海交响音乐博物馆', address: '上海市徐汇区宝庆路3号', source_url: 'https://www.xiaohongshu.com/explore/68234d9a000000000f03b4fe?xsec_token=ABYmxw0NG_mwHTwpD_r70oOvEIvTRe0oVzsKudfoWhMDk=&xsec_source=pc_search' },
  { name: '泗泾舣园', address: '上海市松江区开江中路333号', source_url: 'https://www.xiaohongshu.com/explore/6a1fbd71000000003603063e?xsec_token=ABCesYgFvSSk2JSdY6ZINSNXVSuJiQSazDmsxw29F7LPU=&xsec_source=pc_search' },
  { name: '言子书院', address: '上海市奉贤区望园路600弄97号', source_url: 'https://www.xiaohongshu.com/explore/695f86530000000022008d75?xsec_token=ABO-0qjh9jLZtk4QWvDx6asUVcbLlW5tX9CgP-XtOLpf4=&xsec_source=pc_search' },
  { name: '张江科学会堂', address: '上海市浦东新区海科路1393号', source_url: 'https://www.xiaohongshu.com/explore/6937f5b3000000000d03429f?xsec_token=ABu-tufnyiXUwsygIVfF7KFAXtJI1LLjQk56isgT4xCP8=&xsec_source=pc_user' },
  { name: '天马射电望远镜', address: '上海市松江区九江公路1365号', source_url: 'https://www.xiaohongshu.com/explore/696ad197000000002102916e?xsec_token=ABG6fmbB8tFrlbjrWAiQK-B9sZINj2LtzLh5aZefcirds=&xsec_source=pc_search' },
  { name: '前滩四方城莫比乌斯环', address: '上海市浦东新区前滩四方城3F', source_url: 'https://www.xiaohongshu.com/explore/68c37f91000000001d01c300?xsec_token=ABc3eJL8xhfTwLs3HowDdC62bdCxbPO7fJXFsfmCgghpg=&xsec_source=pc_search' },
  { name: '音宇宙 LIVERSE 剧场', address: '上海市徐汇区漕宝路261号鑫耀·光环Live', source_url: 'https://www.xiaohongshu.com/explore/6863314e0000000013012422?xsec_token=AB5hLelb_mSFIx2JnjdzGFlH_RO2Si6O5qaJD8G-1AecM=&xsec_source=pc_search' },
];

// 更新 heritage spots
let hUpdated = 0;
heritageUpdates.forEach(u => {
  const spot = heritage.spots.find(s => s.name === u.name || s.name.includes(u.name) || u.name.includes(s.name));
  if (spot) {
    spot.address = u.address;
    spot.source_url = u.source_url;
    hUpdated++;
  } else {
    console.log('Heritage not found:', u.name);
  }
});
writeFileSync(resolve(cwd, 'data/heritage-spots.json'), JSON.stringify(heritage, null, 2), 'utf-8');
console.log('Heritage updated:', hUpdated, '/', heritageUpdates.length);

// Flower spots 25-29 的更新数据
const flowerUpdates = [
  { name: '交大徐汇校区樱花', address: '上海市徐汇区华山路1954号上海交通大学徐汇校区', source_url: 'https://www.xiaohongshu.com/explore/67daafca0000000003029f80?xsec_token=ABVFIyLcJp77Dwv1o8K-CwlcFx1vb7bVuZNhT-LVLPCYM=&xsec_source=pc_search' },
  { name: '上海理工大学秋景', address: '上海市杨浦区军工路516号上海理工大学', source_url: 'https://www.xiaohongshu.com/explore/690bf00d000000000303554e?xsec_token=ABhP8sj5-xgLwHqKA8NlR4fb_khFXiaMDLasLhyFtOWFM=&xsec_source=pc_search' },
  { name: '上外松江校区秋景', address: '上海市松江区文翔路1550号上海外国语大学', source_url: 'https://www.xiaohongshu.com/explore/691bb708000000000d03b6a8?xsec_token=ABZAU4j4fCVsv2PRRatmE9tZ7dSU_hj5EBevZvAkpl0Dg=&xsec_source=pc_search' },
  { name: '松江袜子弄悬铃木大道', address: '上海市松江区袜子弄32号袜子新弄园区', source_url: 'https://www.xiaohongshu.com/explore/6940b24d000000000d0358ed?xsec_token=AB8xp6Uk89556YEPQtKnT1Eqjh13BHdlmY9jsWocU6FDE=&xsec_source=pc_search' },
  { name: '宝山永福庵', address: '上海市宝山区南陈路351弄2号（上海大学东门对面）', source_url: 'https://www.xiaohongshu.com/explore/67c3a3fb000000000e005a33?xsec_token=ABAhYyXKmjIQ65gfw4Qh19vVXz98sZMmn-VDIpT8nevMQ=&xsec_source=pc_search&source=web_search_result_notes' },
];

// 更新 flower spots
let fUpdated = 0;
flowerUpdates.forEach(u => {
  const spot = flowers.spots.find(s => s.name === u.name || s.name.includes(u.name) || u.name.includes(s.name));
  if (spot) {
    spot.address = u.address;
    spot.source_url = u.source_url;
    fUpdated++;
  } else {
    console.log('Flower not found:', u.name);
  }
});
writeFileSync(resolve(cwd, 'data/flower-spots.json'), JSON.stringify(flowers, null, 2), 'utf-8');
console.log('Flowers updated:', fUpdated, '/', flowerUpdates.length);

// Store spots 16-25 的更新数据
const storeUpdates = [
  { name: '上海中欧街', address: '上海市闵行区浦星公路567号', source_url: 'https://www.xiaohongshu.com/explore/6aa260ee000000002900da6a?xsec_token=ABHYy9zc42ikCJ3uELzM5SO1XzZn4wlmG1rPdFzPfnpTg=&xsec_source=pc_search' },
  { name: '星期天公园', address: '上海市长宁区延安西路1221号', source_url: 'https://www.xiaohongshu.com/explore/6a9b81b7000000002502f968?xsec_token=ABr5_muJ_Lj0neWnqm3IXVqkEQVe2R1TjpyrqxyMzwcyc=&xsec_source=pc_search' },
  { name: '茂名北路老洋房街区（Bloom Space）', address: '上海市静安区茂名北路65号', source_url: 'https://www.xiaohongshu.com/explore/6a9a42cc0000000011036390?xsec_token=ABGkIZple-6LgJfrNJ_eKp71KOIn0u5jUJnYIRdu1L1Ng=&xsec_source=pc_search' },
  { name: '森林书屋', address: '上海市青浦区朱家角薛间村', source_url: 'https://www.xiaohongshu.com/explore/6a225daf00000000360310ff?xsec_token=ABUAMT9VXvVV8z-T-UeBmlzET4-TfE6tZMZbes-A2UoyNM=&xsec_source=pc_search' },
  { name: '宝山田园咖啡店', address: '上海市宝山区（地址待核验）', source_url: 'https://www.xiaohongshu.com/explore/6a1e356c000000003802199f?xsec_token=ABqfSrgK8l_Ds7nAWGSbj84QsifUslMEepVYQPfdStfx4=&xsec_source=pc_search' },
  { name: '阿特麦文化创意产业园', address: '上海市青浦区老朱枫公路6186弄39号', source_url: 'https://www.xiaohongshu.com/explore/6a0fa2ff000000003700e641?xsec_token=ABVbMdrX4vrzf8e2Kq87xUUcGnKjT1CECGpLlR9UPT0qk=&xsec_source=pc_search' },
  { name: '得丘礼享谷', address: '上海市闵行区申富路788号', source_url: 'https://www.xiaohongshu.com/explore/69d7082a000000001a0311fe?xsec_token=ABnlptH4BY8MC8xD4rpL_Vg5S-A9BDgOeU_S0-D3-PZ3Y=&xsec_source=pc_search' },
  { name: '梦谷南（美式复古街区）', address: '上海市闵行区曲吴路589号', source_url: 'https://www.xiaohongshu.com/explore/6948faf7000000000d03edf0?xsec_token=AB81Wny_2EoI2_rkD8_Nq3WRJvBiiUaou5bMusBgCSWLQ=&xsec_source=pc_search' },
  { name: '梅州路 ins 风建筑', address: '上海市闵行区梅州路507号', source_url: 'https://www.xiaohongshu.com/explore/68b9739e000000001d0399da?xsec_token=ABGFc-5A-JCr_fbhXeAiASMeiLTlpmAShinVyD2PcDOak=&xsec_source=pc_search' },
  { name: '奉浦四季生态园英格兰园', address: '上海市奉贤区韩谊路515号', source_url: 'https://www.xiaohongshu.com/explore/67cd1720000000000900df43?xsec_token=AB18S2LpR9dvbmElul_5KtaxRm7V_d66-pq5o86iI1MzI=&xsec_source=pc_search' },
];

// 更新 store spots + 设置照片路径
let sUpdated = 0;
storeUpdates.forEach(u => {
  const spot = stores.find(s => s.name === u.name || s.name.includes(u.name) || u.name.includes(s.name));
  if (spot) {
    spot.address = u.address;
    spot.source_url = u.source_url;

    // 查找对应的 store-photos 文件
    const baseName = spot.name.replace(/\s+/g, '');
    const photos = storePhotoFiles
      .filter(f => {
        // 去掉后缀和空格后匹配
        const fn = f.replace(/\s+/g, '').replace(/\.\w+$/, '').replace(/\(\d+\)/g, '');
        return fn === baseName.replace(/\s+/g, '') || f.startsWith(spot.name);
      })
      .sort() // 按字母排序：无后缀在前，(2) 和 (3) 在后
      .map(f => `./data/store-photos/${f}`);

    if (photos.length > 0) {
      spot.photos = photos;
    }
    sUpdated++;
  } else {
    console.log('Store not found:', u.name);
  }
});

writeFileSync(resolve(cwd, 'data/stores-seed.json'), JSON.stringify(stores, null, 2), 'utf-8');
console.log('Stores updated:', sUpdated, '/', storeUpdates.length);

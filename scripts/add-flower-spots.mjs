// 添加 4 个时令景观到 flower-spots.json
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const file = resolve(process.cwd(), 'data/flower-spots.json');
const data = JSON.parse(readFileSync(file, 'utf-8'));

const newSpots = [
  {
    id: '交大徐汇校区樱花',
    name: '交大徐汇校区樱花',
    district: '徐汇区',
    address: '上海市徐汇区华山路1954号上海交通大学徐汇校区',
    intro: '上海交通大学徐汇校区的樱花，3-4月盛开时新老建筑与樱花相映，红砖墙与粉白花瓣构成独特的校园春景，是徐汇区樱花经典机位之一。',
    source_url: 'https://www.xiaohongshu.com/explore/67daafca0000000003029f80?xsec_token=ABVFIyLcJp77Dwv1o8K-CwlXYhOKN62ihEoBrLhws9Gdk=&xsec_source=pc_user',
    flowers: ['樱花'],
    photos: [
      './data/flower-photos/樱花/交大徐汇校区樱花.webp',
      './data/flower-photos/樱花/交大徐汇校区樱花 (3).webp',
    ],
  },
  {
    id: '上理工秋景',
    name: '上理工秋景',
    district: '杨浦区',
    address: '上海市杨浦区军工路516号上海理工大学',
    intro: '上海理工大学军工路校区，10-11月银杏与梧桐黄叶交相辉映，校园内的历史建筑与秋色构成沪上知名的秋景打卡地，是杨浦区秋色代表机位之一。',
    source_url: 'https://www.xiaohongshu.com/explore/690bf00d000000000303554e?xsec_token=ABhP8sj5-xgLwHqKA8NlR4ff3R8B_FFQ_fnNrpQu-7MKI=&xsec_source=pc_user',
    flowers: ['银杏', '梧桐'],
    photos: [
      './data/flower-photos/银杏/上海理工大学秋景.webp',
      './data/flower-photos/银杏/上海理工大学秋景 (2).webp',
      './data/flower-photos/银杏/上海理工大学秋景 (3).webp',
    ],
  },
  {
    id: '上外松江校区秋景',
    name: '上外松江校区秋景',
    district: '松江区',
    address: '上海市松江区文翔路1550号上海外国语大学松江校区',
    intro: '上海外国语大学松江校区的秋景，10-11月银杏金黄，与校园内欧式建筑相映，被誉为"上海最美校园秋色"之一，是松江大学城经典秋景机位。',
    source_url: 'https://www.xiaohongshu.com/explore/691bb708000000000d03b6a8?xsec_token=ABZAU4j4fCVsv2PRRatmE9tcgW1Wc0Nzjmr0swa2FrPnU=&xsec_source=pc_user',
    flowers: ['银杏'],
    photos: [
      './data/flower-photos/银杏/上外松江校区秋景.webp',
      './data/flower-photos/银杏/上外松江校区秋景 (2).webp',
      './data/flower-photos/银杏/上外松江校区秋景 (3).webp',
    ],
  },
  {
    id: '松江袜子弄悬铃木大道',
    name: '松江袜子弄悬铃木大道',
    district: '松江区',
    address: '上海市松江区袜子弄',
    intro: '松江袜子弄的悬铃木（法国梧桐）行道树大道，10-11月秋叶金黄，形成隧道般的秋色长廊，是松江老城最具秋意的街拍机位之一，人少景美。',
    source_url: 'https://www.xiaohongshu.com/explore/6940b24d000000000d0358ed?xsec_token=AB8xp6Uk89556YEPQtKnT1EpkFTt1Ht5V7PQn-CPv777Y=&xsec_source=pc_user',
    flowers: ['梧桐'],
    photos: [
      './data/flower-photos/梧桐/松江袜子弄悬铃木大道.webp',
      './data/flower-photos/梧桐/松江袜子弄悬铃木大道 (3).webp',
    ],
  },
];

data.spots.push(...newSpots);
writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Added ${newSpots.length} spots. Total: ${data.spots.length}`);
newSpots.forEach((s, i) => console.log(`  ${i+1}. ${s.name} (${s.district}) | ${s.photos.length} photos | ${s.flowers.join('/')}`));

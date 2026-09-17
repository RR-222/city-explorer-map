-- 全量导入：人文建筑 + 时令花卉 + 好逛街区
-- 由 fill-supabase-urls.mjs 生成

-- 人文建筑导入
ALTER TABLE spots ADD COLUMN IF NOT EXISTS closed_days text[] DEFAULT '{}';
ALTER TABLE spots ADD COLUMN IF NOT EXISTS seasonal jsonb;

DELETE FROM spots;

INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海音乐学院（淮海路校区）', '历史：前身为1927年由蔡元培与萧友梅创办的国立音乐院，是中国第一所独立建制的高等音乐学府，素有“音乐家的摇篮”之称。
特色：校园内分布6幢优秀历史建筑：淮海中路1131号“音乐城堡”建于1926年，倍高洋行设计，德国文艺复兴风格，曾为比利时领事馆、上音图书馆与贺绿汀办公处；1209号“天赐大宅”建于1912年，法式文艺复兴风格，原为犹太富商住宅。
文化影响：2022年上音拆除围墙，3300平方米上音花园向公众开放，2024年起部分老建筑可预约参观，成为衡复风貌区最具文艺气息的文化地标。', '上海市徐汇区汾阳路20号', 31.21395, 121.45484, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/1.1-1789013278059.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/1.1-1789013278059.jpg']::text[], '全年', ARRAY['老建筑','文艺']::text[], 'https://www.xiaohongshu.com/explore/6a9f70a40000000012035564?xsec_token=ABoKG5IvUI6djiWy_ixdU3c1qzFSa8wH3dXxNVMJn8Rf8=&xsec_source=pc_collect', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":0.51,"months":null},{"flower":"紫藤","spotName":"太原路215弄","distanceKm":0.88,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.91,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海邮政博物馆', '历史：邮政总局大楼1922年12月动工、1924年11月竣工，英籍建筑师思九生（史久生）设计，华商余洪记营造厂承建，是上海近代邮政的标志性建筑。
特色：大楼呈U形平面，立面有19根科林斯巨柱，钟楼塔楼为巴洛克风格，两侧各有一组雕塑——火车头、铁锚与电缆，商神墨丘利与爱神；二层营业大厅1200平方米，有“远东第一大厅”之称。
文化影响：1996年列为全国重点文物保护单位，馆藏大龙邮票、“绿衣红娘”等珍贵邮票，门厅“上海之门”是苏州河畔热门机位。', '上海市虹口区北苏州路272号', 31.24647, 121.48056, '虹口区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/2.1-1789013280050.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/2.1-1789013280050.jpg']::text[], '全年', ARRAY['老建筑','博物馆']::text[], 'https://www.xiaohongshu.com/explore/6a8fb40800000000080135fe?xsec_token=ABtt0ejVwFbZAFchRGc4gmIhP-d2LK7GiOxbd0IT6gXsM=&xsec_source=pc_feed', '{}', '[{"flower":"梅花","spotName":"上海总商会旧址","distanceKm":0.36,"months":null},{"flower":"樱花","spotName":"四川路桥","distanceKm":0.36,"months":null},{"flower":"郁金香","spotName":"外滩","distanceKm":0.54,"months":null},{"flower":"杜鹃","spotName":"外滩老市府露台","distanceKm":0.45,"months":null},{"flower":"泡桐","spotName":"汉口路老市府","distanceKm":0.95,"months":null},{"flower":"樱花/紫藤/绣球","spotName":"苏州河樱花谷驿站","distanceKm":0.36,"months":null},{"flower":"银杏","spotName":"圣三一堂","distanceKm":0.87,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('国泰电影院', '历史：1930年建造、1932年1月1日开业，由鸿达洋行设计，建筑师鸿达是装饰艺术派代表人物。
特色：典型装饰艺术风格，紫酱红泰山石外墙配白浆嵌缝，阶梯状塔楼与放射状线条，CATHAY霓虹招牌是淮海路夜景的经典符号。
文化影响：首映米高梅《灵肉之门》，《申报》誉其“富丽宏壮执上海电影院之牛耳”，鲁迅、张爱玲等曾在此观影；1994年列入上海市优秀历史建筑，2024年修缮焕新回归。', '上海市徐汇区淮海中路870号', 31.217954, 121.461389, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/3-1789013280911.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/6a83ca460000000029033caa?xsec_token=ABGeB8TarIuax46eZ7jWjxci-WQ5h4Plz5qVv2H7k_ieo=&xsec_source=pc_feed', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":0.81,"months":null},{"flower":"蔷薇","spotName":"复兴中路","distanceKm":1.17,"months":null},{"flower":"杜鹃/绣球","spotName":"辅德里公园","distanceKm":0.95,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('淮海坊', '历史：1924年由比利时义品地产公司投资建造，是上海规模较大的新式里弄住宅群。
特色：弄堂格局规整，红砖外墙与统一立面构成典型近代里弄风貌。
文化影响：巴金、许广平、徐悲鸿、傅雷、夏衍等文化名人曾在此居住，弄堂深处走出半部上海现代文化史；现为衡复历史风貌区保护对象。', '上海市徐汇区淮海中路927弄', 31.21778, 121.46111, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/4.1-1789013281706.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/4.1-1789013281706.jpg']::text[], '全年', ARRAY['弄堂','石库门']::text[], 'https://www.xiaohongshu.com/explore/6a86c6940000000032033d62?xsec_token=ABO99XLjqFcxSi3FjFfE-jTuzhkK1aznXx2yAMXlQzzBw=&xsec_source=pc_feed', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":0.79,"months":null},{"flower":"蔷薇","spotName":"复兴中路","distanceKm":1.2,"months":null},{"flower":"杜鹃/绣球","spotName":"辅德里公园","distanceKm":0.97,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('周公馆（中共代表团驻沪办事处旧址）', '历史：建于1920年代的西班牙式花园洋房；1946年6月中共代表团在此设立驻沪办事处，周恩来在此工作居住，对外称“周公馆”。
特色：红瓦陡坡屋顶、外廊式结构，南立面连续券廊，庭院绿树成荫。
文化影响：1946至1947年间是国共谈判期间中共在上海的重要据点；1979年辟为纪念馆，全国重点文物保护单位，思南路红色文化地标。', '上海市黄浦区思南路73号', 31.214213, 121.46854, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/5-1789013282575.jpg']::text[], '全年', ARRAY['老建筑','红色文化']::text[], 'https://www.xiaohongshu.com/explore/6a7442630000000021020e02?xsec_token=ABELs8Uox6vhkYqYEGx8bz_sn1X7oTfZa_fChUymCPDO0=&xsec_source=pc_feed', '{}', '[{"flower":"蔷薇","spotName":"复兴中路","distanceKm":0.74,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海孙中山故居纪念馆', '历史：欧洲乡村式小洋房建于1918年前后，1918年至1924年孙中山与宋庆龄在此居住，是孙中山在上海的寓所。
特色：深灰色卵石外墙配红瓦屋顶，楼下会客厅与餐厅，楼上书房与卧室，家具陈设多为原物。
文化影响：孙中山在此完成《建国方略》等著作，会见李大钊与列宁代表；1961年列为全国重点文物保护单位。', '上海市黄浦区香山路7号', 31.216091, 121.467528, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/6-1789013283231.jpg']::text[], '全年', ARRAY['老建筑','纪念馆']::text[], 'https://www.xiaohongshu.com/explore/6a7ad3650000000025000665?xsec_token=ABf3tfAHRuqC3x2a3n88u34ubqoLF4MCUYNqGyh6x4mqA=&xsec_source=pc_feed', '{}', '[{"flower":"蔷薇","spotName":"复兴中路","distanceKm":0.68,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('犹太难民纪念馆', '历史：摩西会堂建于1927年，是上海现存最早的两座犹太会堂之一；二战期间约两万欧洲犹太难民在虹口提篮桥一带避难。
特色：纪念馆由摩西会堂及周边历史建筑组成，青砖外廊式建筑立面简洁庄重。
文化影响：2007年扩建为上海犹太难民纪念馆，2020年完成扩建，系统展陈犹太难民在上海的历史，“上海方舟”故事是中外人文交流的重要记忆载体。', '上海市虹口区长阳路62号', 31.254309, 121.509167, '虹口区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/7.1-1789013284090.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/7.1-1789013284090.jpg']::text[], '全年', ARRAY['纪念馆','历史']::text[], 'https://www.xiaohongshu.com/explore/6a6844f30000000011013ee0?xsec_token=ABbeREdpQPeujUHcAtyZ-poCC38MWfU_-tfGII72j2p-Y=&xsec_source=pc_feed', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('西本愿寺旧址（上海别院）', '历史：建于1931年，是日本京都西本愿寺在上海的分院。
特色：清水砖墙立面，巨大半圆形拱券山花带印度佛教石窟风格，门廊拱券内雕有莲花、迦陵频伽等纹饰，与近代砖混结构结合。
文化影响：曾是日本净土真宗本愿寺派在上海的活动场所，现为上海市优秀历史建筑，是虹口多元宗教建筑遗存的重要见证。', '上海市虹口区乍浦路455号', 31.2559, 121.4882, '虹口区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/8-1789049952796.jpg']::text[], '全年', ARRAY['宗教建筑','老建筑']::text[], 'https://www.xiaohongshu.com/explore/6a6984cf000000000f0311d6?xsec_token=ABxCv9f2ro2FNDET3q7MaAs1DK9AjZHTRFxQe42UUPU7o=&xsec_source=pc_feed', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('袁左良旧居（现：上海市文史研究馆）', '历史：建于1920年代、1930年落成的花园住宅，由第一代建筑师庄俊设计，原为金城银行会计部主任袁左良寓所。
特色：西班牙式花园洋房，黄色水泥拉毛墙面、红瓦坡顶，局部圆形穹顶与尖塔带伊斯兰建筑特点，位于复兴中路与思南路转角，十分醒目。
文化影响：1981年上海市文史研究馆迁入，成为文史名家吟咏书画、中外文化交流的场所；现为上海市优秀历史建筑。', '上海市黄浦区思南路39-41号', 31.2155, 121.4676, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/9.1-1789049954114.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/9.1-1789049954114.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/6a6b2a71000000002c004ac0?xsec_token=ABKY1VY2FNes334Tbn-EBsWyruwSMQsDisoSC-wc6LKpg=&xsec_source=pc_feed', '{}', '[{"flower":"蔷薇","spotName":"复兴中路","distanceKm":0.71,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('钦赐仰殿', '历史：始建年代无考，相传三国东吴孙权为母所建家庙，清乾隆三十五年（1770）重建，因大梁发现“信官秦叔宝监造”字样得名。
特色：占地7000余平方米，三进院落中轴对称，红墙黄瓦、飞檐斗拱；东岳殿主体结构为明代遗存，另有三清殿、藏经楼（老君堂）、钟鼓楼等殿阁。
文化影响：上海现存规模最大的道观，主祀东岳大帝，农历三月二十八“莲船会”香火鼎盛；2002年列为浦东新区文物保护单位，被誉为浦东“小故宫”。', '上海市浦东新区源深路476号', 31.2316, 121.5403, '浦东新区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/10.1-1789049954978.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/10.1-1789049954978.jpg']::text[], '全年', ARRAY['宗教建筑']::text[], 'https://www.xiaohongshu.com/explore/6a60b132000000000f01f716?xsec_token=ABtqQgOf6Za5HrdicKSuhqIsTqghAvX72-ViyxDLds0jE=&xsec_source=pc_feed', '{}', '[{"flower":"桃花","spotName":"桃林路","distanceKm":0.54,"months":null},{"flower":"栾树","spotName":"桃林路天桥","distanceKm":0.54,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海世博会博物馆', '历史：2017年建成开放，全球唯一一座世博会专题博物馆，记录1851年以来世博会发展历程，馆址毗邻原2010年上海世博会浦西园区。
特色：华东建筑设计研究院与法国让·努维尔事务所合作设计，“永恒的瞬间”理念，砖红色体量与玻璃幕墙相映，云厅、彩虹桥空间极具辨识度。
文化影响：常设展“世博之光”贯穿世博历史，既是建筑地标，也是面向公众的世博文化课堂。', '上海市黄浦区蒙自路818号', 31.1992, 121.4875, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/11.1-1789049955552.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/11.1-1789049955552.jpg']::text[], '全年', ARRAY['博物馆']::text[], 'https://www.xiaohongshu.com/explore/6a549438000000001102f806?xsec_token=ABAK38NGW4sZxPuvkVZ4RuWRZp7Z2xA817KGESHoesCV4=&xsec_source=pc_feed', '{}', '[{"flower":"蔷薇","spotName":"黄浦滨江","distanceKm":0.45,"months":null},{"flower":"向日葵/乌桕/银杏","spotName":"南园滨江绿地","distanceKm":1.13,"months":null},{"flower":"粉黛乱子草","spotName":"白莲泾公园","distanceKm":0.83,"months":null},{"flower":"银杏","spotName":"局门路","distanceKm":0.86,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('聚梦天地', '历史：前身为上海航天技术研究院旧址建筑群，2021年开工改造，由上海航天、上实城开、宏伊集团联合开发。
特色：60万平方米产城融合综合体，保留老厂房骨架与红砖肌理，叠加玻璃与钢构元素，塔楼立面汲取“太阳翼”灵感。
文化影响：从“航天摇篮”蜕变为创新聚梦之地，成为漕河泾片区年轻人聚集的活力街区。', '上海市徐汇区桂林路410号', 31.1755, 121.4137, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/12.1-1789049956067.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/12.1-1789049956067.jpg']::text[], '全年', ARRAY['现代建筑']::text[], 'https://www.xiaohongshu.com/explore/6a4caa06000000000f0066dc?xsec_token=AB-acjZu6hfrYvJxNIUAQMGTz5uxjKhE_HukUEVhNAcQM=&xsec_source=pc_feed', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('陕西南路37号（红房子旧址）', '历史：前身是1935年创办的喜乐意西菜馆，1956年迁至陕西南路37号并更名“红房子”，因红色外墙得名。
特色：三层红砖立面，保留老上海西餐馆的怀旧氛围，内部装潢延续复古风格。
文化影响：沪上法式西菜代表，陈毅市长曾亲临光顾，承载几代上海人的西餐记忆；现址为区级文物保护点。', '上海市黄浦区陕西南路37号', 31.2182, 121.4642, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/13.1-1789049956578.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/13.1-1789049956578.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/6a4f7de0000000000f01e535?xsec_token=ABtchr2qyteJEH1ZQ1WWHWJXzKNjzII4acB8Sl0bhBg8A=&xsec_source=pc_feed', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":1.08,"months":null},{"flower":"蔷薇","spotName":"复兴中路","distanceKm":0.9,"months":null},{"flower":"杜鹃/绣球","spotName":"辅德里公园","distanceKm":0.96,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('蟠龙新天地', '历史：蟠龙古镇有千年历史，元代设镇、明清繁盛；2023年“蟠龙天地”焕新开街，是上海城市更新的代表作。
特色：保留蟠龙庵、程家祠堂等历史建筑与十字街肌理，河网桥梁、石板街巷与水乡院落精心复原，新建筑粉墙黛瓦呼应古镇风貌。
文化影响：引入余德耀美术馆、书店与特色商业，古桥流水与现代艺术同框，重现“蟠龙十景”意象，成为青浦文化消费地标。', '上海市青浦区蟠龙路', 31.1878, 121.2598, '青浦区',
   ARRAY['./data/photos/14.jpg']::text[], '全年', ARRAY['商业','古镇']::text[], 'https://www.xiaohongshu.com/explore/6a4fad1a000000000f033ad1?xsec_token=ABtchr2qyteJEH1ZQ1WWHWJRZPIw1Gbc2a5-Pmb1JABrE=&xsec_source=pc_feed', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海汽车博物馆', '历史：2007年建成开放，位于嘉定安亭国际汽车城核心区，是国内首家大型综合性汽车博物馆。
特色：建筑以“空间流动”为概念，玻璃与金属外壳流畅现代；馆藏百余辆经典名车，按年代与主题分层陈列。
文化影响：系统呈现世界汽车工业百年史与设计演进，设有儿童汽车乐园等互动空间，是车迷与亲子家庭的重要目的地。', '上海市嘉定区安亭博园路756号', 31.2909, 121.1638, '嘉定区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/15-1789049957646.jpg']::text[], '全年', ARRAY['博物馆']::text[], 'https://www.xiaohongshu.com/explore/6a44af9300000000110117b5?xsec_token=ABT9QjVj8na5hTCP8WcSlWjP355gsDARpgx7NUD1hxjmg=&xsec_source=pc_feed', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海震旦博物馆', '历史：2013年开馆，由国际建筑大师安藤忠雄利用震旦集团大楼裙房改造设计，是安藤在上海的代表作之一。
特色：清水混凝土与玻璃幕墙对话，标志性圆楼梯与“橄榄形”展廊营造光影层次；馆藏以中国古代器物为主。
文化影响：以“企业+博物馆”模式运营，与陆家嘴天际线相映，是黄浦江畔的艺术文化名片。', '上海市浦东新区陆家嘴富城路99号', 31.2366, 121.4971, '浦东新区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/16.1-1789049957940.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/16.1-1789049957940.jpg']::text[], '全年', ARRAY['博物馆']::text[], 'https://www.xiaohongshu.com/explore/6a1f81580000000022028aa8?xsec_token=ABCesYgFvSSk2JSdY6ZINSNd0y7ObcvoiCISm9BMOJJio=&xsec_source=pc_feed', '{}', '[{"flower":"白玉兰 / 二乔玉兰","spotName":"陆家嘴中心绿地","distanceKm":0.81,"months":null},{"flower":"银杏","spotName":"古城公园","distanceKm":1.03,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('张爱玲故居（康定东路85号）', '历史：原名麦根路别墅，1897至1901年由爱尔德洋行设计建造，原为李鸿章产业，作为嫁妆赠予女儿李菊耦；1920年张爱玲出生于此。
特色：安妮女王复兴风格外廊式花园洋房，清水青砖墙配红砖装饰，南立面五孔券廊，三角形山墙与科林斯柱头雕刻精美。
文化影响：《倾城之恋》白公馆原型即取材于此；2015年列为上海市优秀历史建筑，2021年修缮后作为社区文化活动中心免费开放。', '上海市静安区康定东路85号', 31.2448, 121.455, '静安区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/17.1-1789049958533.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/17.1-1789049958533.jpg']::text[], '全年', ARRAY['老建筑','名人故居']::text[], 'https://www.xiaohongshu.com/explore/6a1530910000000036001c96?xsec_token=ABx7f1kWbSxXOdilTt2jwk36qDkPmtBD0QPpl-buJj84c=&xsec_source=pc_feed', '{}', '[{"flower":"郁金香","spotName":"静安雕塑公园","distanceKm":1.07,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海海派文化中心', '历史：前身为1927年建成的皇家旅馆（乐义大饭店），由兴泰电灯公司设计，曾为外侨聚集的高级旅馆；历经日军征用、华东海军办公、助产学堂与民居等多重身份。
特色：清水红砖外墙，南立面连续券廊配青砖勾边，红瓦双坡屋面，北立面多组三角山墙。
文化影响：2024年海派文化中心迁入，常设展“海上听潮”梳理中国电影在虹口的发端，联动今潮8弄成为沪上文化新空间。', '上海市虹口区四川北路', 31.2553, 121.4842, '虹口区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/18.1-1789049959272.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/18.1-1789049959272.jpg']::text[], '全年', ARRAY['文化空间']::text[], 'https://www.xiaohongshu.com/explore/6a16c5670000000035025eab?xsec_token=ABU1Gi-ND4kBGjiwWBLALhbf4JOwd87NDq7qGLKGgI1UU=&xsec_source=pc_feed', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('蝴蝶湾党群服务中心（蝴蝶湾社区食堂）', '历史：由“蝴蝶堡”“邻里楼”“水晶宫”三座建筑组成；蝴蝶堡始建于20世纪初，曾为划船总会船屋、工部局仓库、大中华百合影片公司、人力车夫互助会总会所；邻里楼即张爱玲出生地麦根路别墅。
特色：蝴蝶堡为安妮女王复兴风格城堡式洋房，清水红砖、连续拱券连廊、八角塔楼与锥形尖顶，被称为“童话城堡”；邻里楼为券柱式外廊花园洋房。
文化影响：2025年焕新为滨河党群服务中心，社区食堂“蝴蝶食坊”、童趣空间与苏州河滨水步道一体开放，是历史建筑活化与社区服务的经典案例。', '上海市静安区康定东路28号', 31.2446, 121.4562, '静安区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/19.1-1789049959819.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/19.1-1789049959819.jpg']::text[], '全年', ARRAY['老建筑','社区']::text[], 'https://www.xiaohongshu.com/explore/6a0ea176000000003502fcc6?xsec_token=ABaStjBHazgxI4esD8Uy4j9385qqapxkn-VPA-SNQRmkI=&xsec_source=pc_feed', '{}', '[{"flower":"郁金香","spotName":"静安雕塑公园","distanceKm":1.01,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('浦东唐墓桥露德圣母堂（唐镇天主堂）', '历史：1894年奠基，由法国耶稣会士鄂劳德神父用其母亲遗产仿法国露德圣母大殿式样营建，1897年底竣工、1898年开堂，清末民初号称“远东第一堂”。
特色：哥特式单塔教堂，通体白蓝外墙，拉丁十字平面，堂长61米、两翼宽43米，钟楼高47.5米；尖拱窗、飞扶壁与彩色玻璃窗，屋顶却用江南小青瓦、门口立中式石狮，中西合璧。
文化影响：上海教区继佘山之后的第二大朝圣地，1999年列为上海市优秀历史建筑，是浦东中西交融的信仰与文化地标。', '上海市浦东新区唐镇', 31.2135, 121.6719, '浦东新区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/20.1-1789049960333.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/20.1-1789049960333.jpg']::text[], '全年', ARRAY['宗教建筑']::text[], 'https://www.xiaohongshu.com/explore/6a02e829000000003502adba?xsec_token=ABwiVgYo9DYH2zpWgEl5Wyadq77oITj42AhKLvR3s_rLg=&xsec_source=pc_feed', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('8号桥艺术中心·1908粮仓', '历史：前身为1908年建成的中国通商银行第二仓库，后为杜月笙私家粮仓，是苏州河畔现存较老的银行仓库遗存。
特色：砖木结构老仓房，红砖清水墙配青砖嵌饰，木质梁架与歇山屋顶被完整保留，内部改造为展厅与活动空间。
文化影响：2017年以“八号桥艺术空间·1908粮仓”焕新，举办展览、话剧、烛光音乐会等活动，是苏州河滨水文化带的地标。', '上海市黄浦区建国中路8号', 31.2427, 121.4657, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/21.1-1789049960796.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/21.1-1789049960796.jpg']::text[], '全年', ARRAY['工业风','艺术']::text[], 'https://www.xiaohongshu.com/explore/6a0587070000000036001e0f?xsec_token=AB3lynxmweVzpMpznEDk-5kpK_L3Wzqj8XbLwdGpQeWmU=&xsec_source=pc_feed', '{}', '[{"flower":"梅花","spotName":"上海总商会旧址","distanceKm":1.17,"months":null},{"flower":"海棠","spotName":"人民公园","distanceKm":1.05,"months":null},{"flower":"郁金香","spotName":"静安雕塑公园","distanceKm":0.98,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('杨树浦水厂', '历史：1881年由英籍工程师哈特设计动工，1883年6月29日李鸿章开闸放水、8月1日正式供水，是中国第一座现代化自来水厂，曾为远东第一大水厂。
特色：英国古典城堡式建筑群，清水砖墙嵌红砖腰线，雉堞压顶、尖拱门窗，大门两侧双层城堡式碉楼，铁锈红调连绵江岸。
文化影响：如今仍承担上海约四分之一供水，2013年列为全国重点文物保护单位；滨江栈桥是“人民城市”理念首发地，工业遗产活化典范。', '上海市杨浦区杨树浦路830号', 31.2632, 121.539, '杨浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/22.1-1789049961322.jpg']::text[], '全年', ARRAY['工业风','老建筑']::text[], 'https://www.xiaohongshu.com/explore/69fc4c130000000035021b6e?xsec_token=AB-S8lGchXxtWrKQmoBpsmSyM-jRTijy7G1evZcKOehKU=&xsec_source=pc_feed', '{}', '[{"flower":"樱花","spotName":"绿之丘","distanceKm":0.3,"months":null},{"flower":"樱花/马鞭草","spotName":"东方渔人码头","distanceKm":0.76,"months":null},{"flower":"郁金香","spotName":"杨浦滨江","distanceKm":0.3,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('何东旧居', '历史：建于1920年代的英式花园住宅，曾为香港富商何东家族在上海的居所。
特色：新古典主义风格，对称立面、清水砖墙配白色线脚，檐口与门廊雕饰精致，庭院开阔。
文化影响：解放后曾为中华书局辞书出版社等机构使用，现为上海市优秀历史建筑，陕西北路历史文化名街上的中西合璧大宅。', '上海市静安区陕西北路457号', 31.231, 121.446, '静安区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/23.1-1789049961564.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/23.1-1789049961564.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/69fde82e0000000035025f0a?xsec_token=AByG9CFlvlWNfsznURImrVZxzTu4Zem1YKqPsk7_Ny0-0=&xsec_source=pc_feed', '{}', '[{"flower":"樱花","spotName":"德莱蒙德住宅（华山路263弄7号）","distanceKm":1.09,"months":null},{"flower":"白玉兰 / 二乔玉兰","spotName":"上海展览中心·西花园","distanceKm":0.69,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('爱司公寓（瑞金公寓）', '历史：1927年由邬达克设计建造，原名爱司公寓，位于淮海中路，是邬达克在上海的早期公寓代表作。
特色：装饰艺术派风格，立面以红砖与白色水泥饰带形成水平线条，转角凸窗与顶部塔楼收分，构图均衡而摩登。
文化影响：见证淮海路商业街的兴起，1999年列为上海市优秀历史建筑，现为瑞金公寓。', '上海市黄浦区瑞金一路150号', 31.2195, 121.462, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/24.1-1789049962071.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/24.1-1789049962071.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/69ddc30f00000000210044a1?xsec_token=ABjOkItNGUMwsIGNJANHBqy91u1xfoCKQy0Ox1BeukDPw=&xsec_source=pc_feed', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":0.88,"months":null},{"flower":"蔷薇","spotName":"复兴中路","distanceKm":1.1,"months":null},{"flower":"杜鹃/绣球","spotName":"辅德里公园","distanceKm":0.78,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('原上海圣约翰大学（现：华东政法大学长宁校区）', '历史：1879年由美国圣公会创办，是上海最早的大学之一，初名圣约翰书院，1905年改称大学；1952年院系调整后校址成为华东政法大学长宁校区。
特色：校园建筑中西合璧，韬奋楼1894年建成，中式歇山顶配西式券廊，是“中西合璧”校园建筑的典范；思颜堂、格致楼等清水砖墙建筑沿苏州河排列。
文化影响：培养出顾维钧、林语堂、贝聿铭等杰出校友，被誉为“东方哈佛”，2019年列为全国重点文物保护单位。', '上海市长宁区万航渡路1575号', 31.2224, 121.4136, '长宁区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/25-1789049962532.jpg']::text[], '全年', ARRAY['老建筑','校园']::text[], 'https://www.xiaohongshu.com/explore/69e9c83f0000000013030803?xsec_token=ABrsL83qwDlhDUE-HUrAAdd8UQq0LQhfrGMm40mTi7ubI=&xsec_source=pc_feed', '{}', '[{"flower":"木香花","spotName":"愚园路1088弄","distanceKm":0.99,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('海格公寓', '历史：建于1920年代的西班牙风格公寓住宅，位于华山路，是上海近代公寓建筑的经典之作。
特色：红瓦缓坡屋顶、白色水泥拉毛墙面，半圆拱窗与铁艺阳台点缀其间，顶部攒尖塔楼，气质明快温暖。
文化影响：现为居民住宅，1999年列为上海市优秀历史建筑，华山路梧桐深处的异域风情地标。', '上海市静安区华山路370号', 31.213, 121.4415, '静安区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/26.1-1789049962741.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/26.1-1789049962741.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/69e71472000000001d019fc8?xsec_token=AB_DZyYdYX6JNri0d-Qy9Uhy4j9aeBvXqgxNiVSv3WRzM=&xsec_source=pc_feed', '{}', '[{"flower":"樱花","spotName":"德莱蒙德住宅（华山路263弄7号）","distanceKm":0.98,"months":null},{"flower":"紫藤","spotName":"太原路215弄","distanceKm":1.13,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.43,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.94,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海工艺美术博物馆', '历史：法式文艺复兴风格花园洋房建于1905年，原为法租界公董局董事住宅，俗称“小白宫”。
特色：白色水泥拉毛外墙配精美雕饰，弧形楼梯与彩色玻璃窗，立面三段式对称，典雅华丽。
文化影响：2002年辟为工艺美术博物馆，展示玉雕、牙雕、绒绣等海派工艺精品，既是建筑遗产也是工艺文化窗口。', '上海市徐汇区汾阳路79号', 31.2115, 121.454, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/27.1-1789049964004.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/27.1-1789049964004.jpg']::text[], '全年', ARRAY['老建筑','博物馆']::text[], 'https://www.xiaohongshu.com/explore/69d5efc80000000023022152?xsec_token=ABHXsqsO8mKAykXeS0qU_wEjzDG2P5Ix9Iuf0THWTHZls=&xsec_source=pc_feed', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":0.75,"months":null},{"flower":"紫藤","spotName":"太原路215弄","distanceKm":0.6,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":1.13,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":1.13,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.79,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('德莱蒙德住宅（现：华山263老字号品牌馆）', '历史：建于1899年，是华山路上现存最早的花园住宅之一，英国乡村风格，曾为多户名人居所。
特色：陡峭红瓦坡屋顶、清水砖墙配白色窗框，烟囱与老虎窗错落，立面朴素而富英伦田园气息。
文化影响：2022年修缮后辟为华山263老字号品牌馆，展示上海老字号品牌文化，是华山路历史建筑活化典范。', '上海市静安区华山路263弄7号', 31.2245, 121.4462, '静安区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/28-1789092462925.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/69dcf709000000002200fe06?xsec_token=ABMYyUKYzT_i8f4zpDvKzTb6FO-ZalmghDDnk2E4oqHMg=&xsec_source=pc_search&source=web_user_page', '{}', '[{"flower":"樱花","spotName":"德莱蒙德住宅（华山路263弄7号）","distanceKm":0.5,"months":null},{"flower":"白玉兰 / 二乔玉兰","spotName":"上海展览中心·西花园","distanceKm":0.14,"months":null},{"flower":"郁金香","spotName":"襄阳公园","distanceKm":0.95,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('基督教国际礼拜堂', '历史：1925年建成开放，位于衡山路，是上海规模较大的基督教教堂。
特色：哥特式风格，清水红砖外墙、尖拱窗与陡峭屋面，入口门廊简洁庄重，堂内穹顶与木构架保留完整。
文化影响：以圣乐与多语种礼拜著称，1980年代恢复礼拜后成为中外信徒交流场所；1994年列为上海市优秀历史建筑。', '上海市徐汇区衡山路53号', 31.2112, 121.4446, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/29.1-1789092463985.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/29.1-1789092463985.jpg']::text[], '全年', ARRAY['宗教建筑']::text[], 'https://www.xiaohongshu.com/explore/69cb5cff0000000023022758?xsec_token=ABnCcqa3KCMURUtyCYojwCZkPUk3cCxbOGnVG7abXKIt0=&xsec_source=pc_search', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":1.1,"months":null},{"flower":"紫藤","spotName":"太原路215弄","distanceKm":0.78,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":1.04,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":1.04,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.11,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.74,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('密丹公寓', '历史：1931年由邬达克设计建成，位于武康路。
特色：装饰艺术派风格，立面以横向线条与灰色水泥饰面为主，顶层退台处理，窗洞造型收放有致，转角位置处理巧妙。
文化影响：邬达克小而精的公寓作品，现为居民住宅，1994年列为上海市优秀历史建筑，武康路漫步的经典打卡点。', '上海市徐汇区武康路115号', 31.2112, 121.4418, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/30.1-1789092464555.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/30.1-1789092464555.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/69c24e0d000000002100552b?xsec_token=ABKIhBRyoQoh6_bmPBtBCPUOwSPT3djRRN-7Tf57bgdWY=&xsec_source=pc_search', '{}', '[{"flower":"樱花","spotName":"德莱蒙德住宅（华山路263弄7号）","distanceKm":1.18,"months":null},{"flower":"紫藤","spotName":"太原路215弄","distanceKm":1,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":1.16,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":1.16,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.37,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.74,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('黑石公寓', '历史：1924年建成，由美国人宋合理投资建造，位于复兴中路，曾是沪上著名的高档公寓。
特色：折衷主义风格，立面三段式构图，清水砖墙与白色线脚相间，入口门廊设科林斯柱式与弧形拱券，顶部女儿墙与塔楼处理多样。
文化影响：曾设“花旗总会”等机构，吸引中外名流租住；2019年修缮后引入黑石M+音乐街区，成为衡复音乐文化新地标。', '上海市徐汇区复兴中路1331号', 31.2108, 121.449, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/31.1-1789092465007.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/31.1-1789092465007.jpg']::text[], '全年', ARRAY['老建筑','文艺']::text[], 'https://www.xiaohongshu.com/explore/69ca36b2000000002200f0d1?xsec_token=ABWPKEsHxwurHiD33TeP1JxgMMWFXhua9GF6F1T32HR7I=&xsec_source=pc_search', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":0.9,"months":null},{"flower":"紫藤","spotName":"太原路215弄","distanceKm":0.48,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":0.92,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":0.92,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.33,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.88,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('息焉堂', '历史：1925年由邬达克设计、马相伯等发起建造，位于可乐路，为纪念教区神职人员而建。
特色：拜占庭风格，圆形穹顶配弧形玻璃窗，清水砖墙与水泥抹面结合，穹顶与钟塔造型独特，融合西方古典与东方元素。
文化影响：2014年列为上海市优秀历史建筑，是西郊静谧角落里的异域穹顶遗存。', '上海市长宁区可乐路1号', 31.2148, 121.4068, '长宁区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/32.1-1789092465730.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/32.1-1789092465730.jpg']::text[], '全年', ARRAY['宗教建筑']::text[], 'https://www.xiaohongshu.com/explore/69bbdc670000000021007a88?xsec_token=AB2dfkp8s77oEfVDuRJUADXiiGcB4mZu6rTp2K_UBiZoE=&xsec_source=pc_search', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('开普敦公寓', '历史：1930年代由公和洋行设计建成，位于武康路，因造型独特被称为“船舰式建筑”。
特色：立面呈锐角楔形处理，窗带与阳台随楔形平面收分，顶部收窄如同船头，清水砖墙配白色水泥饰带。
文化影响：公和洋行在上海的住宅代表作，现为居民住宅，上海市优秀历史建筑，武康路沿线打卡地标。', '上海市徐汇区武康路240号', 31.2092, 121.4408, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/33.1-1789092466240.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/33.1-1789092466240.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/69ba75310000000023022ebc?xsec_token=AB_n1I1fVjt-3obvwX1PU1xk7iZHNJHuPl2G_YPPAOcbo=&xsec_source=pc_search', '{}', '[{"flower":"紫藤","spotName":"太原路215弄","distanceKm":1,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":1.04,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":1.04,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.54,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.55,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('夏衍故居', '历史：建于1932年的英式花园住宅，作家夏衍1932至1935年在此居住。
特色：红瓦坡顶、清水砖墙，立面简洁，南向花园与阳台，室内楼梯与壁炉保留旧貌。
文化影响：夏衍在此创作《狂流》等左翼电影剧本，故居现为纪念馆，是衡复风貌区的文学地标。', '上海市徐汇区乌鲁木齐南路178号2号楼', 31.205, 121.447, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/34.1-1789092466964.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/34.1-1789092466964.jpg']::text[], '全年', ARRAY['老建筑','名人故居']::text[], 'https://www.xiaohongshu.com/explore/69b8dc00000000001d01e9b6?xsec_token=ABqP0PUqvYuiB-6S59YfwdansyUGKC7ZXavvM7YgPZhuk=&xsec_source=pc_search', '{}', '[{"flower":"紫藤","spotName":"太原路215弄","distanceKm":0.42,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":0.31,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":0.31,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.75,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.36,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('柯灵故居', '历史：1933年建成的西班牙式花园住宅，散文家柯灵1959年至2000年在此居住。
特色：白色拉毛墙面、红色筒瓦缓坡屋顶，半圆拱窗与铁艺栏杆，立面明快温馨。
文化影响：柯灵在此创作《不夜城》等作品；2016年辟为柯灵故居纪念馆，陈列其手稿与藏书。', '上海市徐汇区复兴西路147号', 31.2096, 121.4424, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/35-1789092468888.jpg']::text[], '全年', ARRAY['老建筑','名人故居']::text[], 'https://www.xiaohongshu.com/explore/69b13f1c000000002603ffce?xsec_token=ABGJMw-3O4U4h0KRxm1xWz0CSLq5mF8igG81hFUKB73_s=&xsec_source=pc_search', '{}', '[{"flower":"紫藤","spotName":"太原路215弄","distanceKm":0.87,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":0.98,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":0.98,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.39,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.55,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('罗密欧阳台', '历史：武康路210号花园住宅，建于1930年代。
特色：西班牙风格，米黄色拉毛墙面配红色筒瓦，二层外凸的弧形铁艺阳台是经典取景框。
文化影响：因阳台造型优雅被网友戏称“罗密欧的阳台”，是武康路网红打卡点、“建筑可阅读”的代表性场景。', '上海市徐汇区武康路210号', 31.2098, 121.4408, '徐汇区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/36.1-1789092469205.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/36.1-1789092469205.jpg']::text[], '全年', ARRAY['老建筑','文艺']::text[], 'https://www.xiaohongshu.com/explore/69aec1fe00000000220201dd?xsec_token=ABkeWAjPUF1rAfZPfH9S-wh4pn5woRODQGXPrCsIIyQHk=&xsec_source=pc_search', '{}', '[{"flower":"紫藤","spotName":"太原路215弄","distanceKm":1.02,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":1.09,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":1.09,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.51,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.61,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('四行储蓄会大楼(现为上海银行)', '历史：1932年由邬达克设计建成，位于南京西路，是四行储蓄会总行所在。
特色：装饰艺术派风格，立面以竖向线条强调高度感，顶部退台与几何装饰，褐色砖面配浅色线脚，端庄挺拔。
文化影响：邬达克银行建筑代表作，见证上海近代金融业发展，现为上海银行使用，南京西路地标、上海市优秀历史建筑。', '上海市黄浦区南京西路', 31.2333, 121.47, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/37.1-1789092469978.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/37.1-1789092469978.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/69a12ec2000000002603e3a8?xsec_token=ABkaw1SDsBGikPhAOPl4xltnO7GKlPTir_csCiOjPhAfI=&xsec_source=pc_search', '{}', '[{"flower":"海棠","spotName":"人民公园","distanceKm":0.34,"months":null},{"flower":"郁金香","spotName":"静安雕塑公园","distanceKm":1.07,"months":null},{"flower":"杜鹃/绣球","spotName":"辅德里公园","distanceKm":1.11,"months":null},{"flower":"银杏","spotName":"上海音乐厅","distanceKm":0.54,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('金门大酒店', '历史：1926年建成开业，原名华安大厦，为华安合群人寿保险公司大楼，后改建为酒店。
特色：意大利文艺复兴风格，米白色石材立面配科林斯柱式与雕饰，顶部钟楼，内部大厅与楼梯金碧辉煌。
文化影响：曾被称为“远东第一高楼”之一，宋美龄等名流曾出席其活动，现为酒店，是南京西路百年地标、上海市优秀历史建筑。', '上海市黄浦区南京西路104号', 31.2336, 121.4719, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/38.1-1789092470592.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/38.1-1789092470592.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/699e66c5000000002603dadf?xsec_token=ABhDXpHcF88Mu2tvaMjQ7KsY5abkjW2YC-QSzHHV5i8s0=&xsec_source=pc_search', '{}', '[{"flower":"海棠","spotName":"人民公园","distanceKm":0.53,"months":null},{"flower":"泡桐","spotName":"汉口路老市府","distanceKm":1.07,"months":null},{"flower":"银杏","spotName":"上海音乐厅","distanceKm":0.54,"months":null},{"flower":"银杏","spotName":"圣三一堂","distanceKm":1.06,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('丁香花园', '历史：约1890年代建造，相传为晚清重臣李鸿章的私人花园住宅。
特色：建筑中西合璧，主楼英式风格，园内假山、曲桥与百年古树，红瓦白墙掩映其间。
文化影响：上海现存保存较完整的名人私家花园之一，现为餐厅与活动场所，是华山路“藏在闹市的园林”、上海市优秀历史建筑。', '上海市长宁区华山路849号', 31.2116, 121.4432, '长宁区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/39.1-1789092471152.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/39.1-1789092471152.jpg']::text[], '全年', ARRAY['老建筑','园林']::text[], 'https://www.xiaohongshu.com/explore/698c3239000000000a02e6fd?xsec_token=ABo4p2mSl-pMGQ7sTNVkZOxGEUEpvYLyHII7odhjZS0zg=&xsec_source=pc_search', '{}', '[{"flower":"樱花","spotName":"德莱蒙德住宅（华山路263弄7号）","distanceKm":1.14,"months":null},{"flower":"郁金香","spotName":"襄阳公园","distanceKm":1.17,"months":null},{"flower":"紫藤","spotName":"太原路215弄","distanceKm":0.91,"months":null},{"flower":"虞美人","spotName":"肇嘉浜路2号口","distanceKm":1.13,"months":null},{"flower":"绣球","spotName":"肇嘉浜路","distanceKm":1.13,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":0.24,"months":null},{"flower":"乌桕","spotName":"安亭路","distanceKm":0.77,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('兴国宾馆', '历史：由1930年代多家外资机构兴建的一组花园别墅群组成，曾为沪上高级宾馆，接待过多国政要。
特色：英国乡村式与西班牙式别墅交错分布，红瓦陡坡顶、清水砖墙、大草坪与参天古树，园林气息浓厚。
文化影响：上海花园酒店的代表，多次承担重要外事接待，是兴国路梧桐深处的静谧庄园、上海市优秀历史建筑。', '上海市长宁区兴国路78号', 31.2095, 121.4278, '长宁区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/40.1-1789092471592.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/40.1-1789092471592.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/698d705e000000000903b310?xsec_token=ABlwgoSX-tPgxc592ooeYy4T5HftruiQbXCW3XINHQ0ec=&xsec_source=pc_search', '{}', '[{"flower":"樱花","spotName":"上海交通大学（徐汇校区）","distanceKm":1.06,"months":null},{"flower":"樱花","spotName":"交大徐汇校区樱花","distanceKm":0.99,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海扬子饭店(现为扬子精品酒店)', '历史：1934年建成开业，原名扬子饭店，位于汉口路，是装饰艺术派建筑的代表作。
特色：米黄色面砖立面配竖向线条与几何装饰，顶部阶梯状收分，内部回旋楼梯与彩色玻璃精致华丽。
文化影响：曾为沪上名流社交场，周璇等影星常出入；2010年修缮后以“扬子精品酒店”开业，是外滩源区域地标、上海市优秀历史建筑。', '上海市黄浦区滇池路', 31.2345, 121.474, '黄浦区',
   ARRAY['https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/45.1-1789092474436.jpg','https://iacvjoltkqmgyfpldjyr.supabase.co/storage/v1/object/public/spots-photos/45.1-1789092474436.jpg']::text[], '全年', ARRAY['老建筑']::text[], 'https://www.xiaohongshu.com/explore/698184e6000000000a03d75e?xsec_token=ABqxo7Dgdlg4C7YhtVAi6QO0Cof_l0t5p1P5mjMhAoAPg=&xsec_source=pc_search', '{}', '[{"flower":"梅花","spotName":"上海总商会旧址","distanceKm":1.13,"months":null},{"flower":"樱花","spotName":"四川路桥","distanceKm":1.12,"months":null},{"flower":"海棠","spotName":"人民公园","distanceKm":0.74,"months":null},{"flower":"泡桐","spotName":"汉口路老市府","distanceKm":0.84,"months":null},{"flower":"樱花/紫藤/绣球","spotName":"苏州河樱花谷驿站","distanceKm":1.12,"months":null},{"flower":"银杏","spotName":"上海音乐厅","distanceKm":0.67,"months":null},{"flower":"银杏","spotName":"圣三一堂","distanceKm":0.84,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('汇丰银行大楼（现浦发银行）', '历史：1921年建成，由英商公和洋行设计，新古典主义风格，外滩体量最大的建筑，曾被誉为"从苏伊士运河到白令海峡最华贵的建筑"。
特色：立面横五段纵三段，底部正中设3座罗马拱门，中部穹顶高耸。内部曾铺有名为"世界的天空"的马赛克壁画（现保存）。曾为汇丰银行中国总部、上海市人民政府所在地。
文化影响：全国重点文物保护单位，外滩C位楼王，是外滩万国建筑博览群的视觉中心。', '上海市黄浦区中山东一路12号', 31.23944, 121.49028, '黄浦区',
   ARRAY['./data/photos/46.1.webp','./data/photos/46.2.webp','./data/photos/46.3.webp']::text[], '全年', ARRAY['老建筑','外滩']::text[], 'https://www.xiaohongshu.com/explore/6aa260ee000000002900da6a?xsec_token=ABHYy9zc42ikCJ3uELzM5SO1XzZn4wlmG1rPdFzPfnpTg=&xsec_source=pc_search', '{}', '[{"flower":"郁金香","spotName":"外滩","distanceKm":0.69,"months":null},{"flower":"杜鹃","spotName":"外滩老市府露台","distanceKm":0.77,"months":null},{"flower":"泡桐","spotName":"汉口路老市府","distanceKm":0.82,"months":null},{"flower":"银杏","spotName":"圣三一堂","distanceKm":0.86,"months":null},{"flower":"银杏","spotName":"古城公园","distanceKm":1.01,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('张朴桥天主堂', '位于松江稻田中的白色教堂，造型简洁纯净，是上海郊野少见的西式宗教建筑遗存。稻田季节性金黄，与白色教堂体量形成色彩对比，适合田园风格摄影。', '上海市松江区佘山镇张朴村427号', 31.03456, 121.22345, '松江区',
   ARRAY['./data/photos/47.1.webp']::text[], '全年', ARRAY['宗教建筑','老建筑']::text[], 'https://www.xiaohongshu.com/explore/6a9017cf0000000020033dd5?xsec_token=ABpqV2mWDS94aNbSZjfi87Cz3f298KC7xUx9xd6XrVBN8=&xsec_source=pc_search', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('七宝天主堂', '历史：1867年建造，哥特式天主教堂，是上海西南郊最具规模的近代教堂建筑之一。
特色：青砖外墙、尖拱窗、钟楼高耸，内部木屋架结构。教堂隐于七宝老街之中，中西建筑风格的碰撞与交融成为独特的拍摄题材。
文化影响：闵行区文物保护单位，七宝老街文化地标之一。', '上海市闵行区七宝南街50号', 31.15521, 121.34789, '闵行区',
   ARRAY['./data/photos/48.1.webp','./data/photos/48.2.webp','./data/photos/48.3.webp']::text[], '全年', ARRAY['宗教建筑','老建筑']::text[], 'https://www.xiaohongshu.com/explore/6a274c9000000000160276bd?xsec_token=ABb-G8BuPf1vFzz-M5qIxZKhU7aBDxB8KjgA37OKZG7T8=&xsec_source=pc_search', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('佘山天主教堂', '历史：1871年初建，1935年重建，由耶稣会神父叶肇昌设计，巴洛克与哥特式混合风格，被称为"远东第一圣殿"。
特色：位于西佘山顶，红色砖墙、罗马拱廊、穹顶高耸，可俯瞰松江平原。建筑体量与山顶地形结合，朝圣路径与视觉轴线层次分明。
文化影响：全国重点文物保护单位，上海天主教朝圣中心，佘山天文台相邻。', '上海市松江区外青松公路9142号', 31.05389, 121.18806, '松江区',
   ARRAY['./data/photos/50.1.webp','./data/photos/50.2.webp','./data/photos/50.3.webp']::text[], '全年', ARRAY['宗教建筑','老建筑','地标']::text[], 'https://www.xiaohongshu.com/explore/696c2f12000000002102a8eb?xsec_token=AB7Hm77cfN7x3a3zn26FoL5kVPHQn5JsXnonGRu6LNUmo=&xsec_source=pc_search', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('东林寺', '三项吉尼斯纪录的佛教寺院：室内千手观音像、千佛门、山体合一。山寺一体、佛寺如山的独特造型，金顶红墙在郊野绿野中格外醒目。联票30元。', '上海市金山区朱泾镇东林街150号', 30.91667, 121.33333, '金山区',
   ARRAY['./data/photos/59.1.webp','./data/photos/59.2.webp','./data/photos/59.3.webp']::text[], '全年', ARRAY['宗教建筑','地标']::text[], 'https://www.xiaohongshu.com/explore/673f25400000000002039643?xsec_token=ABaCNW4Z0e6lDlhbyUEyONmV6Ea8jaH-wil-8CbwVPQdw=&xsec_source=pc_search', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('真如寺', '历史：始建于南宋（1320年迁建现址），是上海城区唯一保存的元代木结构建筑。
特色：真如寺大殿为元代原物，面阔三间，单檐歇山顶，斗栱粗壮，梁架简洁，体现了早期江南木构的典型做法。寺内另有铁铸弥陀像等文物。
文化影响：全国重点文物保护单位，上海最古老的木建筑之一，是研究江南元代建筑的重要实例。', '上海市普陀区兰溪路399号', 31.25222, 121.40389, '普陀区',
   ARRAY['./data/photos/60.1.webp','./data/photos/60.2.webp','./data/photos/60.3.webp']::text[], '全年', ARRAY['老建筑','宗教建筑']::text[], 'https://www.xiaohongshu.com/explore/672e07fb000000001d039bd3?xsec_token=ABuCa9r5FeXiA0hRUoShu9cxukgqGJFWqPHx_5uxnJSyM=&xsec_source=pc_user', '{}', '[{"flower":"腊梅","spotName":"真如公园","distanceKm":0.56,"months":null},{"flower":"银杏","spotName":"真如寺","distanceKm":0.65,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('和平饭店', '历史：1929年建成，原名沙逊大厦，由公和洋行设计，Art Deco装饰艺术风格的代表作，曾被誉为"远东第一楼"。
特色：10层钢架结构，红砖与金山石外墙，顶部金字塔形铜屋顶覆绿铜瓦。内部拥有闻名遐迩的"龙凤厅"中餐厅和大堂老式爵士酒吧。
文化影响：全国重点文物保护单位，外滩北端地标建筑，老上海风华的象征。', '上海市黄浦区南京东路20号', 31.23972, 121.49083, '黄浦区',
   ARRAY['./data/photos/55.2.webp','./data/photos/55.3.webp']::text[], '全年', ARRAY['老建筑','Art Deco','外滩']::text[], 'https://www.xiaohongshu.com/explore/68450c43000000000f03295e?xsec_token=ABi7QLotnxgHKryEz5KgI6vMJ9eXhKHvBLmSNi_wMbw8o=&xsec_source=pc_search', '{}', '[{"flower":"郁金香","spotName":"外滩","distanceKm":0.7,"months":null},{"flower":"杜鹃","spotName":"外滩老市府露台","distanceKm":0.78,"months":null},{"flower":"泡桐","spotName":"汉口路老市府","distanceKm":0.87,"months":null},{"flower":"银杏","spotName":"圣三一堂","distanceKm":0.91,"months":null},{"flower":"银杏","spotName":"古城公园","distanceKm":1.05,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('外滩华尔道夫', '历史：1910年建成，原为上海总会大楼，由英国皇家建筑师学会设计，新古典主义风格。上海最早引入电梯的建筑之一。
特色：白色大理石立面，6根贯通2-3层的爱奥尼式柱式，顶部三角山花。内部34米长的吧台曾是远东最长酒吧。
文化影响：全国重点文物保护单位，现为华尔道夫酒店，非住客也可进入大堂参观，是外滩经典机位之一。', '上海市黄浦区中山东一路2号', 31.23917, 121.49, '黄浦区',
   ARRAY['./data/photos/56.1.webp','./data/photos/56.2.webp','./data/photos/56.3.webp']::text[], '全年', ARRAY['老建筑','外滩']::text[], 'https://www.xiaohongshu.com/explore/68411ad2000000000303d4d7?xsec_token=ABezuMNr3piIJ5WLfvXxeFWBVdfgBx1CZumN89Uh60P2E=&xsec_source=pc_search', '{}', '[{"flower":"郁金香","spotName":"外滩","distanceKm":0.69,"months":null},{"flower":"杜鹃","spotName":"外滩老市府露台","distanceKm":0.77,"months":null},{"flower":"泡桐","spotName":"汉口路老市府","distanceKm":0.79,"months":null},{"flower":"银杏","spotName":"圣三一堂","distanceKm":0.83,"months":null},{"flower":"银杏","spotName":"古城公园","distanceKm":0.98,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('上海交响音乐博物馆', '历史：原为"染料大王"周宗良宅邸，建于1920-1930年代，法式风格花园洋房。2017年改造为国内第一座交响音乐主题博物馆。
特色：白色外墙、法式孟莎顶、花园有百年香樟。常设展包括中国交响音乐史、手稿、乐器等。每周二至周六开放（周一、周日闭馆）。
文化影响：徐汇区文物保护单位，衡复风貌区文化新地标，是了解上海近代音乐史的重要窗口。', '上海市徐汇区宝庆路3号', 31.21611, 121.45639, '徐汇区',
   ARRAY['./data/photos/57.1.webp','./data/photos/57.2.webp']::text[], '全年', ARRAY['老建筑','博物馆','文艺']::text[], 'https://www.xiaohongshu.com/explore/68234d9a000000000f03b4fe?xsec_token=ABYmxw0NG_mwHTwpD_r70oOvEIvTRe0oVzsKudfoWhMDk=&xsec_source=pc_search', '{}', '[{"flower":"郁金香","spotName":"襄阳公园","distanceKm":0.41,"months":null},{"flower":"紫藤","spotName":"太原路215弄","distanceKm":1.16,"months":null},{"flower":"梧桐","spotName":"梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）","distanceKm":1.13,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('泗泾舣园', '松江泗泾的新中式园林，结合传统园林意境与现代设计手法，是上海郊野少见的当代中式造园实例。水岸、月洞、花木构成丰富的空间层次。', '上海市松江区开江中路333号', 31.12611, 121.31861, '松江区',
   ARRAY['./data/photos/49.1.webp','./data/photos/49.2.webp','./data/photos/49.3.webp']::text[], '全年', ARRAY['园林','新中式']::text[], 'https://www.xiaohongshu.com/explore/6a1fbd71000000003603063e?xsec_token=ABCesYgFvSSk2JSdY6ZINSNXVSuJiQSazDmsxw29F7LPU=&xsec_source=pc_search', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('言子书院', '奉贤的新建文化建筑，以孔子弟子言偃（言子）为主题。建筑获得IAF锋建筑奖，纯白几何造型、庭院水池、光影廊道构成现代东方意境，是上海新晋的文青打卡地。', '上海市奉贤区望园路600弄97号', 30.91667, 121.46667, '奉贤区',
   ARRAY['./data/photos/52.1.webp','./data/photos/52.2.webp']::text[], '全年', ARRAY['新建筑','文艺']::text[], 'https://www.xiaohongshu.com/explore/695f86530000000022008d75?xsec_token=ABO-0qjh9jLZtk4QWvDx6asUVcbLlW5tX9CgP-XtOLpf4=&xsec_source=pc_search', '{}', '[{"flower":"红枫","spotName":"古华公园","distanceKm":0.72,"months":null}]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('张江科学会堂', '张江科学城的标志性公共建筑，以几何形体、光影节奏和清水混凝土为语言，展现当代科学与建筑的对话。屋顶平台与中庭的几何构成适合建筑摄影。', '上海市浦东新区海科路1393号', 31.205, 121.605, '浦东新区',
   ARRAY['./data/photos/53.1.webp','./data/photos/53.2.webp','./data/photos/53.3.webp']::text[], '全年', ARRAY['新建筑','几何光影']::text[], 'https://www.xiaohongshu.com/explore/6937f5b3000000000d03429f?xsec_token=ABu-tufnyiXUwsygIVfF7KFAXtJI1LLjQk56isgT4xCP8=&xsec_source=pc_user', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('天马射电望远镜', '位于松江天马山的65米口径射电望远镜，是国之重器、亚洲最大可转动射电望远镜之一。巨大的白色抛物面与山体结合，科幻感与工业感兼具，是上海郊野独特的景观。', '上海市松江区九江公路1365号', 31.05361, 121.18861, '松江区',
   ARRAY['./data/photos/51.1.webp','./data/photos/51.2.webp']::text[], '全年', ARRAY['科技建筑','地标']::text[], 'https://www.xiaohongshu.com/explore/696ad197000000002102916e?xsec_token=ABG6fmbB8tFrlbjrWAiQK-B9sZINj2LtzLh5aZefcirds=&xsec_source=pc_search', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('前滩四方城莫比乌斯环', '前滩四方城3层的艺术装置，以莫比乌斯环为造型灵感，铝合金镜面材质。曲面反射城市天际线，是前滩最具未来感的当代艺术装置机位之一。', '上海市浦东新区前滩四方城3F', 31.17806, 121.51472, '浦东新区',
   ARRAY['./data/photos/54.2.webp','./data/photos/54.3.webp']::text[], '全年', ARRAY['艺术装置','新建筑']::text[], 'https://www.xiaohongshu.com/explore/68c37f91000000001d01c300?xsec_token=ABc3eJL8xhfTwLs3HowDdC62bdCxbPO7fJXFsfmCgghpg=&xsec_source=pc_search', '{}', '[]'::jsonb);
INSERT INTO spots (name, description, address, lat, lng, district, photos, seasons, tags, source_url, closed_days, seasonal) VALUES
  ('音宇宙 LIVERSE 剧场', '由隈研吾设计的飘带剧场，以音宇宙（LIVERSE）为概念，将声学、光影与建筑融为一体。飘带造型屋顶与清水混凝土体量构成独特空间，是徐汇新晋的文化地标与建筑摄影机位。', '上海市徐汇区漕宝路261号鑫耀·光环Live', 31.17472, 121.41361, '徐汇区',
   ARRAY['./data/photos/61.1.webp','./data/photos/61.2.webp','./data/photos/61.3.webp']::text[], '全年', ARRAY['新建筑','文艺','地标']::text[], 'https://www.xiaohongshu.com/explore/6863314e0000000013012422?xsec_token=AB5hLelb_mSFIx2JnjdzGFlH_RO2Si6O5qaJD8G-1AecM=&xsec_source=pc_search', '{}', '[]'::jsonb);

-- 时令花卉导入
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS intro text;
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS flowers text[] DEFAULT '{}';
ALTER TABLE flowers ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';

DELETE FROM flowers;

INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('鲁迅公园-梅园', '梅花', '鲁迅公园梅园，蜡梅与梅花寒冬报春。', '虹口区四川北路2288号（鲁迅公园内）', 31.27367, 121.47871, '虹口区',
   ARRAY['./data/flower-photos/梅花/鲁迅公园-梅园.jpg','./data/flower-photos/梅花/鲁迅公园-梅园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6991db8e000000000a02c2aa?xsec_token=ABuu3n7C6XW-H4TxWh7h7j2qeN47Rna8eDzdrbA51WTAs=&xsec_source=pc_search&source=web_search_result_notes', '鲁迅公园梅园，蜡梅与梅花寒冬报春。', ARRAY['梅花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('世纪公园', '梅花', '上海内环内最大的生态城市公园，四季花海与琼花、荷花、石榴花景观丰富。', '浦东新区锦绣路1001号', 31.21923, 121.543128, '浦东新区',
   ARRAY['./data/flower-photos/梅花/世纪公园 .jpg','./data/flower-photos/梅花/世纪公园  (2).jpg','./data/flower-photos/琼花/世纪公园.jpg','./data/flower-photos/琼花/世纪公园 (2).jpg','./data/flower-photos/绣球/世纪公园.jpg','./data/flower-photos/绣球/世纪公园 (2).jpg','./data/flower-photos/石榴花/世纪公园.jpg','./data/flower-photos/荷花/世纪公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/699584f1000000000a02f850?xsec_token=AB_ZjF29UeO54DHlJtVjhWAUbAuIZZgK_-MVoOMKIapNg=&xsec_source=pc_search&source=web_search_result_notes', '上海内环内最大的生态城市公园，四季花海与琼花、荷花、石榴花景观丰富。', ARRAY['梅花','琼花','绣球','石榴花','荷花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上海总商会旧址', '梅花', '苏州河畔的百年商厦遗址，青藤爬满砖墙，历史感十足。', '静安区北苏州路470号', 31.24407, 121.477943, '静安区',
   ARRAY['./data/flower-photos/梅花/上海总商会旧址.jpg']::text[], 'https://www.xiaohongshu.com/explore/697196cf000000001a025d55?xsec_token=ABpPQ-bivinlRRGWIgT-TN6cCMQdhMJLNwWEvfPdegRRg=&xsec_source=pc_search&source=web_search_result_notes', '苏州河畔的百年商厦遗址，青藤爬满砖墙，历史感十足。', ARRAY['梅花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('莘庄公园', '梅花', '以梅花闻名的老公园，蜡梅与梅花寒冬报春。', '闵行区莘浜路421号', 31.10495, 121.368565, '闵行区',
   ARRAY['./data/flower-photos/梅花/莘庄公园.jpg','./data/flower-photos/梅花/莘庄公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6979582400000000220097c8?xsec_token=AB8J3LnnPK81qyTEg9ylsBVwMcvB8tdEbAKMjqP-BvAPo=&xsec_source=pc_search&source=web_search_result_notes', '以梅花闻名的老公园，蜡梅与梅花寒冬报春。', ARRAY['梅花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('梅园公园', '梅花', '社区公园，泡桐花与梅花在不同季节接力绽放。', '浦东新区乳山路180号', 31.238881, 121.521336, '浦东新区',
   ARRAY['./data/flower-photos/梅花/梅园公园.jpg','./data/flower-photos/梅花/梅园公园 (2).jpg','./data/flower-photos/泡桐/梅园公园.jpg','./data/flower-photos/泡桐/梅园公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6988ae2a000000001b015caf?xsec_token=ABm8B8QWL8zF7T1bU7PI_QGvYlFRF8BHeR1k0iwj0gxbI=&xsec_source=pc_search&source=web_search_result_notes', '社区公园，泡桐花与梅花在不同季节接力绽放。', ARRAY['梅花','泡桐']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('广富林', '梅花', '水下博物馆与古文化遗址，油菜花田环绕遗址公园。', '松江区广富林路3260号', 31.06682, 121.19424, '松江区',
   ARRAY['./data/flower-photos/梅花/广富林.jpg','./data/flower-photos/梅花/广富林 (2).jpg','./data/flower-photos/油菜花/广富林.jpg','./data/flower-photos/油菜花/广富林 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69715e12000000002103ec1f?xsec_token=ABpPQ-bivinlRRGWIgT-TN6XmpCRgePEl6uoQsDvsd32Y=&xsec_source=pc_search&source=web_search_result_notes', '水下博物馆与古文化遗址，油菜花田环绕遗址公园。', ARRAY['梅花','油菜花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('花开海上生态园', '梅花', '四季花海生态园，鲁冰花、虞美人、地肤、红枫轮番登场。', '金山区朱泾镇待泾村秀泾6060号', 30.88829, 121.1134, '金山区',
   ARRAY['./data/flower-photos/梅花/花开海上生态园.jpg','./data/flower-photos/梅花/花开海上生态园 (2).jpg','./data/flower-photos/喜林草/花开海上生态园.jpg','./data/flower-photos/鲁冰花/花开海上生态园.jpg','./data/flower-photos/虞美人/花开海上生态园.jpg','./data/flower-photos/地肤（绿）/花开海上生态园 .jpg','./data/flower-photos/地肤（黄）/花开海上生态园.jpg','./data/flower-photos/红枫/花开海上生态园.jpg']::text[], 'https://www.xiaohongshu.com/explore/699009eb000000001d02768e?xsec_token=AB_38MKvWhC1Tpo80xlhbnevLDq5xPB7tX8aRUkdYkJck=&xsec_source=pc_search&source=web_search_result_notes', '四季花海生态园，鲁冰花、虞美人、地肤、红枫轮番登场。', ARRAY['梅花','喜林草','鲁冰花','虞美人','地肤（绿）','地肤（黄）','红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('曲水园', '梅花', '江南古典园林，菊花展与园林亭台相映成趣。', '青浦区公园路612号', 31.150198, 121.109161, '青浦区',
   ARRAY['./data/flower-photos/梅花/曲水园.jpg','./data/flower-photos/梅花/曲水园 (2).jpg','./data/flower-photos/菊花/曲水园.jpg']::text[], 'https://www.xiaohongshu.com/explore/699a8b4a000000000a03d4bf?xsec_token=ABH1D_Ebzj64-4Ew4Hu2v6G4W744o2qNinelo7pzpa7mM=&xsec_source=pc_search&source=web_search_result_notes', '江南古典园林，菊花展与园林亭台相映成趣。', ARRAY['梅花','菊花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('青溪园', '梅花', '青浦城区园林，梅花与园林景致相映。', '青浦区（青溪园）', 31.141793, 121.111257, '青浦区',
   ARRAY['./data/flower-photos/梅花/青溪园.jpg']::text[], 'https://www.xiaohongshu.com/explore/6988418a000000001b01cd17?xsec_token=ABm8B8QWL8zF7T1bU7PI_QGuAnaKI0ed7ID2wvt5saPM4=&xsec_source=pc_search&source=web_search_result_notes', '青浦城区园林，梅花与园林景致相映。', ARRAY['梅花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('宝山寺', '梅花', '唐代风格寺院，樱花与红枫衬托古刹禅意。', '宝山区罗店镇罗溪路518号', 31.41925, 121.33877, '宝山区',
   ARRAY['./data/flower-photos/梅花/宝山寺.jpg','./data/flower-photos/樱花/宝山寺.jpg','./data/flower-photos/樱花/宝山寺 (2).jpg','./data/flower-photos/红枫/宝山寺.jpg','./data/flower-photos/红枫/宝山寺 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/697196cf000000001a025d55?xsec_token=ABpPQ-bivinlRRGWIgT-TN6cCMQdhMJLNwWEvfPdegRRg=&xsec_source=pc_search&source=web_search_result_notes', '唐代风格寺院，樱花与红枫衬托古刹禅意。', ARRAY['梅花','樱花','红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('真如公园', '腊梅', '社区公园，梅花在早春绽放。', '普陀区（真如）', 31.251158, 121.398144, '普陀区',
   '{}', '', '社区公园，梅花在早春绽放。', ARRAY['腊梅']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('古猗园', '腊梅', '江南五大名园之一，牡丹、石榴花、荷花、紫薇、桂花四季皆有看点。', '嘉定区南翔镇沪宜公路218号', 31.292001, 121.311294, '嘉定区',
   ARRAY['./data/flower-photos/牡丹/古猗园.jpg','./data/flower-photos/牡丹/古猗园 (2).jpg','./data/flower-photos/石榴花/古猗园.jpg','./data/flower-photos/石榴花/古猗园 (2).jpg','./data/flower-photos/荷花/古猗园.jpg','./data/flower-photos/紫薇/古猗园.jpg','./data/flower-photos/桂花/古猗园.jpg','./data/flower-photos/乌桕/古猗园.jpg','./data/flower-photos/乌桕/古猗园 (2).jpg']::text[], '', '江南五大名园之一，牡丹、石榴花、荷花、紫薇、桂花四季皆有看点。', ARRAY['腊梅','牡丹','石榴花','荷花','紫薇','桂花','乌桕']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('御澜湾', '樱花', '淀山湖畔社区绿地，樱花在春日沿湖绽放。', '青浦区淀山湖大道（御澜湾）', 31.14323, 121.09298, '青浦区',
   ARRAY['./data/flower-photos/樱花/御澜湾.jpg']::text[], 'https://www.xiaohongshu.com/explore/69d3864c000000001a022acf?xsec_token=ABLVs2MKKdCUwCnP5rfZQItbi6GM4ssG7QqJfHBaM-QTA=&xsec_source=pc_search&source=web_search_result_notes', '淀山湖畔社区绿地，樱花在春日沿湖绽放。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('德莱蒙德住宅（华山路263弄7号）', '樱花', '老字号品牌馆所在老洋房，樱花在庭院绽放。', '静安区华山路263弄7号', 31.221829, 121.441999, '静安区',
   ARRAY['./data/flower-photos/樱花/德莱蒙德住宅（华山路263弄7号）.jpg','./data/flower-photos/樱花/德莱蒙德住宅（华山路263弄7号） (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69cf00a3000000002003919d?xsec_token=ABIVMRtGTrN36FMIzCkriYB-4QRvgOrCBTGFLTiiQ9VCY=&xsec_source=pc_search&source=web_search_result_notes', '老字号品牌馆所在老洋房，樱花在庭院绽放。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('龙美术馆', '樱花', '西岸艺术地标，樱花在春日点缀滨江美术馆。', '徐汇区龙腾大道3398号', 31.18603, 121.46034, '徐汇区',
   ARRAY['./data/flower-photos/樱花/龙美术馆.jpg']::text[], 'https://www.xiaohongshu.com/explore/69cb55d7000000001a032530?xsec_token=ABQGBkvw3DPDGuTm4BkqxtsTlcxp39SvsItyPr8RYpheg=&xsec_source=pc_search&source=web_search_result_notes', '西岸艺术地标，樱花在春日点缀滨江美术馆。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上海交通大学（徐汇校区）', '樱花', '百年名校，徐汇校区老图书馆与红砖建筑群掩映于樱花树间，春日樱粉与书香相映。', '徐汇区华山路1954号', 31.200577, 121.43181, '徐汇区',
   ARRAY['./data/flower-photos/樱花/上海交通大学（徐汇校区）.jpg','./data/flower-photos/樱花/上海交通大学（徐汇校区） (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69bff67d00000000210076e4?xsec_token=AB-j35qVxj444xrQJT2UnH74G3X8vbDNmXVCeR-eGTsaA=&xsec_source=pc_search&source=web_search_result_notes', '百年名校，徐汇校区老图书馆与红砖建筑群掩映于樱花树间，春日樱粉与书香相映。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('虹口足球场', '樱花', '樱花环绕的体育场，春日粉色花海引无数游客。', '虹口区东江湾路444号', 31.27243, 121.4757, '虹口区',
   ARRAY['./data/flower-photos/樱花/虹口足球场.jpg','./data/flower-photos/樱花/虹口足球场 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69cd10fe000000002302718d?xsec_token=ABye8gtEFt07bvUvGBh3DC3acJDwFKgIgu7-h7XSZCj6Y=&xsec_source=pc_search&source=web_search_result_notes', '樱花环绕的体育场，春日粉色花海引无数游客。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('世博文化公园', '樱花', '上海中心城区最大公园绿地，汇集油菜花、鸢尾、彼岸花、向日葵等四季花海。', '浦东新区世博大道1750号', 31.187793, 121.478735, '浦东新区',
   ARRAY['./data/flower-photos/樱花/世博文化公园.jpg','./data/flower-photos/樱花/世博文化公园 (2).jpg','./data/flower-photos/油菜花/世博文化公园.jpg','./data/flower-photos/鸢尾/世博文化公园.jpg','./data/flower-photos/荷花/世博文化公园.jpg','./data/flower-photos/荷花/世博文化公园 (2).jpg','./data/flower-photos/百子莲/世博文化公园.jpg','./data/flower-photos/百日菊/百日菊_用一百个白昼，烧成漫长的火_11_一个孤独漫步者的随拍_来自小红书网页版.jpg','./data/flower-photos/彼岸花/世博文化公园.jpg','./data/flower-photos/乌桕/世博文化公园.jpg','./data/flower-photos/银杏/世博文化公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69d0788a00000000210050fd?xsec_token=ABcy53L9DiSd-Y_Y9MqzVg_XSzRsysbmYKtv6dYghGiXI=&xsec_source=pc_search&source=web_explore_feed', '上海中心城区最大公园绿地，汇集油菜花、鸢尾、彼岸花、向日葵等四季花海。', ARRAY['樱花','油菜花','鸢尾','荷花','百子莲','百日菊','彼岸花（石蒜，含多色石蒜）','乌桕','银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('顾村公园', '樱花', '上海赏樱胜地，荷花、木香花与粉黛乱子草四季花事不断。', '宝山区沪太路4788号', 31.34571, 121.37573, '宝山区',
   ARRAY['./data/flower-photos/樱花/顾村公园.jpg','./data/flower-photos/樱花/顾村公园 (2).jpg','./data/flower-photos/木香花/顾村公园.jpg','./data/flower-photos/荷花/顾村公园.jpg','./data/flower-photos/粉黛乱子草/顾村公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69d5a6f3000000002102db6c?xsec_token=AByFkRCiwBDECN9zEGz6LSzVIbWR4ogsfOwcqq-sukBu8=&xsec_source=pc_search&source=web_explore_feed', '上海赏樱胜地，荷花、木香花与粉黛乱子草四季花事不断。', ARRAY['樱花','木香花','荷花','粉黛乱子草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('大宁灵石公园', '樱花', '大宁公园的前身，樱花与郁金香花海依旧。', '静安区广中西路288号', 31.27779, 121.43936, '静安区',
   ARRAY['./data/flower-photos/樱花/大宁灵石公园.jpg','./data/flower-photos/樱花/大宁灵石公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/698daa87000000001a02d230?xsec_token=AB5M_BKziGMu9osdwKrShPUCCrFza7R6GlGqyddriR1PY=&xsec_source=pc_search&source=web_explore_feed', '大宁公园的前身，樱花与郁金香花海依旧。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('同济大学（四平路校区）', '樱花', '樱花大道享誉沪上，海棠与樱花共绘春日校园。', '杨浦区四平路1239号', 31.28511, 121.50161, '杨浦区',
   ARRAY['./data/flower-photos/樱花/同济大学（四平路校区）.jpg','./data/flower-photos/樱花/同济大学（四平路校区） (2).jpg','./data/flower-photos/海棠/同济大学（四平路校区）.jpg']::text[], 'https://www.xiaohongshu.com/explore/69ca9e030000000023026042?xsec_token=ABK3tWU2FO1lGwSTi9iYE0n6phn71Wxmn5Knvtf-juBG8=&xsec_source=pc_search&source=web_explore_feed', '樱花大道享誉沪上，海棠与樱花共绘春日校园。', ARRAY['樱花','海棠']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('南浦大桥', '樱花', '上海第一座跨江斜拉桥，樱花在引桥与浦江畔绽放。', '黄浦区南浦大桥（跨黄浦江）', 31.20947, 121.49697, '黄浦区',
   ARRAY['./data/flower-photos/樱花/南浦大桥.jpg']::text[], 'https://www.xiaohongshu.com/explore/69d1e13c000000002102d982?xsec_token=ABbJYBpxfgPp027ro9aMKWt0JEXRbvaitJzgEl5PODKx0=&xsec_source=pc_search&source=web_search_result_notes', '上海第一座跨江斜拉桥，樱花在引桥与浦江畔绽放。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('四川路桥', '樱花', '苏州河老桥，樱花在桥畔与河岸绽放。', '黄浦区四川路桥（跨苏州河）', 31.2438, 121.47851, '黄浦区',
   ARRAY['./data/flower-photos/樱花/四川路桥.jpg','./data/flower-photos/樱花/四川路桥 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69cccb47000000001a02595f?xsec_token=ABDHS_5ALuGVatL0a-bO6p1Th-lYTOeIDdalaAO5y7e4U=&xsec_source=pc_search&source=web_explore_feed', '苏州河老桥，樱花在桥畔与河岸绽放。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('绿之丘', '樱花', '滨江地标建筑，樱花在春季环绕绽放。', '杨浦区杨树浦路（杨浦滨江）', 31.26495, 121.54147, '杨浦区',
   ARRAY['./data/flower-photos/樱花/绿之丘.jpg']::text[], 'https://www.xiaohongshu.com/explore/69db3229000000002202b8fa?xsec_token=ABRJIldyw6NEQKldTbcOt34dIS2I0HgHKsvpkmXXRwdG8=&xsec_source=pc_search&source=web_search_result_notes', '滨江地标建筑，樱花在春季环绕绽放。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('东方渔人码头', '樱花', '滨江工业遗存改造的休闲码头，马鞭草与蔷薇点缀江岸。', '杨浦区杨树浦路1082号', 31.258165, 121.533653, '杨浦区',
   ARRAY['./data/flower-photos/樱花/东方渔人码头.jpg','./data/flower-photos/马鞭草/东方渔人码头.jpg','./data/flower-photos/马鞭草/东方渔人码头 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/67e927f2000000000903a0b4?xsec_token=AB6gpXyFvyjctaK9lzwARsgw4TwcG6YbArkvzJ_pyKzKY=&xsec_source=pc_search&source=web_search_result_notes', '滨江工业遗存改造的休闲码头，马鞭草与蔷薇点缀江岸。', ARRAY['樱花','马鞭草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('华青南路', '樱花', '青浦城区樱花大道，春日粉色长廊。', '青浦区华青南路', 31.141043, 121.12988, '青浦区',
   ARRAY['./data/flower-photos/樱花/华青南路.jpg','./data/flower-photos/樱花/华青南路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69ce2ca9000000002200086d?xsec_token=ABbON8WwsPW5MVYrePBmFIaJBv22mgL6eIE4qYAznGLhU=&xsec_source=pc_search&source=web_search_result_notes', '青浦城区樱花大道，春日粉色长廊。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上海展览中心·西花园', '白玉兰 / 二乔玉兰', '俄式风格建筑群旁的西花园，白玉兰与郁金香在春日次第绽放。', '静安区延安中路1000号', 31.224985, 121.447568, '静安区',
   ARRAY['./data/flower-photos/白玉兰/上海展览中心·西花园.jpg','./data/flower-photos/白玉兰/上海展览中心·西花园 (2).jpg','./data/flower-photos/白玉兰/上海展览中心·西花园 (3).jpg']::text[], 'https://www.xiaohongshu.com/explore/69af882f000000001600be85?xsec_token=ABE7E5FfSE-IA1NxVuwYtaT1JpBsntyp6PUDqaknF2SBA=&xsec_source=pc_search&source=web_search_result_notes', '俄式风格建筑群旁的西花园，白玉兰与郁金香在春日次第绽放。', ARRAY['白玉兰 / 二乔玉兰']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('龙华寺', '白玉兰 / 二乔玉兰', '千年古刹，白玉兰、牡丹、金丝桃、紫薇与桂花四季花事不断。', '徐汇区龙华路2853号', 31.175928, 121.447325, '徐汇区',
   ARRAY['./data/flower-photos/白玉兰/龙华寺.jpg','./data/flower-photos/白玉兰/龙华寺 (2).jpg','./data/flower-photos/牡丹/龙华寺.jpg','./data/flower-photos/金丝桃/龙华寺.jpg','./data/flower-photos/金丝桃/龙华寺 (2).jpg','./data/flower-photos/紫薇/龙华寺.jpg','./data/flower-photos/紫薇/龙华寺 (2).jpg','./data/flower-photos/桂花/龙华寺.jpg','./data/flower-photos/桂花/龙华寺 (2).jpg','./data/flower-photos/银杏/龙华寺.jpg','./data/flower-photos/银杏/龙华寺 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69b2273a000000001503b18c?xsec_token=ABlMROzwA6ukUJyydqZHxmwmo4yZTUnYUjeouKPkw7rVM=&xsec_source=pc_search&source=web_search_result_notes', '千年古刹，白玉兰、牡丹、金丝桃、紫薇与桂花四季花事不断。', ARRAY['白玉兰 / 二乔玉兰','牡丹','金丝桃','紫薇','桂花','银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('陆家嘴中心绿地', '白玉兰 / 二乔玉兰', '陆家嘴核心绿肺，白玉兰与摩天楼群相映。', '浦东新区陆家嘴环路（近金茂大厦）', 31.234604, 121.505346, '浦东新区',
   ARRAY['./data/flower-photos/白玉兰/陆家嘴中心绿地.jpg','./data/flower-photos/白玉兰/陆家嘴中心绿地 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69b6656f000000001d01d380?xsec_token=ABDJFl_Gcse1utba87CRR8LcGbOn6xHIQS4eiR_GjrKuk=&xsec_source=pc_search&source=web_search_result_notes', '陆家嘴核心绿肺，白玉兰与摩天楼群相映。', ARRAY['白玉兰 / 二乔玉兰']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('闵行文化公园', '白玉兰 / 二乔玉兰', '文化主题公园，白玉兰与雏菊在春夏绽放。', '闵行区吴中路（近外环）', 31.177777, 121.377283, '闵行区',
   ARRAY['./data/flower-photos/白玉兰/闵行文化公园.jpg','./data/flower-photos/雏菊/闵行文化公园.jpg','./data/flower-photos/雏菊/闵行文化公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69b4d93c00000000230216a6?xsec_token=ABGAi05fEa0xMWJgIIkY-fJFXLdiB40Bd83LbPNfasy9w=&xsec_source=pc_search&source=web_search_result_notes', '文化主题公园，白玉兰与雏菊在春夏绽放。', ARRAY['白玉兰 / 二乔玉兰','雏菊']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('天马射电天文望远镜', '桃花', '上海65米射电望远镜所在地，桃花环绕科技奇观。', '松江区佘山镇天马山（近天马山园）', 31.097339, 121.170467, '松江区',
   ARRAY['./data/flower-photos/桃花/天马射电天文望远镜.jpg','./data/flower-photos/桃花/天马射电天文望远镜 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69cb7b50000000001a02f7cc?xsec_token=ABQGBkvw3DPDGuTm4BkqxtsSH6yRrj1l-MHmPnRehYunc=&xsec_source=pc_search&source=web_search_result_notes', '上海65米射电望远镜所在地，桃花环绕科技奇观。', ARRAY['桃花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('桃林路', '桃花', '道路桃树成行，春日桃花如霞。', '浦东新区桃林路', 31.226823, 121.539276, '浦东新区',
   ARRAY['./data/flower-photos/桃花/桃林路.jpg']::text[], 'https://www.xiaohongshu.com/explore/69cf7187000000001a0213a2?xsec_token=ABIVMRtGTrN36FMIzCkriYB6hD4CzCMEYISGsBorUV0g8=&xsec_source=pc_search&source=web_search_result_notes', '道路桃树成行，春日桃花如霞。', ARRAY['桃花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('南汇桃花村', '桃花', '上海著名桃花节举办地，万亩桃林春日如霞。', '浦东新区惠南镇（南汇桃花节主会场）', 31.050024, 121.745192, '浦东新区',
   ARRAY['./data/flower-photos/桃花/南汇桃花村.jpg','./data/flower-photos/桃花/南汇桃花村 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69c537310000000023024346?xsec_token=ABxJLD9NLmFCFwiE5a0e_IRoRAGrUF-zg0wfalweDDSso=&xsec_source=pc_search&source=web_search_result_notes', '上海著名桃花节举办地，万亩桃林春日如霞。', ARRAY['桃花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('闸北公园', '海棠', '百年老公园，海棠、绣球、石榴花与紫薇四季花事不断。', '静安区共和新路1555号', 31.270614, 121.453558, '静安区',
   ARRAY['./data/flower-photos/海棠/闸北公园.jpg','./data/flower-photos/海棠/闸北公园 (2).jpg','./data/flower-photos/绣球/闸北公园.jpg','./data/flower-photos/绣球/闸北公园 (2).jpg','./data/flower-photos/石榴花/闸北公园.jpg','./data/flower-photos/紫薇/闸北公园.jpg','./data/flower-photos/紫薇/闸北公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69cd08d80000000023027e94?xsec_token=ABye8gtEFt07bvUvGBh3DC3UTulaTEiwyfDPYLwkVROdo=&xsec_source=pc_search&source=web_search_result_notes', '百年老公园，海棠、绣球、石榴花与紫薇四季花事不断。', ARRAY['海棠','绣球','石榴花','紫薇']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('人民公园', '海棠', '市中心老牌公园，垂丝海棠与樱花在春日争艳。', '黄浦区南京西路231号', 31.233313, 121.466374, '黄浦区',
   ARRAY['./data/flower-photos/海棠/人民公园.jpg','./data/flower-photos/海棠/人民公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69cbbdbe000000002102ef3d?xsec_token=ABQGBkvw3DPDGuTm4BkqxtsSj4yrl-Cf8MIQrdtDP4M8E=&xsec_source=pc_search&source=web_search_result_notes', '市中心老牌公园，垂丝海棠与樱花在春日争艳。', ARRAY['海棠']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('中科路', '海棠', '张江科学城道路绿化带，垂丝海棠沿路盛放。', '浦东新区张江中科路', 31.191969, 121.630147, '浦东新区',
   ARRAY['./data/flower-photos/海棠/中科路.jpg','./data/flower-photos/海棠/中科路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69ce9041000000001f00617b?xsec_token=ABbON8WwsPW5MVYrePBmFIaM1oOctFce3hDFR_wY6k2Lk=&xsec_source=pc_search&source=web_search_result_notes', '张江科学城道路绿化带，垂丝海棠沿路盛放。', ARRAY['海棠']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('黄兴公园', '海棠', '以黄兴命名的公园，海棠花在春日绽放。', '杨浦区营口路699号', 31.296893, 121.528541, '杨浦区',
   ARRAY['./data/flower-photos/海棠/黄兴公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69c8ebce0000000021010ee8?xsec_token=ABMrzz2ZnvdJnt5AtB-LdY2HFNpX0HKZgYWGIjzEn5I9g=&xsec_source=pc_search&source=web_search_result_notes', '以黄兴命名的公园，海棠花在春日绽放。', ARRAY['海棠']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上海稻德粮食合作社', '油菜花', '成片油菜花田铺满田野，春日金黄画卷，适合乡野拍照。', '闵行区（浦江镇农田片区）', 31.077881, 121.512043, '闵行区',
   ARRAY['./data/flower-photos/油菜花/上海稻德粮食合作社.jpg','./data/flower-photos/油菜花/上海稻德粮食合作社 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69b6af4300000000210119d6?xsec_token=ABDJFl_Gcse1utba87CRR8Le4PxROubo4jQFTn3m8W-L0=&xsec_source=pc_search&source=web_search_result_notes', '成片油菜花田铺满田野，春日金黄画卷，适合乡野拍照。', ARRAY['油菜花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('余德耀美术馆', '油菜花', '当代艺术馆，油菜花与艺术装置交织出田园与艺术气息。', '青浦区蟠龙路1238弄（蟠龙天地）', 31.189799, 121.274721, '青浦区',
   ARRAY['./data/flower-photos/油菜花/余德耀美术馆.jpg']::text[], 'https://www.xiaohongshu.com/explore/69b17fc9000000002603089e?xsec_token=ABVsZBBBzHTOTSYqZhC9-Il0qIy5LjciJZosbTc5vv2IM=&xsec_source=pc_search&source=web_search_result_notes', '当代艺术馆，油菜花与艺术装置交织出田园与艺术气息。', ARRAY['油菜花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('和睦村', '油菜花', '江南水乡村落，油菜花田环绕白墙黛瓦。', '青浦区赵巷镇和睦村', 31.15971, 121.23534, '青浦区',
   ARRAY['./data/flower-photos/油菜花/和睦村.jpg']::text[], 'https://www.xiaohongshu.com/explore/69afb3e40000000015030a4e?xsec_token=ABE7E5FfSE-IA1NxVuwYtaT2H3-hTcUqZhmPziWbsIOQ4=&xsec_source=pc_search&source=web_search_result_notes', '江南水乡村落，油菜花田环绕白墙黛瓦。', ARRAY['油菜花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('辰花路', '油菜花', '通往辰山植物园的道路，油菜花田沿路铺展。', '松江区辰花路', 31.054836, 121.142635, '松江区',
   ARRAY['./data/flower-photos/油菜花/辰花路.jpg']::text[], 'https://www.xiaohongshu.com/explore/69bd67e8000000002202b7a4?xsec_token=AB8R_LPlT3VzoJ2CwzcCqQM69Hibn8dM_RsTjBVjQv_3g=&xsec_source=pc_search&source=web_search_result_notes', '通往辰山植物园的道路，油菜花田沿路铺展。', ARRAY['油菜花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('大宁公园', '郁金香', '以郁金香花展闻名，荷花、向日葵与樱花四季景观丰富。', '静安区广中西路288号', 31.27779, 121.43936, '静安区',
   ARRAY['./data/flower-photos/郁金香/大宁公园.jpg','./data/flower-photos/荷花/大宁公园.jpg','./data/flower-photos/荷花/大宁公园 (2).jpg','./data/flower-photos/向日葵/大宁公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69a80b30000000002602e2bf?xsec_token=ABYcY0z568S4dDvOY--mM6npwEbpwcaOwG2yDKra_POdo=&xsec_source=pc_search&source=web_search_result_note', '以郁金香花展闻名，荷花、向日葵与樱花四季景观丰富。', ARRAY['郁金香','荷花','向日葵']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('静安雕塑公园', '郁金香', '雕塑艺术公园，郁金香在春日与雕塑相映。', '静安区北京西路500号', 31.235849, 121.459197, '静安区',
   ARRAY['./data/flower-photos/郁金香/静安雕塑公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69c92cf90000000021011dfc?xsec_token=AB2l-GJpld_gYjdcYy_C2PGR8AEJxZGDX-ExSo6j0AA5M=&xsec_source=pc_search&source=web_search_result_notes', '雕塑艺术公园，郁金香在春日与雕塑相映。', ARRAY['郁金香']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('杨浦滨江', '郁金香', '工业遗存改造的滨江岸线，郁金香点缀江岸步道。', '杨浦区杨树浦路（滨江段）', 31.26495, 121.54147, '杨浦区',
   ARRAY['./data/flower-photos/郁金香/杨浦滨江.jpg','./data/flower-photos/郁金香/杨浦滨江 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69c3d6170000000023017e7e?xsec_token=AB19cOWkAcQeIYMp_CzcOdUljDjpEQgw75bbD2lHtsYsw=&xsec_source=pc_search&source=web_search_result_notes', '工业遗存改造的滨江岸线，郁金香点缀江岸步道。', ARRAY['郁金香']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('琴键春园', '郁金香', '滨江琴键主题花园，郁金香在春日沿江铺展。', '黄浦区（南浦大桥滨江）', 31.20947, 121.49697, '黄浦区',
   ARRAY['./data/flower-photos/郁金香/琴键春园.jpg','./data/flower-photos/郁金香/琴键春园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69bdf9f5000000002800999a?xsec_token=AB8R_LPlT3VzoJ2CwzcCqQM5eN0REtgvqZJjeb1s3e3vk=&xsec_source=pc_search&source=web_search_result_notes', '滨江琴键主题花园，郁金香在春日沿江铺展。', ARRAY['郁金香']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('外滩', '郁金香', '万国建筑博览群，郁金香花带在春日点缀浦江两岸。', '黄浦区中山东一路', 31.244107, 121.485562, '黄浦区',
   ARRAY['./data/flower-photos/郁金香/外滩.jpg','./data/flower-photos/郁金香/外滩 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/699ea790000000000d009e84?xsec_token=ABDXMaOUCU2Jd0ja785QMAazWRND4fBCSRI0L65IvQpFQ=&xsec_source=pc_search&source=web_search_result_notes', '万国建筑博览群，郁金香花带在春日点缀浦江两岸。', ARRAY['郁金香']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('襄阳公园', '郁金香', '淮海路旁老公园，郁金香在春日点缀闹市。', '徐汇区淮海中路1008号', 31.21818, 121.452862, '徐汇区',
   ARRAY['./data/flower-photos/郁金香/襄阳公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69c9c72a000000001a03385a?xsec_token=AB2l-GJpld_gYjdcYy_C2PGZk9LFFosF86oM5vRfGsLPg=&xsec_source=pc_search&source=web_search_result_notes', '淮海路旁老公园，郁金香在春日点缀闹市。', ARRAY['郁金香']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('浦东牡丹园', '牡丹', '以牡丹为主题的园林，暮春国色天香。', '浦东新区（近高行）', 31.28372, 121.60563, '浦东新区',
   ARRAY['./data/flower-photos/牡丹/浦东牡丹园 .jpg','./data/flower-photos/牡丹/浦东牡丹园  (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69d9a2cc000000002200fc38?xsec_token=ABAgo1Mq2Mg_kw6ne3yeR2c21wv6QYexZv6PG3gE6UHWU=&xsec_source=pc_search&source=web_search_result_notes', '以牡丹为主题的园林，暮春国色天香。', ARRAY['牡丹']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('漕溪公园', '牡丹', '江南风格园林，牡丹与百子莲在不同季节绽放。', '徐汇区漕溪路203号', 31.174177, 121.430895, '徐汇区',
   ARRAY['./data/flower-photos/牡丹/漕溪公园.jpg','./data/flower-photos/牡丹/漕溪公园 (2).jpg','./data/flower-photos/百子莲/漕溪公园.jpg','./data/flower-photos/百子莲/漕溪公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69d4e4bf000000002100658b?xsec_token=ABLFuYLeRYptEOd7Ji4i6ZnDCklWd6FKRwFK3x4-xb6ZU=&xsec_source=pc_search&source=web_search_result_notes', '江南风格园林，牡丹与百子莲在不同季节绽放。', ARRAY['牡丹','百子莲']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上海师范大学（徐汇校区）', '紫藤', '师大校园紫藤长廊与蔷薇墙是经典打卡点，花季书香满园。', '徐汇区桂林路100号', 31.163415, 121.414708, '徐汇区',
   ARRAY['./data/flower-photos/紫藤/上海师范大学（徐汇校区）.jpg','./data/flower-photos/紫藤/上海师范大学（徐汇校区） (2).jpg','./data/flower-photos/紫藤/上海师范大学（徐汇校区） (3).jpg']::text[], 'https://www.xiaohongshu.com/explore/69da54cb000000001a03212f?xsec_token=ABnA77rx-rBbFLH54D28Jp4xOJ0deYaEGnyGgN29E8t-I=&xsec_source=pc_search&source=web_explore_feed', '师大校园紫藤长廊与蔷薇墙是经典打卡点，花季书香满园。', ARRAY['紫藤']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('嘉定紫藤园', '紫藤', '以紫藤闻名，百株紫藤花棚暮春如紫色瀑布。', '嘉定区博乐路45号', 31.38129, 121.2542, '嘉定区',
   ARRAY['./data/flower-photos/紫藤/嘉定紫藤园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69e19cc6000000001b022d22?xsec_token=ABb1VW8Rx2nZALQCvo5w12TiAluMHXAya6nE0RaQxRKEM=&xsec_source=pc_search&source=web_explore_feed', '以紫藤闻名，百株紫藤花棚暮春如紫色瀑布。', ARRAY['紫藤']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('闵行古藤园', '紫藤', '以古紫藤闻名的园林，暮春紫藤垂瀑。', '闵行区临沧路（古藤园）', 31.00469, 121.38251, '闵行区',
   ARRAY['./data/flower-photos/紫藤/闵行古藤园.jpg','./data/flower-photos/紫藤/闵行古藤园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69d79b20000000001b0023a9?xsec_token=ABUl4Scr-HuLXwemFgwvlZYAtkaIJB5gv_l_qGgfLzq3o=&xsec_source=pc_search&source=web_explore_feed', '以古紫藤闻名的园林，暮春紫藤垂瀑。', ARRAY['紫藤']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('太原路215弄', '紫藤', '幽静里弄，紫藤攀满老墙，春日紫色花瀑。', '徐汇区太原路215弄', 31.206775, 121.450918, '徐汇区',
   ARRAY['./data/flower-photos/紫藤/太原路215弄.jpg','./data/flower-photos/紫藤/太原路215弄 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69db6d55000000002103a23a?xsec_token=ABRJIldyw6NEQKldTbcOt34Yxu5eQy2WD0rJH1mtQYSZI=&xsec_source=pc_search&source=web_explore_feed', '幽静里弄，紫藤攀满老墙，春日紫色花瀑。', ARRAY['紫藤']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('东平森林公园', '紫藤', '华东地区最大平原人造森林，紫藤与森林氧吧相融。', '崇明区北沿公路2188号', 31.538683, 121.841338, '崇明区',
   ARRAY['./data/flower-photos/紫藤/东平森林公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69eccd07000000002202677e?xsec_token=ABvPRmUpX8f23vRx6g6UISXWCM0Gid87yeb6N3Q9c5nDc=&xsec_source=pc_search&source=web_explore_feed', '华东地区最大平原人造森林，紫藤与森林氧吧相融。', ARRAY['紫藤']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('广富林郊野公园', '蔷薇', '郊野花海公园，蔷薇花墙与田园景观相映。', '松江区广富林路（近广富林遗址）', 31.059544, 121.233671, '松江区',
   ARRAY['./data/flower-photos/蔷薇/广富林郊野公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69fd6377000000003502fad1?xsec_token=ABuBBdEGj29WaWT74Xf9aCo5XGFEa3pgavJs_x9msKKLM=&xsec_source=pc_search&source=web_explore_feed', '郊野花海公园，蔷薇花墙与田园景观相映。', ARRAY['蔷薇']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('复兴中路', '蔷薇', '梧桐掩映的优雅马路，蔷薇花墙在春夏沿街绽放。', '黄浦区复兴中路', 31.219338, 121.473552, '黄浦区',
   ARRAY['./data/flower-photos/蔷薇/复兴中路.jpg','./data/flower-photos/蔷薇/复兴中路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69f06008000000002202a690?xsec_token=ABu7Ld2K76xmvr2DMWzDh_bNjUJMqjPzEPCxMoWaf2VYo=&xsec_source=pc_search&source=web_explore_feed', '梧桐掩映的优雅马路，蔷薇花墙在春夏沿街绽放。', ARRAY['蔷薇']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('黄浦滨江', '蔷薇', '黄浦滨江岸线，蔷薇花墙沿江绽放。', '黄浦区（黄浦滨江段）', 31.19595, 121.48467, '黄浦区',
   ARRAY['./data/flower-photos/蔷薇/黄浦滨江.jpg']::text[], 'https://www.xiaohongshu.com/explore/69ff0233000000002202a063?xsec_token=ABez0J5Ib8jqUeVFbovnkAqcj36rg5g0SYeGr_IO3C_c4=&xsec_source=pc_search&source=web_explore_feed', '黄浦滨江岸线，蔷薇花墙沿江绽放。', ARRAY['蔷薇']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('东江文体公园', '蔷薇', '滨江文体休闲公园，蔷薇与月季花墙沿步道盛开。', '浦东新区（近东江）', 31.18368, 121.47533, '浦东新区',
   ARRAY['./data/flower-photos/蔷薇/东江文体公园.jpg','./data/flower-photos/蔷薇/东江文体公园 (2).jpg','./data/flower-photos/月季/东江文体公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69fc92fa00000000350313d8?xsec_token=ABrThYEMLNjyjt2dP0C0Ju7yYAsewHZt3ixfLaFoHN5fo=&xsec_source=pc_search&source=web_explore_feed', '滨江文体休闲公园，蔷薇与月季花墙沿步道盛开。', ARRAY['蔷薇','月季']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('辰山植物园', '喜林草', '上海最大植物园，喜林草蓝色花海与矿坑花园闻名。', '松江区辰花路3888号', 31.07672, 121.17583, '松江区',
   ARRAY['./data/flower-photos/喜林草/辰山植物园.jpg','./data/flower-photos/喜林草/辰山植物园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69ec99410000000023016e92?xsec_token=ABvPRmUpX8f23vRx6g6UISXb9VN0AQzde1L3Vq8c5nHeY=&xsec_source=pc_search&source=web_explore_feed', '上海最大植物园，喜林草蓝色花海与矿坑花园闻名。', ARRAY['喜林草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('前滩休闲公园', '喜林草', '黄浦江畔休闲公园，喜林草、鲁冰花、月季、百日菊层层铺展。', '浦东新区前滩大道（近东方体育中心）', 31.157802, 121.467803, '浦东新区',
   ARRAY['./data/flower-photos/喜林草/前滩休闲公园.jpg','./data/flower-photos/鲁冰花/前滩休闲公园.jpg','./data/flower-photos/月季/前滩休闲公园.jpg','./data/flower-photos/月季/前滩休闲公园 (2).jpg','./data/flower-photos/百日菊/前滩公园｜乒乓菊和百日菊的盛开季_1_小杨学摄影_来自小红书网页版.jpg']::text[], 'https://www.xiaohongshu.com/explore/69df5e390000000022026944?xsec_token=ABQDlneqZulku1KklAbSs7xXO8o1QkgeMcqX3vYUn-YQA=&xsec_source=pc_search&source=web_explore_feed', '黄浦江畔休闲公园，喜林草、鲁冰花、月季、百日菊层层铺展。', ARRAY['喜林草','鲁冰花','月季','百日菊']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('滨江森林公园', '喜林草', '黄浦江畔森林公园，杜鹃、绣球、月季、粉黛乱子草四季花事不断。', '浦东新区高桥镇凌桥高沙滩3号', 31.38156, 121.52174, '浦东新区',
   ARRAY['./data/flower-photos/喜林草/滨江森林公园.jpg','./data/flower-photos/杜鹃/滨江森林公园.jpg','./data/flower-photos/杜鹃/滨江森林公园 (2).jpg','./data/flower-photos/木绣球/滨江森林公园.jpg','./data/flower-photos/木绣球/滨江森林公园 (2).jpg','./data/flower-photos/绣球/滨江森林公园.jpg','./data/flower-photos/绣球/滨江森林公园 (2).jpg','./data/flower-photos/月季/滨江森林公园.jpg','./data/flower-photos/粉黛乱子草/滨江森林公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69d3baa90000000023013bc9?xsec_token=ABLVs2MKKdCUwCnP5rfZQItSAgsbIyC9y4Qm67tSSbcKI=&xsec_source=pc_search&source=web_explore_feed', '黄浦江畔森林公园，杜鹃、绣球、月季、粉黛乱子草四季花事不断。', ARRAY['喜林草','杜鹃','木绣球','绣球','月季','粉黛乱子草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('陈春绿地', '雏菊', '社区绿地，雏菊花海在春夏铺展。', '松江区陈春路', 31.070339, 121.310345, '松江区',
   ARRAY['./data/flower-photos/雏菊/陈春绿地.jpg','./data/flower-photos/雏菊/陈春绿地 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69ee2cbb000000003503a836?xsec_token=AB0c1er7SBWNsV5INSeECKakuYaswOLFf1W4AgdUVNf4Y=&xsec_source=pc_search&source=web_explore_feed', '社区绿地，雏菊花海在春夏铺展。', ARRAY['雏菊']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('共青森林公园', '鸢尾', '森林花海胜地，木绣球、绣球、月季、菊花与彼岸花四季轮转。', '杨浦区军工路2000号', 31.290718, 121.551377, '杨浦区',
   ARRAY['./data/flower-photos/鸢尾/共青森林公园.jpg','./data/flower-photos/鸢尾/共青森林公园 (2).jpg','./data/flower-photos/木绣球/共青森林公园.jpg','./data/flower-photos/绣球/共青森林公园.jpg','./data/flower-photos/马鞭草/共青森林公园 .jpg','./data/flower-photos/彼岸花/共青森林公园.jpg','./data/flower-photos/彼岸花/共青森林公园 (2).jpg','./data/flower-photos/菊花/共青森林公园.jpg','./data/flower-photos/红枫/共青森林公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a05adf20000000035028164?xsec_token=ABDj4T5OIBZLvYGx-Yp9CbYLbPW-46qcKYii-2NW0eqZ0=&xsec_source=pc_search&source=web_explore_feed', '森林花海胜地，木绣球、绣球、月季、菊花与彼岸花四季轮转。', ARRAY['鸢尾','木绣球','绣球','马鞭草','彼岸花（石蒜，含多色石蒜）','菊花','红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上海植物园', '鸢尾', '上海老牌植物园，鸢尾、琼花、彼岸花等四季花展不断。', '徐汇区龙吴路1111号', 31.148284, 121.445653, '徐汇区',
   ARRAY['./data/flower-photos/鸢尾/上海植物园.jpg','./data/flower-photos/琼花/上海植物园.jpg','./data/flower-photos/彼岸花/上海植物园.jpg','./data/flower-photos/彼岸花/上海植物园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a126e8f0000000037037b33?xsec_token=ABVzCKWevpC1dIjtv34VGGrTa5UwFlHuBfoORqFwJ4_s8=&xsec_source=pc_search&source=web_explore_feed', '上海老牌植物园，鸢尾、琼花、彼岸花等四季花展不断。', ARRAY['鸢尾','琼花','彼岸花（石蒜，含多色石蒜）']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('外滩老市府露台', '杜鹃', '外滩源露台花园，杜鹃在历史建筑间盛放。', '黄浦区中山东一路（外滩源）', 31.24431, 121.48457, '黄浦区',
   ARRAY['./data/flower-photos/杜鹃/外滩老市府露台.jpg']::text[], 'https://www.xiaohongshu.com/explore/69e44d97000000001a0321cb?xsec_token=ABtog0IR_nKaVw_DmhzF0CBXsTxl6BEHgM_ivN1KYKbHI=&xsec_source=pc_search&source=web_explore_feed', '外滩源露台花园，杜鹃在历史建筑间盛放。', ARRAY['杜鹃']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('辅德里公园', '杜鹃', '中共二大会址纪念馆所在里弄，绣球花与杜鹃装点红色街区。', '静安区老成都北路7弄（辅德里）', 31.226472, 121.461436, '静安区',
   ARRAY['./data/flower-photos/杜鹃/辅德里公园.jpg','./data/flower-photos/绣球/辅德里公园.jpg','./data/flower-photos/绣球/辅德里公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69e6041a000000002301d72f?xsec_token=AB_vjlm78_Bc1BJOQ-gvJzgts-dOiuBjXMI4Z92QDyIm4=&xsec_source=pc_search&source=web_explore_feed', '中共二大会址纪念馆所在里弄，绣球花与杜鹃装点红色街区。', ARRAY['杜鹃','绣球']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('莘庄梅园', '木绣球', '梅花专类园，木绣球在暮春绽放。', '闵行区（近莘庄公园）', 31.1043, 121.36856, '闵行区',
   ARRAY['./data/flower-photos/木绣球/莘庄梅园.jpg','./data/flower-photos/木绣球/莘庄梅园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69c9eecc000000002103a6dc?xsec_token=AB2l-GJpld_gYjdcYy_C2PGciAWQ-cKecCFhqd63chsr0=&xsec_source=pc_search&source=web_explore_feed', '梅花专类园，木绣球在暮春绽放。', ARRAY['木绣球']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('横沔公园', '二月兰', '郊野生态公园，二月兰与水杉林相映成趣。', '浦东新区康桥镇（横沔）', 31.155667, 121.637944, '浦东新区',
   ARRAY['./data/flower-photos/二月兰/横沔公园.jpg','./data/flower-photos/水杉 落羽杉/横沔公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69c698d9000000001a02f012?xsec_token=ABRdR17mfh5CJKCcGHm8wpUdTuGFXVtyxFH06EafyTGmk=&xsec_source=pc_search&source=web_explore_feed', '郊野生态公园，二月兰与水杉林相映成趣。', ARRAY['二月兰','水杉 落羽杉']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('共青国家森林公园', '二月兰', '上海最大森林公园之一，二月兰铺满林间，野趣盎然。', '杨浦区军工路2000号', 31.290718, 121.551377, '杨浦区',
   ARRAY['./data/flower-photos/二月兰/共青国家森林公园.jpg','./data/flower-photos/二月兰/共青国家森林公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69aae9ad000000001a024554?xsec_token=ABNTBUa9Uafd36ZlVx-iyYUmVkbAX_d8Wwq6ET7eAccig=&xsec_source=pc_search&source=web_explore_feed', '上海最大森林公园之一，二月兰铺满林间，野趣盎然。', ARRAY['二月兰']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('东风公园', '二月兰', '上海查无此园，疑为外省同名公园，观赏信息待核实。', '（待确认）', 31.19226, 121.51509, '待确认',
   ARRAY['./data/flower-photos/二月兰/东风公园.jpg','./data/flower-photos/二月兰/东风公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69d50cf9000000002100595b?xsec_token=AByFkRCiwBDECN9zEGz6LSzVX4tnDJDNhr13gn-cEfBXQ=&xsec_source=pc_search&source=web_explore_feed', '上海查无此园，疑为外省同名公园，观赏信息待核实。', ARRAY['二月兰']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('汇一路', '二月兰', '道路绿化带，二月兰在春日铺满路边。', '奉贤区汇一路', 30.976329, 121.499606, '奉贤区',
   ARRAY['./data/flower-photos/二月兰/汇一路.jpg']::text[], 'https://www.xiaohongshu.com/explore/67ed506b000000001d021210?xsec_token=ABY5XHD-rDwx6XKjvIZbz_1kJVOy6rXfXM25ZSfMb5shc=&xsec_source=pc_search&source=web_explore_feed', '道路绿化带，二月兰在春日铺满路边。', ARRAY['二月兰']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('沪闵路与银春路交叉口', '二月兰', '路口绿地，二月兰在春日铺满道路边角。', '闵行区沪闵路与银春路交叉口', 31.0997, 121.375, '闵行区',
   ARRAY['./data/flower-photos/二月兰/沪闵路与银春路交叉口.jpg']::text[], 'https://www.xiaohongshu.com/explore/69b03031000000000600a83d?xsec_token=AB29vRpk7vIMWfZUKfXhLfoUqeimUhz2PYHP0iWy42z_I=&xsec_source=pc_search&source=web_explore_feed', '路口绿地，二月兰在春日铺满道路边角。', ARRAY['二月兰']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('锦绣文化公园', '虞美人', '文化主题公园，虞美人在春夏绽放。', '浦东新区锦绣路（近世纪公园）', 31.21759, 121.5478, '浦东新区',
   ARRAY['./data/flower-photos/虞美人/锦绣文化公园.jpg','./data/flower-photos/虞美人/锦绣文化公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69fb590600000000360180e4?xsec_token=ABFCW6ip_q48SW84rAAYFYJcI33cISo3jZLxGkHzQ66c0=&xsec_source=pc_search&source=web_explore_feed', '文化主题公园，虞美人在春夏绽放。', ARRAY['虞美人']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('肇嘉浜路2号口', '虞美人', '地铁站口绿地，虞美人在春夏摇曳。', '徐汇区肇嘉浜路（地铁站2号口）', 31.2025, 121.448481, '徐汇区',
   ARRAY['./data/flower-photos/虞美人/肇嘉浜路2号口.jpg']::text[], 'https://www.xiaohongshu.com/explore/69be7e46000000001f001f60?xsec_token=ABHNdU1RBwIaW_2Lxuo1OOUXNcNz-nxi4qbQxlWDqzIGY=&xsec_source=pc_search&source=web_explore_feed', '地铁站口绿地，虞美人在春夏摇曳。', ARRAY['虞美人']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('西岸艺术公园', '虞美人', '西岸滨江艺术公园，虞美人在春夏盛开。', '徐汇区龙腾大道（西岸滨江）', 31.184852, 121.459681, '徐汇区',
   ARRAY['./data/flower-photos/虞美人/西岸艺术公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69dce0fb000000002301651e?xsec_token=ABMYyUKYzT_i8f4zpDvKzTb68cN8ktzET6YDEDJeRUpkY=&xsec_source=pc_search&source=web_explore_feed', '西岸滨江艺术公园，虞美人在春夏盛开。', ARRAY['虞美人']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('红枫路', '木香花', '木香花沿街绽放的优雅道路。', '浦东新区红枫路', 31.237954, 121.592332, '浦东新区',
   ARRAY['./data/flower-photos/木香花/红枫路.jpg','./data/flower-photos/木香花/红枫路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69df90b4000000001a02c206?xsec_token=ABQDlneqZulku1KklAbSs7xdAe8sDccsCID78APILISm4=&xsec_source=pc_search&source=web_explore_feed', '木香花沿街绽放的优雅道路。', ARRAY['木香花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('山阴路', '木香花', '梧桐老街，木香花攀墙而上，初夏芬芳。', '虹口区山阴路', 31.26852, 121.480289, '虹口区',
   ARRAY['./data/flower-photos/木香花/山阴路.jpg','./data/flower-photos/木香花/山阴路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69e08dd900000000230110da?xsec_token=ABbYz5CVqKk_kYdRsak6alWPDspWNuwBwRIVKQ7o11FQQ=&xsec_source=pc_search&source=web_explore_feed', '梧桐老街，木香花攀墙而上，初夏芬芳。', ARRAY['木香花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('愚园路1088弄', '木香花', '网红弄堂街区，木香花攀满墙面，初夏芬芳四溢。', '长宁区愚园路1088弄', 31.221122, 121.423936, '长宁区',
   ARRAY['./data/flower-photos/木香花/愚园路1088弄.jpg','./data/flower-photos/木香花/愚园路1088弄 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69d64d0b000000001a033a20?xsec_token=ABrTUlbiGj1aD7td_seGP2qQWhmpCTqaHbYiBy5ieZ66M=&xsec_source=pc_search&source=web_explore_feed', '网红弄堂街区，木香花攀满墙面，初夏芬芳四溢。', ARRAY['木香花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('得丘艺术区', '木香花', '艺术创意园区，木香花与工业建筑碰撞出文艺气息。', '闵行区（近莘庄）', 31.11089, 121.38208, '闵行区',
   ARRAY['./data/flower-photos/木香花/得丘艺术区.jpg','./data/flower-photos/木香花/得丘艺术区 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69d8deb4000000001d01f636?xsec_token=ABJNdDQTzj7_EaYdfjjFO2dvyKtO0X5PuUXJlXXh0xF-8=&xsec_source=pc_search&source=web_explore_feed', '艺术创意园区，木香花与工业建筑碰撞出文艺气息。', ARRAY['木香花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('春西路', '木香花', '道路绿化带，木香花在春夏之交沿墙盛开。', '闵行区春西路', 31.078168, 121.369635, '闵行区',
   ARRAY['./data/flower-photos/木香花/春西路.jpg','./data/flower-photos/木香花/春西路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/67f905a6000000001c0369c2?xsec_token=ABncs3M2ruuwnER6QW6iVwjxnKJh2gjsjuMUJkijNRohQ=&xsec_source=pc_search&source=web_explore_feed', '道路绿化带，木香花在春夏之交沿墙盛开。', ARRAY['木香花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('汉口路老市府', '泡桐', '原上海市府大楼，泡桐花在老建筑旁绽放。', '黄浦区汉口路193号', 31.238, 121.481851, '黄浦区',
   ARRAY['./data/flower-photos/泡桐/汉口路老市府.jpg']::text[], 'https://www.xiaohongshu.com/explore/69eabbbb0000000020013001?xsec_token=ABpgLjHgWE3bixYybe_cKpfCQ0pZfOdZj9qozxRAoOaIo=&xsec_source=pc_search&source=web_explore_feed', '原上海市府大楼，泡桐花在老建筑旁绽放。', ARRAY['泡桐']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('子长路', '泡桐', '社区道路，泡桐花在春日高处绽放。', '普陀区子长路', 31.265771, 121.429074, '普陀区',
   ARRAY['./data/flower-photos/泡桐/子长路.jpg']::text[], 'https://www.xiaohongshu.com/explore/69db7c2a000000001f001628?xsec_token=ABRJIldyw6NEQKldTbcOt34WzEB-cipSJkd_cQOLxedvg=&xsec_source=pc_search&source=web_explore_feed', '社区道路，泡桐花在春日高处绽放。', ARRAY['泡桐']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('听翠园', '绣球', '新中式园林公园，绣球花海与湖景相映。', '闵行区（近闵行文化公园）', 31.1684, 121.35639, '闵行区',
   ARRAY['./data/flower-photos/绣球/听翠园.jpg','./data/flower-photos/绣球/听翠园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a1944da000000003703489c?xsec_token=AB2d8ekfIuqGsgC5m31cjK6S5rsN_rSE5gtrXiYUnnyww=&xsec_source=pc_search&source=web_explore_feed', '新中式园林公园，绣球花海与湖景相映。', ARRAY['绣球']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('苏州河樱花谷驿站', '樱花', '苏州河樱花谷驿站，绣球花与水岸景观相映。', '黄浦区苏州河畔（近外白渡桥）', 31.2438, 121.47851, '黄浦区',
   ARRAY['./data/flower-photos/绣球/苏州河樱花谷驿站.jpg','./data/flower-photos/绣球/苏州河樱花谷驿站 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a1fedc40000000036031c68?xsec_token=ABN1Y5A_TDtzMjXXDISmJmoxTVjb0L4dfu84_3EjoyQew=&xsec_source=pc_search&source=web_explore_feed', '苏州河樱花谷驿站，绣球花与水岸景观相映。', ARRAY['樱花','紫藤','绣球']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('肇嘉浜路', '绣球', '城市主干道，绣球花点缀绿化带。', '徐汇区肇嘉浜路', 31.2025, 121.448481, '徐汇区',
   ARRAY['./data/flower-photos/绣球/肇嘉浜路.jpg','./data/flower-photos/绣球/肇嘉浜路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a1ba369000000003502c0be?xsec_token=AB8f89cJDpg_5biu3UO0XRW3ShGUpPPyTmov25Sfn3nQU=&xsec_source=pc_search&source=web_explore_feed', '城市主干道，绣球花点缀绿化带。', ARRAY['绣球']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('桂江路', '绣球', '社区道路，月季与绣球沿街绽放。', '徐汇区桂江路', 31.154292, 121.403803, '徐汇区',
   ARRAY['./data/flower-photos/绣球/桂江路.jpg','./data/flower-photos/月季/桂江路.jpg','./data/flower-photos/月季/桂江路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/682ee93900000000230008e5?xsec_token=ABtq0uYg0q5s-b0q2bXRK8muRVtVipcpoPi0A3w7btKt0=&xsec_source=pc_search&source=web_explore_feed', '社区道路，月季与绣球沿街绽放。', ARRAY['绣球','月季']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('鲁迅公园', '绣球', '纪念鲁迅的百年公园，红枫与绣球装点四季。', '虹口区四川北路2288号', 31.270433, 121.478075, '虹口区',
   ARRAY['./data/flower-photos/绣球/鲁迅公园.jpg','./data/flower-photos/红枫/鲁迅公园.jpg','./data/flower-photos/红枫/鲁迅公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a116ca000000000070216fa?xsec_token=AB7ryXA__8SsD2S2To9yTxRkMWsn8edb2wX0eWByQkUMc=&xsec_source=pc_search&source=web_explore_feed', '纪念鲁迅的百年公园，红枫与绣球装点四季。', ARRAY['绣球','红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('花木月季园', '月季', '以月季为主题的花园，五月花开满园。', '浦东新区（花木街道）', 31.208548, 121.543566, '浦东新区',
   ARRAY['./data/flower-photos/月季/花木月季园.jpg','./data/flower-photos/月季/花木月季园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a10f2a90000000008031257?xsec_token=ABRob3L7aqbYfSCAO4RThqxxIJjGntw8jPRYqasgmkRFI=&xsec_source=pc_search&source=web_explore_feed', '以月季为主题的花园，五月花开满园。', ARRAY['月季']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('薰衣草公园', '薰衣草', '上海国际旅游度假区薰衣草园，初夏紫色花海。', '浦东新区（上海国际旅游度假区）', 31.15701, 121.67303, '浦东新区',
   ARRAY['./data/flower-photos/薰衣草/薰衣草公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/682eec77000000000303c847?xsec_token=ABtq0uYg0q5s-b0q2bXRK8mvxhQaHr4amB7mnYxSnnBMA=&xsec_source=pc_search&source=web_explore_feed', '上海国际旅游度假区薰衣草园，初夏紫色花海。', ARRAY['薰衣草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('秋霞圃', '石榴花', '江南古典园林，石榴花与园景相映成趣。', '嘉定区东大街314号', 31.388084, 121.249654, '嘉定区',
   ARRAY['./data/flower-photos/石榴花/秋霞圃.jpg','./data/flower-photos/石榴花/秋霞圃 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a130e4000000000060353fe?xsec_token=AB6SkRmI-BSb576pvmCgYhaQxOqBnJrTyJlW-9N5W7v20=&xsec_source=pc_search&source=web_explore_feed', '江南古典园林，石榴花与园景相映成趣。', ARRAY['石榴花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('寻梦源・梦水乡', '马鞭草', '水乡花海景区，马鞭草紫色花田铺展水岸。', '青浦区（朱家角方向）', 31.102513, 121.044479, '青浦区',
   ARRAY['./data/flower-photos/马鞭草/寻梦源・梦水乡.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a25620b0000000021016b1c?xsec_token=ABiHIAvl4t0cTGflEnL8z01qPP6QHysXpLcgi_5JcAWAk=&xsec_source=pc_search&source=web_explore_feed', '水乡花海景区，马鞭草紫色花田铺展水岸。', ARRAY['马鞭草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('油罐艺术中心', '马鞭草', '油罐改造的艺术中心，马鞭草在草坪间紫色摇曳。', '徐汇区龙腾大道2380号', 31.16656, 121.459488, '徐汇区',
   ARRAY['./data/flower-photos/马鞭草/油罐艺术中心.jpg','./data/flower-photos/马鞭草/油罐艺术中心 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a0c74c900000000350293de?xsec_token=AB64W8GklofnVFW6aejW8blkBi_q-nkjY1zCIjjcWzMoU=&xsec_source=pc_search&source=web_explore_feed', '油罐改造的艺术中心，马鞭草在草坪间紫色摇曳。', ARRAY['马鞭草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('东滩湿地公园', '马鞭草', '长江口生态湿地，马鞭草花海与候鸟湿地景观独特。', '崇明区东旺路（长江口）', 31.51973, 121.94725, '崇明区',
   ARRAY['./data/flower-photos/马鞭草/东滩湿地公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a25284a000000001c027381?xsec_token=ABiHIAvl4t0cTGflEnL8z01pKTYcuTlnqRg9QhnlL0p4Y=&xsec_source=pc_search&source=web_explore_feed', '长江口生态湿地，马鞭草花海与候鸟湿地景观独特。', ARRAY['马鞭草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('延中绿地', '金丝桃', '市中心大型绿地，红枫与金丝桃花点缀都市绿洲。', '黄浦区延安中路（延中绿地）', 31.28082, 121.4536, '黄浦区',
   ARRAY['./data/flower-photos/金丝桃/延中绿地.jpg','./data/flower-photos/红枫/延中绿地.jpg','./data/flower-photos/红枫/延中绿地 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/66604ddb000000000c01a613?xsec_token=ABN1jv2fMvFKaEIXwWkbVpRFVagoYRRAgkCFa6BVscHXw=&xsec_source=pc_search&source=web_explore_feed', '市中心大型绿地，红枫与金丝桃花点缀都市绿洲。', ARRAY['金丝桃','红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('莲湖村', '荷花', '江南水乡村落，荷花在盛夏铺满池塘。', '青浦区金泽镇莲湖村', 31.06128, 120.99822, '青浦区',
   ARRAY['./data/flower-photos/荷花/莲湖村.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a40d8570000000006022466?xsec_token=ABmUPNmhFF0laiE0Bvijoxl68hzc6jzrSlllJV55Ihc28=&xsec_source=pc_search&source=web_explore_feed', '江南水乡村落，荷花在盛夏铺满池塘。', ARRAY['荷花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('闵行体育公园', '向日葵', '体育主题公园，向日葵花海在盛夏绽放。', '闵行区新镇路456号', 31.145571, 121.362568, '闵行区',
   ARRAY['./data/flower-photos/向日葵/闵行体育公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a097f68000000003601c07a?xsec_token=ABB3xuWbrqYbB2cJEegzW9APrDRpIDUvnrWkR6gRhD1VE=&xsec_source=pc_search&source=web_explore_feed', '体育主题公园，向日葵花海在盛夏绽放。', ARRAY['向日葵']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('南园滨江绿地', '向日葵', '黄浦滨江绿地，向日葵与乌桕、银杏装点四季江岸。', '黄浦区龙华东路（近南园）', 31.197573, 121.475826, '黄浦区',
   ARRAY['./data/flower-photos/向日葵/南园滨江绿地.jpg','./data/flower-photos/乌桕/南园滨江绿地.jpg','./data/flower-photos/银杏/南园滨江绿地.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a4cf702000000001702e2e7?xsec_token=ABLbONIUpaGQtUba9DgexMhfMiE2RU50YHeXrsgOSDybw=&xsec_source=pc_search&source=web_explore_feed', '黄浦滨江绿地，向日葵与乌桕、银杏装点四季江岸。', ARRAY['向日葵','乌桕','银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('桃浦中央绿地', '向日葵', '大型城市中央绿地，向日葵花海在盛夏绽放。', '普陀区桃浦（中央绿地）', 31.284398, 121.368862, '普陀区',
   ARRAY['./data/flower-photos/向日葵/桃浦中央绿地.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a9d358e000000000d024311?xsec_token=ABAF5JFTVT-gk6b1lPUm2m2g6ss-Mr251epnMUQJUdsoQ=&xsec_source=pc_search&source=web_explore_feed', '大型城市中央绿地，向日葵花海在盛夏绽放。', ARRAY['向日葵']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('宝山罗店联合村', '向日葵', '乡村向日葵花田，盛夏金黄笑脸向阳。', '宝山区罗店镇联合村', 31.40781, 121.31888, '宝山区',
   ARRAY['./data/flower-photos/向日葵/宝山罗店联合村.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a2eabf8000000001702e657?xsec_token=ABqL3BCBCRC1oEb0sMfzCBw86zS9Z-c1bb4iwHrtXKimc=&xsec_source=pc_search&source=web_explore_feed', '乡村向日葵花田，盛夏金黄笑脸向阳。', ARRAY['向日葵']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('醉白池', '紫薇', '上海五大古典园林之一，桂花与牡丹在园中飘香。', '松江区人民南路64号', 31.004061, 121.224696, '松江区',
   ARRAY['./data/flower-photos/紫薇/醉白池.jpg','./data/flower-photos/紫薇/醉白池 (2).jpg','./data/flower-photos/桂花/醉白池.jpg','./data/flower-photos/桂花/醉白池 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6a884737000000003502795a?xsec_token=ABAcKJUEbAl7mP4pKri0acKyjSWEDtr0HfeiWnlcZMGr4=&xsec_source=pc_search&source=web_explore_feed', '上海五大古典园林之一，桂花与牡丹在园中飘香。', ARRAY['紫薇','桂花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('沈杨村', '百日菊', '乡村百日菊花田，盛夏五彩花海。', '宝山区顾村镇沈杨村', 31.33283, 121.36769, '宝山区',
   ARRAY['./data/flower-photos/百日菊/上海秋日浪漫小众无人油画般花海🌸游玩攻略_10_我是姚嘻嘻_来自小红书网页版.jpg']::text[], 'https://www.xiaohongshu.com/explore/65360209000000002500b57a?xsec_token=ABXb9aAzTB5R9OmsDr26M_pYcnmwXEUUhiTNZ8Vq7kN6Y=&xsec_source=pc_search&source=web_explore_feed', '乡村百日菊花田，盛夏五彩花海。', ARRAY['百日菊']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('宝山国际民间艺术博览馆', '彼岸花（石蒜，含多色石蒜）', '民间艺术展馆，彼岸花在馆前绿地秋日盛放。', '宝山区沪太路4788号', 31.34571, 121.37573, '宝山区',
   ARRAY['./data/flower-photos/彼岸花/宝山国际民间艺术博览馆.jpg','./data/flower-photos/彼岸花/宝山国际民间艺术博览馆 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6aa28a390000000011035b10?xsec_token=ABF8eqkORlAAMoFjYfJRMBtVAbL3F0GO_OJg8QMMnyGDk=&xsec_source=pc_search&source=web_explore_feed', '民间艺术展馆，彼岸花在馆前绿地秋日盛放。', ARRAY['彼岸花（石蒜，含多色石蒜）']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('大柏树站', '栾树', '地铁站周边栾树成行，秋季金黄花序缀满枝头。', '虹口区大柏树（地铁3号线大柏树站）', 31.15524, 121.42634, '虹口区',
   ARRAY['./data/flower-photos/栾树/大柏树站.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a8e58c7000000002503b8c1?xsec_token=ABCQC1FxYdwtkZZ9aQql6IiH5L7PVOacqU3ZYvkOP_fNY=&xsec_source=pc_search&source=web_explore_feed', '地铁站周边栾树成行，秋季金黄花序缀满枝头。', ARRAY['栾树']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('桃林路天桥', '栾树', '天桥视角俯瞰栾树金黄，秋日城市景观。', '浦东新区桃林路（天桥）', 31.226823, 121.539276, '浦东新区',
   ARRAY['./data/flower-photos/栾树/桃林路天桥.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a9f9635000000002a007c09?xsec_token=AB_gw0UU4yP2ENN2HY-T4f5_FD93sg_6YN6Yht0AzRurk=&xsec_source=pc_search&source=web_explore_feed', '天桥视角俯瞰栾树金黄，秋日城市景观。', ARRAY['栾树']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('南浦大桥滨江', '栾树', '大桥下的滨江绿地，栾树金黄与江水相映。', '浦东新区南浦大桥东侧滨江', 31.37069, 121.5418, '浦东新区',
   ARRAY['./data/flower-photos/栾树/南浦大桥滨江.jpg']::text[], 'https://www.xiaohongshu.com/explore/6a9f9635000000002a007c09?xsec_token=AB_gw0UU4yP2ENN2HY-T4f5_FD93sg_6YN6Yht0AzRurk=&xsec_source=pc_search&source=web_explore_feed', '大桥下的滨江绿地，栾树金黄与江水相映。', ARRAY['栾树']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('白莲泾公园', '粉黛乱子草', '世博滨江公园，粉黛乱子草秋季粉色如雾。', '浦东新区世博大道（白莲泾）', 31.1937, 121.49339, '浦东新区',
   ARRAY['./data/flower-photos/粉黛乱子草/白莲泾公园.jpg','./data/flower-photos/粉黛乱子草/白莲泾公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/68eb6a8e0000000004028dab?xsec_token=ABuPBZdxA_fEgIapvzTqbw7FdX8uNkskGPDbn4ebJvU4E=&xsec_source=pc_search&source=web_explore_feed', '世博滨江公园，粉黛乱子草秋季粉色如雾。', ARRAY['粉黛乱子草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('嘉北郊野公园', '粉黛乱子草', '大型郊野公园，粉黛乱子草与田园花海连绵。', '嘉定区沪宜公路5051号', 31.3675, 121.19717, '嘉定区',
   ARRAY['./data/flower-photos/粉黛乱子草/嘉北郊野公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69057ef900000000070397ac?xsec_token=ABYMk9Lf7F-TqdEvcUJMRytp60WJCCjy0CKCC7oovHs8s=&xsec_source=pc_search&source=web_explore_feed', '大型郊野公园，粉黛乱子草与田园花海连绵。', ARRAY['粉黛乱子草']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）', '梧桐', '上海最经典的梧桐大道，深秋满城金黄，风情街区如画。', '徐汇区/静安区/长宁区（衡山路-武康路-淮海路等路段）', 31.211625, 121.445696, '徐汇区',
   ARRAY['./data/flower-photos/梧桐/梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路）.jpg','./data/flower-photos/梧桐/梧桐黄叶街道（徐家汇-衡山路-淮海路，天平路-武康路-湖南路-兴国路，常乐路-富民路-汾阳路，华山路-江苏路-愚园路） (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/68d3e8f2000000001301c04d?xsec_token=ABWCeI0WbVk4LqRNNj8yKieaDYmQrHrvRoNcZwvHlvoi8=&xsec_source=pc_search&source=web_explore_feed', '上海最经典的梧桐大道，深秋满城金黄，风情街区如画。', ARRAY['梧桐']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('苏河半马公园', '红枫', '苏州河半马赛道沿线公园，红枫秋季点缀河岸。', '普陀区苏州河畔（半马公园）', 31.222176, 121.379926, '普陀区',
   ARRAY['./data/flower-photos/红枫/苏河半马公园.jpg','./data/flower-photos/红枫/苏河半马公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6916f5be0000000005012670?xsec_token=AB939Z9cMHObVSzwLlEBlb_Vo405ArPiuZmJ3r6YW5ykY=&xsec_source=pc_search&source=web_explore_feed', '苏州河半马赛道沿线公园，红枫秋季点缀河岸。', ARRAY['红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('古华公园', '红枫', '奉贤古园林公园，秋季红枫与水榭亭台相衬。', '奉贤区南桥镇解放中路220号', 30.91976, 121.45999, '奉贤区',
   ARRAY['./data/flower-photos/红枫/古华公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69214043000000001e00fca2?xsec_token=ABAhHWrDEEPajv-tjnRBlMO4BbwZAD8Jx9K2TGcubmEk8=&xsec_source=pc_search&source=web_explore_feed', '奉贤古园林公园，秋季红枫与水榭亭台相衬。', ARRAY['红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('世博文化公园·申园', '红枫', '江南园林风格园中园，秋季红枫与古典建筑相映成画。', '浦东新区世博文化公园内', 31.18368, 121.47533, '浦东新区',
   ARRAY['./data/flower-photos/红枫/世博文化公园·申园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69341757000000001b021fad?xsec_token=ABkZtzxNkTJePS9VyIjRXbswyDZCAbURkeIAddOZjpsUI=&xsec_source=pc_search&source=web_explore_feed', '江南园林风格园中园，秋季红枫与古典建筑相映成画。', ARRAY['红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('红园', '红枫', '以红枫闻名的老公园，秋季满园红叶。', '闵行区江川路354号', 31.00531, 121.4093, '闵行区',
   ARRAY['./data/flower-photos/红枫/红园.jpg','./data/flower-photos/红枫/红园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/693424a5000000000d0350d6?xsec_token=ABkZtzxNkTJePS9VyIjRXbs4gZUE6J2iOwM-wlqjgqSa4=&xsec_source=pc_search&source=web_explore_feed', '以红枫闻名的老公园，秋季满园红叶。', ARRAY['红枫']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('安亭路', '乌桕', '乌桕成行的林荫道，秋季红叶如丹。', '徐汇区安亭路', 31.204678, 121.443202, '徐汇区',
   ARRAY['./data/flower-photos/乌桕/安亭路.jpg']::text[], 'https://www.xiaohongshu.com/explore/693a4245000000001d03e020?xsec_token=ABqWqOUiFYOvlzsL25hmRiutB8FDeGPHuJ36q8uLBwYL0=&xsec_source=pc_search&source=web_explore_feed', '乌桕成行的林荫道，秋季红叶如丹。', ARRAY['乌桕']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('黄金城道步行街', '银杏', '银杏大道，深秋满街金黄落叶。', '长宁区黄金城道（近古北路）', 31.195161, 121.405595, '长宁区',
   ARRAY['./data/flower-photos/银杏/黄金城道步行街.jpg']::text[], 'https://www.xiaohongshu.com/explore/6932d686000000001e03b577?xsec_token=ABzt7N54CwBLywb4aSP9Ym6i7F-4I8OyJocpsFKvWuIAY=&xsec_source=pc_search&source=web_explore_feed', '银杏大道，深秋满街金黄落叶。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('真如寺', '银杏', '元代古刹，银杏古树深秋满树金黄。', '普陀区兰溪路399号', 31.250885, 121.39719, '普陀区',
   ARRAY['./data/flower-photos/银杏/真如寺.jpg']::text[], 'https://www.xiaohongshu.com/explore/6936a1d7000000001f00a19f?xsec_token=ABW5nKk-ylthliSWFJwWzL-dKijnr2wSpSuTVUXZUJfEE=&xsec_source=pc_search&source=web_explore_feed', '元代古刹，银杏古树深秋满树金黄。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上海音乐厅', '银杏', '欧式古典音乐殿堂，秋季银杏金黄映衬穹顶，音乐与秋色交融。', '黄浦区延安东路523号', 31.22875, 121.472, '黄浦区',
   ARRAY['./data/flower-photos/银杏/上海音乐厅.jpg']::text[], 'https://www.xiaohongshu.com/explore/692ffa43000000000d00f8df?xsec_token=ABx0LSXTsGOKwqqtjhwCYbEnOqLx8RNPbK5Umbb0lb8C4=&xsec_source=pc_search&source=web_explore_feed', '欧式古典音乐殿堂，秋季银杏金黄映衬穹顶，音乐与秋色交融。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('圣三一堂', '银杏', '哥特式红砖教堂，秋日银杏与钟楼相映成画。', '黄浦区九江路219号', 31.238715, 121.481309, '黄浦区',
   ARRAY['./data/flower-photos/银杏/圣三一堂.jpg','./data/flower-photos/银杏/圣三一堂 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6933f2fa000000001e0241d6?xsec_token=ABDVInn5UMhFvia44SaHR6qeI-9IRlkDy7MRvebKpnVCk=&xsec_source=pc_search&source=web_explore_feed', '哥特式红砖教堂，秋日银杏与钟楼相映成画。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('局门路', '银杏', '城市道路，银杏在深秋洒落满地金黄。', '黄浦区局门路', 31.195416, 121.47959, '黄浦区',
   ARRAY['./data/flower-photos/银杏/局门路.jpg','./data/flower-photos/银杏/局门路 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/6928f70a000000001b020d42?xsec_token=ABpnK-5_n98DRSwoPW9PfOnUg2oopOL0AAjcjt886iGLc=&xsec_source=pc_search&source=web_explore_feed', '城市道路，银杏在深秋洒落满地金黄。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('古城公园', '银杏', '豫园旁的城市公园，秋日银杏金黄映古城墙。', '黄浦区人民路333号（近豫园）', 31.2304, 121.48899, '黄浦区',
   ARRAY['./data/flower-photos/银杏/古城公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/692bd985000000001e00172d?xsec_token=ABNXTUJnehdfKbwAG2e1FcHENqjUghFfBDoGKgONwaY1c=&xsec_source=pc_search&source=web_explore_feed', '豫园旁的城市公园，秋日银杏金黄映古城墙。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('汇龙潭公园', '银杏', '嘉定古城公园，银杏古树与潭水相映。', '嘉定区塔城路299号', 31.384456, 121.249259, '嘉定区',
   ARRAY['./data/flower-photos/银杏/汇龙潭公园.jpg','./data/flower-photos/银杏/汇龙潭公园 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/692fe35e000000001d03af0b?xsec_token=ABx0LSXTsGOKwqqtjhwCYbEr7327rd5BWdRMdMFzoySiw=&xsec_source=pc_search&source=web_explore_feed', '嘉定古城公园，银杏古树与潭水相映。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('报国寺', '银杏', '淀山湖畔古寺，银杏古树深秋金黄。', '青浦区朱家角镇（近淀山湖）', 31.105701, 121.041642, '青浦区',
   ARRAY['./data/flower-photos/银杏/报国寺.jpg','./data/flower-photos/银杏/报国寺 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69313bcd000000001e00c313?xsec_token=AB2AQrRB0JlkIWX6p6x3rBRcD0w7AreGh_1hR633uxYjI=&xsec_source=pc_search&source=web_explore_feed', '淀山湖畔古寺，银杏古树深秋金黄。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('颐浩禅寺', '银杏', '金泽古镇古寺，银杏古树深秋金黄。', '青浦区金泽镇（金泽古镇）', 31.03756, 120.91637, '青浦区',
   ARRAY['./data/flower-photos/银杏/颐浩禅寺.jpg','./data/flower-photos/银杏/颐浩禅寺 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69435760000000001f00829f?xsec_token=ABUmF_G1XxYmvBNjWePp9b7VNUMoNpjLUmjW9fCnyb738=&xsec_source=pc_search&source=web_explore_feed', '金泽古镇古寺，银杏古树深秋金黄。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('青龙寺', '银杏', '千年古寺遗址，银杏古树深秋金黄。', '青浦区白鹤镇青龙村', 31.24138, 121.17208, '青浦区',
   ARRAY['./data/flower-photos/银杏/青龙寺.jpg','./data/flower-photos/银杏/青龙寺 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69412139000000001d03f7d7?xsec_token=ABRT9JoN62N8SEYXGv5s7e3xzUR58zmuOa0fvz4elCZG4=&xsec_source=pc_search&source=web_explore_feed', '千年古寺遗址，银杏古树深秋金黄。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('庄严寺', '银杏', '练塘古镇寺院，银杏古树在深秋满树金黄。', '青浦区练塘镇', 31.001928, 121.048048, '青浦区',
   ARRAY['./data/flower-photos/银杏/庄严寺.jpg','./data/flower-photos/银杏/庄严寺 (2).jpg']::text[], 'https://www.xiaohongshu.com/explore/69368771000000001e00156d?xsec_token=ABW5nKk-ylthliSWFJwWzL-Us90suXrjkRi-AmbnuFkWU=&xsec_source=pc_search&source=web_explore_feed', '练塘古镇寺院，银杏古树在深秋满树金黄。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('江滨路', '银杏', '黄浦滨江道路，银杏在深秋铺成金色长廊。', '黄浦区龙华东路（滨江段）', 31.1964, 121.47153, '黄浦区',
   ARRAY['./data/flower-photos/银杏/江滨路.jpg']::text[], 'https://www.xiaohongshu.com/explore/6926459b000000000d036efc?xsec_token=AB2iF3qebVPppLmIey1IAlsRojp0_M1fMiRYmAbpQkzN4=&xsec_source=pc_search&source=web_explore_feed', '黄浦滨江道路，银杏在深秋铺成金色长廊。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('青西郊野公园', '水杉 落羽杉', '水上森林奇观，水杉与落羽杉秋季层林尽染。', '青浦区金泽镇紫莲路500号', 31.062653, 120.998024, '青浦区',
   ARRAY['./data/flower-photos/水杉 落羽杉/青西郊野公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/692d71eb000000001e036404?xsec_token=AB1gIb_D_HrBJnEgNCi4A7dMt5mR2PVzsJr6VhkPm-Kvw=&xsec_source=pc_search&source=web_explore_feed', '水上森林奇观，水杉与落羽杉秋季层林尽染。', ARRAY['水杉 落羽杉']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('塘桥公园', '水杉 落羽杉', '社区公园，水杉与落羽杉秋季变红，水岸倒影迷人。', '浦东新区塘桥（近南泉路）', 31.2187, 121.52406, '浦东新区',
   ARRAY['./data/flower-photos/水杉 落羽杉/塘桥公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69318e96000000001f00d8fd?xsec_token=AB2AQrRB0JlkIWX6p6x3rBRYAVR0ZUPiev3dQSYJ6s6ek=&xsec_source=pc_search&source=web_explore_feed', '社区公园，水杉与落羽杉秋季变红，水岸倒影迷人。', ARRAY['水杉 落羽杉']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('汤巷公园', '水杉 落羽杉', '康桥社区公园，水杉与落羽杉秋季变红。', '浦东新区康桥镇（汤巷）', 31.14113, 121.59989, '浦东新区',
   ARRAY['./data/flower-photos/水杉 落羽杉/汤巷公园.jpg']::text[], 'https://www.xiaohongshu.com/explore/69459cdd000000001f006be3?xsec_token=ABk5ylEUvcoCefIxXlKpiYShdzjEWBwAqswiZ5kY-p4KY=&xsec_source=pc_search&source=web_explore_feed', '康桥社区公园，水杉与落羽杉秋季变红。', ARRAY['水杉 落羽杉']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('滨江城市森林', '水杉 落羽杉', '三林滨江森林绿带，水杉与落羽杉秋季层林尽染。', '浦东新区三林（滨江）', 31.13613, 121.462931, '浦东新区',
   ARRAY['./data/flower-photos/水杉 落羽杉/滨江城市森林.jpg']::text[], 'https://www.xiaohongshu.com/explore/69303411000000001f009752?xsec_token=ABuXWF6-xSInqRrvSWsyHXqfG8nbLF-z9kCFUc9jSFX8k=&xsec_source=pc_search&source=web_explore_feed', '三林滨江森林绿带，水杉与落羽杉秋季层林尽染。', ARRAY['水杉 落羽杉']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('交大徐汇校区樱花', '樱花', '上海交通大学徐汇校区的樱花，3-4月盛开时新老建筑与樱花相映，红砖墙与粉白花瓣构成独特的校园春景，是徐汇区樱花经典机位之一。', '上海市徐汇区华山路1954号上海交通大学徐汇校区', 31.20062, 121.42821, '徐汇区',
   ARRAY['./data/flower-photos/樱花/交大徐汇校区樱花.webp','./data/flower-photos/樱花/交大徐汇校区樱花 (3).webp']::text[], 'https://www.xiaohongshu.com/explore/67daafca0000000003029f80?xsec_token=ABVFIyLcJp77Dwv1o8K-CwlcFx1vb7bVuZNhT-LVLPCYM=&xsec_source=pc_search', '上海交通大学徐汇校区的樱花，3-4月盛开时新老建筑与樱花相映，红砖墙与粉白花瓣构成独特的校园春景，是徐汇区樱花经典机位之一。', ARRAY['樱花']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上理工秋景', '银杏', '上海理工大学军工路校区，10-11月银杏与梧桐黄叶交相辉映，校园内的历史建筑与秋色构成沪上知名的秋景打卡地，是杨浦区秋色代表机位之一。', '上海市杨浦区军工路516号上海理工大学', 31.292849, 121.550945, '杨浦区',
   ARRAY['./data/flower-photos/银杏/上海理工大学秋景.webp','./data/flower-photos/银杏/上海理工大学秋景 (2).webp','./data/flower-photos/银杏/上海理工大学秋景 (3).webp']::text[], 'https://www.xiaohongshu.com/explore/690bf00d000000000303554e?xsec_token=ABhP8sj5-xgLwHqKA8NlR4fb_khFXiaMDLasLhyFtOWFM=&xsec_source=pc_search', '上海理工大学军工路校区，10-11月银杏与梧桐黄叶交相辉映，校园内的历史建筑与秋色构成沪上知名的秋景打卡地，是杨浦区秋色代表机位之一。', ARRAY['银杏','梧桐']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('上外松江校区秋景', '银杏', '上海外国语大学松江校区的秋景，10-11月银杏金黄，与校园内欧式建筑相映，被誉为"上海最美校园秋色"之一，是松江大学城经典秋景机位。', '上海市松江区文翔路1550号上海外国语大学', 31.04932, 121.22092, '松江区',
   ARRAY['./data/flower-photos/银杏/上外松江校区秋景.webp','./data/flower-photos/银杏/上外松江校区秋景 (2).webp','./data/flower-photos/银杏/上外松江校区秋景 (3).webp']::text[], 'https://www.xiaohongshu.com/explore/691bb708000000000d03b6a8?xsec_token=ABZAU4j4fCVsv2PRRatmE9tZ7dSU_hj5EBevZvAkpl0Dg=&xsec_source=pc_search', '上海外国语大学松江校区的秋景，10-11月银杏金黄，与校园内欧式建筑相映，被誉为"上海最美校园秋色"之一，是松江大学城经典秋景机位。', ARRAY['银杏']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('松江袜子弄悬铃木大道', '梧桐', '松江袜子弄的悬铃木（法国梧桐）行道树大道，10-11月秋叶金黄，形成隧道般的秋色长廊，是松江老城最具秋意的街拍机位之一，人少景美。', '上海市松江区袜子弄32号袜子新弄园区', 31.012489, 121.237127, '松江区',
   ARRAY['./data/flower-photos/梧桐/松江袜子弄悬铃木大道.webp','./data/flower-photos/梧桐/松江袜子弄悬铃木大道 (3).webp']::text[], 'https://www.xiaohongshu.com/explore/6940b24d000000000d0358ed?xsec_token=AB8xp6Uk89556YEPQtKnT1Eqjh13BHdlmY9jsWocU6FDE=&xsec_source=pc_search', '松江袜子弄的悬铃木（法国梧桐）行道树大道，10-11月秋叶金黄，形成隧道般的秋色长廊，是松江老城最具秋意的街拍机位之一，人少景美。', ARRAY['梧桐']::text[]);
INSERT INTO flowers (name, flower, description, address, lat, lng, district, photos, source_url, intro, flowers) VALUES
  ('宝山永福庵', '梅花', '宝山郊野的佛教庵堂，2-3月红梅盛放时为最佳拍摄时机，古建筑与红梅相映，兼具人文建筑与时令花景的双重价值。', '上海市宝山区南陈路351弄2号（上海大学东门对面）', 31.10673, 121.196945, '宝山区',
   ARRAY['./data/photos/52.1.webp','./data/photos/52.2.webp']::text[], 'https://www.xiaohongshu.com/explore/67c3a3fb000000000e005a33?xsec_token=ABAhYyXKmjIQ65gfw4Qh19vVXz98sZMmn-VDIpT8nevMQ=&xsec_source=pc_search&source=web_search_result_notes', '宝山郊野的佛教庵堂，2-3月红梅盛放时为最佳拍摄时机，古建筑与红梅相映，兼具人文建筑与时令花景的双重价值。', ARRAY['梅花']::text[]);

-- 好逛街区导入
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text,
  address text,
  lat double precision,
  lng double precision,
  description text,
  photos text[] DEFAULT '{}',
  source text,
  created_at timestamptz DEFAULT now()
)
;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "stores_read_public" ON stores;
CREATE POLICY "stores_read_public" ON stores FOR SELECT TO public USING (true);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE stores ALTER COLUMN id SET DEFAULT gen_random_uuid();
DELETE FROM stores;

INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('上海中欧街', '闵行区', '上海市闵行区浦星公路567号', 31.1012, 121.4876, '复古南洋风情街区，满街欧式雕塑与彩色拱廊，适合拍照闲逛', ARRAY['./data/store-photos/上海中欧街 (2).webp','./data/store-photos/上海中欧街 (3).webp','./data/store-photos/上海中欧街.webp']::text[], 'https://www.xiaohongshu.com/explore/6aa260ee000000002900da6a?xsec_token=ABHYy9zc42ikCJ3uELzM5SO1XzZn4wlmG1rPdFzPfnpTg=&xsec_source=pc_search');
INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('星期天公园', '闵行区', '上海市长宁区延安西路1221号', 31.1864, 121.3821, '开放式文艺街区，大量艺术装置、小店与咖啡', ARRAY['./data/store-photos/星期天公园 (2).webp','./data/store-photos/星期天公园 (3).webp','./data/store-photos/星期天公园.webp']::text[], 'https://www.xiaohongshu.com/explore/6a9b81b7000000002502f968?xsec_token=ABr5_muJ_Lj0neWnqm3IXVqkEQVe2R1TjpyrqxyMzwcyc=&xsec_source=pc_search');
INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('茂名北路Bloom Space', '静安区', '上海市静安区茂名北路65号', 31.2236, 121.4528, '老上海石库门街区，沿街精品小店、展览空间', ARRAY['./data/store-photos/茂名北路老洋房街区（Bloom Space） (2).webp','./data/store-photos/茂名北路老洋房街区（Bloom Space） (3).webp','./data/store-photos/茂名北路老洋房街区（Bloom Space）.webp']::text[], 'https://www.xiaohongshu.com/explore/6a9a42cc0000000011036390?xsec_token=ABGkIZple-6LgJfrNJ_eKp71KOIn0u5jUJnYIRdu1L1Ng=&xsec_source=pc_search');
INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('森林书屋', '松江区', '上海市青浦区朱家角薛间村', 31.0472, 121.2157, '藏在郊野公园里的木质书屋，安静治愈', ARRAY['./data/store-photos/森林书屋 (2).webp','./data/store-photos/森林书屋 (3).webp','./data/store-photos/森林书屋.webp']::text[], 'https://www.xiaohongshu.com/explore/6a225daf00000000360310ff?xsec_token=ABUAMT9VXvVV8z-T-UeBmlzET4-TfE6tZMZbes-A2UoyNM=&xsec_source=pc_search');
INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('宝山田园咖啡', '宝山区', '上海市宝山区（地址待核验）', 31.4125, 121.3841, '乡野田园咖啡店，开阔户外草坪，近郊休闲', ARRAY['./data/store-photos/宝山田园咖啡店 (2).webp','./data/store-photos/宝山田园咖啡店 (3).webp','./data/store-photos/宝山田园咖啡店.webp']::text[], 'https://www.xiaohongshu.com/explore/6a1e356c000000003802199f?xsec_token=ABqfSrgK8l_Ds7nAWGSbj84QsifUslMEepVYQPfdStfx4=&xsec_source=pc_search');
INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('阿特麦', '奉贤区', '上海市青浦区老朱枫公路6186弄39号', 30.8631, 121.4512, '手作文创园区，木器工坊、庭院空间，适合半日游', ARRAY['./data/store-photos/阿特麦文化创意产业园 (2).webp','./data/store-photos/阿特麦文化创意产业园 (3).webp','./data/store-photos/阿特麦文化创意产业园.webp']::text[], 'https://www.xiaohongshu.com/explore/6a0fa2ff000000003700e641?xsec_token=ABVbMdrX4vrzf8e2Kq87xUUcGnKjT1CECGpLlR9UPT0qk=&xsec_source=pc_search');
INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('得丘礼享谷', '闵行区', '上海市闵行区申富路788号', 31.1048, 121.3396, '古堡风文创园区，展览、咖啡馆、花园', ARRAY['./data/store-photos/得丘礼享谷 (2).webp','./data/store-photos/得丘礼享谷 (3).webp','./data/store-photos/得丘礼享谷.webp']::text[], 'https://www.xiaohongshu.com/explore/69d7082a000000001a0311fe?xsec_token=ABnlptH4BY8MC8xD4rpL_Vg5S-A9BDgOeU_S0-D3-PZ3Y=&xsec_source=pc_search');
INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('梦谷南', '闵行区', '上海市闵行区曲吴路589号', 31.0443, 121.2514, '旧厂房改造文创园区，涂鸦、摄影、小众店铺', ARRAY['./data/store-photos/梦谷南（美式复古街区） (2).webp','./data/store-photos/梦谷南（美式复古街区） (3).webp','./data/store-photos/梦谷南（美式复古街区）.webp']::text[], 'https://www.xiaohongshu.com/explore/6948faf7000000000d03edf0?xsec_token=AB81Wny_2EoI2_rkD8_Nq3WRJvBiiUaou5bMusBgCSWLQ=&xsec_source=pc_search');
INSERT INTO stores (name, district, address, lat, lng, description, photos, source) VALUES
  ('梅州路新梦堂', '闵行区', '上海市闵行区梅州路507号', 31.1247, 121.4215, '南洋风复古街区，独栋洋房、特色小店', ARRAY['./data/store-photos/梅州路ins风建筑 (2).webp','./data/store-photos/梅州路ins风建筑 (3).webp','./data/store-photos/梅州路ins风建筑.webp']::text[], 'https://www.xiaohongshu.com/explore/68b9739e000000001d0399da?xsec_token=ABGFc-5A-JCr_fbhXeAiASMeiLTlpmAShinVyD2PcDOak=&xsec_source=pc_search');

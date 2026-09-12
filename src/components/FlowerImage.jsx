import React, { useEffect, useState } from 'react';
import { fetchClassicFlowerImage, getClassicPhotoUrl, getLocalFlowerPhoto } from '../utils/flowerImages';

/**
 * 花卉图片组件：
 * 1) 优先展示本地打包的经典图（data/classic-photos，网上搜索下载）
 * 2) 没有经典图时尝试维基百科 / Commons 在线搜索
 * 3) 都不可用时回退到本地 flower-photos 照片
 */
export default function FlowerImage({ name, className, alt, fallbackLocal = true, placeholder = '🌸' }) {
  const [src, setSrc] = useState(() => getClassicPhotoUrl(name) || (fallbackLocal ? getLocalFlowerPhoto(name) : null));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const classic = getClassicPhotoUrl(name);
    const local = fallbackLocal ? getLocalFlowerPhoto(name) : null;
    setFailed(false);
    if (classic || local) {
      setSrc(classic || local);
      return () => {
        mounted = false;
      };
    }
    // 本地无图：尝试在线搜索经典图
    setSrc(null);
    (async () => {
      const url = await fetchClassicFlowerImage(name);
      if (!mounted) return;
      if (url) setSrc(url);
    })();
    return () => {
      mounted = false;
    };
  }, [name, fallbackLocal]);

  if (!src) {
    return <div className={className ? `${className} flower-img-loading` : 'flower-img-loading'}>{placeholder}</div>;
  }

  return (
    <img
      src={src}
      alt={alt || name}
      className={className}
      loading="lazy"
      onError={() => {
        if (failed) return;
        setFailed(true);
        const local = getLocalFlowerPhoto(name);
        if (local) setSrc(local);
        else setSrc(null);
      }}
    />
  );
}

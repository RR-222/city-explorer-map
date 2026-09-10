import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import spots from '../../data/spots-seed.json';

const SPOTS_WITH_PHOTOS = spots.filter(
  (s) => Array.isArray(s.photos) && s.photos.length > 0
);

const SLIDE_COUNT = 6;
const SLIDE_INTERVAL = 8000;

function toAbsolutePhotoPath(path) {
  if (path.startsWith('./')) return path.slice(1);
  return path;
}

function pickRandomSlides(count) {
  const slides = [];
  const spotsCopy = [...SPOTS_WITH_PHOTOS];
  while (slides.length < count && spotsCopy.length > 0) {
    const spotIndex = Math.floor(Math.random() * spotsCopy.length);
    const spot = spotsCopy.splice(spotIndex, 1)[0];
    const photo = spot.photos[Math.floor(Math.random() * spot.photos.length)];
    slides.push({
      ...spot,
      activePhoto: toAbsolutePhotoPath(photo),
    });
  }
  return slides;
}

export default function AuthLayout({ children, mode, hero, heroSub }) {
  const [slides] = useState(() => pickRandomSlides(SLIDE_COUNT));
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback((index) => {
    setCurrentIndex((index + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="auth-split-page">
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <Link to="/" className="auth-brand-link">
              City Explorer
            </Link>
          </div>

          <div className="auth-hero">
            <h1 className="auth-hero-title">{hero}</h1>
            {heroSub && <p className="auth-hero-subtitle">{heroSub}</p>}
          </div>

          <div className="auth-form-card">{children}</div>

          <div className="auth-footer">
            {mode === 'register' ? (
              <>
                <span>已有账号？</span>
                <Link to="/login" className="auth-toggle-link">
                  立即登录
                </Link>
              </>
            ) : (
              <>
                <span>还没有账号？</span>
                <Link to="/register" className="auth-toggle-link">
                  免费注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="auth-right">
        {slides.length > 0 ? (
          <>
            <div className="auth-slides">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`auth-slide ${index === currentIndex ? 'active' : ''}`}
                >
                  <img
                    src={slide.activePhoto}
                    alt={slide.name}
                    className="auth-right-image"
                  />
                </div>
              ))}
            </div>
            <div className="auth-right-overlay" />

            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  className="auth-carousel-arrow auth-carousel-prev"
                  onClick={prev}
                  aria-label="上一张"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="auth-carousel-arrow auth-carousel-next"
                  onClick={next}
                  aria-label="下一张"
                >
                  ›
                </button>
                <div className="auth-carousel-dots">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`auth-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => goTo(index)}
                      aria-label={`切换到第 ${index + 1} 张`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="auth-spot-card">
              <div className="auth-spot-meta">
                <span className="auth-spot-district">{currentSlide.district}</span>
              </div>
              <h3 className="auth-spot-name">{currentSlide.name}</h3>
              <p className="auth-spot-desc">{currentSlide.description}</p>
            </div>
          </>
        ) : (
          <div className="auth-right-placeholder">
            <span>上海城市风景</span>
          </div>
        )}
      </div>
    </div>
  );
}

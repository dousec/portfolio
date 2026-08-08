'use client';

import { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) {
      el.style.setProperty('--ambient-progress', '0');
      return;
    }

    let raf = 0;
    let last = -1;

    const tick = () => {
      const w = window as Window & { lenis?: { scroll: number } };
      const y = w.lenis?.scroll ?? window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;

      if (Math.abs(progress - last) > 0.0005) {
        last = progress;
        el.style.setProperty('--ambient-progress', progress.toFixed(4));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="ambient-layer pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="ambient-glow ambient-glow-c" />
      <div className="ambient-dots" />
    </div>
  );
}

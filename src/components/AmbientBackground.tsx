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

    const progressFor = (y: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
    };

    let raf = 0;
    let pending = false;
    let last = -1;

    const apply = () => {
      pending = false;
      const w = window as Window & { lenis?: { scroll: number } };
      const y = w.lenis?.scroll ?? window.scrollY;
      const progress = progressFor(y);
      if (Math.abs(progress - last) > 0.0005) {
        last = progress;
        el.style.setProperty('--ambient-progress', progress.toFixed(4));
      }
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const lenis = (
      window as Window & {
        lenis?: { on?: (event: string, cb: () => void) => void };
      }
    ).lenis;
    lenis?.on?.('scroll', schedule);

    schedule();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      lenis?.off?.('scroll', schedule);
    };
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

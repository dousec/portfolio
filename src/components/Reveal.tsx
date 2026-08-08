'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 40,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) {
      el.style.opacity = '1';
      el.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    const stretch = 0.55;

    const apply = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const phase = (delay / 1000) * vh * 0.22;
      const raw = (vh - (rect.top + phase)) / (vh * stretch);
      const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      const eased = 1 - (1 - p) ** 3;
      el.style.opacity = eased.toFixed(3);
      el.style.transform = `translate3d(0, ${(y * (1 - eased)).toFixed(2)}px, 0)`;
    };

    apply();

    let raf = 0;
    const tick = () => {
      apply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => apply();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [delay, y]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  );
}

'use client';

import {
  useRef,
  useState,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from 'react';

export interface HighlightProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function Highlight({
  children,
  className = '',
  delay = 120,
}: HighlightProps) {
  const ref = useRef<HTMLElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = { '--hl-delay': `${delay}ms` } as CSSProperties;

  return (
    <em
      ref={ref}
      className={`hl font-normal italic ${isIn ? 'is-in' : ''} ${className}`}
      style={style}
    >
      {children}
      <svg
        className="hl-svg"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="hl-path"
          d="M1 9.5 C 30 4, 70 4, 99 9.5"
          pathLength={100}
        />
      </svg>
    </em>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useLenisScroll } from '@/hooks/useLenisScroll';

export interface RailSection {
  id: string;
  label: string;
}

export default function ScrollRail({ sections }: { sections: RailSection[] }) {
  const { progress, y } = useLenisScroll();
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const probe = window.innerHeight * 0.4;
    let idx = -1;
    for (let i = 0; i < sections.length; i++) {
      const el = document.getElementById(sections[i].id.slice(1));
      if (!el) continue;
      if (el.getBoundingClientRect().top <= probe) idx = i;
      else break;
    }
    setActive(idx);
  }, [y, sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.slice(1));
    if (!el) return;
    const w = window as Window & {
      lenis?: { scrollTo?: (target: Element, opts?: object) => void };
    };
    if (w.lenis?.scrollTo) {
      w.lenis.scrollTo(el, { offset: -64, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col items-end">
        <div className="absolute inset-y-2 right-2.25 w-px bg-zinc-200/90">
          <div
            className="h-full w-full origin-top bg-zinc-900/60"
            style={{ transform: `scaleY(${progress})` }}
          />
        </div>
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            aria-label={s.label}
            aria-current={active === i ? 'true' : undefined}
            className="group relative z-10 flex h-8 cursor-pointer items-center gap-3 pr-0"
          >
            <span
              className={`whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                active === i
                  ? 'bg-zinc-900 text-white opacity-100'
                  : 'text-zinc-500 opacity-0 group-hover:opacity-90 group-focus-visible:opacity-90'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full font-mono text-[9px] leading-none transition-all duration-300 ${
                active === i
                  ? 'scale-110 bg-zinc-900 text-white'
                  : 'border border-zinc-300 bg-white text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-700'
              }`}
            >
              {i + 1}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

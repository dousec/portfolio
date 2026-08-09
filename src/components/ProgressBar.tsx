import { useEffect, useRef, useState } from 'react';
import { useLenisScroll } from '@/hooks/useLenisScroll';

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const { progress } = useLenisScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${progress})`;
    }
    setScrolled(progress > 0.01);
  }, [progress]);

  const pct = Math.round(progress * 100);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="pointer-events-none fixed inset-x-0 top-0 z-60"
    >
      <div className="h-[3px] w-full bg-zinc-200/60" />

      <div className="absolute inset-x-0 top-0 h-[3px]">
        <div
          ref={barRef}
          className="relative h-full w-full origin-left bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-400"
          style={{ transform: 'scaleX(0)' }}
        >
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-zinc-400/70 blur-[3px]"
          />
        </div>
      </div>

      <span
        aria-hidden="true"
        className={`absolute right-4 top-16 flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/85 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-zinc-600 tabular-nums shadow-lg shadow-zinc-900/5 backdrop-blur-md transition-all duration-300 motion-reduce:transition-none ${
          scrolled ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-zinc-900"
        />
        {pct}%
      </span>
    </div>
  );
}

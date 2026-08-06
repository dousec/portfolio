import { useEffect, useRef } from 'react';
import { useLenisScroll } from '@/hooks/useLenisScroll';

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const { progress } = useLenisScroll();

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${progress})`;
    }
  }, [progress]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-60 h-2px">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-zinc-900"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

import { useLenisScroll } from '@hooks/useLenisScroll';
import GlobeScene from '@components/GlobeScene';

export interface GlobeSpinnerProps {
  className?: string;
}

export default function GlobeSpinner({ className = '' }: GlobeSpinnerProps) {
  const { progress } = useLenisScroll();

  return (
    <GlobeScene
      className={`absolute inset-0 h-full w-full ${className}`}
      scrollProgress={progress}
    />
  );
}

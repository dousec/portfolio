import { useLenisScroll } from '@hooks/useLenisScroll';
import GlobeScene from '@components/GlobeScene';

export default function GlobeSpinner() {
  const { progress } = useLenisScroll();

  return (
    <GlobeScene
      className="absolute inset-0 h-full w-full"
      scrollProgress={progress}
    />
  );
}

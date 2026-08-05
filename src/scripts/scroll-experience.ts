interface LenisLike {
  scroll: number;
  velocity: number;
  options: {
    lerp: number;
    wheelMultiplier: number;
    touchMultiplier: number;
    overscroll: boolean;
  };
}

type LenisWindow = Window & { lenis?: LenisLike };

const lenisWindow = window as LenisWindow;
const root = document.documentElement;

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

function tuneLenis(): void {
  const lenis = lenisWindow.lenis;
  if (!lenis) return;
  lenis.options.lerp = 0.085;
  lenis.options.wheelMultiplier = 1;
  lenis.options.touchMultiplier = 1.4;
  lenis.options.overscroll = true;
}

let tuned = false;
let heroHeight = 0;
let lastHeroScroll = -1;

const marquee = document.querySelector<HTMLElement>('[data-marquee]');
let marqueePeriod = 0;
let marqueePos = 0;
let speedFactor = 1;
let lastFrame = performance.now();

function measureMarquee(): void {
  if (!marquee) return;
  const half = marquee.children.length / 2;
  const copy = marquee.children[half] as HTMLElement | undefined;
  marqueePeriod = copy?.offsetLeft ?? marquee.scrollWidth / 2;
}

function initMarquee(): void {
  measureMarquee();
  marquee?.style.setProperty('animation', 'none');
  window.addEventListener('resize', measureMarquee);
  window.addEventListener('load', measureMarquee);
  document.fonts?.ready.then(measureMarquee).catch(() => undefined);
  for (const ms of [500, 1500]) window.setTimeout(measureMarquee, ms);
}

function measureHero(): void {
  heroHeight = document.getElementById('top')?.offsetHeight ?? 0;
}

function tick(): void {
  if (!tuned) {
    tuneLenis();
    tuned = true;
  }

  const now = performance.now();
  const dt = Math.min((now - lastFrame) / 1000, 0.1);
  lastFrame = now;

  const lenis = lenisWindow.lenis;
  const scrollY = lenis?.scroll ?? window.scrollY;

  const heroScroll = heroHeight > 0 ? Math.min(scrollY / heroHeight, 1) : 0;
  if (heroScroll !== lastHeroScroll) {
    lastHeroScroll = heroScroll;
    root.style.setProperty('--hero-scroll', heroScroll.toFixed(3));
  }

  if (marquee && marqueePeriod > 0) {
    const target = lenis
      ? 1 + Math.max(-0.35, Math.min(lenis.velocity / 1000, 1.2))
      : 1;
    speedFactor += (target - speedFactor) * 0.07;
    marqueePos += (marqueePeriod / 32) * speedFactor * dt;
    marqueePos = ((marqueePos % marqueePeriod) + marqueePeriod) % marqueePeriod;
    marquee.style.transform = `translate3d(${-marqueePos}px, 0, 0)`;
  }

  requestAnimationFrame(tick);
}

if (reducedMotion) {
  root.style.setProperty('--hero-scroll', '0');
  initMarquee();
} else {
  measureHero();
  initMarquee();
  window.addEventListener('resize', measureHero);
  requestAnimationFrame(tick);
}

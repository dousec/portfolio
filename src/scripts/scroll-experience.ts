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
const hero = document.getElementById('top');

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
let rafId = 0;
let running = false;

function measureHero(): void {
  heroHeight = hero?.offsetHeight ?? 0;
}

function updateHeroScroll(scrollY: number): void {
  if (!hero) return;
  const heroScroll = heroHeight > 0 ? Math.min(scrollY / heroHeight, 1) : 0;
  if (heroScroll !== lastHeroScroll) {
    lastHeroScroll = heroScroll;
    hero.style.setProperty('--hero-scroll', heroScroll.toFixed(3));
  }
}

function tick(): void {
  if (!running) return;
  if (!tuned) {
    tuneLenis();
    tuned = true;
  }
  const lenis = lenisWindow.lenis;
  updateHeroScroll(lenis?.scroll ?? window.scrollY);
  rafId = requestAnimationFrame(tick);
}

if (reducedMotion || !hero) {
  hero?.style.setProperty('--hero-scroll', '0');
} else {
  measureHero();
  window.addEventListener('resize', measureHero);
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries[0]?.isIntersecting ?? false;
      if (visible && !running) {
        running = true;
        lastHeroScroll = -1;
        rafId = requestAnimationFrame(tick);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
    },
    { rootMargin: '300px 0px' },
  );
  observer.observe(hero);
}

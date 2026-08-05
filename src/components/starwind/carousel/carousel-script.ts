import EmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
  type EmblaPluginType,
} from 'embla-carousel';

export type CarouselApi = EmblaCarouselType;

export interface CarouselOptions {
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  setApi?: (api: CarouselApi) => void;
}

export interface CarouselManager {
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  destroy: () => void;
}

export function initCarousel(
  carouselElement: HTMLElement,
  options: CarouselOptions = {},
): CarouselManager | null {
  if (carouselElement.dataset.initialized === 'true') return null;
  carouselElement.dataset.initialized = 'true';

  if (!carouselElement) {
    console.warn('Carousel element not found');
    return null;
  }

  const viewportElement = carouselElement.querySelector(
    '[data-slot="carousel-content"]',
  ) as HTMLElement;
  if (!viewportElement) {
    console.warn('Carousel content element not found');
    return null;
  }

  const axisData = carouselElement.dataset.axis;
  const axis: EmblaOptionsType['axis'] = axisData === 'y' ? 'y' : 'x';

  let dataOpts = {};
  try {
    const optsString = carouselElement.dataset.opts;
    if (optsString && optsString !== 'undefined' && optsString !== 'null') {
      dataOpts = JSON.parse(optsString);
    }
  } catch (e) {
    console.warn('Failed to parse carousel opts:', e);
    dataOpts = {};
  }

  if (!dataOpts || typeof dataOpts !== 'object') {
    dataOpts = {};
  }

  const emblaOptions: EmblaOptionsType = {
    axis,
    ...dataOpts,
    ...(options.opts || {}),
  };

  const plugins =
    options.plugins && options.plugins.length > 0 ? options.plugins : undefined;

  const prevButton = carouselElement.querySelector(
    '.starwind-carousel-previous',
  ) as HTMLButtonElement;
  const nextButton = carouselElement.querySelector(
    '.starwind-carousel-next',
  ) as HTMLButtonElement;

  let emblaApi: EmblaCarouselType;
  if (plugins) {
    emblaApi = EmblaCarousel(viewportElement, emblaOptions, plugins);
  } else {
    emblaApi = EmblaCarousel(viewportElement, emblaOptions);
  }

  const updateButtons = () => {
    const canScrollPrev = emblaApi.canScrollPrev();
    const canScrollNext = emblaApi.canScrollNext();

    if (prevButton) {
      prevButton.disabled = !canScrollPrev;
      prevButton.setAttribute('aria-disabled', (!canScrollPrev).toString());
    }

    if (nextButton) {
      nextButton.disabled = !canScrollNext;
      nextButton.setAttribute('aria-disabled', (!canScrollNext).toString());
    }
  };

  const prevClickHandler = () => emblaApi.scrollPrev();
  const nextClickHandler = () => emblaApi.scrollNext();
  const keydownHandler = (event: KeyboardEvent) => {
    if (axis === 'y') {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        emblaApi.scrollPrev();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        emblaApi.scrollNext();
      }
    } else {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        emblaApi.scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        emblaApi.scrollNext();
      }
    }
  };

  const setupEventListeners = () => {
    prevButton?.addEventListener('click', prevClickHandler);
    nextButton?.addEventListener('click', nextClickHandler);

    carouselElement.addEventListener('keydown', keydownHandler);
  };

  const setupUserCallbacks = () => {
    if (options.setApi) {
      options.setApi(emblaApi);
    }
  };

  updateButtons();
  setupEventListeners();
  setupUserCallbacks();

  emblaApi.on('select', updateButtons);
  emblaApi.on('init', () => {
    updateButtons();
  });
  emblaApi.on('reInit', () => {
    updateButtons();
  });

  return {
    api: emblaApi,
    scrollPrev: () => emblaApi.scrollPrev(),
    scrollNext: () => emblaApi.scrollNext(),
    canScrollPrev: () => emblaApi.canScrollPrev(),
    canScrollNext: () => emblaApi.canScrollNext(),
    destroy: () => {
      if (prevButton) {
        prevButton.removeEventListener('click', prevClickHandler);
      }
      if (nextButton) {
        nextButton.removeEventListener('click', nextClickHandler);
      }
      carouselElement.removeEventListener('keydown', keydownHandler);

      emblaApi.destroy();
    },
  };
}

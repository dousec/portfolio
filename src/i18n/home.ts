export interface Step {
  title: string;
  desc: string;
}

export interface TeamOption {
  name: string;
  tag: string;
  desc: string;
  price: string;
  badge: string | null;
}

export interface Payment {
  name: string;
  icon: string | null;
  glyph: string | null;
  note: string;
}

export interface Quote {
  text: string;
  who: string;
  role: string;
  org: string;
  url: string;
  avatar: string;
}

export interface HeroCopy {
  eyebrow: string;
  lines: { pre: string; highlight?: string; post?: string }[];
  description: string;
  primaryCta: string;
  secondaryCta: string;
  stats: string[];
  scrollHint: string;
  card: { title: string; subtitle: string };
}

export interface HowCopy {
  label: string;
  titlePre: string;
  titleHighlight: string;
  titlePost: string;
  description: string;
  steps: Step[];
  callout: { title: string; description: string; cta: string } | null;
}

export interface TeamCopy {
  label: string;
  titlePre: string;
  titleHighlight: string;
  titlePost: string;
  description: string;
  teams: TeamOption[];
  footnote: string;
  card: {
    devSingular: string;
    devPlural: string;
    typicalPrefix: string;
    rate: string;
    buildPrefix: string;
  };
}

export interface PaymentsCopy {
  label?: string;
  titlePre?: string;
  titleHighlight?: string;
  titlePost?: string;
  description?: string;
  payments: Payment[];
}

export interface ReceiptsCopy {
  label: string;
  titlePre: string;
  titleHighlight: string;
  titlePost: string;
  quotes: Quote[];
  prevLabel: string;
  nextLabel: string;
  footnote: string;
}

export interface TeamMapCopy {
  ariaLabel: string;
  badge: string;
  statBadge: string;
  hint: string;
  messageCta: string;
}

export interface ContactCopy {
  label: string;
  titlePre: string;
  titleHighlight: string;
  titlePost: string;
  description: string;
  mailtoHref: string;
  primaryCta: string;
  copyCta: string;
  copySuccess: string;
  copyError: string;
  socialsLabel: string;
  sinceLabel: string;
  sinceText: string;
  payments?: Payment[];
}

export interface FooterCopy {
  tagline: string;
  exploreLabel: string;
  exploreLinks: { label: string; href: string }[];
  connectLabel: string;
  credit: string;
  backToTop: string;
}

export interface HomeCopy {
  hero: HeroCopy;
  how: HowCopy;
  team: TeamCopy;
  receipts: ReceiptsCopy;
  teamMap: TeamMapCopy;
  contact: ContactCopy;
  footer: FooterCopy;
}

export const homeEn: HomeCopy = {
  hero: {
    eyebrow: 'Dou · freelance software · est. 2021',
    lines: [
      { pre: 'You pick the devs.' },
      { pre: 'You set the ', highlight: 'price', post: '.' },
      { pre: 'We ship.' },
    ],
    description:
      'Most software deals burn you twice: freelancers vanish, agencies inflate the bill. Dou is different: {devs} senior developers across Latam and Europe, no account managers, no middlemen, no inflated invoices. You pick the people who build it, you set the budget, and you talk directly to the devs doing the work.',
    primaryCta: 'Claim your free quote',
    secondaryCta: 'Meet the developers',
    stats: [
      '{devs} developers on call',
      '{countries} countries',
      '+20 projects shipped',
      'replies within 24h',
    ],
    scrollHint: 'scroll',
    card: { title: 'You set the price', subtitle: 'fixed scope · your budget' },
  },
  how: {
    label: '02 · The playbook',
    titlePre: '{n} steps. ',
    titleHighlight: 'Zero',
    titlePost: ' fine print.',
    description:
      "No retainers, no sales calls, no surprises. Here's exactly how we make you money.",
    steps: [
      {
        title: "Tell us what you're building",
        desc: "What are you building, when does it ship, what's the budget? Two paragraphs is plenty. Keep it real, we speak human.",
      },
      {
        title: 'Meet the actual developers',
        desc: "Real names, real profiles, real contact links. You're not hiring a brand, you're hiring humans, and you choose who joins.",
      },
      {
        title: 'You set the price',
        desc: "Fixed scope, your number, zero surprises. If we can't deliver for it, we tell you honestly.",
      },
      {
        title: 'We ship. You keep everything.',
        desc: 'Weekly demos, full code ownership, deployed and live. The product, the code and the profit: all yours.',
      },
    ],
    callout: null,
  },
  team: {
    label: '03 · Pick your team',
    titlePre: 'Your project. Your rules. ',
    titleHighlight: 'Your price.',
    titlePost: '',
    description:
      'Agencies drain your budget: $150-300 an hour plus retainers, and you still talk to a sales guy. We flip the table: you pick the devs, you name the number.',
    teams: [
      {
        name: 'Solo',
        tag: 'One senior developer',
        desc: 'MVPs, landing pages, quick wins. One sharp developer, all yours.',
        price: '$30-$70',
        badge: null,
      },
      {
        name: 'Duo',
        tag: 'Frontend plus backend',
        desc: 'Two developers, one sprint, twice the momentum. Built for tight deadlines.',
        price: '$70-$140',
        badge: 'Most picked',
      },
      {
        name: 'Trio',
        tag: 'Full product in 4-8 weeks',
        desc: 'Design, frontend and backend. The whole stack on your timeline.',
        price: '$140-$300',
        badge: 'Best value',
      },
      {
        name: 'Army',
        tag: 'Four or more developers',
        desc: 'Big launch, hard deadline? Tell us the date, we staff it.',
        price: 'from $300',
        badge: null,
      },
    ],
    footnote:
      "No fixed hourly rate: that's a losing game. You name the budget, we tell you what ships for it. That's the deal.",
    card: {
      devSingular: 'developer',
      devPlural: 'developers',
      typicalPrefix: 'Typical · ',
      rate: 'Rate · you set it',
      buildPrefix: 'Build with',
    },
  },
  receipts: {
    label: '04 · The receipts',
    titlePre: "Don't trust us. ",
    titleHighlight: 'Trust them.',
    titlePost: '',
    quotes: [
      {
        text: "Dou shipped our complete B2B budgeting app in two months, no agency bloat, no excuses. To this day, every improvement I ask for gets built. Full code ownership, for a price that felt like a steal. If you're still on the fence, don't be. Just hire them.",
        who: 'Oscar Feliu',
        role: 'Founder',
        org: 'EvokaReformas',
        url: 'https://evokareformas.com',
        avatar:
          'https://ui-avatars.com/api/?name=Oscar+Felidu&background=18181b&color=fff&size=96',
      },
    ],
    prevLabel: 'Previous quote',
    nextLabel: 'Next quote',
    footnote: 'Open source included, all public on GitHub',
  },
  teamMap: {
    ariaLabel: 'The developers · where we work',
    badge: '05 · Meet the developers',
    statBadge: '{countries} countries · {devs} developers',
    hint: 'drag the globe · keep scrolling',
    messageCta: 'Message the developers',
  },
  contact: {
    label: "06 · Let's make a deal",
    titlePre: 'Money on the table. ',
    titleHighlight: 'Are you in?',
    titlePost: '',
    description:
      "Tell us what you're building and what you want to pay. We reply within 24 hours, usually faster, with a plan and a number you control. No games, no fine print.",
    mailtoHref:
      'mailto:contact@dousec.org?subject=Quote%20request%20for%20Dou&body=Hi%20Dou%2C%0A%0AHere%27s%20what%20I%27m%20building%3A%0A%0A%0ABudget%20range%3A%0A%0ADeadline%3A%0A',
    primaryCta: 'Claim your free quote',
    copyCta: 'Copy email',
    copySuccess: 'Email copied to your clipboard!',
    copyError: "Oops! We couldn't copy the email. Here: contact@dousec.org",
    socialsLabel: 'Elsewhere',
    sinceLabel: 'Since',
    sinceText: 'Building Open-Source and Private Software since 2021',
    payments: [
      {
        name: 'PayPal',
        icon: 'paypal',
        glyph: null,
        note: 'Global, instant. Everyone uses it.',
      },
      {
        name: 'Wise',
        icon: 'wise',
        glyph: null,
        note: 'Fair exchange rates, no hidden fees.',
      },
      {
        name: 'ACH',
        icon: null,
        glyph: 'ACH',
        note: 'Local bank transfer, straight to the dev. Simple.',
      },
      {
        name: 'Takenos',
        icon: null,
        glyph: 'T',
        note: 'Latam made, borderless, direct bridge.',
      },
    ],
  },
  footer: {
    tagline:
      'A freelance software team across Latam and Europe. No agencies, no middlemen. You pick the devs, you set the price, we ship.',
    exploreLabel: 'Explore',
    exploreLinks: [
      { label: 'Home', href: '#top' },
      { label: 'How it works', href: '#how' },
      { label: 'Choose your team', href: '#team' },
      { label: 'The developers', href: '#team-map' },
      { label: 'Contact', href: '#contact' },
    ],
    connectLabel: 'Connect',
    credit: '© {year} Dou · built with Astro · React · Three.js',
    backToTop: 'Back to top',
  },
};

export const homeEs: HomeCopy = {
  hero: {
    eyebrow: 'Dou · software freelance · est. 2021',
    lines: [
      { pre: 'Tú eliges a los devs.' },
      { pre: 'Tú pones el ', highlight: 'precio', post: '.' },
      { pre: 'We ship.' },
    ],
    description:
      'La mayoría de los proyectos de software te clavan dos veces: el freelance desaparece, la agencia infla la factura. Dou juega otra liga. {devs} desarrolladores senior en Latam y Europa: sin account managers, sin intermediarios, sin facturas infladas. Tú eliges a las personas que construyen, tú pones el presupuesto y hablas directo con quien hace el trabajo. Sin vendedores. Sin juegos.',
    primaryCta: 'Reclama tu presupuesto gratis',
    secondaryCta: 'Conoce a los desarrolladores',
    stats: [
      '{devs} desarrolladores disponibles',
      '{countries} países',
      '+20 proyectos entregados',
      'respuesta en 24 h',
    ],
    scrollHint: 'desliza',
    card: {
      title: 'Tú fijas el precio',
      subtitle: 'alcance fijo · tu presupuesto',
    },
  },
  how: {
    label: '02 · El playbook',
    titlePre: '{n} pasos. ',
    titleHighlight: 'Cero',
    titlePost: ' letra pequeña.',
    description:
      'Sin retenedores, sin llamadas de ventas, sin sorpresas. Solo plan, precio y entrega. Así se hace dinero.',
    steps: [
      {
        title: 'Cuéntanos tu proyecto',
        desc: '¿Qué construyes, cuándo se entrega, cuánto presupuesto? Dos párrafos bastan. Sin rodeos, directo al grano: hablamos en humano.',
      },
      {
        title: 'Conoce a los developers',
        desc: 'Nombres reales, perfiles reales, contactos reales. Nada de marcas humo: contratas personas, con nombre y cara, y tú decides quién juega.',
      },
      {
        title: 'Tú fijas el precio',
        desc: 'Alcance fijo, tu número, cero sorpresas. ¿No nos da con tu número? Te lo decimos claro. Sin letra pequeña.',
      },
      {
        title: 'We ship. Tú te quedas con todo.',
        desc: 'Demos semanales, código 100% tuyo, live en producción. El producto, el código y la pasta: todo tuyo.',
      },
    ],
    callout: null,
  },
  team: {
    label: '03 · Elige a tu equipo',
    titlePre: 'Tu proyecto. Tus reglas. ',
    titleHighlight: 'Tu precio.',
    titlePost: '',
    description:
      'Las agencias te cuestan una fortuna: $150-300 la hora, más retenedores, y aun así hablas con un vendedor. Aquí volteamos la mesa: tú eliges a los devs, tú pones el número. Así de simple.',
    teams: [
      {
        name: 'Solo',
        tag: 'Un desarrollador senior',
        desc: 'MVPs, landing pages, victorias rápidas. Un dev sharp, listo para el knock out.',
        price: '$30-$70',
        badge: null,
      },
      {
        name: 'Dúo',
        tag: 'Frontend más backend',
        desc: 'Dos devs, un sprint, el doble de fuel. Hecho para fechas que no perdonan.',
        price: '$70-$140',
        badge: 'El más elegido',
      },
      {
        name: 'Trío',
        tag: 'Producto completo en 4-8 semanas',
        desc: 'Diseño, frontend y backend: el stack completo, a tu ritmo, sin excusas.',
        price: '$140-$300',
        badge: 'Mejor relación calidad-precio',
      },
      {
        name: 'Ejército',
        tag: 'Cuatro o más desarrolladores',
        desc: '¿Lanzamiento grande con fecha dura? Di el día. Nosotros aparecemos con todo.',
        price: 'desde $300',
        badge: null,
      },
    ],
    footnote:
      "¿Tarifa horaria fija? Eso no es negocio. Tú pones el número, nosotros decimos qué se entrega. That's the deal. Punto.",
    card: {
      devSingular: 'desarrollador',
      devPlural: 'desarrolladores',
      typicalPrefix: 'Típico · ',
      rate: 'Tarifa · tú la pones',
      buildPrefix: 'Construye con',
    },
  },
  receipts: {
    label: '04 · Los receipts',
    titlePre: 'No confíes en nosotros. ',
    titleHighlight: 'Confía en ellos.',
    titlePost: '',
    quotes: [
      {
        text: 'Dou nos entregó nuestra app de presupuestos en dos meses: un B2B completo, sin humo de agencia y sin excusas. Hasta hoy, cada mejora que pido se implementa. Código 100% nuestro, a un precio regalado. ¿Todavía dudas? Yo ya no.',
        who: 'Oscar Feliu',
        role: 'Fundador',
        org: 'EvokaReformas',
        url: 'https://evokareformas.com',
        avatar:
          'https://ui-avatars.com/api/?name=Oscar+Felidu&background=18181b&color=fff&size=96',
      },
    ],
    prevLabel: 'Cita anterior',
    nextLabel: 'Cita siguiente',
    footnote: 'Código abierto incluido, todo público en GitHub',
  },
  teamMap: {
    ariaLabel: 'Los desarrolladores · dónde trabajamos',
    badge: '05 · Conoce a los developers',
    statBadge: '{countries} países · {devs} desarrolladores',
    hint: 'arrastra el globo · sigue bajando',
    messageCta: 'Escribe a los desarrolladores',
  },
  contact: {
    label: '06 · Hagamos un trato',
    titlePre: 'La plata está sobre la mesa. ',
    titleHighlight: '¿Entras o no?',
    titlePost: '',
    description:
      'Dinos qué estás construyendo y cuánto quieres pagar. Respondemos en 24 horas, casi siempre antes, con un plan y un número que tú controlas. Sin juegos, sin letra pequeña.',
    mailtoHref:
      'mailto:contact@dousec.org?subject=Solicitud%20de%20presupuesto%20para%20Dou&body=Hola%20Dou%2C%0A%0AEsto%20es%20lo%20que%20estoy%20construyendo%3A%0A%0A%0ARango%20de%20presupuesto%3A%0A%0AFecha%20l%C3%ADmite%3A%0A',
    primaryCta: 'Reclama tu presupuesto gratis',
    copyCta: 'Copiar correo',
    copySuccess: '¡Correo copiado a tu portapapeles!',
    copyError:
      '¡Ups! No pudimos copiar el correo. Aquí está: contact@dousec.org',
    socialsLabel: 'En otros sitios',
    sinceLabel: 'Desde',
    sinceText: 'Construyendo Software Open-Source y Privado desde 2021',
    payments: [
      {
        name: 'PayPal',
        icon: 'paypal',
        glyph: null,
        note: 'Global, al instante. Todo el mundo lo usa.',
      },
      {
        name: 'Wise',
        icon: 'wise',
        glyph: null,
        note: 'Comisión de cambio justa, sin costos ocultos.',
      },
      {
        name: 'ACH',
        icon: null,
        glyph: 'ACH',
        note: 'Transferencia bancaria local, directa al dev. Simple, sin fricción.',
      },
      {
        name: 'Takenos',
        icon: null,
        glyph: 'T',
        note: 'Hecho en Latam, sin fronteras, puente directo.',
      },
    ],
  },
  footer: {
    tagline:
      'Un equipo de software freelance en Latam y Europa. Sin agencias, sin intermediarios. Tú eliges a los devs, tú pones el precio, we ship.',
    exploreLabel: 'Explora',
    exploreLinks: [
      { label: 'Inicio', href: '#top' },
      { label: 'Cómo funciona', href: '#how' },
      { label: 'Elige tu equipo', href: '#team' },
      { label: 'Los desarrolladores', href: '#team-map' },
      { label: 'Contacto', href: '#contact' },
    ],
    connectLabel: 'Conecta',
    credit: '© {year} Dou · hecho con Astro · React · Three.js',
    backToTop: 'Volver arriba',
  },
};

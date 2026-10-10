type Kind = 'call' | 'estimate' | 'lead';
type Props = Record<string, string>;

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Props }) => void) & { q?: unknown[] };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const EVENTS: Record<string, Record<Kind, string>> = {
  plausible: { call: 'Call Click', estimate: 'Estimate CTA Click', lead: 'Form Submit' },
  ga4: { call: 'call_click', estimate: 'estimate_cta_click', lead: 'generate_lead' },
};

const root = document.documentElement;
const provider = root.dataset.analytics ?? '';

if (provider === 'plausible' && !window.plausible) {
  window.plausible = Object.assign(
    (...args: unknown[]) => {
      (window.plausible!.q = window.plausible!.q || []).push(args);
    },
    { q: [] as unknown[] },
  );
}

if (provider === 'ga4' && !window.gtag) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', root.dataset.analyticsId);
}

export function track(kind: Kind, props: Props): void {
  const name = EVENTS[provider]?.[kind];
  if (!name) return;
  if (provider === 'plausible') window.plausible?.(name, { props });
  if (provider === 'ga4') window.gtag?.('event', name, props);
}

document.addEventListener(
  'click',
  (event) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>('[data-track]');
    const kind = el?.dataset.track;
    if (kind !== 'call' && kind !== 'estimate') return;
    track(kind, { location: el!.dataset.trackLocation ?? 'page' });
  },
  true,
);

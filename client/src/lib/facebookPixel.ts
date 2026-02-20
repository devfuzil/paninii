/**
 * Facebook / Meta Pixel.
 * Só carrega se VITE_FACEBOOK_PIXEL_ID estiver definido no .env.
 */

declare global {
  interface Window {
    fbq: (
      action: "init" | "track" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: typeof window.fbq;
  }
}

const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID as string | undefined;

function loadPixelScript(): void {
  if (typeof window === "undefined" || window.fbq) return;
  const script = document.createElement("script");
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
  `;
  document.head.appendChild(script);
}

/**
 * Inicializa o pixel e dispara PageView (chame uma vez no carregamento do app).
 */
export function initFacebookPixel(): void {
  if (!PIXEL_ID || !PIXEL_ID.trim()) return;
  loadPixelScript();
  scriptReady(() => {
    window.fbq("init", PIXEL_ID!);
    window.fbq("track", "PageView");
  });
}

function scriptReady(cb: () => void): void {
  if (window.fbq) {
    cb();
    return;
  }
  const check = setInterval(() => {
    if (window.fbq) {
      clearInterval(check);
      cb();
    }
  }, 20);
  setTimeout(() => clearInterval(check), 5000);
}

/**
 * Dispara o evento Purchase (use na página de sucesso da compra).
 * Enviamos só value e currency para evitar bloqueio por políticas da Meta.
 */
export function trackFacebookPurchase(params: {
  value: number;
  currency?: string;
}): void {
  if (!PIXEL_ID || !PIXEL_ID.trim()) return;
  if (!window.fbq) return;
  window.fbq("track", "Purchase", {
    value: params.value,
    currency: params.currency ?? "BRL",
  });
}

export function isFacebookPixelEnabled(): boolean {
  return Boolean(PIXEL_ID && PIXEL_ID.trim());
}

/**
 * Facebook / Meta Pixel.
 * Só carrega se VITE_FACEBOOK_PIXEL_ID estiver definido no .env.
 */

declare global {
  interface Window {
    fbq?: (
      action: "init" | "track" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: typeof window.fbq;
    __FB_PIXEL_ID__?: string;
  }
}

const PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID as string | undefined;
const PIXEL_DEBUG = import.meta.env.VITE_FACEBOOK_PIXEL_DEBUG === "true";

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
 * Define o ID do pixel no global para o script em index.html carregar o pixel.
 * Se após 500ms o pixel não existir (HTML sem script), carrega via JS como fallback.
 */
export function setFacebookPixelId(): void {
  if (!PIXEL_ID || !PIXEL_ID.trim()) return;
  window.__FB_PIXEL_ID__ = PIXEL_ID;
  setTimeout(() => {
    if (window.fbq) return;
    loadPixelScript();
    scriptReady(() => {
      if (window.fbq) {
        window.fbq("init", PIXEL_ID!);
        window.fbq("track", "PageView");
      }
    });
  }, 500);
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
 * Só value e currency para evitar bloqueio por políticas da Meta.
 * Se Purchase for bloqueado, use VITE_FACEBOOK_PIXEL_DEBUG=true e confira
 * o evento "CompraTeste" no Events Manager (se aparecer = pixel OK, Purchase que está bloqueado).
 */
export function trackFacebookPurchase(params: {
  value: number;
  currency?: string;
}): void {
  if (!PIXEL_ID || !PIXEL_ID.trim()) return;

  const value = params.value;
  const currency = params.currency ?? "BRL";
  const payload = { value, currency };

  const send = () => {
    if (typeof window === "undefined") return false;
    const fbq = (window as Window & { fbq?: typeof window.fbq }).fbq;
    if (!fbq) return false;
    fbq("track", "Purchase", payload);
    if (PIXEL_DEBUG) fbq("trackCustom", "CompraTeste", { value });
    return true;
  };

  if (send()) return;

  let attempts = 0;
  const maxAttempts = 250;
  const interval = setInterval(() => {
    attempts++;
    if (send() || attempts >= maxAttempts) clearInterval(interval);
  }, 20);
}

export function isFacebookPixelEnabled(): boolean {
  return Boolean(PIXEL_ID && PIXEL_ID.trim());
}

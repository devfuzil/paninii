/**
 * Facebook / Meta Pixel – evento Purchase.
 * O pixel base (init + PageView) está no index.html.
 */

declare global {
  interface Window {
    fbq?: (
      action: "init" | "track" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: typeof window.fbq;
  }
}

/**
 * Dispara o evento Purchase na página de sucesso da compra.
 * Só value e currency para evitar bloqueio por políticas da Meta.
 * Espera o fbq estar pronto (até 3s) para não perder o evento.
 */
export function trackFacebookPurchase(params: {
  value: number;
  currency?: string;
}): void {
  if (typeof window === "undefined") return;

  const value = params.value;
  const currency = params.currency ?? "BRL";
  const payload = { value, currency };

  const send = () => {
    if (window.fbq) {
      window.fbq("track", "Purchase", payload);
      return true;
    }
    return false;
  };

  if (send()) return;

  let attempts = 0;
  const maxAttempts = 15;
  const interval = setInterval(() => {
    attempts++;
    if (send() || attempts >= maxAttempts) clearInterval(interval);
  }, 200);
}

export function isFacebookPixelEnabled(): boolean {
  return typeof window !== "undefined" && Boolean(window.fbq);
}

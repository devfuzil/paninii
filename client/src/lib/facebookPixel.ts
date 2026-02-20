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
 */
export function trackFacebookPurchase(params: {
  value: number;
  currency?: string;
}): void {
  if (typeof window === "undefined" || !window.fbq) return;

  const value = params.value;
  const currency = params.currency ?? "BRL";

  window.fbq("track", "Purchase", { value, currency });
}

export function isFacebookPixelEnabled(): boolean {
  return typeof window !== "undefined" && Boolean(window.fbq);
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  priceFormatted: string;
  /** Nome do arquivo da imagem em public/images/ (ex: envelopes_140.webp) */
  image?: string;
}

export const PRODUCTS: Record<string, Product> = {
  starter: {
    id: "starter",
    name: "Kit Iniciante",
    description: "1 Álbum Capa Dura + 30 Pacotes",
    price: 9700, // R$ 97,00
    priceFormatted: "R$ 97,00",
  },
  popular: {
    id: "popular",
    name: "Kit Campeão",
    description: "1 Álbum Capa Dura + 60 Pacotes",
    price: 14900, // R$ 149,00
    priceFormatted: "R$ 149,00",
  },
  complete: {
    id: "complete",
    name: "Kit Colecionador",
    description: "1 Álbum Capa Dura + 90 Pacotes",
    price: 19900, // R$ 199,00
    priceFormatted: "R$ 199,00",
  },
};

export const BUMPS: Record<string, Product> = {
  envelopes_140: {
    id: "envelopes_140",
    name: "20 Envelopes com 140 Figurinhas",
    description: "LEVE MAIS 140 FIGURINHAS — Para quem quer completar de verdade",
    price: 3499, // R$ 34,99
    priceFormatted: "R$ 34,99",
    image: "envelopes_140.webp",
  },
  porta_album: {
    id: "porta_album",
    name: "Porta-Álbum Premium Copa do Mundo 2026 — Edição Colecionador",
    description: "PORTA-ÁLBUM PREMIUM EDIÇÃO COLECIONADOR — Adicione o Porta-Álbum Premium e transforme sua coleção em peça de destaque na sua estante.",
    price: 4499, // R$ 44,99
    priceFormatted: "R$ 44,99",
    image: "porta_album.webp",
  },
};

export type ShippingOptionId = "PAC" | "SEDEX";

export const SHIPPING_OPTIONS: Array<{
  id: ShippingOptionId;
  name: string;
  days: string;
  costCents: number;
  costFormatted: string;
}> = [
  { id: "PAC", name: "Correios - PAC", days: "4 a 7 dias", costCents: 0, costFormatted: "Grátis" },
  { id: "SEDEX", name: "Correios - SEDEX", days: "2 a 3 dias", costCents: 1174, costFormatted: "R$ 11,74" },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS[id];
}

export function getBumpById(id: string): Product | undefined {
  return BUMPS[id];
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

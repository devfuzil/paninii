export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  priceFormatted: string;
}

// Preços em R$ 1,00 para teste (voltar aos valores reais depois)
export const PRODUCTS: Record<string, Product> = {
  starter: {
    id: "starter",
    name: "Kit Iniciante",
    description: "1 Álbum Capa Dura + 30 Pacotes",
    price: 100, // R$ 1,00 (teste)
    priceFormatted: "R$ 1,00",
  },
  popular: {
    id: "popular",
    name: "Kit Campeão",
    description: "1 Álbum Capa Dura + 60 Pacotes",
    price: 100, // R$ 1,00 (teste)
    priceFormatted: "R$ 1,00",
  },
  complete: {
    id: "complete",
    name: "Kit Colecionador",
    description: "1 Álbum Capa Dura + 90 Pacotes",
    price: 100, // R$ 1,00 (teste)
    priceFormatted: "R$ 1,00",
  },
};

export function getProductById(id: string): Product | undefined {
  return PRODUCTS[id];
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

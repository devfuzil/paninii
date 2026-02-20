import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Package } from "lucide-react";
import type { Product } from "../../../shared/products";

interface OrderSummaryProps {
  product: Product;
}

export default function OrderSummary({ product }: OrderSummaryProps) {
  const originalPrice = Math.round(product.price / 0.66); // Calcula preço original (34% desconto)
  const discount = originalPrice - product.price;
  const discountPercent = Math.round((discount / originalPrice) * 100);

  return (
    <div className="bg-red-600 text-white rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

      {/* Product Card */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex gap-3">
          <img
            src={`/images/${product.id === "starter" ? "1alb1box" : product.id === "popular" ? "1alb2box" : "1alb3box"}.webp`}
            alt={product.name}
            className="w-20 h-20 object-contain"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-gray-900 font-bold text-sm">{product.name}</h3>
              {product.id === "popular" && (
                <Badge className="bg-red-600 text-white text-xs">MAIS VENDIDO</Badge>
              )}
            </div>
            <p className="text-gray-600 text-xs">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Entrega em 4-7 dias úteis</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Produto Original Panini</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-red-500 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="line-through">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(originalPrice / 100)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Desconto ({discountPercent}%)</span>
          <span className="text-green-400 font-semibold">
            -
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(discount / 100)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Frete (PAC)</span>
          <span className="text-green-400 font-semibold">Grátis</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-red-500 mt-4 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total</span>
          <div className="text-right">
            <div className="text-3xl font-bold">{product.priceFormatted}</div>
            <div className="text-xs opacity-90">ou 12x de R$ {(product.price / 100 / 12).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span>Compra 100% Segura</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Produto Original Panini</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          <span>Entrega Garantida</span>
        </div>
      </div>
    </div>
  );
}

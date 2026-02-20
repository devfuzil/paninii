import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Package, Truck, Mail } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Success() {
  const [, params] = useRoute("/success/:orderId");
  const [, setLocation] = useLocation();
  const orderId = params?.orderId ? parseInt(params.orderId) : 0;

  const { data, isLoading } = trpc.orders.getById.useQuery(
    { orderId },
    { enabled: orderId > 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>Pedido não encontrado</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")}>Voltar para a página inicial</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { order } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-2 border-green-200">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-green-700 mb-2">
              Pedido Confirmado!
            </CardTitle>
            <CardDescription className="text-lg">
              Obrigado pela sua compra, {order.customerName}!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg mb-4">Resumo do Pedido</h3>
              <div className="flex justify-between">
                <span className="text-gray-600">Número do Pedido:</span>
                <span className="font-semibold">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Produto:</span>
                <span className="font-semibold">{order.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Pago:</span>
                <span className="font-semibold text-green-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(order.productPrice / 100)}
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">✓ Pagamento Aprovado</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Endereço de Entrega</h3>
              </div>
              <div className="text-sm space-y-1 text-gray-700">
                <p>{order.shippingStreet}, {order.shippingNumber}</p>
                {order.shippingComplement && <p>{order.shippingComplement}</p>}
                <p>{order.shippingNeighborhood}</p>
                <p>{order.shippingCity} - {order.shippingState}</p>
                <p>CEP: {order.shippingZipcode}</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Próximos Passos</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Confirmação por E-mail</p>
                    <p className="text-sm text-gray-600">
                      Você receberá um e-mail com os detalhes do pedido
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Preparação do Pedido</p>
                    <p className="text-sm text-gray-600">
                      Seu pedido será preparado em até 2 dias úteis
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Entrega</p>
                    <p className="text-sm text-gray-600">
                      Prazo de entrega: 7 a 15 dias úteis
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => setLocation("/")}
              >
                Voltar para Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

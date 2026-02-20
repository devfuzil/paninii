import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, Check, CreditCard } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import CheckoutStepper from "@/components/CheckoutStepper";
import OrderSummary from "@/components/OrderSummary";
import TrustSection from "@/components/TrustSection";
import { getProductById } from "../../../shared/products";

export default function Payment() {
  const [, params] = useRoute("/payment/:orderId");
  const [, setLocation] = useLocation();
  const orderId = params?.orderId ? parseInt(params.orderId) : 0;

  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = trpc.orders.getById.useQuery(
    { orderId },
    { enabled: orderId > 0 }
  );

  const { data: statusData } = trpc.orders.checkStatus.useQuery(
    { orderId },
    {
      enabled: orderId > 0,
      refetchInterval: (query) => {
        const status = query.state.data?.transactionStatus;
        return status === "COMPLETO" || status === "FALHA" ? false : 5000;
      },
    }
  );

  useEffect(() => {
    if (statusData?.transactionStatus === "COMPLETO") {
      toast.success("Pagamento aprovado!");
      setTimeout(() => {
        setLocation(`/success/${orderId}`);
      }, 2000);
    }
  }, [statusData, orderId, setLocation]);

  const product = data?.order ? getProductById(data.order.productId) : null;

  const handleCopyPix = () => {
    if (data?.transaction?.copyPaste) {
      navigator.clipboard.writeText(data.transaction.copyPaste);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading || !data || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")}>Voltar para a página inicial</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { transaction } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-red-800"
              onClick={() => setLocation(`/checkout/${product.id}`)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <img src="/pngwing.com.png" alt="Copa" className="h-10" />
            <div className="flex items-center gap-2 text-white text-sm">
              <Lock className="w-4 h-4" />
              <span className="hidden md:inline">Compra Segura</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <CheckoutStepper currentStep={3} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Forma de Pagamento
                </CardTitle>
                <p className="text-sm text-gray-600">Escolha como deseja pagar</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* PIX Option */}
                <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">PIX</span>
                          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                            RECOMENDADO
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Aprovação instantânea</p>
                      </div>
                    </div>
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>

                {/* Credit Card Option (Disabled) */}
                <div className="border rounded-lg p-4 bg-gray-50 opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-10 h-10 text-gray-400" />
                      <div>
                        <span className="font-bold text-gray-600">Cartão de Crédito</span>
                        <p className="text-sm text-gray-500">Parcele em até 12x</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            {transaction ? (
              <Card>
                <CardHeader>
                  <CardTitle>Pague com PIX</CardTitle>
                  <p className="text-sm text-gray-600">
                    Escaneie o QR Code ou copie o código abaixo
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* QR Code */}
                  {transaction.qrCodeBase64 && (
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <img
                          src={transaction.qrCodeBase64}
                          alt="QR Code PIX"
                          className="w-64 h-64"
                        />
                      </div>
                    </div>
                  )}

                  {/* Copy Code */}
                  {transaction.copyPaste && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ou copie o código PIX:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={transaction.copyPaste}
                          readOnly
                          className="flex-1 px-4 py-3 border rounded-lg bg-gray-50 text-sm font-mono"
                        />
                        <Button
                          onClick={handleCopyPix}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {copied ? "Copiado!" : "Copiar"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold mb-2 text-blue-900">Como pagar:</h4>
                    <ol className="text-sm space-y-1 text-blue-800">
                      <li>1. Abra o app do seu banco</li>
                      <li>2. Escolha pagar via PIX</li>
                      <li>3. Escaneie o QR Code ou cole o código</li>
                      <li>4. Confirme o pagamento</li>
                      <li>5. Aguarde a confirmação automática</li>
                    </ol>
                  </div>

                  {/* Waiting Status */}
                  {statusData?.transactionStatus === "PENDENTE" && (
                    <div className="text-center py-4">
                      <div className="animate-pulse flex items-center justify-center gap-2 text-orange-600">
                        <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce"></div>
                        <span className="font-medium">Aguardando pagamento...</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        A confirmação é automática e leva alguns segundos
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Gerando QR Code...</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-1">
            <OrderSummary product={product} />
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <TrustSection />
    </div>
  );
}

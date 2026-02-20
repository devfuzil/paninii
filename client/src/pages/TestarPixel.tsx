import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackFacebookPurchase } from "@/lib/facebookPixel";
import { ArrowLeft } from "lucide-react";

/**
 * Página só para testar o evento Purchase do Facebook sem precisar pagar.
 * Acesse /testar-pixel e clique no botão; confira no Meta Pixel Validator.
 */
export default function TestarPixel() {
  const [, setLocation] = useLocation();
  const [disparado, setDisparado] = useState(false);

  const handleDisparar = () => {
    trackFacebookPurchase({ value: 0.01, currency: "BRL" });
    setDisparado(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Testar evento Purchase</CardTitle>
          <CardDescription>
            Dispara um Purchase de R$ 0,01 para testar o pixel sem pagar. Abra o Meta Pixel Validator e clique no botão abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleDisparar}
          >
            Disparar Purchase (teste)
          </Button>
          {disparado && (
            <p className="text-sm text-green-600 font-medium">
              Evento disparado. Confira no Meta Pixel Validator se &quot;Purchase&quot; apareceu.
            </p>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

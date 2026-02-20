import { Check, Truck, Package } from "lucide-react";

export default function TrustSection() {
  const features = [
    {
      icon: Check,
      title: "Clientes Satisfeitos",
      description:
        "Garantimos a satisfação de 100% dos nossos clientes. São mais de 50.000 clientes satisfeitos em 2025.",
    },
    {
      icon: Truck,
      title: "Envio Rápido",
      description:
        "Após a aprovação da compra, o pedido é separado para envio de imediato. O código de rastreio é enviado pelo e-mail e WhatsApp.",
    },
    {
      icon: Package,
      title: "Devolução Grátis",
      description:
        "Você tem 7 dias a partir do recebimento do pedido para devolução caso o mesmo não corresponda às suas expectativas.",
    },
  ];

  return (
    <div className="bg-gray-50 py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-red-600 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Badges */}
      <div className="border-t mt-12 pt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Produto Original</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>Entrega Garantida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="text-center mt-8 text-xs text-gray-500">
        <p className="font-semibold">PANINI BRASIL LTDA</p>
        <p>CNPJ: 50.870.819/0001-06</p>
        <p>Av. das Nações Unidas, 4777 - São Paulo - SP, 05477-000</p>
        <p>contato@panini.com.br</p>
      </div>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

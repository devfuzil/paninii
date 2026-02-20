import { User, MapPin, CreditCard } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3;
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { number: 1, label: "Dados Pessoais", icon: User },
    { number: 2, label: "Endereço", icon: MapPin },
    { number: 3, label: "Pagamento", icon: CreditCard },
  ];

  return (
    <div className="bg-white border-b py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;

            return (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isActive
                        ? "bg-red-600 text-white"
                        : isCompleted
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="font-bold">{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`hidden md:inline font-medium ${
                      isActive || isCompleted ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-16 h-0.5 mx-4 ${
                      isCompleted ? "bg-red-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import axios from "axios";

const MISTICPAY_API_URL = "https://api.misticpay.com/api";

interface MisticPayConfig {
  clientId: string;
  clientSecret: string;
}

interface CreateTransactionParams {
  amount: number; // in reais (e.g., 99.00)
  payerName: string;
  payerDocument: string; // CPF without formatting
  transactionId: string; // unique ID from your application
  description: string;
  projectWebhook?: string;
}

interface MisticPayTransactionResponse {
  message: string;
  data: {
    transactionId: string;
    payer: {
      name: string;
      document: string;
    };
    transactionFee: number; // in cents
    transactionType: string;
    transactionMethod: string;
    transactionAmount: number; // in cents
    transactionState: "PENDENTE" | "COMPLETO" | "FALHA";
    qrCodeBase64: string;
    qrcodeUrl: string;
    copyPaste: string;
  };
}

interface CheckTransactionParams {
  transactionId: string;
}

interface MisticPayCheckResponse {
  message: string;
  transaction: {
    transactionId: string;
    value: number;
    fee: number;
    transactionState: "PENDENTE" | "COMPLETO" | "FALHA";
    transactionType: string;
    transactionMethod: string;
    createdAt: string;
    updatedAt: string;
  };
}

export class MisticPayService {
  private config: MisticPayConfig;

  constructor(config: MisticPayConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      ci: this.config.clientId,
      cs: this.config.clientSecret,
      "Content-Type": "application/json",
    };
  }

  async createTransaction(params: CreateTransactionParams): Promise<MisticPayTransactionResponse> {
    try {
      const response = await axios.post<MisticPayTransactionResponse>(
        `${MISTICPAY_API_URL}/transactions/create`,
        {
          amount: params.amount,
          payerName: params.payerName,
          payerDocument: params.payerDocument,
          transactionId: params.transactionId,
          description: params.description,
          projectWebhook: params.projectWebhook,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("[MisticPay] Create transaction error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create MisticPay transaction");
      }
      throw error;
    }
  }

  async checkTransaction(params: CheckTransactionParams): Promise<MisticPayCheckResponse> {
    try {
      const response = await axios.post<MisticPayCheckResponse>(
        `${MISTICPAY_API_URL}/transactions/check`,
        {
          transactionId: params.transactionId,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("[MisticPay] Check transaction error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to check MisticPay transaction");
      }
      throw error;
    }
  }

  async getBalance(): Promise<{ balance: number }> {
    try {
      const response = await axios.get<{ message: string; data: { balance: number } }>(
        `${MISTICPAY_API_URL}/users/balance`,
        {
          headers: this.getHeaders(),
        }
      );

      return { balance: response.data.data.balance };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("[MisticPay] Get balance error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to get MisticPay balance");
      }
      throw error;
    }
  }
}

// Singleton instance
let misticPayInstance: MisticPayService | null = null;

export function getMisticPayService(): MisticPayService {
  if (!misticPayInstance) {
    const clientId = process.env.MISTICPAY_CLIENT_ID;
    const clientSecret = process.env.MISTICPAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("MisticPay credentials not configured");
    }

    misticPayInstance = new MisticPayService({
      clientId,
      clientSecret,
    });
  }

  return misticPayInstance;
}

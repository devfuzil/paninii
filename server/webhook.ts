import express from "express";
import { getTransactionByMisticpayId, updateTransactionStatus, updateOrderStatus, getOrderById } from "./db";
import { notifyOwner } from "./_core/notification";

export type MisticpayWebhookBody = {
  transactionId?: string | number;
  transactionType?: string;
  transactionMethod?: string;
  clientName?: string;
  clientDocument?: string;
  status?: string;
  value?: number;
  fee?: number;
};

export type MisticpayWebhookResult =
  | { ok: true; status: 200 }
  | { ok: false; status: 400 | 404 | 500; body: { error: string } };

/**
 * Shared handler for MisticPay webhook. Used by Express and Vercel serverless.
 */
export async function handleMisticpayWebhook(body: unknown): Promise<MisticpayWebhookResult> {
  const {
    transactionId,
    status,
  } = (body || {}) as MisticpayWebhookBody;

  if (!transactionId || !status) {
    return { ok: false, status: 400, body: { error: "Missing required fields" } };
  }

  const transaction = await getTransactionByMisticpayId(transactionId.toString());
  if (!transaction) {
    return { ok: false, status: 404, body: { error: "Transaction not found" } };
  }

  await updateTransactionStatus(transaction.id, status);

  const order = await getOrderById(transaction.orderId);
  if (!order) {
    return { ok: false, status: 404, body: { error: "Order not found" } };
  }

  if (status === "COMPLETO" && order.status !== "paid") {
    await updateOrderStatus(order.id, "paid");
    await notifyOwner({
      title: "🎉 Novo pedido aprovado!",
      content: `Pedido #${order.id} de ${order.customerName} foi aprovado.\n\nProduto: ${order.productName}\nValor: R$ ${(order.productPrice / 100).toFixed(2)}\n\nEndereço de entrega:\n${order.shippingStreet}, ${order.shippingNumber}${order.shippingComplement ? ` - ${order.shippingComplement}` : ""}\n${order.shippingNeighborhood}, ${order.shippingCity} - ${order.shippingState}\nCEP: ${order.shippingZipcode}`,
    });
  } else if (status === "FALHA" && order.status !== "failed") {
    await updateOrderStatus(order.id, "failed");
  }

  return { ok: true, status: 200 };
}

export const webhookRouter = express.Router();

webhookRouter.post("/misticpay", express.json(), async (req, res) => {
  try {
    const result = await handleMisticpayWebhook(req.body);
    if (result.ok) {
      return res.status(200).json({ success: true, message: "Webhook processed successfully" });
    }
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

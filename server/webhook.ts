import express from "express";
import { getTransactionByMisticpayId, updateTransactionStatus, updateOrderStatus, getOrderById } from "./db";
import { notifyOwner } from "./_core/notification";

export const webhookRouter = express.Router();

// MisticPay webhook endpoint
webhookRouter.post("/misticpay", express.json(), async (req, res) => {
  try {
    console.log("[Webhook] Received MisticPay webhook:", JSON.stringify(req.body, null, 2));

    const {
      transactionId,
      transactionType,
      transactionMethod,
      clientName,
      clientDocument,
      status,
      value,
      fee,
    } = req.body;

    if (!transactionId || !status) {
      console.error("[Webhook] Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find transaction in database
    const transaction = await getTransactionByMisticpayId(transactionId.toString());
    if (!transaction) {
      console.error(`[Webhook] Transaction not found: ${transactionId}`);
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Update transaction status
    await updateTransactionStatus(transaction.id, status);
    console.log(`[Webhook] Updated transaction ${transaction.id} to status: ${status}`);

    // Get order
    const order = await getOrderById(transaction.orderId);
    if (!order) {
      console.error(`[Webhook] Order not found: ${transaction.orderId}`);
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status based on transaction status
    if (status === "COMPLETO" && order.status !== "paid") {
      await updateOrderStatus(order.id, "paid");
      console.log(`[Webhook] Updated order ${order.id} to status: paid`);

      // Notify owner
      await notifyOwner({
        title: "🎉 Novo pedido aprovado!",
        content: `Pedido #${order.id} de ${order.customerName} foi aprovado.\n\nProduto: ${order.productName}\nValor: R$ ${(order.productPrice / 100).toFixed(2)}\n\nEndereço de entrega:\n${order.shippingStreet}, ${order.shippingNumber}${order.shippingComplement ? ` - ${order.shippingComplement}` : ""}\n${order.shippingNeighborhood}, ${order.shippingCity} - ${order.shippingState}\nCEP: ${order.shippingZipcode}`,
      });
      console.log(`[Webhook] Notified owner about order ${order.id}`);
    } else if (status === "FALHA" && order.status !== "failed") {
      await updateOrderStatus(order.id, "failed");
      console.log(`[Webhook] Updated order ${order.id} to status: failed`);
    }

    return res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

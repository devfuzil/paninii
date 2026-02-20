import { desc, eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { InsertOrder, InsertTransaction, InsertCardAttempt, Order, Transaction } from "../drizzle/schema";
import { orders, transactions, cardAttempts } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      _db = drizzle({ client: sql });
    } catch (e) {
      console.warn("[DB] Connect failed:", e);
      _db = null;
    }
  }
  return _db;
}

export async function createOrder(data: InsertOrder): Promise<Order> {
  const db = getDb();
  if (!db) throw new Error("Banco indisponível");

  const [row] = await db.insert(orders).values(data).returning();
  if (!row) throw new Error("Falha ao criar pedido");
  return row;
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return row;
}

export async function updateOrderStatus(id: number, status: Order["status"]): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Banco indisponível");
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
}

export async function createTransaction(data: InsertTransaction): Promise<Transaction> {
  const db = getDb();
  if (!db) throw new Error("Banco indisponível");

  const amount = typeof data.amount === "number" && !Number.isInteger(data.amount)
    ? Math.round(data.amount * 100)
    : Number(data.amount);
  const fee = typeof data.fee === "number" && !Number.isInteger(data.fee)
    ? Math.round(data.fee * 100)
    : Number(data.fee);

  const [row] = await db
    .insert(transactions)
    .values({ ...data, amount, fee })
    .returning();
  if (!row) throw new Error("Falha ao criar transação");
  return row;
}

export async function getTransactionByOrderId(orderId: number): Promise<Transaction | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const [row] = await db.select().from(transactions).where(eq(transactions.orderId, orderId)).limit(1);
  return row;
}

export async function getTransactionByMisticpayId(id: string): Promise<Transaction | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const [row] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.misticpayTransactionId, id))
    .limit(1);
  return row;
}

export async function updateTransactionStatus(
  id: number,
  status: Transaction["status"]
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Banco indisponível");
  await db.update(transactions).set({ status, updatedAt: new Date() }).where(eq(transactions.id, id));
}

export async function getAllOrders(): Promise<Order[]> {
  const db = getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function createCardAttempt(data: InsertCardAttempt): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Banco indisponível");
  await db.insert(cardAttempts).values(data);
}

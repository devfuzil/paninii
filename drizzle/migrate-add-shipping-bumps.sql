-- Execute este arquivo no SQL Editor do Neon (uma vez só).
-- Adiciona as colunas de frete e order bumps na tabela orders.
-- Se der erro "column already exists", ignore — significa que já foi aplicado.

ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingMethod" varchar(50) DEFAULT 'PAC' NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingCost" integer DEFAULT 0 NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shippingDays" varchar(50) DEFAULT '4 a 7 dias' NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "bumpsTotal" integer DEFAULT 0 NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "bumpIds" text;

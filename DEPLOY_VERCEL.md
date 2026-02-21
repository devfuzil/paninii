# Deploy na Vercel

O projeto está configurado para rodar **todo na Vercel** (frontend estático + API serverless).

## O que foi feito

- **Frontend:** build Vite em `dist/public`, servido como estático.
- **API tRPC:** `api/trpc/[...path].ts` — todas as rotas tRPC em `/api/trpc/*`.
- **Webhook MisticPay:** `api/webhook/misticpay.ts` — POST em `/api/webhook/misticpay`.

## Variáveis de ambiente (Vercel)

Configure no dashboard do projeto (Settings → Environment Variables):

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | Connection string do Neon (Postgres). |
| `VITE_FRONTEND_FORGE_API_URL` | URL pública do app (ex: `https://seu-app.vercel.app`) para o webhook do MisticPay. |
| Demais env do MisticPay / notificações | Conforme já usados no `.env` local. |

## Limites da Vercel (Hobby/Pro)

- **Body:** até 4,5 MB no request (Hobby). Para pedidos grandes, considere plano Pro (até 5 MB no serverless).
- **Timeout:** 60 s na função tRPC e 30 s no webhook (configurado em `vercel.json`).
- **Neon:** continua igual; o driver `@neondatabase/serverless` é adequado para serverless.

## Deploy

1. Conecte o repositório à Vercel.
2. Em **Settings → General → Build & Development**: não use **Production Override** no Build Command; deixe o projeto usar o comando do `vercel.json` (`node scripts/build-vercel-api.mjs && npx vite build`).
3. Defina as variáveis de ambiente.
4. Deploy: a Vercel usa `node scripts/build-vercel-api.mjs && npx vite build`. O script gera bundles autocontidos (`trpc-handler.js`, `misticpay-handler.js`) para as functions; não é preciso `tsc` nem pastas `server/` no deploy.
5. Após o deploy, defina em **MisticPay** a URL do webhook:  
   `https://<seu-dominio>.vercel.app/api/webhook/misticpay`

## Desenvolvimento local

Para rodar como antes (Express único):

```bash
pnpm run build
pnpm start
```

O servidor Express continua em `server/_core/index.ts`; na Vercel só entram as funções em `api/`.

# Deploy no Railway

Este projeto pode ser hospedado no [Railway](https://railway.app). O Railway detecta Node.js e usa os scripts do `package.json`.

## Passos

### 1. Repositório

- Crie um repositório no GitHub com o código do projeto.
- Não faça commit do arquivo `.env` (ele já está no `.gitignore`).

### 2. Novo projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login.
2. **New Project** → **Deploy from GitHub repo**.
3. Selecione o repositório do projeto e autorize o Railway.
4. O Railway vai usar:
   - **Build:** `npm install` + `npm run build`
   - **Start:** `npm start` (roda `node dist/index.js`)

### 3. Variáveis de ambiente

No projeto no Railway, abra **Variables** e configure:

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | URL do PostgreSQL (ex.: Neon). Ex.: `postgresql://user:pass@host/db?sslmode=require` |
| `MISTICPAY_CLIENT_ID` | Sim | Client ID da MisticPay |
| `MISTICPAY_CLIENT_SECRET` | Sim | Client Secret da MisticPay |
| `VITE_FRONTEND_FORGE_API_URL` | Sim | URL pública do app no Railway (ex.: `https://seu-app.up.railway.app`) para o webhook do PIX |
| `PORT` | Não | O Railway define automaticamente; o app já usa `process.env.PORT` |
| `NODE_ENV` | Não | O Railway costuma definir como `production` |

**Importante:** Depois do primeiro deploy, pegue a URL que o Railway gerou (ex.: `https://album-copa-production.up.railway.app`) e defina:

```bash
VITE_FRONTEND_FORGE_API_URL=https://sua-url.up.railway.app
```

(sem barra no final). Assim o webhook da MisticPay aponta para o seu app.

### 4. Banco de dados

- Use um PostgreSQL (ex.: [Neon](https://neon.tech)) e rode o script `drizzle/setup-neon.sql` no banco.
- Cole a connection string em `DATABASE_URL` no Railway.

### 5. Facebook / Meta Pixel (opcional)

Para rastrear conversões (PageView + Purchase na página de sucesso):

- `VITE_FACEBOOK_PIXEL_ID` = ID do seu pixel (ex.: `1234567890123456`)

Deixe vazio ou não defina para não carregar o pixel.

### 6. Notificações (opcional)

Se quiser notificação ao receber pagamento (ex.: Manus/Forge):

- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`

Sem essas variáveis, o app só não envia notificação; o resto funciona.

---

## Resumo

1. Subir código no GitHub (sem `.env`).
2. Criar projeto no Railway conectado ao repo.
3. Configurar variáveis (principalmente `DATABASE_URL`, MisticPay e `VITE_FRONTEND_FORGE_API_URL` com a URL do app).
4. Deploy automático a cada push (se o deploy automático estiver ativo).

A aplicação sobe em uma única instância; o mesmo processo serve o front (estático) e a API (Express + tRPC + webhook).

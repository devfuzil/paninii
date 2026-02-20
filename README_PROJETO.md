# Álbum Copa 2026 - Plataforma de Vendas com MisticPay

Plataforma completa de e-commerce para venda de kits de álbum e figurinhas da Copa do Mundo 2026, com integração total com a API MisticPay para pagamentos via PIX.

## 🚀 Funcionalidades Implementadas

### Backend
- ✅ Integração completa com API MisticPay (criação de transações, verificação de status)
- ✅ Sistema de pedidos com banco de dados MySQL
- ✅ Endpoints tRPC para gerenciamento de pedidos e transações
- ✅ Webhook para receber notificações de pagamento da MisticPay
- ✅ Notificações automáticas ao owner quando pedidos são aprovados
- ✅ Validação de dados (CPF, CEP, etc.)

### Frontend
- ✅ Landing page responsiva com seleção de 3 kits (Starter, Popular, Colecionador)
- ✅ Formulário de checkout com validação
- ✅ Integração com ViaCEP para preenchimento automático de endereço
- ✅ Página de pagamento com QR Code PIX
- ✅ Verificação automática de status de pagamento (polling a cada 5 segundos)
- ✅ Página de sucesso pós-pagamento
- ✅ Design responsivo mobile-first
- ✅ Melhorias visuais com Tailwind CSS e shadcn/ui

### Segurança
- ✅ Credenciais MisticPay armazenadas de forma segura no backend
- ✅ Validação de dados no frontend e backend
- ✅ Proteção contra injeção de dados

## 📦 Produtos Disponíveis

1. **Kit Starter** - R$ 99,00
   - 1 Álbum Oficial
   - 20 Pacotes de Figurinhas
   - Frete Grátis

2. **Kit Popular** - R$ 149,00 (MAIS POPULAR)
   - 1 Álbum Oficial
   - 50 Pacotes de Figurinhas
   - Frete Grátis
   - Figurinhas Extras

3. **Kit Colecionador** - R$ 199,00
   - 1 Álbum Oficial Premium
   - 100 Pacotes de Figurinhas
   - Frete Grátis
   - Figurinhas Especiais
   - Bônus Exclusivo

## 🔧 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Node.js, Express, tRPC 11
- **Banco de Dados**: MySQL/TiDB (via Drizzle ORM)
- **Pagamentos**: MisticPay API (PIX)
- **Validações**: Zod
- **Testes**: Vitest

## 🎯 Fluxo de Compra

1. **Seleção do Produto**: Cliente escolhe um dos 3 kits na landing page
2. **Checkout**: Preenchimento de dados pessoais e endereço de entrega
3. **Pagamento**: Geração automática de QR Code PIX via MisticPay
4. **Confirmação**: Verificação automática do pagamento
5. **Sucesso**: Página de confirmação com detalhes do pedido

## 📊 Estrutura do Banco de Dados

### Tabela `orders`
- Dados do cliente (nome, CPF, email, telefone)
- Endereço de entrega completo
- Produto e valor
- Status do pedido (pending, paid, failed, cancelled)

### Tabela `transactions`
- Vínculo com pedido
- ID da transação MisticPay
- Dados do PIX (QR Code, copia e cola)
- Status da transação (PENDENTE, COMPLETO, FALHA)

## 🔗 Endpoints da API

### tRPC Endpoints
- `orders.create`: Cria novo pedido e transação PIX
- `orders.getById`: Busca pedido por ID
- `orders.checkStatus`: Verifica status do pagamento

### Webhook
- `POST /api/webhook/misticpay`: Recebe notificações da MisticPay

## ⚙️ Configuração

### Variáveis de Ambiente Necessárias
- `MISTICPAY_CLIENT_ID`: Client ID da API MisticPay
- `MISTICPAY_CLIENT_SECRET`: Client Secret da API MisticPay
- `DATABASE_URL`: String de conexão do banco de dados

### Comandos Úteis
```bash
# Instalar dependências
pnpm install

# Rodar migrações do banco
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev

# Executar testes
pnpm test

# Build para produção
pnpm build
```

## 🎨 Design

O design foi criado com foco em:
- Responsividade mobile-first
- Cores vibrantes (azul #2563eb como cor principal)
- Tipografia clara e legível
- Espaçamentos consistentes
- Feedback visual em todas as ações
- Ícones intuitivos (lucide-react)

## 🔔 Notificações

Quando um pagamento é aprovado:
1. O status do pedido é atualizado no banco de dados
2. O owner recebe uma notificação com detalhes do pedido
3. O cliente é redirecionado para a página de sucesso

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🧪 Testes

Testes implementados:
- ✅ Criação de pedidos
- ✅ Recuperação de pedidos
- ✅ Atualização de status
- ✅ Criação de transações
- ✅ Catálogo de produtos

## 📝 Observações Importantes

1. **Credenciais MisticPay**: As credenciais fornecidas inicialmente estavam inválidas. Certifique-se de usar credenciais válidas do painel MisticPay.

2. **Webhook URL**: O webhook está configurado para receber notificações em `/api/webhook/misticpay`. Certifique-se de configurar esta URL no painel da MisticPay.

3. **Polling de Status**: A página de pagamento verifica o status a cada 5 segundos. Quando o pagamento é aprovado, o cliente é automaticamente redirecionado.

4. **Imagens**: As imagens dos produtos estão em `/client/public/images/` e são servidas estaticamente.

## 🚀 Deploy

Para fazer deploy:
1. Configure as variáveis de ambiente no servidor
2. Execute `pnpm build`
3. Inicie o servidor com `pnpm start`
4. Configure o webhook da MisticPay para apontar para seu domínio

## 📞 Suporte

Para dúvidas sobre a API MisticPay, consulte a documentação oficial em https://docs.misticpay.com/

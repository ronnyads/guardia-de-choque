# REQUIREMENTS — CommerceOS SaaS Multi-Tenant

## Requisitos Funcionais

### RF-01: Multi-tenancy com isolamento real
- Cada tenant tem `tenant_id` único
- RLS (Row Level Security) no Supabase isola dados entre tenants
- Middleware injeta `tenant_id` em todas as requisições
- Nenhum tenant pode ver ou afetar dados de outro

### RF-02: Configuração completa via admin (zero hardcode)
- Nome da loja, logo, cores, fontes → configuráveis no painel
- Mensagens de anúncio, trust badges, FAQs → editáveis no painel
- Dados de contato (telefone, email) → configuráveis
- SEO (título, descrição, OG image) → configuráveis

### RF-03: Integrações por tenant
- Mercado Pago: cada tenant cadastra seu próprio public key + access token
- Stripe: cada tenant cadastra seu próprio public key + secret key
- Meta Pixel ID → por tenant
- Kwai Pixel ID → por tenant
- Chaves secretas armazenadas criptografadas (Supabase Vault ou pgcrypto)
- Botão "Testar Conexão" valida credenciais antes de salvar

### RF-04: Catálogo de produtos dinâmico
- CRUD completo de produtos no admin (criar, editar, deletar)
- Upload de imagens (Supabase Storage)
- Categorias configuráveis por tenant
- Estoque gerenciado
- Preços com suporte a promoção + preço PIX
- FAQs e especificações por produto

### RF-05: Checkout por tenant
- Checkout usa as credenciais MP/Stripe do tenant
- Preços validados contra banco (não hardcoded)
- Pedidos salvos na tabela `orders` com `tenant_id`
- Suporte a PIX, cartão de crédito (parcelamento)
- Order bump e upsell configuráveis por tenant

### RF-06: Painel de pedidos real
- Lê da tabela `orders` (não mais da API do MP)
- Filtros por status, data, valor
- Detalhes do cliente e itens por pedido
- Export CSV

### RF-07: Onboarding de novos lojistas
- Landing page pública para cadastro (`/criar-loja`)
- Wizard de 3 etapas: dados da loja → pagamento → visual
- Criação automática de tenant + usuário admin
- Store funcionando imediatamente após cadastro

### RF-08: Super Admin (plataforma)
- Painel para dono da plataforma gerenciar todos os tenants
- Ativar/suspender lojas
- Métricas globais (total de lojas, pedidos, receita)

## Requisitos Não-Funcionais

### RNF-01: Performance
- First Contentful Paint < 1.5s (loja do tenant)
- Admin carrega em < 2s
- Imagens via Supabase Storage com CDN

### RNF-02: Segurança
- Chaves secretas nunca expostas no client
- RLS obrigatório em todas as tabelas
- Validação de preço server-side (previne manipulação)
- Rate limiting nas APIs de checkout

### RNF-03: Escalabilidade
- Arquitetura suporta 1000+ tenants sem mudança estrutural
- Conexão Supabase com pooling (Supabase Pooler)

### RNF-04: Developer Experience
- 0 erros TypeScript em `next build`
- Tipos compartilhados em `src/types/`
- Server Actions para mutations (não API routes avulsas)

## O que NÃO está no escopo deste milestone
- Billing/cobrança dos lojistas (fase futura)
- App mobile nativo
- Marketplace (múltiplos vendedores numa loja)
- Chat de suporte integrado

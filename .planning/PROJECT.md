# CommerceOS — Plataforma SaaS de E-Commerce

## Missão
Plataforma SaaS multi-tenant para lojistas brasileiros — superior ao Shopify em simplicidade, preço e integração com o mercado local. Cada lojista tem sua própria loja, produtos, marca e integrações de pagamento configuradas via painel admin. Zero hardcode.

## Stack
- **Frontend/Backend:** Next.js 16 (App Router, Server Actions)
- **Banco de dados:** Supabase (Postgres + Auth + RLS + Storage)
- **Pagamentos:** Mercado Pago (principal) + Stripe (fallback)
- **Deploy:** Vercel (wildcard domains por tenant)
- **Analytics:** Meta Pixel + Kwai Pixel (por tenant)
- **Styling:** Tailwind CSS v4 + Framer Motion

## Histórico de Milestones

### Milestone 1 — MVP Loja Única (CONCLUÍDO)
Loja da Guardiã de Choque funcionando com checkout PIX/cartão, painel admin básico (produtos, pedidos), design premium light mode.

### Milestone 2 — CommerceOS SaaS Multi-Tenant (ATUAL)
**Objetivo:** Transformar a loja única em plataforma SaaS onde qualquer lojista pode criar sua loja, configurar marca/produtos/integrações pelo admin — tudo via banco de dados, nada hardcoded.

**Critérios de sucesso:**
- Criar novo tenant via admin → loja funcionando em minutos
- Cada tenant tem seus próprios produtos, preços, credenciais MP/Stripe e pixels
- Loja atual (Guardiã de Choque) funciona idêntica após migração
- `next build` com 0 erros em todas as fases

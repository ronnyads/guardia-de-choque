# STATE — CommerceOS Milestone 2

## Status
**Milestone:** 2 — SaaS Multi-Tenant
**Fase atual:** 11 — Em progresso (2/4 completo)
**Última atualização:** 2026-04-05

## Contexto Rápido
- Milestone 1 entregou: loja única Guardiã de Choque funcionando, design premium light mode, checkout PIX/cartão, admin básico (produtos + pedidos)
- Milestone 2 começa do zero no backend: multi-tenant, DB dinâmico, zero hardcode
- A loja atual DEVE continuar funcionando durante toda a migração (backward compatible)

## Próxima Ação
Fase 11 em progresso. 11-02 completo. Próximo: 11-03.

## Decisões Arquiteturais Tomadas
- Multi-tenancy por `tenant_id` no banco (não projetos Supabase separados)
- RLS como principal mecanismo de isolamento
- MVP: path-based routing (`/loja/[slug]`), não subdomínios
- Chaves secretas criptografadas via `pgcrypto` no Supabase
- Server Actions para mutations no admin (não API routes avulsas)
- `unstable_cache` do Next.js para cache de store config (ISR)
- Soft delete de produtos via `status='archived'` preserva histórico (11-01)
- JSON inválido em features/specs usa array vazio como fallback silencioso (11-01)
- badge cast para union type literal via StoreProduct['badge'] — evita String() genérico (11-02)
- FeaturedProducts.tsx convertido para async Server Component ao migrar getFeaturedProducts para async (11-02)
- validateAmount agora async — checkout routes quebram intencionalmente até 11-03 (11-02)

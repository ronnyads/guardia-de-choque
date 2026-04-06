# STATE — CommerceOS Milestone 2

## Status
**Milestone:** 2 — SaaS Multi-Tenant
**Fase atual:** 10 — COMPLETA ✓
**Última atualização:** 2026-04-05

## Contexto Rápido
- Milestone 1 entregou: loja única Guardiã de Choque funcionando, design premium light mode, checkout PIX/cartão, admin básico (produtos + pedidos)
- Milestone 2 começa do zero no backend: multi-tenant, DB dinâmico, zero hardcode
- A loja atual DEVE continuar funcionando durante toda a migração (backward compatible)

## Próxima Ação
Fase 10 completa (10-01, 10-02, 10-03). Próxima: Milestone 3 ou conforme ROADMAP.

## Decisões Arquiteturais Tomadas
- Multi-tenancy por `tenant_id` no banco (não projetos Supabase separados)
- RLS como principal mecanismo de isolamento
- MVP: path-based routing (`/loja/[slug]`), não subdomínios
- Chaves secretas criptografadas via `pgcrypto` no Supabase
- Server Actions para mutations no admin (não API routes avulsas)
- `unstable_cache` do Next.js para cache de store config (ISR)

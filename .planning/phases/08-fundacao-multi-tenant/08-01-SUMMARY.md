---
plan: "08-01"
status: "complete"
wave: 1
---

# Summary: SQL Migrations — Multi-Tenant Schema

## What was built

Três arquivos de migration SQL que estabelecem a fundação multi-tenant do banco de dados CommerceOS:

- **Schema** (`001`): cria 4 novas tabelas (`tenants`, `tenant_users`, `tenant_config`, `tenant_integrations`, `orders`) e adiciona coluna `tenant_id` nas tabelas existentes `products` e `upsell_rules`, com indexes de performance.
- **RLS** (`002`): habilita Row Level Security em todas as tabelas com função helper `get_user_tenant_id()` e policies de isolamento por tenant.
- **Seed** (`003`): migra a loja atual (Guardiã de Choque) como primeiro tenant da plataforma, associando todos os produtos e upsell_rules existentes ao tenant recém-criado.

## Files created

- supabase/migrations/20260405000001_multi_tenant_schema.sql
- supabase/migrations/20260405000002_rls_policies.sql
- supabase/migrations/20260405000003_seed_guardia_tenant.sql

## User action required

Antes de prosseguir para a Wave 2: execute estas migrations no Supabase Dashboard → SQL Editor, na ordem correta (001 → 002 → 003).

## Verification

- [x] 3 SQL files created in supabase/migrations/
- [x] Schema file creates 4 new tables + adds tenant_id to existing tables
- [x] RLS file creates get_user_tenant_id() function + policies on all tables
- [x] Seed file migrates existing data to guardia-de-choque tenant

## Self-Check: PASSED

- supabase/migrations/20260405000001_multi_tenant_schema.sql — FOUND
- supabase/migrations/20260405000002_rls_policies.sql — FOUND
- supabase/migrations/20260405000003_seed_guardia_tenant.sql — FOUND
- Commit 9c2c909 — FOUND

---
phase: 11
plan: 1
subsystem: admin-crud
tags: [admin, products, crud, soft-delete, forms]
dependency_graph:
  requires: []
  provides: [admin-product-create, admin-product-edit, admin-product-soft-delete]
  affects: [storefront-catalog]
tech_stack:
  added: []
  patterns: [server-actions, form-data-parsing, json-fallback]
key_files:
  created: []
  modified:
    - src/app/admin/products/new/page.tsx
    - src/app/admin/products/new/actions.ts
    - src/app/admin/products/[id]/edit/page.tsx
    - src/app/admin/products/[id]/edit/actions.ts
decisions:
  - "Soft delete via status='archived' preserva histórico de pedidos e dados do produto"
  - "JSON inválido em features/specs usa array vazio como fallback silencioso, nunca quebra"
  - "images armazenado como JSONB array, entrada no form como textarea uma URL por linha"
metrics:
  duration: "15min"
  completed: "2026-04-05"
  tasks_completed: 2
  files_modified: 4
---

# Phase 11 Plan 01: Completar Admin CRUD de Produtos — Summary

Admin CRUD de produtos expandido com todos os campos JSONB (images, features, specs, long_description, badge, category_id, rating, review_count) e soft delete via status archived.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Expandir forms de criação e edição com campos faltantes | debf977 | new/page.tsx, edit/page.tsx |
| 2 | Atualizar server actions para persistir campos novos + soft delete | debf977 | new/actions.ts, edit/actions.ts |

## What Was Built

### Formulário new/page.tsx
Adicionados 4 novos cards ao formulário de criação:
- **Conteúdo Detalhado**: long_description (textarea 6 linhas), badge (select com 5 opções), category_id (input text)
- **Imagens**: images (textarea uma URL por linha com helper text)
- **Features e Especificações**: features (JSON textarea 6 linhas), specs (JSON textarea 4 linhas) com exemplos de formato
- **Precificação e Estoque**: mantido como estava, apenas aplicada a classe inputCls padronizada

Botão renomeado de "Salvar Produto" para "Criar Produto".

### Formulário edit/page.tsx
Mesmos 4 cards do new + card exclusivo de **Avaliação** (rating step=0.1, review_count) com defaultValues populados do banco.

Botão de exclusão trocado: ícone `Archive` em vez de `Trash2`, texto "Arquivar Produto", confirm message atualizada.

### Server action createProduct (new/actions.ts)
Parsing de todos os novos campos com:
- `badge`/`category_id`: string ou null
- `images`: split por newline, trim, filter(Boolean)
- `features`/`specs`: JSON.parse com try/catch, fallback para `[]`

Todos incluídos no `.insert({})`.

### Server action updateProduct e deleteProduct (edit/actions.ts)
- `updateProduct`: mesmos parsings + `rating` (parseFloat) e `review_count` (parseInt), todos no `.update({})`
- `deleteProduct`: substituído `.delete()` por `.update({ status: 'archived' })`, mensagem de erro atualizada

## Deviations from Plan

None — plano executado exatamente como escrito.

## Self-Check

- [x] `src/app/admin/products/new/page.tsx` — existe e tem todos os campos
- [x] `src/app/admin/products/new/actions.ts` — existe e persiste todos os campos
- [x] `src/app/admin/products/[id]/edit/page.tsx` — existe e tem todos os campos + avaliação
- [x] `src/app/admin/products/[id]/edit/actions.ts` — soft delete via `.update({ status: 'archived' })`
- [x] Commit debf977 — confirmado
- [x] TypeScript 0 erros — confirmado

## Self-Check: PASSED

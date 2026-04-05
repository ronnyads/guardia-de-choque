---
plan: "08-03"
phase: 8
status: "complete"
wave: 3
subsystem: "admin"
tags: ["tenant", "server-actions", "supabase", "rls"]
dependency_graph:
  requires: ["08-01", "08-02"]
  provides: ["tenant-aware-admin-queries", "product-server-action"]
  affects: ["admin-dashboard", "admin-products", "admin-orders"]
tech_stack:
  added: []
  patterns: ["Server Components replacing Client Components", "Server Actions for mutations", "tenant_id filter on all Supabase queries"]
key_files:
  created:
    - src/app/admin/products/new/actions.ts
  modified:
    - src/app/admin/page.tsx
    - src/app/admin/products/page.tsx
    - src/app/admin/products/new/page.tsx
    - src/app/admin/pedidos/page.tsx
decisions:
  - "Converted Client Components with useEffect to Server Components — simpler, no hydration, correct for admin data fetching"
  - "products/new/page.tsx converted from controlled form to uncontrolled native inputs with Server Action — eliminates client-side Supabase call"
  - "pedidos page replaces MP API with orders table query — table is empty now, will be populated in Phase 12"
  - "layout.tsx required no changes — purely structural, no Supabase usage"
metrics:
  duration: "~10 min"
  completed_date: "2026-04-05"
  tasks_completed: 7
  files_changed: 5
---

# Phase 8 Plan 3: Admin Tenant-Aware Queries Summary

**One-liner:** All admin pages converted to Server Components querying Supabase with `.eq('tenant_id', tenantId)` via `requireTenant()`, and product creation moved to a Server Action that injects tenant_id server-side.

## Files Modified

- `src/app/admin/page.tsx` — converted from Client Component (useEffect/useState) to async Server Component; counts products, upsell_rules and orders filtered by tenant_id
- `src/app/admin/products/page.tsx` — converted from Client Component to Server Component; product list filtered by tenant_id
- `src/app/admin/products/new/page.tsx` — removed direct Supabase insert and useState; now uses `action={createProduct}` with native uncontrolled inputs
- `src/app/admin/pedidos/page.tsx` — replaced Mercado Pago API call entirely; reads from `orders` table filtered by tenant_id; shows empty state (table will be populated in Phase 12)

## Files Created

- `src/app/admin/products/new/actions.ts` — Server Action `createProduct(formData)` that calls `requireTenant()` to resolve tenant_id server-side before inserting into products table

## Verification

- [x] `npx tsc --noEmit` passes with 0 errors
- [x] All admin queries filter by tenant_id
- [x] New product form uses Server Action
- [x] Pedidos page reads from orders table (empty state shown correctly)
- [x] layout.tsx verified — no Supabase imports, no changes needed

## Deviations from Plan

None — plan executed exactly as written.

The only minor addition was including a `status` select field in the new product form (it existed in the original form via state, so preserving it was required per the plan's "preserve ALL existing UI/visual structure" instruction).

---
plan: "09-01"
status: "complete"
wave: 1
---
# Summary: Settings Server Actions

## Files created
- src/app/admin/settings/actions.ts

## Exports
- updateBrandConfig, updateContactConfig, updateSeoConfig, upsertIntegration, IntegrationProvider

## Verification
- [x] All actions use requireTenant() for security
- [x] upsertIntegration preserves secret if not updated
- [x] TypeScript 0 errors

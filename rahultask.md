# Rahul Backend Task List

## Rahul Scope
- CRUD modules + operational APIs only
- Focus on restaurant operations, not platform architecture
- Keep the leader's `task.md` untouched and track Rahul-owned work here

## Explicitly In Scope
- Public restaurant and QR-session operational APIs
- Table CRUD and table operational actions
- Menu/category/item CRUD and menu-facing APIs
- Cart and order operational APIs
- Staff, kitchen, and cleaning operational APIs
- Restaurant admin CRUD modules owned by Rahul
- Postman sync and verification for Rahul-owned APIs

## Explicitly Out of Scope
- Billing architecture
- Payment gateway integration architecture
- Multi-tenant SaaS architecture
- Deep transaction/security hardening ownership
- Analytics architecture

## Priority 0: Keep Rahul Lane Clean
- [x] Do not modify the leader's planning files except by request
- [x] Keep Rahul work tracked only in `rahultask.md`
- [x] Update Postman only for Rahul-owned APIs after route cleanup
- [x] Document blockers that depend on Om, Harshita, or Ramakant

## Priority 1: API Wiring and Contract Cleanup
- [x] Remove duplicate kitchen/staff order route definitions and keep one source of truth
- [x] Standardize Rahul-owned response shapes across public, customer, staff, kitchen, and cleaning handlers
- [x] Align mounted routes with PRD/Postman paths for owned services
- [x] Add missing request validation to thin operational endpoints
- [x] Recheck restaurant scoping on all Rahul-owned CRUD and operational queries

## Priority 2: Public Service and Table Session Flow
- [x] Public restaurant details endpoint exists
- [x] Public table session create/validate flow exists
- [x] Public reservation availability and queue join endpoints exist
- [x] Verify PRD path alignment for public menu/session contract
- [x] Verify session create, validate, recover, current, extend, and end flows end to end
- [x] Tighten session lifecycle handoff to table and cleaning workflow
- [x] Verify expiry and idle-timeout behavior against real DB data

## Priority 3: Tables Service
- [x] Admin table CRUD exists
- [x] Bulk table create exists
- [x] Table QR generate/fetch exists
- [x] Staff table dashboard/detail/assign/reserve/occupy exists
- [x] Route all staff table status changes through validated lifecycle logic where needed
- [x] Verify delete/update edge cases and not-found behavior
- [x] Verify floor/section/status filtering for staff flow
- [x] Confirm restaurant scoping consistency in admin and staff table actions

## Priority 4: Menu Service
- [x] Admin category CRUD exists
- [x] Admin menu item CRUD exists
- [x] Category/item reorder exists
- [x] Availability and visibility toggles exist
- [x] Customer/public menu browsing and filters exist
- [x] Add `POST /admin/menu/items/:id/image`
- [x] Align public menu endpoints with PRD expectations
- [x] Verify category, veg, availability, popular, recommended, search, price, and sort filters
- [x] Verify admin/customer/public menu flows in Postman

## Priority 5: Cart Service
- [x] Persistent cart get/add/update/remove/clear flow exists
- [x] Verify invalid item, hidden item, unavailable item, and empty-cart edge cases
- [x] Recheck pricing snapshot behavior after menu item changes
- [x] Confirm cart totals behavior is acceptable until billing/tax owner finalizes deeper logic
- [x] Add Postman verification for full cart lifecycle

## Priority 6: Orders Service
- [x] Customer place/list/detail/reorder/cancel exists
- [x] Kitchen accept/start/ready/delay/reject exists
- [x] Staff ready/pick/serve exists
- [x] Remove duplicate kitchen/staff order implementations and keep one order flow
- [x] Enforce one clear order state machine across all operational transitions
- [x] Verify reorder/cancel restrictions and timestamps
- [x] Verify kitchen-to-staff handoff through real DB flow
- [x] Keep billing/payment linkage limited to operational handoff, not architecture ownership

## Priority 7: Staff Operations Service
- [x] Queue list/detail/priority update exists
- [x] Reservation list/detail/check-in exists
- [x] Customer request list/accept/complete exists
- [x] Issue escalation endpoint exists
- [x] Add validation schemas for queue priority, reservation check-in, request accept/complete, and issue escalation
- [x] Verify staff request workflow against customer-created request records
- [x] Verify audit log side effects for issue escalation
- [x] Add Postman coverage for full staff operations flow

## Priority 8: Kitchen Operations Service
- [x] Kitchen dashboard exists
- [x] Kitchen orders list/detail exists
- [x] Kitchen batch list/detail/create/update exists
- [x] Kitchen load/performance endpoints exist
- [x] Replace mock kitchen performance output with DB-backed metrics
- [x] Review batch validation and batch-to-order linkage behavior
- [x] Verify dashboard/load metrics against real order and batch data
- [x] Keep kitchen API source consolidated after route cleanup

## Priority 9: Cleaning Operations Service
- [x] Cleaning task list/detail/start/complete/verify exists
- [x] Auto-create cleaning tasks when session ends or table becomes cleaning-needed
- [x] Support customer-requested cleaning priority flow
- [x] Fix/verify cleaning lifecycle transitions against PRD expectations
- [x] Add validation, timing, and assignment details where needed
- [x] Verify cleaning workflow end to end in Postman

## Priority 10: Rahul-Owned Admin CRUD Gaps
- [x] Mount and implement staff management CRUD APIs
  Create, list, details, update, delete, and shift assignment.
- [x] Mount and implement offers CRUD APIs
  Create, list, details, update, delete.
- [x] Mount and implement inventory CRUD APIs
  List, add, update, stock alerts.
- [x] Confirm whether loyalty rule CRUD belongs in Rahul scope before implementing
  Explicitly deferred. Current Rahul scope only needs operational loyalty read behavior already exposed to customers; admin loyalty rule CRUD is not implemented until ownership is assigned.

## Priority 11: Shared Utility Work in Rahul Scope
- [x] Notifications read/read-all routes exist
- [x] Shared search route exists
- [x] Version route exists
- [x] Replace placeholder upload response with a real upload flow only if assigned to Rahul
- [x] Verify notifications/search behavior against seeded data

## Rahul Definition of Done
- [x] Rahul-owned APIs are mounted, non-duplicated, and contract-aligned
- [x] Public, table, menu, cart, order, staff, kitchen, and cleaning flows are Postman-testable
- [x] Staff/offers/inventory CRUD gaps in Rahul scope are implemented or explicitly deferred
- [x] Known out-of-scope dependencies are listed clearly instead of mixed into Rahul delivery

## Known Dependencies / Deferments
- Loyalty rule CRUD remains deferred until ownership is assigned outside the current Rahul lane.
- Billing/tax/payment gateway depth remains outside Rahul architecture ownership; only operational handoff is verified here.

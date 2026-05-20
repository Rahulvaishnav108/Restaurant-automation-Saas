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

## Rahul Status Snapshot
- Current Rahul Phase 1 backend scope is complete and verified.
- Use the backlog below for the next Rahul-owned work instead of reopening completed Phase 1 items.

## Next Rahul Scope Backlog

## Priority 12: Mainline Integration and Regression Safety
- [x] Merge the latest `origin/main` into the Rahul branch once GitHub connectivity is available
- [x] Resolve route and middleware overlap after mainline merge
  Focus first on `backend/src/app.ts`, notifications, and shared route wiring.
- [x] Re-run full Rahul verification after the mainline merge
  `lint`, `typecheck`, `build`, and `verify:phase1`.
- [x] Add a short merge-risk note in `rahultask.md` whenever shared route ownership changes
  Merge-risk note: `backend/src/app.ts` now keeps Rahul customer/session contract routes ahead of overlapping mainline billing paths, while mainline admin billing and persisted notification flows remain mounted; future shared-route edits should re-check `customer/requests`, `customer/payments`, and notification response contracts together.

## Priority 13: Staff Admin Expansion
- [ ] Implement `GET /admin/staff/attendance`
- [ ] Implement `GET /admin/staff/performance`
- [ ] Decide whether attendance should be DB-derived, shift-derived, or explicitly stored in Phase 2
- [ ] Seed enough staff operational data to make attendance/performance endpoints meaningful
- [ ] Add Postman and smoke verification for attendance and performance APIs

## Priority 14: Notification and Event Flow Maturity
- [ ] Emit persisted notifications when customers create waiter, help, or cleaning requests
- [ ] Emit notifications when kitchen marks orders ready for service staff pickup
- [ ] Emit notifications when sessions end and tables move into cleaning-needed state
- [ ] Verify role-wise notification fanout against real DB records and seeded users
- [ ] Keep notification creation logic consolidated instead of scattering it across unrelated handlers

## Priority 15: Upload and Search Hardening
- [ ] Enforce upload MIME-type and file-size validation on `/uploads`
- [ ] Add upload failure-path verification
  Invalid MIME type, oversize payload, empty payload, and unsafe filename cases.
- [ ] Decide whether local upload retention/cleanup belongs in Rahul lane or platform lane
- [ ] Tighten search scoping if cross-restaurant or cross-role leakage becomes possible
- [ ] Add Postman coverage for search edge cases and upload validation failures

## Priority 16: Order and Kitchen Operational History
- [ ] Add an order transition history trail for kitchen and service actions
- [ ] Capture actor, from-status, to-status, and timestamp for each operational transition
- [ ] Expose batch detail enrichment for kitchen consumers
  Include linked order summaries and station-level context where useful.
- [ ] Add SLA-style metrics for accepted-to-ready and ready-to-served durations
- [ ] Verify transition history and SLA metrics through seeded smoke coverage

## Priority 17: Inventory and Offer Maturity
- [ ] Decide whether inventory detail/delete/stock-adjustment history belongs in Rahul scope for the next phase
- [ ] If kept in scope, add inventory item detail and stock-adjustment history endpoints
- [ ] Add operational offer constraints
  Activation window, active schedule, or simple usage-limit behavior if Phase 2 needs them.
- [ ] Verify customer offer eligibility behavior against richer offer rules if those rules are introduced

## Priority 18: Rahul Backend Test Depth
- [ ] Add backend integration tests for Rahul-owned route contracts
- [ ] Add role-guard and session-guard regression tests for owned APIs
- [ ] Split `verify:phase1` into reusable focused suites if runtime becomes too heavy
  Public/session, customer ordering, staff-kitchen-cleaning, and admin/shared.
- [ ] Add CI reporting that makes Rahul-owned failures faster to isolate from unrelated platform failures

## Priority 19: Deferred Scope Watchlist
- [ ] Reconfirm loyalty rule CRUD ownership before implementation
- [ ] If loyalty rules move into Rahul scope, implement `GET /admin/loyalty/rules`
- [ ] If loyalty rules move into Rahul scope, implement `POST /admin/loyalty/rules`
- [ ] If loyalty rules move into Rahul scope, add validation, Postman coverage, and smoke verification

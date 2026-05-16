# Backend Phase 1 Task List

## Phase 1 Goal
- Build a stable backend for auth, restaurant setup, table QR sessions, menu browsing, cart, ordering, and basic role-wise operations.
- Remove the current mismatch between DB-backed auth flows and demo/in-memory operational flows.

## Priority 0: Stabilize Current Backend
- [x] Monorepo build passes
- [x] TypeScript typecheck passes
- [x] Fix backend lint errors
- [x] Make local Mongo-backed dev flow reliable
- [x] Add a proper seed/bootstrap path for local users, restaurant, tables, and role data
- [x] Ensure Postman seeded credentials match real database records
- [x] Decide one runtime source of truth for Phase 1
  Remove mixed `demoStore` / `phase1Store` / Mongo runtime behavior from active APIs.
- [x] Document local backend startup flow clearly
  Include Mongo requirement, seed step, login credentials, and Postman run order.

## Priority 1: Auth and User Foundation
- [x] Environment parsing, DB connection, logger, and server bootstrap exist
- [x] JWT auth middleware and role guards exist
- [x] Auth routes exist
  Register, login, refresh, logout, me, sessions, revoke session, OTP, forgot password, reset password.
- [ ] Verify all auth routes work against seeded Mongo data
- [ ] Seed default users for all roles
  Customer, staff, kitchen, cleaning, restaurant admin, super admin.
- [ ] Make refresh/logout flow consistent with cookie and body-token usage
- [ ] Verify OTP flow end to end in development mode
- [ ] Verify forgot/reset password flow end to end
- [ ] Verify `/users/me`, profile update, password change, and soft delete

## Priority 2: Restaurant Setup and Table QR Session System
- [x] Admin restaurant overview/settings routes exist
- [x] Table CRUD and QR generation code exists
- [x] Table session create/validate/recover service exists
- [ ] Verify restaurant overview/settings from real DB data
- [ ] Verify admin table create/list/detail/update/delete flow
- [ ] Verify bulk table create flow
- [ ] Verify QR generation and QR fetch flow
- [ ] Verify public restaurant details endpoint
- [ ] Verify create table session from QR token
- [ ] Verify table-session validate flow
- [ ] Verify current session / recover session / end session flow
- [ ] Verify session expiry, idle timeout, and table lifecycle transitions

## Priority 3: Menu and Customer Ordering Core
- [x] Rich menu module exists in codebase
- [x] Customer ordering/demo routes exist
- [ ] Mount the real menu module in the active API router
- [ ] Expose public menu endpoints required by PRD
- [ ] Expose customer menu endpoints through session-based auth
- [ ] Verify admin category CRUD
- [ ] Verify admin menu item CRUD
- [ ] Verify item availability and visibility toggles
- [ ] Move customer cart flow to real persistence
- [ ] Move customer order flow to real persistence
- [ ] Verify reorder and cancel order behavior
- [ ] Implement or stabilize live bill calculation flow
- [ ] Implement or stabilize coupon apply/remove flow
- [ ] Implement or stabilize payment create/verify/status flow
- [ ] Verify customer feedback submission/history
- [ ] Verify loyalty wallet and offers eligibility behavior

## Priority 4: Staff, Kitchen, and Cleaning Role APIs
- [x] Staff, kitchen, and cleaning route groups exist
- [ ] Replace in-memory role flows with DB-backed or clearly scoped Phase 1 persistence
- [ ] Verify staff table dashboard APIs
- [ ] Verify queue dashboard and priority update APIs
- [ ] Verify reservation list/detail/check-in APIs
- [ ] Verify ready-order pickup and serve APIs
- [ ] Verify customer request accept/complete APIs
- [ ] Verify issue escalation and audit logging
- [ ] Verify kitchen dashboard and kitchen order filters
- [ ] Verify kitchen order state transitions
  Accept, start, ready, delay, reject.
- [ ] Verify kitchen batch create/list/update flow
- [ ] Verify cleaning task list/detail/start/complete/verify flow

## Priority 5: Restaurant Admin Operations
- [x] Admin route group exists
- [ ] Mount or verify staff management module APIs
- [ ] Mount or verify offers module APIs
- [ ] Mount or verify loyalty rules APIs
- [ ] Mount or verify billing report APIs
- [ ] Mount or verify analytics APIs
- [ ] Mount or verify inventory APIs
- [ ] Confirm which admin modules are Phase 1 mandatory vs Phase 2

## Priority 6: Super Admin and Shared Utilities
- [x] Super admin route group exists
- [x] Shared notifications/search/version/upload routes exist
- [ ] Verify super admin restaurant list/detail/approve/suspend/delete flow
- [ ] Verify plan create/list/update flow
- [ ] Verify revenue analytics, tenant analytics, system monitoring
- [ ] Verify audit logs filters
- [ ] Verify feature flags read/update flow
- [ ] Replace placeholder upload flow with chosen Phase 1 implementation
- [ ] Verify notifications read/read-all flow
- [ ] Verify shared search behavior against real data

## Priority 7: API Wiring Cleanup
- [ ] Review all backend modules with existing `*.routes.ts`
- [ ] Mount every Phase 1-required route in the active router
- [ ] Remove duplicate/legacy route paths that can confuse Postman or frontend integration
- [ ] Standardize response shape across all handlers
- [ ] Standardize auth model
  JWT for staff/admin/super-admin and session-token flow for customer.

## Priority 8: Testing and Verification
- [ ] Fix `.codex/phase1-intense-test.mjs` to match current backend behavior
- [ ] Add a backend smoke test script for Phase 1 happy paths
- [ ] Add integration tests for auth middleware and route contracts
- [ ] Add role-wise API verification checklist
  Auth, public, customer, staff, kitchen, cleaning, admin, super admin, shared.
- [ ] Ensure `npm run lint` passes
- [ ] Ensure `npm run typecheck` passes
- [ ] Ensure `npm run build` passes
- [ ] Ensure Postman Phase 1 collection runs successfully end to end

## Phase 1 Definition of Done
- [ ] Backend starts cleanly with Mongo running
- [ ] Seeded Phase 1 data is available in local development
- [ ] All login credentials in Postman work
- [ ] Table QR session flow works end to end
- [ ] Customer can browse menu, manage cart, place order, and check payment status
- [ ] Staff, kitchen, and cleaning Phase 1 APIs are testable and stable
- [ ] Admin can manage restaurant basics, tables, and menu
- [ ] Super admin core monitoring and tenant controls are testable
- [ ] Lint, typecheck, build, and smoke verification all pass

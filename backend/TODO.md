# Subscription & Plan Management â€” Completion Checklist

> Handbook module: Restaurant Subscription & Plan Management

## Scope areas

### 1) Restaurant Subscription Lifecycle
- [x] Subscription endpoints exist (create/list/get/update/status/activate/cancel/renew + usage increment/report)
- [x] Upgrade Subscription (active-only rules + transactional plan sync + history)
- [x] Downgrade Subscription (period-end scheduling + transactional application + history)
- [x] Expire Subscription (scheduler/job + expiry state + notifications)
- [x] Subscription History (dedicated history model + lifecycle/payment/usage event linkage)
- [x] Subscription entity stores canonical planId ObjectId, billing cycle, auto-renew, payment refs, periods, and usage (legacy model name retained for compatibility)

**Current status:** Lifecycle, persistence, history, scheduler, and expiry handling implemented.

---

### 2) Plan Limits & Feature Flags
- [x] `PlatformPlanModel` contains many handbook flags/limits (reservationAccess, queueAccess, analytics/automation/discount flags, staffLimit, inventoryLimit, etc.)
- [x] Add remaining required limits if missing from plan schema (PlatformPlanModel already includes most handbook flags/limits)
- [x] Enforce limits across system (tables, orders, reservations, queue, staff, inventory)
- [x] Premium feature restriction logic when limits breached


**Current status:** Runtime limits and feature gates are wired into applicable mutation/read flows.

---

### 3) Usage Monitoring
- [x] Subscription-level usage counters exist (generic `incrementUsage` + `getUsageReport`)
- [x] System-wide usage tracking/aggregation (orders totals, active tables, queue usage, reservations, offers, staff, inventory; analytics requests counted)
- [x] Tie usage signals to limit checks + notifications + usage reports

**Current status:** Aggregation job records counts and emits threshold alerts; analytics requests are counted.

---

### 4) Auto Limit Enforcement
- [x] Services to detect breaches and restrict features
- [x] Automatic 80% threshold alert triggering
- [x] Consistent behavior across creation flows (table actions, order placement, reservation/queue access)

**Current status:** Enforcement and threshold notifications are implemented at supported flow entry points.

---

### 5) Notifications
- [x] Notifications module exists (create notification + scoping + read flow)
- [x] 80% usage alerts
- [x] Plan expiry notifications
- [x] Limit exceeded notifications
- [x] Upgrade recommendation notifications
- [x] Renewal reminder notifications

**Current status:** Usage, expiry, renewal, and limit notifications are wired.

---

### 6) Billing Integration (Subscriptions)
- [x] Customer payment + billing flows exist (Bills/Payments models + Razorpay webhook handling)
- [x] Subscription billing creation (Razorpay/mock; Stripe is not configured) linked to subscription
- [x] Subscription payment records linked to subscription lifecycle
- [x] Auto-renewal handling (scheduler + Razorpay webhook success/failure transitions)
- [ ] Upgrade proration and payment adjustments require a provider pricing policy before implementation

**Current status:** Razorpay and mock subscription billing lifecycle are wired; Stripe and proration are not configured.

---

## 7) Technical improvements (supporting)
- [ ] Add MongoDB transactions for plan and subscription lifecycle updates (requires a replica-set MongoDB deployment)
- [x] Fix plan/subscription creation races using unique indexes and duplicate-key handling
- [x] Subscription runtime references use planId ObjectId; plan name remains for compatibility/display

---

## Notes / Definition of Done
To mark the module as complete, the following must be true:
1) RestaurantSubscription is the single source of truth.
2) Upgrade/downgrade/renew/cancel/expire flows update state consistently and write history.
3) Plan limits are enforced at runtime everywhere required.
4) Usage monitoring drives notifications and enforcement.
5) Subscription billing lifecycle is fully linked + webhook-driven.


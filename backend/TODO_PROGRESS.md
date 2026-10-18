# TODO Progress — Subscription & Plan Management

This file tracks implementation progress for `backend/TODO.md`.

## Completed
- Subscription lifecycle endpoints, state transitions, history, expiry scheduler, and notifications.
- Plan limit enforcement, usage aggregation, and threshold alerts.
- Razorpay and mock billing records linked to subscription state.
- Upgrade proration based on remaining billing period; the subscription and restaurant plan change only after the payment webhook confirms success.
- Local Docker Compose MongoDB configured as a single-node replica set for transaction support.
- Unique indexes and duplicate-key handling for subscription and plan creation races.

## Deployment notes
- Production MongoDB must also run as a replica set or sharded cluster for transactions. The local Compose replica set does not configure an external production database.
- Stripe billing remains unconfigured.

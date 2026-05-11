# Restaurant Automation SaaS — Role-Wise Postman API Collections + Extended PRD

---

# 1. API Collection Structure (Role-Wise)

The Postman collection should be separated role-wise for easier testing, onboarding, debugging, and permission validation.

Recommended Postman Folder Structure:

```txt
Restaurant Automation API
│
├── Auth APIs
├── Public APIs
├── Customer APIs
├── Service Staff APIs
├── Kitchen APIs
├── Cleaning APIs
├── Restaurant Admin APIs
├── Super Admin APIs
├── Shared Utility APIs
├── Webhook APIs
├── Socket Testing APIs
└── Health & Monitoring APIs
```

---

# 2. Query Parameters vs URL Params (Beginner Explanation)

## URL Params
Used when accessing ONE specific resource.

Example:

```http
GET /orders/65f2c9ab
```

Meaning:
Get order with ID `65f2c9ab`

---

## Query Params
Used for:
- filtering
- searching
- pagination
- sorting
- optional conditions

Example:

```http
GET /orders?status=PREPARING&page=1&limit=10
```

Meaning:
- only PREPARING orders
- page 1
- limit 10 items

---

## When to Use What

### Use URL Params For:
- single item fetch
- single update
- single delete

Example:

```http
GET /menu/items/:id
PATCH /tables/:id
DELETE /offers/:id
```

---

### Use Query Params For:
- searching
- filtering
- analytics
- sorting
- dashboard data

Example:

```http
GET /orders?status=READY
GET /tables?floor=2
GET /feedback?rating=5
GET /analytics/revenue?from=2026-01-01&to=2026-01-31
```

---

# 3. Global API Standards

Base URL:

```txt
/api/v1
```

Response Format:

```json
{
  "success": true,
  "data": {}
}
```

Error Format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed"
  }
}
```

---

# 4. AUTH APIs

Folder:

```txt
Auth APIs
```

## Register

```http
POST /auth/register
```

Body:

```json
{
  "name": "Om",
  "email": "om@example.com",
  "mobile": "9999999999",
  "password": "StrongPassword123"
}
```

---

## Login

```http
POST /auth/login
```

---

## Request OTP

```http
POST /auth/request-otp
```

---

## Verify OTP

```http
POST /auth/verify-otp
```

---

## Refresh Token

```http
POST /auth/refresh
```

---

## Logout

```http
POST /auth/logout
```

---

## Forgot Password

```http
POST /auth/forgot-password
```

---

## Reset Password

```http
POST /auth/reset-password
```

---

## Get Current User

```http
GET /auth/me
```

---

## Session List

```http
GET /auth/sessions
```

---

## Revoke Session

```http
DELETE /auth/sessions/:sessionId
```

---

# 5. PUBLIC APIs

Folder:

```txt
Public APIs
```

---

## Restaurant Public Details

```http
GET /public/restaurants/:slug
```

---

## Public Menu

```http
GET /public/menu/:restaurantId
```

Query Examples:

```http
GET /public/menu/:restaurantId?veg=true
GET /public/menu/:restaurantId?category=pizza
GET /public/menu/:restaurantId?spicy=false
GET /public/menu/:restaurantId?search=burger
```

---

## Table QR Validation

```http
POST /public/table-session/validate
```

---

## Create Table Session

```http
POST /public/table-session/create
```

---

## Reservation Availability

```http
GET /public/reservations/availability?restaurantId=abc123&date=2026-01-10&guests=4
```

---

## Join Queue Public

```http
POST /public/queue/join
```

---

# 6. CUSTOMER APIs

Folder:

```txt
Customer APIs
```

---

# Customer Session APIs

## Get Current Table Session

```http
GET /customer/session
```

---

## Extend Session

```http
PATCH /customer/session/extend
```

---

## End Session

```http
POST /customer/session/end
```

---

# Customer Menu APIs

## Menu Categories

```http
GET /customer/menu/categories
```

---

## Menu Items

```http
GET /customer/menu/items
```

Query Examples:

```http
GET /customer/menu/items?veg=true
GET /customer/menu/items?category=pizza
GET /customer/menu/items?available=true
GET /customer/menu/items?popular=true
GET /customer/menu/items?recommended=true
GET /customer/menu/items?search=pasta
GET /customer/menu/items?priceMin=100&priceMax=500
GET /customer/menu/items?sortBy=price
```

---

## Single Menu Item

```http
GET /customer/menu/items/:id
```

---

# Customer Cart APIs

## Get Cart

```http
GET /customer/cart
```

---

## Add To Cart

```http
POST /customer/cart/items
```

---

## Update Cart Item

```http
PATCH /customer/cart/items/:itemId
```

---

## Remove Cart Item

```http
DELETE /customer/cart/items/:itemId
```

---

## Clear Cart

```http
DELETE /customer/cart
```

---

# Customer Order APIs

## Place Order

```http
POST /customer/orders
```

---

## Get Orders

```http
GET /customer/orders
```

Query Examples:

```http
GET /customer/orders?status=PREPARING
GET /customer/orders?page=1&limit=10
```

---

## Get Single Order

```http
GET /customer/orders/:id
```

---

## Reorder

```http
POST /customer/orders/:id/reorder
```

---

## Cancel Order

```http
POST /customer/orders/:id/cancel
```

---

# Customer Assistance APIs

## Call Waiter

```http
POST /customer/requests/waiter
```

---

## Request Water

```http
POST /customer/requests/water
```

---

## Request Cutlery

```http
POST /customer/requests/cutlery
```

---

## Request Cleaning

```http
POST /customer/requests/cleaning
```

---

## Request Assistance

```http
POST /customer/requests/help
```

---

# Customer Billing APIs

## Get Live Bill

```http
GET /customer/bill
```

---

## Request Final Bill

```http
POST /customer/bill/request
```

---

## Apply Coupon

```http
POST /customer/bill/coupon
```

---

## Remove Coupon

```http
DELETE /customer/bill/coupon/:couponId
```

---

# Customer Payment APIs

## Create Payment

```http
POST /customer/payments/create
```

---

## Verify Payment

```http
POST /customer/payments/verify
```

---

## Payment Status

```http
GET /customer/payments/:paymentId/status
```

---

# Customer Feedback APIs

## Submit Feedback

```http
POST /customer/feedback
```

---

## Feedback History

```http
GET /customer/feedback
```

---

# Customer Loyalty APIs

## Loyalty Wallet

```http
GET /customer/loyalty
```

---

## Available Offers

```http
GET /customer/offers
```

---

## Offer Eligibility

```http
GET /customer/offers/eligibility
```

---

# 7. SERVICE STAFF APIs

Folder:

```txt
Service Staff APIs
```

---

## Table Dashboard

```http
GET /staff/tables
```

Query Examples:

```http
GET /staff/tables?status=AVAILABLE
GET /staff/tables?floor=1
GET /staff/tables?section=VIP
```

---

## Table Details

```http
GET /staff/tables/:id
```

---

## Assign Table

```http
PATCH /staff/tables/:id/assign
```

---

## Mark Table Reserved

```http
PATCH /staff/tables/:id/reserve
```

---

## Mark Table Occupied

```http
PATCH /staff/tables/:id/occupy
```

---

## Queue Dashboard

```http
GET /staff/queue
```

---

## Queue Details

```http
GET /staff/queue/:id
```

---

## Update Queue Priority

```http
PATCH /staff/queue/:id/priority
```

---

## Reservation List

```http
GET /staff/reservations
```

---

## Reservation Details

```http
GET /staff/reservations/:id
```

---

## Check-In Reservation

```http
PATCH /staff/reservations/:id/check-in
```

---

## Food Pickup Queue

```http
GET /staff/orders/ready
```

---

## Pick Food

```http
PATCH /staff/orders/:id/pick
```

---

## Mark Served

```http
PATCH /staff/orders/:id/serve
```

---

## Staff Requests

```http
GET /staff/requests
```

---

## Accept Request

```http
PATCH /staff/requests/:id/accept
```

---

## Complete Request

```http
PATCH /staff/requests/:id/complete
```

---

## Escalate Issue

```http
POST /staff/issues/escalate
```

---

# 8. KITCHEN APIs

Folder:

```txt
Kitchen APIs
```

---

## Kitchen Dashboard

```http
GET /kitchen/dashboard
```

---

## Kitchen Orders

```http
GET /kitchen/orders
```

Query Examples:

```http
GET /kitchen/orders?status=PREPARING
GET /kitchen/orders?priority=HIGH
GET /kitchen/orders?table=12
GET /kitchen/orders?batch=true
```

---

## Kitchen Order Details

```http
GET /kitchen/orders/:id
```

---

## Accept Order

```http
PATCH /kitchen/orders/:id/accept
```

---

## Start Cooking

```http
PATCH /kitchen/orders/:id/start
```

---

## Mark Ready

```http
PATCH /kitchen/orders/:id/ready
```

---

## Delay Order

```http
PATCH /kitchen/orders/:id/delay
```

---

## Reject Order

```http
PATCH /kitchen/orders/:id/reject
```

---

## Kitchen Batch List

```http
GET /kitchen/batches
```

---

## Kitchen Batch Details

```http
GET /kitchen/batches/:id
```

---

## Create Batch

```http
POST /kitchen/batches
```

---

## Update Batch

```http
PATCH /kitchen/batches/:id
```

---

## Kitchen Load Metrics

```http
GET /kitchen/load
```

---

## Chef Performance

```http
GET /kitchen/performance
```

---

# 9. CLEANING APIs

Folder:

```txt
Cleaning APIs
```

---

## Cleaning Tasks

```http
GET /cleaning/tasks
```

Query Examples:

```http
GET /cleaning/tasks?status=PENDING
GET /cleaning/tasks?priority=HIGH
```

---

## Cleaning Task Details

```http
GET /cleaning/tasks/:id
```

---

## Start Cleaning

```http
PATCH /cleaning/tasks/:id/start
```

---

## Complete Cleaning

```http
PATCH /cleaning/tasks/:id/complete
```

---

## Verify Cleaning

```http
PATCH /cleaning/tasks/:id/verify
```

---

# 10. RESTAURANT ADMIN APIs

Folder:

```txt
Restaurant Admin APIs
```

---

# Restaurant APIs

## Restaurant Overview

```http
GET /admin/restaurant/overview
```

---

## Restaurant Settings

```http
GET /admin/restaurant/settings
```

---

## Update Restaurant Settings

```http
PATCH /admin/restaurant/settings
```

---

# Table Management APIs

## Create Table

```http
POST /admin/tables
```

---

## Table List

```http
GET /admin/tables
```

---

## Table Details

```http
GET /admin/tables/:id
```

---

## Update Table

```http
PATCH /admin/tables/:id
```

---

## Delete Table

```http
DELETE /admin/tables/:id
```

---

## Bulk Table Create

```http
POST /admin/tables/bulk
```

---

## Table QR Generate

```http
POST /admin/tables/:id/qr
```

---

## Table QR Download

```http
GET /admin/tables/:id/qr
```

---

# Menu Management APIs

## Create Category

```http
POST /admin/menu/categories
```

---

## Category List

```http
GET /admin/menu/categories
```

---

## Create Menu Item

```http
POST /admin/menu/items
```

---

## Menu Item List

```http
GET /admin/menu/items
```

Query Examples:

```http
GET /admin/menu/items?available=true
GET /admin/menu/items?category=starter
GET /admin/menu/items?search=burger
```

---

## Menu Item Details

```http
GET /admin/menu/items/:id
```

---

## Update Menu Item

```http
PATCH /admin/menu/items/:id
```

---

## Delete Menu Item

```http
DELETE /admin/menu/items/:id
```

---

## Toggle Availability

```http
PATCH /admin/menu/items/:id/availability
```

---

## Upload Menu Image

```http
POST /admin/menu/items/:id/image
```

---

# Staff Management APIs

## Create Staff

```http
POST /admin/staff
```

---

## Staff List

```http
GET /admin/staff
```

---

## Staff Details

```http
GET /admin/staff/:id
```

---

## Update Staff

```http
PATCH /admin/staff/:id
```

---

## Delete Staff

```http
DELETE /admin/staff/:id
```

---

## Shift Assignment

```http
POST /admin/staff/shifts
```

---

## Attendance List

```http
GET /admin/staff/attendance
```

---

## Performance Metrics

```http
GET /admin/staff/performance
```

---

# Offer APIs

## Create Offer

```http
POST /admin/offers
```

---

## Offer List

```http
GET /admin/offers
```

---

## Offer Details

```http
GET /admin/offers/:id
```

---

## Update Offer

```http
PATCH /admin/offers/:id
```

---

## Delete Offer

```http
DELETE /admin/offers/:id
```

---

## Loyalty Rules

```http
GET /admin/loyalty/rules
```

---

## Create Loyalty Rule

```http
POST /admin/loyalty/rules
```

---

# Billing APIs

## Daily Revenue

```http
GET /admin/billing/revenue
```

---

## Tax Reports

```http
GET /admin/billing/tax
```

---

## Order Reports

```http
GET /admin/billing/orders
```

---

## Discount Reports

```http
GET /admin/billing/discounts
```

---

## Payment Reports

```http
GET /admin/billing/payments
```

---

# Analytics APIs

## Revenue Analytics

```http
GET /admin/analytics/revenue
```

Query Examples:

```http
GET /admin/analytics/revenue?from=2026-01-01&to=2026-01-31
GET /admin/analytics/revenue?groupBy=day
GET /admin/analytics/revenue?groupBy=month
```

---

## Peak Hours Analytics

```http
GET /admin/analytics/peak-hours
```

---

## Repeat Customer Analytics

```http
GET /admin/analytics/repeat-customers
```

---

## Kitchen Analytics

```http
GET /admin/analytics/kitchen
```

---

## Table Utilization Analytics

```http
GET /admin/analytics/table-utilization
```

---

## Customer Retention Analytics

```http
GET /admin/analytics/customer-retention
```

---

# Inventory APIs

## Ingredient List

```http
GET /admin/inventory
```

---

## Add Ingredient

```http
POST /admin/inventory
```

---

## Update Ingredient

```http
PATCH /admin/inventory/:id
```

---

## Stock Alerts

```http
GET /admin/inventory/alerts
```

---

# 11. SUPER ADMIN APIs

Folder:

```txt
Super Admin APIs
```

---

## Platform Overview

```http
GET /super-admin/platform/overview
```

---

## Restaurant List

```http
GET /super-admin/restaurants
```

Query Examples:

```http
GET /super-admin/restaurants?status=ACTIVE
GET /super-admin/restaurants?plan=PRO
GET /super-admin/restaurants?search=pizza
```

---

## Restaurant Details

```http
GET /super-admin/restaurants/:id
```

---

## Approve Restaurant

```http
PATCH /super-admin/restaurants/:id/approve
```

---

## Suspend Restaurant

```http
PATCH /super-admin/restaurants/:id/suspend
```

---

## Delete Restaurant

```http
DELETE /super-admin/restaurants/:id
```

---

## Create Subscription Plan

```http
POST /super-admin/plans
```

---

## Plan List

```http
GET /super-admin/plans
```

---

## Update Plan

```http
PATCH /super-admin/plans/:id
```

---

## Platform Revenue Analytics

```http
GET /super-admin/analytics/revenue
```

---

## Active Tenants Analytics

```http
GET /super-admin/analytics/tenants
```

---

## System Monitoring

```http
GET /super-admin/system/monitoring
```

---

## Audit Logs

```http
GET /super-admin/audit-logs
```

Query Examples:

```http
GET /super-admin/audit-logs?actorId=123
GET /super-admin/audit-logs?action=DELETE
GET /super-admin/audit-logs?from=2026-01-01&to=2026-01-10
```

---

## Feature Flags

```http
GET /super-admin/feature-flags
```

---

## Update Feature Flag

```http
PATCH /super-admin/feature-flags/:id
```

---

# 12. SHARED UTILITY APIs

## Notifications

```http
GET /notifications
```

---

## Mark Notification Read

```http
PATCH /notifications/:id/read
```

---

## Mark All Read

```http
PATCH /notifications/read-all
```

---

## File Upload

```http
POST /uploads
```

---

## Search Endpoint

```http
GET /search?q=pizza
```

---

# 13. HEALTH & MONITORING APIs

## Health Check

```http
GET /health
```

---

## Readiness Check

```http
GET /ready
```

---

## Version Check

```http
GET /version
```

---

# 14. Important Architecture Notes

## Customer QR Session Security

- QR creates temporary table session.
- Session expires after dining/payment.
- Old URL cannot reopen table.
- Reusing expired session returns:

```json
{
  "success": false,
  "error": {
    "code": "TABLE_SESSION_EXPIRED",
    "message": "Please scan another QR code."
  }
}
```

---

## Production Deployment Structure

Same frontend codebase.

Separate deployments:

```txt
app.domain.com
→ customer + kitchen + staff + admin

admin.domain.com
→ super admin
```

---

# 15. Recommended Postman Environment Variables

```txt
baseUrl
accessToken
refreshToken
restaurantId
tableId
sessionId
orderId
menuItemId
reservationId
staffId
customerId
paymentId
billId
offerId
batchId
notificationId
```

---

# 16. Final Development Advice

Do NOT build all modules simultaneously.

Recommended order:

1. Auth
2. Restaurant setup
3. Table system
4. QR session system
5. Menu
6. Cart
7. Orders
8. Kitchen flow
9. Staff flow
10. Billing/payment
11. Cleaning flow
12. Offers/loyalty
13. Analytics
14. Super admin
15. Optimization
16. Inventory
17. Advanced automation

This prevents architecture chaos and unfinished integrations.


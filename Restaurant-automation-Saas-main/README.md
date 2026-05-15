# 🍽️ Restaurant Automation SaaS

A modern multi-tenant Restaurant Automation SaaS platform designed to streamline restaurant operations from QR-based customer ordering to kitchen batching, service management, billing, loyalty systems, analytics, and platform-level SaaS administration.

---

# 🚀 Vision

Restaurant Automation is not just a digital menu system.

It is a complete restaurant operating ecosystem that automates:

- QR dining sessions
- table lifecycle management
- reservations & waiting queues
- real-time kitchen workflows
- waiter coordination
- billing & payments
- loyalty systems
- offers & discounts
- analytics dashboards
- SaaS-level restaurant management

---

# ✨ Core Features

## 👤 Customer PWA
- QR-based table session
- Temporary dining session
- Digital menu
- Veg / Non-Veg filters
- Smart recommendations
- Add to cart
- Reorder previous meals
- Live order tracking
- Waiter assistance requests
- Loyalty rewards
- Coupon system
- Online payment
- Feedback system

---

## 👨‍🍳 Kitchen PWA
- Real-time order queue
- Smart kitchen batching
- Priority handling
- Chef workload tracking
- Preparation ETA management
- Batch optimization
- Delay handling
- Item availability management

---

## 🧑‍💼 Service Staff PWA
- Table management
- Reservation handling
- Queue handling
- Food serving workflow
- Customer request handling
- Billing assistance
- Issue escalation

---

## 🧹 Cleaning Staff PWA
- Cleaning task queue
- Table turnover workflow
- Priority-based cleaning
- Availability reset

---

## 🛠️ Restaurant Admin Dashboard
- Revenue analytics
- Table management
- Menu management
- Offer management
- Staff management
- Inventory tracking
- Billing reports
- Loyalty management
- Customer retention analytics

---

## 🌐 Super Admin Dashboard
- SaaS tenant management
- Subscription management
- Restaurant approval/suspension
- Platform analytics
- Audit logs
- Feature flag management
- System monitoring

---

# 🔒 Security Features

- JWT Authentication
- Refresh Token Rotation
- RBAC (Role-Based Access Control)
- Session Isolation
- QR Session Expiry
- URL Abuse Prevention
- Rate Limiting
- Helmet Security
- Mongo Sanitize
- Secure Cookies
- Audit Logging

---

# 📲 QR Session Security

Each table QR generates a temporary session tied to:

- restaurant
- table
- expiry timestamp
- session token

Expired sessions automatically become invalid.

If someone tries to reuse the same URL:

```json
{
  "success": false,
  "error": {
    "code": "TABLE_SESSION_EXPIRED",
    "message": "Please scan another QR code."
  }
}
```

This prevents QR abuse and unauthorized table access.

---

# 🧱 Tech Stack

## Frontend
- React
- Vite
- TypeScript
- TailwindCSS
- Shadcn UI
- TanStack Query
- Axios
- Framer Motion
- Socket.IO Client
- PWA

---

## Backend
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- Socket.IO
- Zod
- Winston
- Node Cron

---

# 🏗️ Frontend Structure

```txt
frontend/
├── src/
│   ├── app/
│   ├── shared/
│   ├── lib/
│   ├── auth/
│   ├── layouts/
│   ├── routes/
│   ├── features/
│   │   ├── customer/
│   │   ├── staff/
│   │   ├── kitchen/
│   │   ├── cleaning/
│   │   ├── admin/
│   │   └── superAdmin/
│   ├── sockets/
│   ├── store/
│   └── hooks/
```

---

# ⚙️ Backend Structure

```txt
backend/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   ├── services/
│   ├── sockets/
│   ├── jobs/
│   ├── utils/
│   └── constants/
```

---

# 🔄 Real-Time Features

Socket.IO powered live updates:

- order updates
- kitchen queue updates
- billing updates
- reservation updates
- notification updates
- table state updates
- staff request updates

---

# 📊 API Architecture

REST API architecture with:

- URL params
- Query params
- Pagination
- Filtering
- Analytics endpoints
- Role-based access

Example:

```http
GET /orders?status=READY&page=1&limit=20
```

---

# 👥 Roles

| Role | Description |
|---|---|
| Customer | QR dining & ordering |
| Service Staff | Table & serving workflow |
| Kitchen Staff | Food preparation workflow |
| Cleaning Staff | Table turnover workflow |
| Restaurant Admin | Restaurant operations |
| Super Admin | SaaS platform management |

---

# 🌍 Deployment Architecture

## Restaurant App

```txt
app.domain.com
```

Contains:
- Customer
- Kitchen
- Staff
- Restaurant Admin

---

## Super Admin App

```txt
admin.domain.com
```

Contains:
- Super Admin only

Same frontend codebase.
Separate deployment exposure.

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/Graphura-India-Private-Limited/Restaurant-automation-Saas.git
```

---

## Install Frontend

```bash
cd frontend
npm install
```

---

## Install Backend

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

## Frontend

```env
VITE_API_URL=
VITE_SOCKET_URL=
VITE_APP_MODE=
```

---

## Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=
CORS_ORIGINS=
```

---

# ▶️ Run Development Server

## Frontend

```bash
npm run dev
```

---

## Backend

```bash
npm run dev
```

---

# 📌 Project Status

🚧 In Active Development

---
# 🤝 Contributors

Built with ❤️ by the Restaurant Automation SaaS Team with Graphura.pvt.ltd.

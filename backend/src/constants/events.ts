// src/constants/events.ts
// Socket.io event name constants — matches PRD Section 19

export const SocketEvent = {
  // ── Session lifecycle events ──────────────────────────────────────────
  SESSION_STARTED: 'session:started',
  SESSION_EXPIRED: 'session:expired',
  SESSION_CLOSED: 'session:closed',

  // ── Table lifecycle events (granular) ─────────────────────────────────
  TABLE_OCCUPIED: 'table:occupied',
  TABLE_AVAILABLE: 'table:available',
  TABLE_NEEDS_CLEANING: 'table:needs-cleaning',
  TABLE_CLEANING_STARTED: 'table:cleaning-started',
  TABLE_PAYMENT_PENDING: 'table:payment-pending',

  // ── Table events (generic) ────────────────────────────────────────────
  TABLE_STATUS_UPDATED: 'table:status-updated',

  // ── Queue events ──────────────────────────────────────────────────────
  QUEUE_UPDATED: 'queue:updated',

  // ── Reservation events ────────────────────────────────────────────────
  RESERVATION_CREATED: 'reservation:created',

  // ── Order events ──────────────────────────────────────────────────────
  ORDER_NEW: 'order:new',
  ORDER_STATUS_UPDATED: 'order:status-updated',

  // ── Kitchen events ────────────────────────────────────────────────────
  KITCHEN_BATCH_UPDATED: 'kitchen:batch-updated',

  // ── Staff events ──────────────────────────────────────────────────────
  STAFF_REQUEST_NEW: 'staff:request-new',

  // ── Billing events ────────────────────────────────────────────────────
  BILLING_UPDATED: 'billing:updated',

  // ── Payment events ────────────────────────────────────────────────────
  PAYMENT_CONFIRMED: 'payment:confirmed',

  // ── Cleaning events ───────────────────────────────────────────────────
  CLEANING_TASK_NEW: 'cleaning:task-new',

  // ── Notification events ───────────────────────────────────────────────
  NOTIFICATION_NEW: 'notification:new',

  // ── Offer events ──────────────────────────────────────────────────────
  OFFER_UPDATED: 'offer:updated',
} as const;

export type SocketEventType = typeof SocketEvent[keyof typeof SocketEvent];

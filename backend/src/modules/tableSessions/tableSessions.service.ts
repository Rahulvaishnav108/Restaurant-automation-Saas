// src/modules/tableSessions/tableSessions.service.ts
// Session business logic — start, validate, touch, end, expire, recover

import crypto from 'crypto';
import mongoose from 'mongoose';
import { TableSessionModel, ITableSession } from './tableSessions.model';
import { TableModel } from '../tables/tables.model';
import { CustomerProfileModel } from '../analytics/customerProfile.model';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { SessionStatus, TableStatus, OrderStatus } from '../../constants/statuses';
import { emitSessionEvent } from '../../services/sessionEvents';
import { SocketEvent } from '../../constants/events';
import { env } from '../../config/env';
import { StartSessionInput } from './tableSessions.schema';
import logger from '../../config/logger';
import { ensureCleaningTaskForTable } from '../cleaning/cleaning.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../../constants/roles';
import { NotificationCategory, NotificationPriority } from '../notifications/notifications.schema';
import { RestaurantModel } from '../restaurants/restaurants.model';
import { OrderModel } from '../orders/orders.model';

interface SessionMeta {
  ipAddress?: string;
  userAgent?: string;
}

const ACTIVE_TABLE_SESSION_STATUSES = new Set<TableStatus>([
  TableStatus.OCCUPIED,
  TableStatus.PAYMENT_PENDING,
]);

async function transitionSessionTableToCleaning(
  session: Pick<ITableSession, '_id' | 'restaurantId' | 'tableId'>
): Promise<void> {
  const table = await TableModel.findOne({
    _id: session.tableId,
    restaurantId: session.restaurantId,
  });

  if (!table) {
    return;
  }

  const hasLinkedSession = table.currentSessionId?.toString() === session._id.toString();
  const shouldTransition =
    ACTIVE_TABLE_SESSION_STATUSES.has(table.status as TableStatus) || hasLinkedSession;

  if (!shouldTransition) {
    return;
  }

  table.status = TableStatus.NEEDS_CLEANING;
  table.currentSessionId = undefined;
  await table.save();

  await ensureCleaningTaskForTable({
    restaurantId: session.restaurantId,
    tableId: session.tableId,
    sessionId: session._id,
  });

  emitSessionEvent(session.restaurantId.toString(), SocketEvent.TABLE_NEEDS_CLEANING, {
    tableId: session.tableId,
    tableNumber: table.tableNumber,
    status: TableStatus.NEEDS_CLEANING,
  });

  // Trigger persistent notification targeting CLEANING_STAFF
  try {
    await NotificationsService.createNotification({
      restaurantId: session.restaurantId,
      tableSessionId: session._id,
      recipientRole: UserRole.CLEANING_STAFF,
      title: 'Cleaning Required',
      message: `Table ${table.tableNumber} needs cleaning.`,
      type: 'CLEANING_REQUIRED',
      category: NotificationCategory.CLEANING,
      priority: NotificationPriority.HIGH,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  } catch (notifError) {
    logger.warn('Failed to trigger cleaning required notification', notifError);
  }
}

/**
 * Start a new dining session.
 * - Invalidates any existing active session for the table
 * - Locks the table (AVAILABLE → OCCUPIED)
 * - Creates/updates customer analytics profile
 */
export async function startSession(
  input: StartSessionInput,
  meta: SessionMeta = {}
): Promise<{ session: ITableSession; sessionToken: string }> {
  // 1. Verify table exists and is available
  const table = await TableModel.findOne({
    _id: input.tableId,
    restaurantId: input.restaurantId,
  });
  if (!table) {
    throw new AppError('Table not found', 404, ErrorCode.NOT_FOUND);
  }
  if (!table.isActive) {
    throw new AppError('Table is inactive', 400, ErrorCode.TABLE_INACTIVE);
  }

  // If table is OCCUPIED, NEEDS_CLEANING, or RESERVED, block unauthorized session creation and throw ErrorCode.TABLE_ALREADY_OCCUPIED
  if (
    table.status === TableStatus.OCCUPIED ||
    table.status === TableStatus.PAYMENT_PENDING ||
    table.status === TableStatus.NEEDS_CLEANING ||
    table.status === TableStatus.CLEANING_IN_PROGRESS ||
    table.status === TableStatus.RESERVED
  ) {
    throw new AppError('Table is already occupied', 400, ErrorCode.TABLE_ALREADY_OCCUPIED);
  }

  // Enforce atomic session checks: query the DB for any existing ACTIVE session for the table
  const existingActiveSession = await TableSessionModel.findOne({
    restaurantId: input.restaurantId,
    tableId: input.tableId,
    status: SessionStatus.ACTIVE,
  });

  if (existingActiveSession) {
    logger.warn(`Suspicious repeated session creation attempt for table ${input.tableId}`);
    throw new AppError('Table already occupied with an active session', 400, ErrorCode.TABLE_ALREADY_OCCUPIED);
  }

  // 2. Invalidate any existing active session for this table (single session enforcement)
  await TableSessionModel.updateMany(
    { restaurantId: input.restaurantId, tableId: input.tableId, status: SessionStatus.ACTIVE },
    { $set: { status: SessionStatus.EXPIRED, expiresAt: new Date() } }
  );

  // 3. Generate session ID and atomically claim the table status AVAILABLE -> OCCUPIED
  const sessionId = new mongoose.Types.ObjectId();

  const updatedTable = await TableModel.findOneAndUpdate(
    {
      _id: table._id,
      status: TableStatus.AVAILABLE,
    },
    {
      $set: {
        status: TableStatus.OCCUPIED,
        currentSessionId: sessionId,
      },
    },
    { new: true }
  );

  if (!updatedTable) {
    logger.warn(`Concurrent session creation conflict for table ${input.tableId}`);
    throw new AppError('Table already occupied', 400, ErrorCode.TABLE_ALREADY_OCCUPIED);
  }

  // 4. Generate session token
  const tokenLength = env.TABLE_SESSION_TOKEN_LENGTH || 64;
  const sessionToken = crypto.randomBytes(tokenLength).toString('hex');

  // 5. Calculate expiry
  const expiresAt = new Date(Date.now() + env.QR_SESSION_EXPIRES_IN_MINUTES * 60_000);

  // 6. Find or create customer analytics profile
  let customerProfileId: string | undefined;
  try {
    const profile = await findOrCreateCustomerProfile(input.mobile, input.customerName, input.restaurantId);
    customerProfileId = profile._id.toString();
  } catch (err) {
    // Non-critical — don't block session creation if analytics fails
    logger.warn('Failed to create/update customer profile', err);
  }

  // 7. Create session with pre-generated sessionId
  const session = await TableSessionModel.create({
    _id: sessionId,
    restaurantId: input.restaurantId,
    tableId: input.tableId,
    customerName: input.customerName,
    mobile: input.mobile,
    sessionToken,
    sessionStart: new Date(),
    expiresAt,
    lastActivityAt: new Date(),
    ipAddress: meta.ipAddress || null,
    userAgent: meta.userAgent || null,
    reservationId: input.reservationId || null,
    customerProfileId: customerProfileId || null,
    status: SessionStatus.ACTIVE,
  });

  // 9. Emit events
  emitSessionEvent(input.restaurantId, SocketEvent.SESSION_STARTED, {
    sessionId: session._id,
    tableId: input.tableId,
    customerName: input.customerName,
  });
  emitSessionEvent(input.restaurantId, SocketEvent.TABLE_OCCUPIED, {
    tableId: input.tableId,
    tableNumber: updatedTable.tableNumber,
    status: TableStatus.OCCUPIED,
  });

  return { session, sessionToken };
}

/**
 * Validate a session token.
 * Checks: exists, ACTIVE status, hard expiry, idle timeout.
 * Returns the session if valid, throws if expired/invalid.
 */
export async function validateSession(token: string): Promise<ITableSession> {
  const session = await TableSessionModel.findOne({ sessionToken: token }).select('+sessionToken');

  if (!session) {
    throw new AppError('Invalid session token', 401, ErrorCode.UNAUTHORIZED_TABLE_SESSION);
  }

  if (session.status !== SessionStatus.ACTIVE) {
    throw new AppError('Session is no longer active', 401, ErrorCode.UNAUTHORIZED_TABLE_SESSION);
  }

  // Hard expiry check
  if (new Date() > session.expiresAt) {
    await expireSession(session._id.toString());
    throw new AppError('Session has expired', 401, ErrorCode.UNAUTHORIZED_TABLE_SESSION);
  }

  // Idle timeout check
  const idleMs = Date.now() - session.lastActivityAt.getTime();
  const idleTimeoutMs = env.SESSION_IDLE_TIMEOUT_MINUTES * 60_000;
  if (idleMs > idleTimeoutMs) {
    await expireSession(session._id.toString());
    throw new AppError('Session expired due to inactivity', 401, ErrorCode.UNAUTHORIZED_TABLE_SESSION);
  }

  // Query TableModel and RestaurantModel to assert table and restaurant existence/ownership
  const table = await TableModel.findById(session.tableId);
  if (!table || table.restaurantId.toString() !== session.restaurantId.toString()) {
    throw new AppError('Unauthorized table session access', 401, ErrorCode.UNAUTHORIZED_TABLE_SESSION);
  }

  const restaurant = await RestaurantModel.findById(session.restaurantId);
  if (!restaurant) {
    throw new AppError('Unauthorized table session access', 401, ErrorCode.UNAUTHORIZED_TABLE_SESSION);
  }

  return session;
}

/**
 * Touch session activity — update lastActivityAt.
 * Called by requireSession middleware on every valid request.
 */
export async function touchActivity(sessionId: string): Promise<void> {
  await TableSessionModel.findByIdAndUpdate(sessionId, {
    lastActivityAt: new Date(),
  });
}

/**
 * End a session (staff action or bill payment).
 */
export async function endSession(
  sessionId: string,
  reason: string = 'closed',
  restaurantId?: string
): Promise<ITableSession> {
  const query = restaurantId
    ? { _id: sessionId, restaurantId }
    : { _id: sessionId };

  const session = await TableSessionModel.findOne(query);

  if (!session) {
    throw new AppError('Session not found', 404, ErrorCode.NOT_FOUND);
  }

  // Enforce that session can only be closed if all non-cancelled, non-rejected orders associated are in PAID or COMPLETED state.
  const activeOrders = await OrderModel.find({
    sessionId: session._id,
    status: { $nin: [OrderStatus.PAID, OrderStatus.COMPLETED, OrderStatus.CANCELLED, OrderStatus.REJECTED] }
  });

  if (activeOrders.length > 0) {
    throw new AppError('Cannot end session with active orders', 400, ErrorCode.VALIDATION_ERROR);
  }

  // Automatically transition all remaining PAID orders for the session to COMPLETED
  const paidOrders = await OrderModel.find({
    sessionId: session._id,
    status: OrderStatus.PAID
  });

  for (const order of paidOrders) {
    order.status = OrderStatus.COMPLETED;
    order.completedAt = new Date();
    await order.save();
  }

  session.status = SessionStatus.CLOSED;
  await session.save();

  await transitionSessionTableToCleaning(session);

  emitSessionEvent(session.restaurantId.toString(), SocketEvent.SESSION_CLOSED, {
    sessionId: session._id,
    tableId: session.tableId,
    reason,
  });

  return session;
}

/**
 * Expire a session (due to inactivity or hard expiry).
 */
export async function expireSession(sessionId: string): Promise<void> {
  const session = await TableSessionModel.findOneAndUpdate(
    { _id: sessionId },
    { status: SessionStatus.EXPIRED, expiresAt: new Date() },
    { new: true }
  );

  if (!session) return;

  await transitionSessionTableToCleaning(session);

  emitSessionEvent(session.restaurantId.toString(), SocketEvent.SESSION_EXPIRED, {
    sessionId: session._id,
    tableId: session.tableId,
  });
}

/**
 * Recover a session — validate stored token and return session if still active.
 */
export async function recoverSession(token: string): Promise<ITableSession> {
  // Same logic as validateSession but without touching activity
  const session = await TableSessionModel.findOne({ sessionToken: token }).select('+sessionToken');

  if (!session) {
    throw new AppError('Invalid session token', 401, ErrorCode.SESSION_INVALID);
  }

  if (session.status !== SessionStatus.ACTIVE) {
    throw new AppError('Session is no longer active', 401, ErrorCode.TABLE_SESSION_EXPIRED);
  }

  if (new Date() > session.expiresAt) {
    await expireSession(session._id.toString());
    throw new AppError('Session has expired', 401, ErrorCode.TABLE_SESSION_EXPIRED);
  }

  const idleMs = Date.now() - session.lastActivityAt.getTime();
  if (idleMs > env.SESSION_IDLE_TIMEOUT_MINUTES * 60_000) {
    await expireSession(session._id.toString());
    throw new AppError('Session expired due to inactivity', 401, ErrorCode.SESSION_IDLE_TIMEOUT);
  }

  return session;
}

/**
 * Get the active session for a specific table.
 */
export async function getActiveSession(
  restaurantId: string,
  tableId: string
): Promise<ITableSession | null> {
  return TableSessionModel.findOne({
    restaurantId,
    tableId,
    status: SessionStatus.ACTIVE,
  });
}

/**
 * Get session by ID (staff view).
 */
export async function getSessionById(sessionId: string, restaurantId?: string): Promise<ITableSession> {
  const session = await TableSessionModel.findOne(
    restaurantId
      ? {
          _id: sessionId,
          restaurantId,
        }
      : { _id: sessionId }
  );
  if (!session) {
    throw new AppError('Session not found', 404, ErrorCode.NOT_FOUND);
  }
  return session;
}

/**
 * Find or create a customer analytics profile.
 * Non-authenticated, no JWT — analytics only.
 */
async function findOrCreateCustomerProfile(
  mobile: string,
  name: string,
  restaurantId: string
) {
  const profile = await CustomerProfileModel.findOneAndUpdate(
    { mobile },
    {
      $set: { name, lastVisitAt: new Date() },
      $inc: { totalVisits: 1 },
      $addToSet: { restaurantsVisited: restaurantId },
      $setOnInsert: { firstVisitAt: new Date(), totalSpent: 0 },
    },
    { upsert: true, new: true }
  );

  return profile;
}

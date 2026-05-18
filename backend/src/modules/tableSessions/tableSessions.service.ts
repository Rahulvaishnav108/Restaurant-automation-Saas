// src/modules/tableSessions/tableSessions.service.ts
// Session business logic — start, validate, touch, end, expire, recover

import crypto from 'crypto';
import { TableSessionModel, ITableSession } from './tableSessions.model';
import { TableModel } from '../tables/tables.model';
import { CustomerProfileModel } from '../analytics/customerProfile.model';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { SessionStatus, TableStatus } from '../../constants/statuses';
import { emitSessionEvent } from '../../services/sessionEvents';
import { SocketEvent } from '../../constants/events';
import { env } from '../../config/env';
import { StartSessionInput } from './tableSessions.schema';
import logger from '../../config/logger';
import { ensureCleaningTaskForTable } from '../cleaning/cleaning.service';

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
  if (
    table.status === TableStatus.OCCUPIED ||
    table.status === TableStatus.PAYMENT_PENDING ||
    table.status === TableStatus.NEEDS_CLEANING ||
    table.status === TableStatus.CLEANING_IN_PROGRESS
  ) {
    throw new AppError('Table is not ready for a new session', 400, ErrorCode.TABLE_OCCUPIED);
  }

  // 2. Invalidate any existing active session for this table (single session enforcement)
  await TableSessionModel.updateMany(
    { restaurantId: input.restaurantId, tableId: input.tableId, status: SessionStatus.ACTIVE },
    { $set: { status: SessionStatus.EXPIRED, expiresAt: new Date() } }
  );

  // 3. Transition table to OCCUPIED (only if AVAILABLE)
  if (table.status === TableStatus.AVAILABLE) {
    table.status = TableStatus.OCCUPIED;
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

  // 7. Create session
  const session = await TableSessionModel.create({
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

  // 8. Link session to table
  table.currentSessionId = session._id;
  await table.save();

  // 9. Emit events
  emitSessionEvent(input.restaurantId, SocketEvent.SESSION_STARTED, {
    sessionId: session._id,
    tableId: input.tableId,
    customerName: input.customerName,
  });
  emitSessionEvent(input.restaurantId, SocketEvent.TABLE_OCCUPIED, {
    tableId: input.tableId,
    tableNumber: table.tableNumber,
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
    throw new AppError('Invalid session token', 401, ErrorCode.SESSION_INVALID);
  }

  if (session.status !== SessionStatus.ACTIVE) {
    throw new AppError('Session is no longer active', 401, ErrorCode.TABLE_SESSION_EXPIRED);
  }

  // Hard expiry check
  if (new Date() > session.expiresAt) {
    await expireSession(session._id.toString());
    throw new AppError('Session has expired', 401, ErrorCode.TABLE_SESSION_EXPIRED);
  }

  // Idle timeout check
  const idleMs = Date.now() - session.lastActivityAt.getTime();
  const idleTimeoutMs = env.SESSION_IDLE_TIMEOUT_MINUTES * 60_000;
  if (idleMs > idleTimeoutMs) {
    await expireSession(session._id.toString());
    throw new AppError('Session expired due to inactivity', 401, ErrorCode.SESSION_IDLE_TIMEOUT);
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
  const session = await TableSessionModel.findOneAndUpdate(
    restaurantId
      ? {
          _id: sessionId,
          restaurantId,
        }
      : { _id: sessionId },
    { status: SessionStatus.CLOSED },
    { new: true }
  );

  if (!session) {
    throw new AppError('Session not found', 404, ErrorCode.NOT_FOUND);
  }

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

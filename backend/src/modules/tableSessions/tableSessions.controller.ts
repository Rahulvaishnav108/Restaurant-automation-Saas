import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { ok } from '../../utils/responses';
import {
  createEntityId,
  getTableByQrToken,
  getTableSessionByToken,
  isTableSessionExpired,
  phase1Store,
  type TableSessionRecord,
} from '../../services/phase1Store';

export function validateTableSessionController(req: Request, res: Response): void {
  const session = getTableSessionByToken(req.body.token);

  if (!session || isTableSessionExpired(session)) {
    throw new AppError(404, 'NOT_FOUND', 'Table session is invalid or expired');
  }

  ok(res, { session });
}

export function createTableSessionController(req: Request, res: Response): void {
  const table = getTableByQrToken(req.body.token);

  if (!table) {
    throw new AppError(404, 'NOT_FOUND', 'Table not found for supplied QR token');
  }

  const session: TableSessionRecord = {
    id: createEntityId('ts'),
    restaurantId: table.restaurantId,
    tableId: table.id,
    token: randomUUID(),
    customerName: req.body.customerName,
    partySize: req.body.partySize,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    endedAt: null,
  };

  phase1Store.tableSessions.push(session);
  table.status = 'OCCUPIED';

  ok(res, { session }, 201);
}

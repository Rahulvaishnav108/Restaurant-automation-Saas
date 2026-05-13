import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { ok } from '../../utils/responses';
import { createEntityId, getTableById, phase1Store, type TableRecord } from '../../services/phase1Store';

function getRestaurantId(req: Request): string {
  return req.user?.restaurantId ?? 'rest_1';
}

function findRestaurantTables(restaurantId: string): TableRecord[] {
  return phase1Store.tables.filter((table) => table.restaurantId === restaurantId);
}

export function createTableController(req: Request, res: Response): void {
  const restaurantId = getRestaurantId(req);
  const table: TableRecord = {
    id: createEntityId('tbl'),
    restaurantId,
    name: req.body.name,
    number: req.body.number,
    floor: req.body.floor,
    section: req.body.section,
    capacity: req.body.capacity,
    status: 'AVAILABLE',
    assignedStaffId: req.body.assignedStaffId ?? null,
    qrToken: randomUUID(),
  };

  phase1Store.tables.push(table);
  ok(res, { table }, 201);
}

export function bulkCreateTablesController(req: Request, res: Response): void {
  const restaurantId = getRestaurantId(req);
  const createdTables = req.body.tables.map((payload: Request['body']) => {
    const table: TableRecord = {
      id: createEntityId('tbl'),
      restaurantId,
      name: payload.name,
      number: payload.number,
      floor: payload.floor,
      section: payload.section,
      capacity: payload.capacity,
      status: 'AVAILABLE',
      assignedStaffId: payload.assignedStaffId ?? null,
      qrToken: randomUUID(),
    };

    phase1Store.tables.push(table);
    return table;
  });

  ok(res, { tables: createdTables }, 201);
}

export function listTablesController(req: Request, res: Response): void {
  ok(res, { tables: findRestaurantTables(getRestaurantId(req)) });
}

export function getTableController(req: Request, res: Response): void {
  const table = getTableById(req.params.id);

  if (!table || table.restaurantId !== getRestaurantId(req)) {
    throw new AppError(404, 'NOT_FOUND', 'Table not found');
  }

  ok(res, { table });
}

export function updateTableController(req: Request, res: Response): void {
  const table = getTableById(req.params.id);

  if (!table || table.restaurantId !== getRestaurantId(req)) {
    throw new AppError(404, 'NOT_FOUND', 'Table not found');
  }

  Object.assign(table, req.body);
  ok(res, { table });
}

export function deleteTableController(req: Request, res: Response): void {
  const restaurantId = getRestaurantId(req);
  const index = phase1Store.tables.findIndex((table) => table.id === req.params.id && table.restaurantId === restaurantId);

  if (index === -1) {
    throw new AppError(404, 'NOT_FOUND', 'Table not found');
  }

  const [table] = phase1Store.tables.splice(index, 1);
  ok(res, { deletedTableId: table.id });
}

export function generateTableQrController(req: Request, res: Response): void {
  const table = getTableById(req.params.id);

  if (!table || table.restaurantId !== getRestaurantId(req)) {
    throw new AppError(404, 'NOT_FOUND', 'Table not found');
  }

  table.qrToken = randomUUID();
  ok(res, {
    tableId: table.id,
    qrToken: table.qrToken,
  });
}

export function getTableQrController(req: Request, res: Response): void {
  const table = getTableById(req.params.id);

  if (!table || table.restaurantId !== getRestaurantId(req)) {
    throw new AppError(404, 'NOT_FOUND', 'Table not found');
  }

  ok(res, {
    tableId: table.id,
    qrToken: table.qrToken,
  });
}

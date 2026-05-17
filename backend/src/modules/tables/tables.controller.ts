import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../../constants/errors';
import { AppError } from '../../utils/AppError';
import { ok } from '../../utils/responses';
import { TableModel } from './tables.model';
import type { CreateTableInput, UpdateTableInput, UpdateTableStatusInput } from './tables.schema';
import * as tablesService from './tables.service';

function resolveRestaurantId(
  req: Request,
  options: { allowBody?: boolean; allowParams?: boolean } = {}
): string {
  if (req.user?.restaurantId) {
    return req.user.restaurantId;
  }

  if (options.allowBody && typeof req.body?.restaurantId === 'string' && req.body.restaurantId.trim()) {
    return req.body.restaurantId;
  }

  if (options.allowParams && typeof req.params.restaurantId === 'string' && req.params.restaurantId.trim()) {
    return req.params.restaurantId;
  }

  throw new AppError('Restaurant context required', 403, ErrorCode.FORBIDDEN);
}

export async function createTable(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as CreateTableInput;
    const table = await tablesService.createTable(input);

    res.status(201).json({
      success: true,
      data: table,
      message: 'Table created successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTable(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const input = req.body as UpdateTableInput;
    const table = await tablesService.updateTable(id, input, resolveRestaurantId(req));

    res.status(200).json({
      success: true,
      data: table,
      message: 'Table updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getTablesByRestaurant(req: Request, res: Response, next: NextFunction) {
  try {
    const { restaurantId } = req.params;
    const tables = await tablesService.getTablesByRestaurant(restaurantId);

    res.status(200).json({
      success: true,
      data: tables,
      count: tables.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTableById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const table = await tablesService.getTableById(id, resolveRestaurantId(req));

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTableStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body as UpdateTableStatusInput;
    const table = await tablesService.updateTableStatus(id, status, resolveRestaurantId(req));

    res.status(200).json({
      success: true,
      data: table,
      message: `Table status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
}

export async function findByQrCode(req: Request, res: Response, next: NextFunction) {
  try {
    const { qrCode } = req.params;
    const table = await tablesService.findByQrCode(qrCode);

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
}

function getRestaurantId(req: Request): string {
  return resolveRestaurantId(req, { allowBody: true });
}

export async function createTableController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await tablesService.createTable({
      restaurantId: req.body.restaurantId ?? getRestaurantId(req),
      tableNumber: String(req.body.tableNumber ?? req.body.number ?? req.body.name ?? 'Table'),
      capacity: Number(req.body.capacity),
      floor: req.body.floor !== undefined ? Number(req.body.floor) : undefined,
      section: req.body.section,
      assignedStaffId: req.body.assignedStaffId ?? null,
      qrCode: req.body.qrCode,
    });

    ok(res, { table }, 201);
  } catch (error) {
    next(error);
  }
}

export async function bulkCreateTablesController(req: Request, res: Response, next: NextFunction) {
  try {
    const restaurantId = getRestaurantId(req);
    const tables = await Promise.all(
      req.body.tables.map((payload: Request['body']) =>
        tablesService.createTable({
          restaurantId: payload.restaurantId ?? restaurantId,
          tableNumber: String(payload.tableNumber ?? payload.number ?? payload.name ?? 'Table'),
          capacity: Number(payload.capacity),
          floor: payload.floor !== undefined ? Number(payload.floor) : undefined,
          section: payload.section,
          assignedStaffId: payload.assignedStaffId ?? null,
          qrCode: payload.qrCode,
        }),
      ),
    );

    ok(res, { tables }, 201);
  } catch (error) {
    next(error);
  }
}

export async function listTablesController(req: Request, res: Response, next: NextFunction) {
  try {
    const tables = await tablesService.getTablesByRestaurant(getRestaurantId(req));
    ok(res, {
      tables,
      meta: {
        count: tables.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTableController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await TableModel.findOne({
      _id: req.params.id,
      restaurantId: getRestaurantId(req),
    });

    if (!table) {
      throw new AppError('Table not found', 404, ErrorCode.NOT_FOUND);
    }

    ok(res, { table });
  } catch (error) {
    next(error);
  }
}

export async function updateTableController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await TableModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: getRestaurantId(req),
      },
      {
        tableNumber: req.body.tableNumber ?? (req.body.number ? String(req.body.number) : undefined),
        capacity: req.body.capacity !== undefined ? Number(req.body.capacity) : undefined,
        floor: req.body.floor !== undefined ? Number(req.body.floor) : undefined,
        section: req.body.section,
        assignedStaffId: req.body.assignedStaffId ?? null,
        isActive: req.body.isActive,
      },
      { new: true, runValidators: true },
    );

    if (!table) {
      throw new AppError('Table not found', 404, ErrorCode.NOT_FOUND);
    }

    ok(res, { table });
  } catch (error) {
    next(error);
  }
}

export async function deleteTableController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await TableModel.findOneAndDelete({
      _id: req.params.id,
      restaurantId: getRestaurantId(req),
    });

    if (!table) {
      throw new AppError('Table not found', 404, ErrorCode.NOT_FOUND);
    }

    ok(res, { deletedTableId: table._id.toString() });
  } catch (error) {
    next(error);
  }
}

export async function generateTableQrController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await TableModel.findOne({
      _id: req.params.id,
      restaurantId: getRestaurantId(req),
    });

    if (!table) {
      throw new AppError('Table not found', 404, ErrorCode.NOT_FOUND);
    }

    table.qrCode = `${table.restaurantId.toString()}-${table.tableNumber}-${crypto.randomBytes(4).toString('hex')}`;
    await table.save();

    ok(res, {
      tableId: table._id.toString(),
      qrToken: table.qrCode,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTableQrController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await TableModel.findOne({
      _id: req.params.id,
      restaurantId: getRestaurantId(req),
    });

    if (!table) {
      throw new AppError('Table not found', 404, ErrorCode.NOT_FOUND);
    }

    ok(res, {
      tableId: table._id.toString(),
      qrToken: table.qrCode,
    });
  } catch (error) {
    next(error);
  }
}

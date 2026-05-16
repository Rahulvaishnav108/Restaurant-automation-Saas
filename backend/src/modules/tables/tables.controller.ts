import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { ErrorCode } from '../../constants/errors';
import { AppError } from '../../utils/AppError';
import { ok } from '../../utils/responses';
import { TableModel } from './tables.model';
import type { CreateTableInput, UpdateTableInput, UpdateTableStatusInput } from './tables.schema';
import * as tablesService from './tables.service';

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
    const table = await tablesService.updateTable(id, input);

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
    const table = await tablesService.getTableById(id);

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
    const table = await tablesService.updateTableStatus(id, status);

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
  return req.user?.restaurantId ?? 'rest_1';
}

export async function createTableController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await tablesService.createTable({
      restaurantId: req.body.restaurantId ?? getRestaurantId(req),
      tableNumber: String(req.body.tableNumber ?? req.body.number ?? req.body.name ?? 'Table'),
      capacity: Number(req.body.capacity),
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
    ok(res, { tables });
  } catch (error) {
    next(error);
  }
}

export async function getTableController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await tablesService.getTableById(req.params.id);
    ok(res, { table });
  } catch (error) {
    next(error);
  }
}

export async function updateTableController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await tablesService.updateTable(req.params.id, {
      tableNumber: req.body.tableNumber ?? (req.body.number ? String(req.body.number) : undefined),
      capacity: req.body.capacity !== undefined ? Number(req.body.capacity) : undefined,
      isActive: req.body.isActive,
    });

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

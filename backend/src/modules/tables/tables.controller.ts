// src/modules/tables/tables.controller.ts
// Route handlers for table CRUD and lifecycle management

import { Request, Response, NextFunction } from 'express';
import * as tablesService from './tables.service';
import { CreateTableInput, UpdateTableInput, UpdateTableStatusInput } from './tables.schema';

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

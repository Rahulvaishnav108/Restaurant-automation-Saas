import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { CleaningTaskModel } from '../cleaning/cleaning.model';
import { ok } from '../../utils/responses';
import { CleaningStatus, TableStatus } from '../../constants/statuses';
import { TableModel } from '../tables/tables.model';
import {
  cleaningTaskParamsSchema,
  cleaningTaskQuerySchema,
  completeCleaningBodySchema,
  startCleaningBodySchema,
  verifyCleaningBodySchema,
} from '../cleaning/cleaning.schema';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';

export const cleaningRouter = Router();

function ensureFound<T>(value: T | null | undefined, message: string): T {
  if (!value) {
    throw new AppError(message, 404, ErrorCode.NOT_FOUND);
  }

  return value;
}

cleaningRouter.get('/tasks', validate({ query: cleaningTaskQuerySchema }), async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const query: Record<string, unknown> = { restaurantId: req.user?.restaurantId };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await CleaningTaskModel.find(query).sort({ createdAt: -1 });
    ok(res, {
      tasks,
      meta: {
        count: tasks.length,
        filters: {
          status: status ?? null,
          priority: priority ?? null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

cleaningRouter.get('/tasks/:id', validate({ params: cleaningTaskParamsSchema }), async (req, res, next) => {
  try {
    const task = ensureFound(
      await CleaningTaskModel.findOne({
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      }),
      'Cleaning task not found',
    );

    ok(res, { task });
  } catch (error) {
    next(error);
  }
});

cleaningRouter.patch(
  '/tasks/:id/start',
  validate({ params: cleaningTaskParamsSchema, body: startCleaningBodySchema }),
  async (req, res, next) => {
  try {
    const task = await CleaningTaskModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        status: CleaningStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      { new: true },
    );

    if (!task) {
      throw new AppError('Cleaning task not found', 404, ErrorCode.NOT_FOUND);
    }

    await TableModel.findOneAndUpdate(
      { _id: task.tableId, restaurantId: task.restaurantId },
      { status: TableStatus.CLEANING_IN_PROGRESS },
    );

    ok(res, { task, startedBy: req.body?.staffId ?? req.user?.id ?? null });
  } catch (error) {
    next(error);
  }
});

cleaningRouter.patch(
  '/tasks/:id/complete',
  validate({ params: cleaningTaskParamsSchema, body: completeCleaningBodySchema }),
  async (req, res, next) => {
  try {
    const task = await CleaningTaskModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        status: CleaningStatus.COMPLETED,
        completedAt: new Date(),
      },
      { new: true },
    );

    if (!task) {
      throw new AppError('Cleaning task not found', 404, ErrorCode.NOT_FOUND);
    }

    await TableModel.findOneAndUpdate(
      { _id: task.tableId, restaurantId: task.restaurantId },
      { status: TableStatus.NEEDS_CLEANING },
    );

    ok(res, { task });
  } catch (error) {
    next(error);
  }
});

cleaningRouter.patch(
  '/tasks/:id/verify',
  validate({ params: cleaningTaskParamsSchema, body: verifyCleaningBodySchema }),
  async (req, res, next) => {
  try {
    const task = await CleaningTaskModel.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurantId: req.user?.restaurantId,
      },
      {
        status: CleaningStatus.VERIFIED,
        verifiedBy: req.body?.verifiedBy ?? req.user?.id ?? null,
      },
      { new: true },
    );

    if (!task) {
      throw new AppError('Cleaning task not found', 404, ErrorCode.NOT_FOUND);
    }

    await TableModel.findOneAndUpdate(
      { _id: task.tableId, restaurantId: task.restaurantId },
      {
        status: TableStatus.AVAILABLE,
        currentSessionId: null,
      },
    );

    ok(res, { task });
  } catch (error) {
    next(error);
  }
});

import { Router } from 'express';
import { CleaningTaskModel } from '../cleaning/cleaning.model';
import { ok } from '../../utils/responses';
import { CleaningStatus, TableStatus } from '../../constants/statuses';
import { TableModel } from '../tables/tables.model';

export const cleaningRouter = Router();

cleaningRouter.get('/tasks', async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const query: Record<string, unknown> = { restaurantId: req.user?.restaurantId };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await CleaningTaskModel.find(query).sort({ createdAt: -1 });
    ok(res, { tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
});

cleaningRouter.get('/tasks/:id', async (req, res, next) => {
  try {
    const task = await CleaningTaskModel.findOne({
      _id: req.params.id,
      restaurantId: req.user?.restaurantId,
    });

    ok(res, { task });
  } catch (error) {
    next(error);
  }
});

cleaningRouter.patch('/tasks/:id/start', async (req, res, next) => {
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

    if (task) {
      await TableModel.findByIdAndUpdate(task.tableId, { status: TableStatus.CLEANING_IN_PROGRESS });
    }

    ok(res, { task, startedBy: req.body?.staffId ?? req.user?.id ?? null });
  } catch (error) {
    next(error);
  }
});

cleaningRouter.patch('/tasks/:id/complete', async (req, res, next) => {
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

    if (task) {
      await TableModel.findByIdAndUpdate(task.tableId, { status: TableStatus.NEEDS_CLEANING });
    }

    ok(res, { task });
  } catch (error) {
    next(error);
  }
});

cleaningRouter.patch('/tasks/:id/verify', async (req, res, next) => {
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

    if (task) {
      await TableModel.findByIdAndUpdate(task.tableId, {
        status: TableStatus.AVAILABLE,
        currentSessionId: null,
      });
    }

    ok(res, { task });
  } catch (error) {
    next(error);
  }
});

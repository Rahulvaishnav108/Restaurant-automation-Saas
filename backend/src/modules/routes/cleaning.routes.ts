import { Router } from 'express';
import { store } from '../../services/demoStore';
import { ok } from '../../utils/responses';

export const cleaningRouter = Router();

cleaningRouter.get('/tasks', (req, res) => {
  const { status, priority } = req.query;
  let tasks = [...store.cleaningTasks];
  if (status) tasks = tasks.filter((task) => task.status === String(status));
  if (priority) tasks = tasks.filter((task) => task.priority === String(priority));
  ok(res, { tasks, count: tasks.length });
});

cleaningRouter.get('/tasks/:id', (req, res) => {
  ok(res, { task: store.cleaningTasks.find((task) => task.id === req.params.id) ?? null });
});

cleaningRouter.patch('/tasks/:id/start', (req, res) => {
  const task = store.cleaningTasks.find((entry) => entry.id === req.params.id);
  if (task) task.status = 'IN_PROGRESS';
  ok(res, { task: task ?? null, startedBy: req.body?.staffId ?? 'usr_cleaning_1' });
});

cleaningRouter.patch('/tasks/:id/complete', (req, res) => {
  const task = store.cleaningTasks.find((entry) => entry.id === req.params.id);
  if (task) task.status = 'COMPLETED';
  ok(res, { task: task ?? null });
});

cleaningRouter.patch('/tasks/:id/verify', (req, res) => {
  const task = store.cleaningTasks.find((entry) => entry.id === req.params.id);
  if (task) {
    task.status = 'VERIFIED';
    task.verifiedBy = req.body?.verifiedBy ?? 'usr_staff_1';
  }
  ok(res, { task: task ?? null });
});

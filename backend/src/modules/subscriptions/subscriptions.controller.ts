import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as service from './subscriptions.service';
import { ok } from '../../utils/responses';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const subscription = await service.createSubscription(req.body);
  ok(res, { subscription }, 201);
});

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const subscriptions = await service.listSubscriptions();
  ok(res, { subscriptions });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const sub = await service.getSubscription(req.params.id);
  ok(res, { subscription: sub });
});

export const patch = asyncHandler(async (req: Request, res: Response) => {
  const sub = await service.updateSubscription(req.params.id, req.body);
  ok(res, { subscription: sub });
});

export const setStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const sub = await service.setStatus(req.params.id, status);
  ok(res, { subscription: sub });
});

export const activate = asyncHandler(async (req: Request, res: Response) => {
  const sub = await service.activate(req.params.id);
  ok(res, { subscription: sub });
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const { immediate } = req.body;
  const sub = await service.cancel(req.params.id, immediate);
  ok(res, { subscription: sub });
});

export const renew = asyncHandler(async (req: Request, res: Response) => {
  const { days } = req.body;
  const sub = await service.renew(req.params.id, days);
  ok(res, { subscription: sub });
});

export const getUsage = asyncHandler(async (req: Request, res: Response) => {
  const usage = await service.getSubscriptionUsage(req.params.id);
  ok(res, { usage });
});

export const getUsageReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await service.getSubscriptionUsageReport(req.params.id);
  ok(res, { usageReport: report });
});

export const incrementUsage = asyncHandler(async (req: Request, res: Response) => {
  const { key, delta } = req.body;
  const subscription = await service.incrementUsage(req.params.id, key, delta);
  ok(res, { subscription });
});

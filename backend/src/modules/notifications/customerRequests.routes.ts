import { Router, Request, Response, NextFunction } from 'express';
import { requireSession } from '../../middleware/requireSession';
import { NotificationsService } from './notifications.service';
import { NotificationCategory, NotificationPriority } from './notifications.schema';
import { TableModel } from '../tables/tables.model';
import { UserRole } from '../../constants/roles';
import { AppError } from '../../utils/AppError';
import { ErrorCode } from '../../constants/errors';
import { z } from 'zod';

const router = Router();

const customerRequestSchema = z.object({
  type: z.enum(['waiter', 'water', 'cutlery', 'cleaning', 'help']),
});

async function executeCustomerRequest(
  type: 'waiter' | 'water' | 'cutlery' | 'cleaning' | 'help',
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = req.tableSession!;

    // Retrieve the table number for a rich and human-friendly notification message
    const table = await TableModel.findById(session.tableId);
    const tableNum = table ? table.tableNumber : 'Unknown';

    // Define target roles, priority, category, title, message and responseMessage maps
    let recipientRole: UserRole = UserRole.SERVICE_STAFF;
    let category = NotificationCategory.STAFF;
    let priority = NotificationPriority.NORMAL;
    let title = '';
    let message = '';
    let notificationType = '';
    let responseMessage = '';

    switch (type) {
      case 'waiter':
        title = 'Waiter Requested';
        message = `Table ${tableNum} is requesting a waiter.`;
        notificationType = 'CALL_WAITER';
        priority = NotificationPriority.HIGH;
        responseMessage = 'Waiter Call submitted successfully';
        break;
      case 'water':
        title = 'Water Requested';
        message = `Table ${tableNum} is requesting water.`;
        notificationType = 'REQUEST_WATER';
        responseMessage = 'Water Request submitted successfully';
        break;
      case 'cutlery':
        title = 'Cutlery Requested';
        message = `Table ${tableNum} is requesting cutlery.`;
        notificationType = 'REQUEST_CUTLERY';
        responseMessage = 'Cutlery Request submitted successfully';
        break;
      case 'cleaning':
        title = 'Table Cleaning';
        message = `Table ${tableNum} is requesting table cleaning.`;
        recipientRole = UserRole.CLEANING_STAFF;
        category = NotificationCategory.CLEANING;
        notificationType = 'REQUEST_CLEANING';
        responseMessage = 'Cleaning Request submitted successfully';
        break;
      case 'help':
        title = 'Assistance Needed';
        message = `Table ${tableNum} requested help/assistance.`;
        notificationType = 'REQUEST_HELP';
        responseMessage = 'Help/Other Request submitted successfully';
        break;
    }

    // Create notification (Automatically handles 60s sliding window deduplication and real-time websocket emit)
    const notification = await NotificationsService.createNotification({
      restaurantId: session.restaurantId,
      tableSessionId: session._id,
      recipientRole,
      title,
      message,
      type: notificationType,
      category,
      priority,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      metadata: {
        tableNumber: tableNum,
        customerName: session.customerName,
        requestType: type,
      },
    });

    res.status(201).json({
      success: true,
      message: responseMessage,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

router.post(
  '/',
  requireSession,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type } = customerRequestSchema.parse(req.body);
      await executeCustomerRequest(type, req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError('Invalid request type', 400, ErrorCode.VALIDATION_ERROR));
      }
      next(error);
    }
  }
);

router.post(
  '/waiter',
  requireSession,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await executeCustomerRequest('waiter', req, res, next);
  }
);

router.post(
  '/water',
  requireSession,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await executeCustomerRequest('water', req, res, next);
  }
);

router.post(
  '/cutlery',
  requireSession,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await executeCustomerRequest('cutlery', req, res, next);
  }
);

router.post(
  '/cleaning',
  requireSession,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await executeCustomerRequest('cleaning', req, res, next);
  }
);

router.post(
  '/help',
  requireSession,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await executeCustomerRequest('help', req, res, next);
  }
);

export default router;

import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { getAuditLogsController, getAuditLogByIdController } from './auditLogs.controller';
import { getAuditLogsQuerySchema, getAuditLogByIdParamsSchema } from './auditLogs.schema';

export const auditLogsRouter = Router();

auditLogsRouter.get('/', validate({ query: getAuditLogsQuerySchema }), getAuditLogsController);
auditLogsRouter.get('/:id', validate({ params: getAuditLogByIdParamsSchema }), getAuditLogByIdController);

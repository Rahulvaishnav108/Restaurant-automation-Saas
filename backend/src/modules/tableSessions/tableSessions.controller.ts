import type { NextFunction, Request, Response } from 'express';
import { ok } from '../../utils/responses';
import * as tablesService from '../tables/tables.service';
import type { StartSessionInput } from './tableSessions.schema';
import * as sessionService from './tableSessions.service';

export async function startSession(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as StartSessionInput;
    const meta = {
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    const { session, sessionToken } = await sessionService.startSession(input, meta);

    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        restaurantId: session.restaurantId,
        tableId: session.tableId,
        customerName: session.customerName,
        sessionToken,
        expiresAt: session.expiresAt,
        status: session.status,
      },
      message: 'Session started successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function validateTableSessionController(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await sessionService.validateSession(req.body.token);
    ok(res, { session });
  } catch (error) {
    next(error);
  }
}

export async function createTableSessionController(req: Request, res: Response, next: NextFunction) {
  try {
    const table = await tablesService.findByQrCode(req.body.token);
    const { session, sessionToken } = await sessionService.startSession(
      {
        restaurantId: table.restaurantId.toString(),
        tableId: table._id.toString(),
        customerName: req.body.customerName,
        mobile: req.body.mobile ?? '0000000000',
      },
      {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      },
    );

    ok(
      res,
      {
        session,
        sessionToken,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
}

export async function getCurrentSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = req.tableSession;

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function recoverSession(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['x-session-token'] as string;
    if (!token) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'x-session-token header is required',
        },
      });
      return;
    }

    const session = await sessionService.recoverSession(token);

    res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        restaurantId: session.restaurantId,
        tableId: session.tableId,
        customerName: session.customerName,
        expiresAt: session.expiresAt,
        status: session.status,
        lastActivityAt: session.lastActivityAt,
      },
      message: 'Session recovered successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function endSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId } = req.params;
    const session = await sessionService.endSession(sessionId, 'staff_closed');

    res.status(200).json({
      success: true,
      data: session,
      message: 'Session ended successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId } = req.params;
    const session = await sessionService.getSessionById(sessionId);

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

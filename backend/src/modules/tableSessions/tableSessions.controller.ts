// src/modules/tableSessions/tableSessions.controller.ts
// Route handlers for table session lifecycle

import { Request, Response, NextFunction } from 'express';
import * as sessionService from './tableSessions.service';
import { StartSessionInput } from './tableSessions.schema';

/**
 * POST /sessions/start — QR scan entry point (public, rate-limited)
 */
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
        sessionToken, // Client stores this in localStorage for recovery
        expiresAt: session.expiresAt,
        status: session.status,
      },
      message: 'Session started successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /sessions/current — Get current session info (requireSession)
 */
export async function getCurrentSession(req: Request, res: Response, next: NextFunction) {
  try {
    // req.tableSession is set by requireSession middleware
    const session = req.tableSession;

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /sessions/recover — Recover session from stored token (public)
 */
export async function recoverSession(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['x-session-token'] as string;
    if (!token) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'x-session-token header is required',
        },
      });
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

/**
 * POST /sessions/:sessionId/end — Staff ends a session
 */
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

/**
 * GET /sessions/:sessionId — Staff views a session
 */
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

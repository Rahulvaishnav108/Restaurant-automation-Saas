// src/sockets/socket.service.ts
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { verifyAccessToken } from '../services/jwt.service';
import { TableSessionModel } from '../modules/tableSessions/tableSessions.model';

class SocketService {
  private io: SocketIOServer | null = null;

  /**
   * Initialize Socket.io with the HTTP server
   */
  public init(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: env.corsOrigins,
        credentials: true,
      },
    });

    // Enforce robust authentication and reject anonymous connections
    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      const sessionToken = socket.handshake.auth?.sessionToken || socket.handshake.headers?.['x-session-token'];

      if (token) {
        // Staff/Admin Auth
        const jwtToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
        try {
          const decoded = verifyAccessToken(jwtToken);
          socket.data.user = decoded;
          socket.data.type = 'staff';
          return next();
        } catch (err) {
          return next(new Error('Authentication failed: Invalid JWT token'));
        }
      }

      if (sessionToken) {
        // Customer Auth
        try {
          // Check token in DB
          const session = await TableSessionModel.findOne({ token: sessionToken });
          if (!session) {
            return next(new Error('Authentication failed: Invalid session token'));
          }
          if (new Date() > session.expiresAt) {
            return next(new Error('Authentication failed: Session expired'));
          }
          socket.data.tableSession = {
            _id: session._id.toString(),
            restaurantId: session.restaurantId.toString(),
            tableId: session.tableId.toString(),
            customerName: session.customerName,
            mobile: session.mobile,
          };
          socket.data.type = 'customer';
          return next();
        } catch (err) {
          return next(new Error('Authentication failed: Database error'));
        }
      }

      return next(new Error('Authentication failed: No credentials provided'));
    });

    this.io.on('connection', (socket: Socket) => {
      logger.info(`🔌 Socket connected with verified identity: ${socket.id} (Type: ${socket.data.type})`);

      // Enforce strict tenant isolation on room joining
      socket.on('join:restaurant', (restaurantId: string) => {
        if (
          (socket.data.type === 'staff' && socket.data.user?.restaurantId === restaurantId) ||
          (socket.data.type === 'customer' && socket.data.tableSession?.restaurantId === restaurantId)
        ) {
          socket.join(`restaurant:${restaurantId}`);
          logger.info(`👤 Socket ${socket.id} joined restaurant room: ${restaurantId}`);
        } else {
          logger.warn(`🚫 Unauthorized join:restaurant attempt by socket ${socket.id} for restaurant ${restaurantId}`);
          socket.emit('error', { code: 'TENANT_VIOLATION', message: 'Unauthorized room subscription' });
        }
      });

      socket.on('join:session', (sessionId: string) => {
        if (
          (socket.data.type === 'customer' && socket.data.tableSession?._id === sessionId) ||
          (socket.data.type === 'staff' && socket.data.user?.restaurantId)
        ) {
          socket.join(`session:${sessionId}`);
          logger.info(`👤 Socket ${socket.id} joined session room: ${sessionId}`);
        } else {
          logger.warn(`🚫 Unauthorized join:session attempt by socket ${socket.id} for session ${sessionId}`);
          socket.emit('error', { code: 'TENANT_VIOLATION', message: 'Unauthorized room subscription' });
        }
      });

      socket.on('join:role', ({ restaurantId, role }: { restaurantId: string; role: string }) => {
        if (
          socket.data.type === 'staff' &&
          socket.data.user?.restaurantId === restaurantId &&
          socket.data.user?.role === role
        ) {
          socket.join(`restaurant:${restaurantId}:role:${role}`);
          logger.info(`👤 Socket ${socket.id} joined role room: restaurant:${restaurantId}:role:${role}`);
        } else {
          logger.warn(`🚫 Unauthorized join:role attempt by socket ${socket.id} for role ${role}`);
          socket.emit('error', { code: 'TENANT_VIOLATION', message: 'Unauthorized room subscription' });
        }
      });

      socket.on('join:user', (userId: string) => {
        if (socket.data.type === 'staff' && socket.data.user?._id === userId) {
          socket.join(`user:${userId}`);
          logger.info(`👤 Socket ${socket.id} joined user room: user:${userId}`);
        } else {
          logger.warn(`🚫 Unauthorized join:user attempt by socket ${socket.id} for user ${userId}`);
          socket.emit('error', { code: 'TENANT_VIOLATION', message: 'Unauthorized room subscription' });
        }
      });

      socket.on('disconnect', () => {
        logger.info(`🔌 Socket disconnected: ${socket.id}`);
      });
    });

    logger.info('📡 Secure Socket.io initialized');
  }

  /**
   * Get Socket.io server instance
   */
  public getIO(): SocketIOServer | null {
    return this.io;
  }

  /**
   * Emit event to a specific restaurant (staff/kitchen)
   */
  public emitToRestaurant(restaurantId: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`restaurant:${restaurantId}`).emit(event, data);
  }

  /**
   * Emit event to a specific customer session
   */
  public emitToSession(sessionId: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`session:${sessionId}`).emit(event, data);
  }

  /**
   * Emit event to a specific role in a restaurant
   */
  public emitToRole(restaurantId: string, role: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`restaurant:${restaurantId}:role:${role}`).emit(event, data);
  }

  /**
   * Emit event to a specific user
   */
  public emitToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Broadcast to all connected clients
   */
  public broadcast(event: string, data: any): void {
    if (!this.io) return;
    this.io.emit(event, data);
  }
}

export const socketService = new SocketService();

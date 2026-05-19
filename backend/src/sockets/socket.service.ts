// src/sockets/socket.service.ts
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import logger from '../config/logger';
import { SocketEvent } from '../constants/events';

class SocketService {
  private io: SocketIOServer | null = null;

  /**
   * Initialize Socket.io with the HTTP server
   */
  public init(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*', // In production, replace with specific origins
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      logger.info(`🔌 Socket connected: ${socket.id}`);

      // Join room based on restaurantId (for staff/kitchen)
      socket.on('join:restaurant', (restaurantId: string) => {
        socket.join(`restaurant:${restaurantId}`);
        logger.info(`👤 Socket ${socket.id} joined restaurant room: ${restaurantId}`);
      });

      // Join room based on sessionId (for customer updates)
      socket.on('join:session', (sessionId: string) => {
        socket.join(`session:${sessionId}`);
        logger.info(`👤 Socket ${socket.id} joined session room: ${sessionId}`);
      });

      // Join room based on role (for specific staff role updates)
      socket.on('join:role', ({ restaurantId, role }: { restaurantId: string; role: string }) => {
        if (restaurantId && role) {
          socket.join(`restaurant:${restaurantId}:role:${role}`);
          logger.info(`👤 Socket ${socket.id} joined role room: restaurant:${restaurantId}:role:${role}`);
        }
      });

      // Join room based on userId (for direct user updates)
      socket.on('join:user', (userId: string) => {
        if (userId) {
          socket.join(`user:${userId}`);
          logger.info(`👤 Socket ${socket.id} joined user room: user:${userId}`);
        }
      });

      socket.on('disconnect', () => {
        logger.info(`🔌 Socket disconnected: ${socket.id}`);
      });
    });

    logger.info('📡 Socket.io initialized');
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

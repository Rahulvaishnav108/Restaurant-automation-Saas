import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env';
import { logger } from '../config/logger';

let io: Server | null = null;

export function createSocketServer(server: HttpServer): Server {
  if (io) {
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: env.corsOrigins,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info('Socket client connected', { socketId: socket.id });

    socket.on('disconnect', (reason) => {
      logger.info('Socket client disconnected', { socketId: socket.id, reason });
    });
  });

  return io;
}

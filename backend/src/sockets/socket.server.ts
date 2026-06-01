import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketService } from './socket.service';

export function createSocketServer(server: HttpServer): Server {
  socketService.init(server);
  return socketService.getIO()!;
}

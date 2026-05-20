import { io } from 'socket.io-client';
import { env } from './env';
import { getAccessToken } from '../auth/tokenStore';

export const socket = io(env.socketUrl, {
  autoConnect: false,
  transports: ['websocket'],
});

socket.on('connect_error', () => {
  socket.disconnect();
});

export function connectSocket(): void {
  if (socket.connected) {
    return;
  }

  socket.auth = {
    token: getAccessToken(),
  };
  socket.connect();
}

export function disconnectSocket(): void {
  if (!socket.connected) {
    return;
  }

  socket.disconnect();
}

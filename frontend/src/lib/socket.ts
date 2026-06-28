import { io } from 'socket.io-client';
import { env } from './env';
import { getAccessToken, type Panel } from '../auth/tokenStore';

const ACTIVE_PANEL_KEY = 'ra/active-panel';

function getActivePanel(): Panel {
  return (localStorage.getItem(ACTIVE_PANEL_KEY) as Panel) ?? 'customer';
}

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
    token: getAccessToken(getActivePanel()),
  };
  socket.connect();
}

export function disconnectSocket(): void {
  if (!socket.connected) {
    return;
  }

  socket.disconnect();
}


import { useEffect, type PropsWithChildren } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { connectSocket, disconnectSocket } from '../../lib/socket';
import { env } from '../../lib/env';

export function SocketProvider({ children }: PropsWithChildren): JSX.Element {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (env.demoMode) {
      disconnectSocket();
      return undefined;
    }
    if (isAuthenticated) {
      connectSocket();
      return () => disconnectSocket();
    }

    disconnectSocket();
    return undefined;
  }, [isAuthenticated]);

  return <>{children}</>;
}

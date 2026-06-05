import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './app/router';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { QueryProvider } from './app/providers/QueryProvider';
import { AuthProvider } from './app/providers/AuthProvider';
import { SocketProvider } from './app/providers/SocketProvider';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>
            <AppRouter />
          </SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>
);
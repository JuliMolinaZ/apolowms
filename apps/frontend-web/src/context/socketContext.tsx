// src/context/socketContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextValue {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextValue>({ socket: null });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Si no habilitamos sockets en env, salimos
    if (process.env.NEXT_PUBLIC_ENABLE_SOCKETS !== 'true') {
      console.info('[SocketProvider] Sockets are disabled by configuration.');
      return;
    }

    // URL y path desde variables de entorno
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? '';
    const socketPath = process.env.NEXT_PUBLIC_SOCKET_PATH ?? '/socket.io';

    // Inicializa socket.io
    const socketIo = io(socketUrl, {
      path: socketPath,
      transports: ['websocket'],
      query: { username: user?.username ?? '' },
      reconnectionAttempts: 3,
    });

    socketIo.on('connect', () => {
      console.log('[SocketProvider] Connected, socket id:', socketIo.id);
    });
    socketIo.on('connect_error', (err) => {
      console.warn('[SocketProvider] Connection error:', err.message);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
      console.log('[SocketProvider] Disconnected socket.');
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  return useContext(SocketContext);
};

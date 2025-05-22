'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL || '');
    socketIo.on('connect', () => {
      console.log('[SocketProvider] Conectado con ID:', socketIo.id);
    });
    socketIo.on('connect_error', (err) => {
      console.error('[SocketProvider] Error de conexión:', err);
    });
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
      console.log('[SocketProvider] Socket desconectado.');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

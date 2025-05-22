// src/store/socketStore.ts
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

type SocketStore = {
  socket: Socket | null;
  connectSocket: (token: string) => Promise<void>;
  disconnectSocket: () => void;
};

let reconnecting = false;
let lastToken: string | null = null;

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,

  connectSocket: async (token: string) => {
    lastToken = token;

    const existingSocket = get().socket;

    if (existingSocket && existingSocket.connected) {
      return;
    }

    if (existingSocket) {
      existingSocket.disconnect();
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL!, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      path: '/socket/socket.io',
      query: {
        token: token,
      },
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      if (reason !== 'io client disconnect' && !reconnecting) {
        reconnecting = true;
        setTimeout(() => {
          if (lastToken) {
            get().connectSocket(lastToken);
            reconnecting = false;
          }
        }, 3000);
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect(); // Đây là manual disconnect
      set({ socket: null });
    }
  },
}));

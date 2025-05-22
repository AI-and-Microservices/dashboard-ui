// src/hooks/useChatRoom.ts
import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socketStore';

export const useChatRoom = (
    conversationId: string,
    onMessage: (msg: any) => void
) => {
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    // Join room
    socket.emit('join:conversation', { conversationId });

    // Listen
    socket.on(`chat:receive:${conversationId}`, onMessage);

    // Cleanup
    return () => {
      socket.emit('leave:conversation', { conversationId });
      socket.off(`chat:receive:${conversationId}`, onMessage);
    };
  }, [socket, conversationId, onMessage]);
};

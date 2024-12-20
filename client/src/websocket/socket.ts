import { io } from 'socket.io-client';

export const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace(/\/api$/, '')!,
  {
    withCredentials: true,
    transports: ['websocket'],
  },
);

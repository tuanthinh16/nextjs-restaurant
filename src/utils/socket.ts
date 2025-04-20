// utils/socket.ts
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from './api';

let socket: Socket | null = null;

export const getSocket = async (): Promise<Socket> => {
    if (socket) return socket;

    const token = await getAuthToken(); // await đúng cách
    console.log("token in client: ", token)
    socket = io(process.env.NEXT_PUBLIC_WSS_URL!, {
        transports: ['websocket'],
        auth: {
            token: token || '',
        },
    });

    return socket;
};

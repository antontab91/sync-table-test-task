import { WebSocketServer } from 'ws';
import type { Server } from 'http';

import { addClient, removeClient } from './client';

export function attachWsServer(server: Server): void {
    const wss = new WebSocketServer({
        server,
        path: '/creatives',
    });

    wss.on('connection', (socket) => {
        addClient(socket);

        socket.on('close', () => {
            removeClient(socket);
        });
    });
}

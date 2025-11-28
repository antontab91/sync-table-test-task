import type { WebSocket } from 'ws';

export interface WsEvent<T = unknown> {
    type: string;
    payload: T;
}

const clients = new Set<WebSocket>();

export function addClient(client: WebSocket): void {
    clients.add(client);
}

export function removeClient(client: WebSocket): void {
    clients.delete(client);
}

export function broadcast<T>(event: WsEvent<T>): void {
    const message = JSON.stringify(event);

    for (const client of clients) {
        try {
            client.send(message);
        } catch {
            clients.delete(client);
            try {
                client.close();
            } catch {}
        }
    }
}

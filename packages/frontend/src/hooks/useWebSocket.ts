import { useEffect, useRef } from 'react';

interface UseWebSocketOptions<TEvent> {
    url: string;
    onMessage: (event: TEvent) => void;
}

export function useWebSocket<TEvent>({
    url,
    onMessage,
}: UseWebSocketOptions<TEvent>) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data) as TEvent;
                onMessage(parsed);
            } catch {
                // игнор
            }
        };

        return () => {
            ws.close();
        };
    }, [url, onMessage]);
}

import { useEffect, useRef, useState } from "react";
import { INIT, Message, MOVE, PING, STATE, Status } from "common";

export default function useWebSocket(code: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>(Status.NOT_STARTED);
  const [ping, setPing] = useState<number | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const sendPing = () => {
    const start = Date.now();
    if (ws.current?.readyState !== WebSocket.OPEN) return;
    ws.current.send(
      JSON.stringify({ type: PING, payload: { timestamp: start } })
    );
  };

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:3000/room?code=${code}`);
    ws.current.onopen = () => {
      console.log("WebSocket connected");
      ws.current!.send(JSON.stringify({ type: STATE }));
      sendPing();
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const end = Date.now();
      const message: Message = JSON.parse(event.data);
      if (message.type === PING) {
        setPing(end - message.payload!.timestamp!);
        setTimeout(sendPing, 5000);
      }
      if (message.type === INIT || message.type === STATE) {
        setStatus(message.payload?.status!);
      }
      if (message.type === MOVE) {
        setMoves((prevMoves) => [...prevMoves, message.payload?.move!]);
      }
      if (message.type !== PING) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    ws.current.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, [code]);

  const sendMessage = (message: Message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      if (message.type === MOVE) {
        setMoves((prevMoves) => [...prevMoves, message.payload?.move!]);
      }
    }
  };

  return [messages, status, ping, moves, sendMessage] as const;
}

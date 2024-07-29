import { useEffect, useRef, useState } from "react";
import { Message, Status } from "@/lib/message";

export default function useWebSocket(code: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>(Status.NOT_STARTED);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://192.168.1.33:3000?code=${code}`);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const message: Message = JSON.parse(event.data);
      if (message.payload?.status) setStatus(message.payload?.status);
      setMessages((prevMessages) => [...prevMessages, message]);
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
  }, []);

  const sendMessage = (message: Message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return [messages, status, sendMessage] as const;
}

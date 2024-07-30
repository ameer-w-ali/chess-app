import { Manager } from "./lib/manager";
import { ERROR, GAME_OVER, MOVE } from "./lib/message";

type Data = {
  code: string;
};

let count = 0;
const manager = new Manager();

const server = Bun.serve<Data>({
  port: 3000,
  development: true,
  fetch(request, server) {
    const url = new URL(request.url);
    const path = url.pathname;
    const params = new URLSearchParams(url.search);
    const code = params.get("code") as string;

    if (!code) return new Response("invalid room code",{status: 400});

    if (/^\/room/.test(path)) {
      const success = server.upgrade(request, { data: { code } });
      if (!success) throw new Error("unable to upgrade the request");
      return new Response("WebSocket Server", {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    throw new Error("Page not found");
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      status: 500,
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
  websocket: {
    open(ws) {
      console.log(`user count:${++count}`);
      const room = manager.fetchRoom(ws.data.code, ws);
      if (!room) {
        ws.close(1011,'Room not found');
      }
    },
    message(ws, message) {
      const room = manager.getRoom(ws.data.code as string);
      if (!room) return ws.close(1011,'Room not found');
      const { type, payload } = JSON.parse(message as string);
      switch (type) {
        case MOVE:
          room.handleMove(ws, payload.move);
          break;
        case GAME_OVER:
          room.handleGameOver(ws);
          break;
        default:
          ws.send(
            JSON.stringify({
              type: ERROR,
              payload: { error: "invalid message type" },
            })
          );
      }
    },
    close(ws) {
      console.log(`user count:${--count}`);
      const room = manager.getRoom(ws.data.code as string);
      if (!room) return;
      room.removePlayer(ws);
      if (room.users === 0) {
        manager.removeRoom(ws.data.code);
      }
    },
  },
});

console.log(`Server running on ${server.url}`)
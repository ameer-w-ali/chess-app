import { Manager } from "./lib/manager";
import { ERROR, GAME_OVER, MOVE, PING, STATE } from "common";

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

    if (/^\/room/.test(path)) {
      if (!code) return new Response("invalid room code", { status: 400 });
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
    return new Response(`${error.stack}`, {
      status: 500,
      headers: {
        "Content-Type": "text/text",
      },
    });
  },
  websocket: {
    open(ws) {
      console.log(`user count:${++count}`);
      const room = manager.fetchRoom(ws.data.code, ws);
      if (!room) {
        ws.close(1011, "Room not found");
      }
    },

    ping(ws,data){
      Promise.resolve(setImmediate(()=>{},100000));
      ws.send(data.toString())
    },
    pong(ws,data){
      ws.send(data.toString())
    },

    message(ws, message) {
      const room = manager.getRoom(ws.data.code as string);
      if (!room) return ws.close(1011, "Room not found");
      const { type, payload } = JSON.parse(message as string);
      switch (type) {
        case PING:
          ws.ping(JSON.stringify({type: PING, payload: {timestamp: payload.timestamp}}));
          break;
        case STATE:
          room.getState(ws);
          break;
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

console.log(`Server running on ${server.url}`);

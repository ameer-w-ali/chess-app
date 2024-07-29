import { createServer } from "http";
import { WebSocketServer } from "ws";
import { ERROR } from "./lib/message";
import { Manager } from "./lib/manager";

const manager = new Manager();
let users = 0;
const server = createServer((req: any, res: any) => {
  console.log(`${new Date()}: Received request for ${req.url}`);
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end("WebSocket server\n");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  console.log(`user count:${++users}`);

  ws.on("error", console.error);
  const params = new URLSearchParams(req.url?.split("?")[1]);
  const code = params.get("code");
  if (!code) {
    ws.send(
      JSON.stringify({ type: ERROR, payload: { error: "Invalid room code" } })
    );
    return ws.close();
  }
  const room = manager.fetchRoom(code, ws);

  if (!room) {
    ws.send(
      JSON.stringify({ type: ERROR, payload: { error: "Room not Found" } })
    );
    return ws.close();
  }
  room.MessageHandler(ws);

  ws.on("close", () => {
    console.log(`user count:${--users}`);
    room.removePlayer(ws);
    if (room.users === 0) {
      manager.removeRoom(code);
    }
  });
});

server.listen(3000, () => console.log("> Ready on http://localhost:3000"));

import { createServer } from "http";
import next from "next";
import { parse } from "url";
import { WebSocketServer } from "ws";
import { ERROR } from "./lib/message"
import { Manager } from "./lib/manager";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const manager = new Manager();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parseUrl = parse(req.url!, true);
    handle(req, res, parseUrl);
  });

  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    ws.on("error", console.error);
    const params = new URLSearchParams(req.url?.split("?")[1]);
    const code = params.get("code");

    if (!code) {
      ws.send(JSON.stringify({ type: ERROR, message: "Invalid room code" }));
      return ws.close();
    }
    const room = manager.fetchRoom(code, ws);

    if (!room) {
      ws.send(JSON.stringify({ type: ERROR, message: "Room not Found" }));
      return ws.close();
    }
    room.MessageHandler(ws);
    ws.on("close", () => {
      room.removePlayer(ws);
      if (room.users === 0) {
        manager.removeRoom(code);
      }
    });
  });
  server.listen(3000, () => console.log("> Ready on http://localhost:3000"));
});

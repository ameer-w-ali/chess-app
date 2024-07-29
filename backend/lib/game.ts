import { WebSocket } from "ws";
import { ERROR, GAME_OVER, INIT, MOVE, Status } from "./message";
import { Chess } from "chess.js";

export class Game {
  player1: WebSocket;
  player2: WebSocket;
  board: Chess;
  history: { move: { from: string; to: string }; timestamp: number }[];

  constructor(p1: WebSocket, p2: WebSocket) {
    this.player1 = p1;
    this.player2 = p2;
    this.board = new Chess();
    this.history = [];
    const num1 = Math.floor(1 + Math.random() * 9);
    const num2 = Math.floor(1 + Math.random() * 9);
    this.player1.send(
      JSON.stringify({
        type: INIT,
        payload: {
          status: Status.IN_PROGRESS,
          color: "white",
          avatar: num1,
          opponent: num2,
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT,
        payload: {
          status: Status.IN_PROGRESS,
          color: "black",
          avatar: num2,
          opponent: num1,
        },
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    const turn = this.board.turn() === "w" ? this.player1 : this.player2;
    if (socket !== turn) {
      socket.send(
        JSON.stringify({ type: ERROR, payload: { message: "Not your turn" } })
      );
      return;
    }
    const res = this.board.move(move);
    if (!res) {
      socket.send(
        JSON.stringify({ type: ERROR, payload: { message: "Invalid Move" } })
      );
      return;
    }

    const timestamp = Date.now();
    this.history.push({ move, timestamp });

    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "w" ? "black" : "white";
      this.player1.send(
        JSON.stringify({ type: GAME_OVER, payload: { winner } })
      );
      this.player2.send(
        JSON.stringify({ type: GAME_OVER, payload: { winner } })
      );
      return;
    }

    const opponent = socket === this.player1 ? this.player2 : this.player1;
    opponent.send(JSON.stringify({ type: MOVE, payload: { move, timestamp } }));
  }
}

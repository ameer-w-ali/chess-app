import { ERROR, GAME_OVER, INIT, MOVE, Status } from "common";
import { Chess } from "chess.js";
import type { ServerWebSocket } from "bun";

export class Game {
  player1: {
    color: "white" | "black";
    socket: ServerWebSocket<unknown>;
    avatar: number;
  };
  player2: {
    color: "white" | "black";
    socket: ServerWebSocket<unknown>;
    avatar: number;
  };
  board: Chess;
  history: { move: { from: string; to: string }; timestamp: number }[];

  constructor(p1: ServerWebSocket<unknown>, p2: ServerWebSocket<unknown>) {
    this.player1 = {
      socket: p1,
      color: "white",
      avatar: Math.floor(1 + Math.random() * 8),
    };

    this.player2 = {
      socket: p2,
      color: "black",
      avatar: Math.floor(1 + Math.random() * 8),
    };

    this.board = new Chess();
    this.history = [];

    this.player1.socket.send(
      JSON.stringify({
        type: INIT,
        payload: {
          status: Status.IN_PROGRESS,
          color: this.player1.color,
          avatar: this.player1.avatar,
          opponent: this.player2.avatar,
        },
      })
    );
    this.player2.socket.send(
      JSON.stringify({
        type: INIT,
        payload: {
          status: Status.IN_PROGRESS,
          color: this.player2.color,
          avatar: this.player2.avatar,
          opponent: this.player1.avatar,
        },
      })
    );
  }

  makeMove(
    socket: ServerWebSocket<unknown>,
    move: { from: string; to: string }
  ) {
    const turn = this.board.turn() === "w" ? this.player1.socket : this.player2.socket;
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
      this.player1.socket.send(
        JSON.stringify({ type: GAME_OVER, payload: { winner } })
      );
      this.player2.socket.send(
        JSON.stringify({ type: GAME_OVER, payload: { winner } })
      );
      return;
    }

    const opponent = socket === this.player1.socket ? this.player2.socket : this.player1.socket;
    opponent.send(JSON.stringify({ type: MOVE, payload: { move, timestamp } }));
  }

  getPlayer(socket: ServerWebSocket<unknown>) {
    if (socket === this.player1.socket) return {
      color: this.player1.color,
      avatar: this.player1.avatar,
      opponent: this.player2.avatar,
      fen:this.board.fen(),
      history: this.history,
    };
    if (socket === this.player2.socket) return {
      color: this.player2.color,
      avatar: this.player2.avatar,
      opponent: this.player1.avatar,
      history: this.history,
      fen:this.board.fen(),
    };
    return null;
  }
}

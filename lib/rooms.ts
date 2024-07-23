import { WebSocket } from "ws";
import { Game } from "./game";
import { ERROR, GAME_OVER, INIT, MOVE } from "./message";

export class Room {
  code: string;
  users: number;
  private players: WebSocket[];
  private game?: Game;

  constructor(code: string, player: WebSocket) {
    this.code = code;
    this.players = [player];
    this.users = this.players.length;
  }

  addPlayer(player: WebSocket) {
    if (this.players.length < 2) {
      this.players.push(player);
      if (this.players.length === 2) {
        this.initiateGame();
      }
      this.users = this.players.length;
    } else {
      player.send(
        JSON.stringify({ type: ERROR, message: "Only 2 Players are allowed" })
      );
      player.close();
    }
  }

  removePlayer(player: WebSocket) {
    this.players = this.players.filter((p) => p !== player);
    this.users = this.players.length;
    if (this.players.length === 0) {
      this.destructor();
    }
  }

  private initiateGame() {
    if (!this.game) {
      this.game = new Game(this.players[0], this.players[1]);
    }
  }

  destructor() {
    this.players = [];
    this.code = "";
    this.users = 0;
  }

  MessageHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      switch (message.type) {
        case MOVE:
          this.handleMove(socket, message.move);
        case GAME_OVER:
          this.handleGameOver(socket);
      }
    });

    socket.on("close", () => {
      this.removePlayer(socket);
    });
  }

  private handleMove(player: WebSocket, move: string) {
    if (this.game) {
      this.game.makeMove(player, move);
    } else {
      player.send(
        JSON.stringify({ type: "ERROR", message: "Game not started" })
      );
    }
  }

  private handleGameOver(player: WebSocket) {
    this.removePlayer(player);
  }
}
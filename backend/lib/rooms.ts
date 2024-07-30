import { Game } from "./game";
import { ERROR } from "./message";
import type { ServerWebSocket } from "bun";

export class Room {
  code: string;
  users: number;
  private players: ServerWebSocket<unknown>[];
  private game?: Game;

  constructor(code: string, player: ServerWebSocket<unknown>) {
    this.code = code;
    this.players = [player];
    this.users = this.players.length;
  }

  addPlayer(player: ServerWebSocket<unknown>) {
    if (this.players.length < 2) {
      this.players.push(player);
      if (this.players.length === 2) {
        this.initiateGame();
      }
      this.users = this.players.length;
    } else {
      player.send(
        JSON.stringify({ type: ERROR, payload:{message: "Only 2 Players are allowed"} })
      );
      player.close();
    }
  }

  removePlayer(player: ServerWebSocket<unknown>) {
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

  handleMove(player: ServerWebSocket<unknown>, move: {from:string,to:string}) {
    if (this.game) {
      console.log(move);
      this.game.makeMove(player, move);
    } else {
      player.send(
        JSON.stringify({ type: "ERROR", message: "Game not started" })
      );
    }
  }

  handleGameOver(player: ServerWebSocket<unknown>) {
    this.removePlayer(player);
  }
}

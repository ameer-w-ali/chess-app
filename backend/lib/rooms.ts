import { Game } from "./game";
import { ERROR, STATE, Status } from "common";
import type { ServerWebSocket } from "bun";

export class Room {
  code: string;
  users: number;
  private state: Status;
  private players: ServerWebSocket<unknown>[];
  private game?: Game;

  constructor(code: string, player: ServerWebSocket<unknown>) {
    this.code = code;
    this.players = [player];
    this.users = this.players.length;
    this.state = Status.NOT_STARTED;
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
        JSON.stringify({
          type: ERROR,
          payload: { message: "Only 2 Players are allowed" },
        })
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

  getState(player: ServerWebSocket<unknown>) {
    const user = this.game?.getPlayer(player);
    if (!user && this.game)
      return player.send(
        JSON.stringify({ type: ERROR, payload: { message: "User not Found" } })
      );
    const payload = { status: this.state, ...user };
    player.send(JSON.stringify({ type: STATE, payload }));
  }

  private initiateGame() {
    if (!this.game) {
      this.game = new Game(this.players[0], this.players[1]);
      this.state = Status.IN_PROGRESS;
    }
  }

  destructor() {
    this.players = [];
    this.code = "";
    this.users = 0;
  }

  handleMove(
    player: ServerWebSocket<unknown>,
    move: { from: string; to: string }
  ) {
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
    this.state = Status.ABANDONED;
  }
}

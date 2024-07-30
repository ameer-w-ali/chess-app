import { Room } from "./rooms";
import type { ServerWebSocket } from "bun";

export class Manager {
  private rooms: Room[];

  constructor() {
    this.rooms = [];
  }

  getRoom(code: string) {
    return this.rooms.find((rm) => rm.code === code);
  }

  fetchRoom(code: string, user: ServerWebSocket<unknown>) {
    let room = this.getRoom(code);

    if (room) {
      room.addPlayer(user);
    } else {
      room = new Room(code, user);
      this.rooms.push(room);
    }
    return room;
  }

  removeRoom(code: string) {
    const room = this.getRoom(code);
    if (room) {
      room.destructor();
      this.rooms = this.rooms.filter((r) => r !== room);
    }
  }
}

export const INIT = "init";
export const MOVE = "move";
export const ERROR = "error";
export const INVALID_MOVE = "invalid move";
export const GAME_OVER = "game over";

export enum Status {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  CHECK = "check",
  CHECKMATE = "checkmate",
  STALEMATE = "stalemate",
  DRAW = "draw",
  RESIGNATION = "resignation",
  TIMEOUT = "timeout",
  ABANDONED = "abandoned",
}

export interface Message {
  type:
    | typeof ERROR
    | typeof INIT
    | typeof MOVE
    | typeof INVALID_MOVE
    | typeof GAME_OVER;
  payload?: {
    status?: Status;
    error?: string;
    message?: string;
    move?: {from:string,to:string};
    avatar?:number
    opponent?:number //opponent avatar number
    color?: "black" | "white";
    winner?: "black" | "white";
  };
}

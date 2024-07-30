export const INIT = "init";
export const MOVE = "move";
export const ERROR = "error";
export const INVALID_MOVE = "invalid move";
export const GAME_OVER = "game over";
export const STATE = "state";
export const PING = "ping";

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
    | typeof GAME_OVER
    | typeof STATE
    | typeof PING;
  payload?: {
    status?: Status;
    error?: string;
    message?: string;
    move?: { from: string; to: string };
    color?: "white" | "black";
    winner?: "white" | "black";
    avatar?: number;
    opponent?: number;
    timestamp?: number;
    history?: { move: { from: string; to: string }; timestamp: number }[];
    fen?: string;
  };
}



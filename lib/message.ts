export const INIT = "init";
export const MOVE = "move";
export const ERROR = "error";
export const INVALID_MOVE = "invalid move";
export const GAME_OVER = "game over";

export type messageTypes =
  | typeof ERROR
  | typeof INIT
  | typeof MOVE
  | typeof INVALID_MOVE
  | typeof GAME_OVER;

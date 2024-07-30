import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import Player from "./player";
import Chessboard from "./chessboard";
import { Square } from "react-chessboard/dist/chessboard/types";
import { INIT, Message, MOVE, STATE, Status } from "common";

interface ChessComponentProps {
  ping: number | null;
  messages: Message[];
  sendMessage: (message: Message) => void;
}

export default function ChessComponent({
  ping,
  messages,
  sendMessage,
}: ChessComponentProps) {
  const [color, setColor] = useState<"black" | "white">("white");
  const [avatar1, setAvatar1] = useState(0);
  const [avatar2, setAvatar2] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | "">("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<{
    [key in Square]?: { backgroundColor: string };
  }>({});
  const [moveSquares] = useState<{
    [key in Square]?: { background: string; borderRadius?: string };
  }>({});
  const [optionSquares, setOptionSquares] = useState<{
    [key in Square]?: { background: string; borderRadius?: string };
  }>({});

  useEffect(() => {
    messages.find((m) => {
      if (m.type === STATE && m.payload?.status === Status.IN_PROGRESS) {
        setColor(m.payload?.color!);
        setAvatar1(m.payload?.avatar!);
        setAvatar2(m.payload?.opponent!);
      } else if (m.type === INIT) {
        setColor(m.payload?.color!);
        setAvatar1(m.payload?.avatar!);
        setAvatar2(m.payload?.opponent!);
      }
    });
  }, []);

  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (latest.type === MOVE && latest.payload && latest.payload.move) {
      const gameCopy = new Chess(game.fen());
      const move = latest.payload?.move;
      const moveResult = gameCopy.move({ from: move.from, to: move.to });
      if (moveResult) {
        setGame(gameCopy);
      } else {
        console.error(`Invalid move: ${latest.payload?.move}`);
      }
    }
  }, [messages]);

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: {
      [key in Square]?: { background: string; borderRadius?: string };
    } = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)!.color !== game.get(square)!.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: Square) {
    setRightClickedSquares({});

    if (!moveFrom) {
      if (game.get(square)?.color !== color[0] || game.turn() !== color[0]) {
        return; // Only allow moving own pieces when it's your turn
      }
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    if (!moveTo) {
      const moves = game.moves({
        square: moveFrom,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      setMoveTo(square);

      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);

      sendMessage({
        type: MOVE,
        payload: { move: { from: move.from, to: move.to } },
      });

      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(
    piece?: string,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ): boolean {
    if (piece && promoteFromSquare && promoteToSquare) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move({
        from: promoteFromSquare,
        to: promoteToSquare,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(gameCopy);
      setMoveFrom("");
      setMoveTo(null);
      setShowPromotionDialog(false);
      setOptionSquares({});
      sendMessage({
        type: MOVE,
        payload: { move: { from: promoteFromSquare, to: promoteToSquare } },
      });
      return true;
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return false;
  }

  function onPieceDrop(sourceSquare: Square, targetSquare: Square): boolean {
    if (game.turn() !== color[0]) {
      return false; // Only allow dropping pieces when it's your turn
    }

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion:
          game.get(targetSquare)?.type === "p" &&
          (targetSquare[1] === "1" || targetSquare[1] === "8")
            ? "q"
            : undefined,
      });

      if (move) {
        setGame(gameCopy);
        sendMessage({
          type: MOVE,
          payload: { move: { from: move.from, to: move.to } },
        });
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  function onSquareRightClick(square: Square) {
    const color = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square]!.backgroundColor === color
          ? undefined
          : { backgroundColor: color },
    });
  }

  return (
    <div className="md:col-span-3 md:row-span-3 sm:min-w-[460px] sm:rounded-lg bg-neutral-50 dark:bg-neutral-800 p-2">
      <Player
        ping={ping}
        name={color === "black" ? "Player 1" : "Player 2"}
        num={avatar2}
        active={game.turn() !== color[0]}
      />
      <div className="w-full sm:px-3">
        <Chessboard
          color={color}
          position={game.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          onPromotionPieceSelect={onPromotionPieceSelect}
          onPieceDrop={onPieceDrop}
          moveSquares={moveSquares}
          optionSquares={optionSquares}
          rightClickedSquares={rightClickedSquares}
          showPromotionDialog={showPromotionDialog}
          promotionToSquare={moveTo}
        />
      </div>
      <Player
        ping={ping}
        name={color === "white" ? "Player 1" : "Player 2"}
        num={avatar1}
        active={game.turn() === color[0]}
      />
    </div>
  );
}

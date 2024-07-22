'use client'
import { useState } from "react";
import { Chess } from "chess.js";
import Player from "./player";
import Chessboard from "./chessboard";
import { Square,Piece } from "react-chessboard/dist/chessboard/types";

const num1 = Math.floor(1 + Math.random() * 9);
const num2 = Math.floor(1 + Math.random() * 9);

export default function ChessComponent() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | "">("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<{
    [key in Square]?: { backgroundColor: string };
  }>({});
  const [moveSquares, setMoveSquares] = useState<{
    [key in Square]?: { background: string; borderRadius?: string };
  }>({});
  const [optionSquares, setOptionSquares] = useState<{
    [key in Square]?: { background: string; borderRadius?: string };
  }>({});

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

      const gameCopy = game;
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
      return true;
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return false;
  }

  function onPieceDrop(
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ): boolean {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion:
          game.get(targetSquare)?.type === "p" &&
          (targetSquare[1] === "1" || targetSquare[1] === "8")
            ? "q"
            : undefined,
      });
      return true
    } catch (error) {
      return false
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
    <div className="w-[460px] rounded bg-neutral-600">
      <Player name="Player 2" num={num2} active={game.turn() === "b"} />
      <div className="w-full px-3">
        <Chessboard
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
      <Player name="Player 1" num={num1} active={game.turn() === "w"} />
    </div>
  );
}

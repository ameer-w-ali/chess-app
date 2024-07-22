'use client'
import { useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Piece, PromotionPieceOption, Square } from "react-chessboard/dist/chessboard/types";

interface ChessBoardProps {
  position: string;
  onPieceDrop: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean,
  onSquareClick: (square: Square) => void;
  onSquareRightClick: (square: Square) => void;
  onPromotionPieceSelect: (
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) => boolean;
  moveSquares: {
    [key in Square]?: { background: string; borderRadius?: string };
  };
  optionSquares: {
    [key in Square]?: { background: string; borderRadius?: string };
  };
  rightClickedSquares: { [key in Square]?: { backgroundColor: string } };
  showPromotionDialog: boolean;
  promotionToSquare: Square | null;
}

const pieces = [
  "wP",
  "wN",
  "wB",
  "wR",
  "wQ",
  "wK",
  "bP",
  "bN",
  "bB",
  "bR",
  "bQ",
  "bK",
];

export default function ChessBoard({
  position,
  onPieceDrop,
  onSquareClick,
  onSquareRightClick,
  onPromotionPieceSelect,
  moveSquares,
  optionSquares,
  rightClickedSquares,
  showPromotionDialog,
  promotionToSquare,
}: ChessBoardProps) {
  const customPieces = useMemo(() => {
    const pieceComponents: {
      [key: string]: ({ squareWidth }: { squareWidth: number }) => JSX.Element;
    } = {};
    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/pieces/${piece}.png)`,
            backgroundSize: "100%",
          }}
        />
      );
    });
    return pieceComponents;
  }, []);

  return (
    <Chessboard
      animationDuration={200}
      position={position}
      onPieceDrop={onPieceDrop}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
      onPromotionPieceSelect={onPromotionPieceSelect}
      customBoardStyle={{
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
      }}
      customSquareStyles={{
        ...moveSquares,
        ...optionSquares,
        ...rightClickedSquares,
      }}
      promotionToSquare={promotionToSquare}
      showPromotionDialog={showPromotionDialog}
      customDarkSquareStyle={{ backgroundColor: "#779952" }}
      customLightSquareStyle={{ backgroundColor: "#edeed1" }}
      customPieces={customPieces}
    />
  );
}

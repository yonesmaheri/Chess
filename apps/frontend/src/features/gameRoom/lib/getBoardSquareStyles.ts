import type { CSSProperties } from "react";

type BoardMove = { from: string; to: string } | null;

type GetBoardSquareStylesOptions = {
  lastMove: BoardMove;
  selectedSquare: string | null;
  legalTargets: string[];
  showLegalMoves: boolean;
  checkSquare: string | null;
};

export function getBoardSquareStyles({
  lastMove,
  selectedSquare,
  legalTargets,
  showLegalMoves,
  checkSquare,
}: GetBoardSquareStylesOptions): Record<string, CSSProperties> {
  const styles: Record<string, CSSProperties> = {};

  if (lastMove) {
    styles[lastMove.from] = {
      backgroundColor: "rgba(127, 159, 133, 0.18)",
    };
    styles[lastMove.to] = {
      backgroundColor: "rgba(127, 159, 133, 0.28)",
    };
  }

  if (selectedSquare) {
    styles[selectedSquare] = {
      backgroundColor: "rgba(255, 209, 102, 0.42)",
      boxShadow: "inset 0 0 0 2px rgba(255, 209, 102, 0.88)",
    };
  }

  if (showLegalMoves) {
    legalTargets.forEach((targetSquare) => {
      styles[targetSquare] = {
        ...(styles[targetSquare] ?? {}),
        background:
          "radial-gradient(circle, rgba(127, 159, 133, 0.32) 0%, rgba(127, 159, 133, 0.14) 46%, rgba(127, 159, 133, 0) 48%)",
      };
    });
  }

  if (checkSquare) {
    styles[checkSquare] = {
      ...(styles[checkSquare] ?? {}),
      backgroundColor: "rgba(217, 83, 79, 0.35)",
      boxShadow: "inset 0 0 0 2px rgba(201, 82, 75, 0.7)",
    };
  }

  return styles;
}

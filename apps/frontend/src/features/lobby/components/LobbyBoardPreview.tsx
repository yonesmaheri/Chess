"use client";

import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Badge } from "@/shared/components/ui/badge";

type LobbyBoardPreviewProps = {
  title: string;
  subtitle: string;
  fen: string;
};

export default function LobbyBoardPreview({
  title,
  subtitle,
  fen,
}: LobbyBoardPreviewProps) {
  const boardWrapperRef = useRef<HTMLDivElement | null>(null);
  const [boardWidth, setBoardWidth] = useState(320);

  useEffect(() => {
    const element = boardWrapperRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setBoardWidth(Math.max(260, Math.floor(element.clientWidth - 24)));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#E5EAE2] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.06)]">
      <div className="flex flex-col gap-3 border-b border-[#EEF2EC] px-5 py-5 sm:px-6">
        <Badge className="w-fit rounded-full bg-[#E9F2E8] px-3 py-1 text-[#628061] hover:bg-[#E9F2E8]">
          پیش‌نمایش بازی
        </Badge>
        <div>
          <h2 className="text-xl font-bold text-[#1F2525]">{title}</h2>
          <p className="mt-1 text-sm text-[#6E7772]">{subtitle}</p>
        </div>
      </div>

      <div className="bg-[#F7FAF6] p-4 sm:p-6">
        <div
          ref={boardWrapperRef}
          className="mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[24px] border border-[#E1E8DE] bg-white p-3 shadow-[0_16px_40px_rgba(31,37,37,0.05)]"
        >
          <Chessboard
            id="lobby-preview-board"
            position={fen}
            arePiecesDraggable={false}
            boardWidth={boardWidth}
            customDarkSquareStyle={{ backgroundColor: "#7F9F85" }}
            customLightSquareStyle={{ backgroundColor: "#EEF4EC" }}
            customBoardStyle={{
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "inset 0 0 0 1px rgba(127, 159, 133, 0.16)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

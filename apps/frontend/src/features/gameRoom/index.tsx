"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Square } from "chess.js";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/shared/contexts/auth-provider";
import { useSocketContext } from "@/shared/contexts/socket-provider";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { formatClockTime, useSessionGameRoom } from "./lib/useSessionGameRoom";
import { getBoardSquareStyles } from "./lib/getBoardSquareStyles";
import { getConnectionBadge } from "./lib/getConnectionBadge";
import { useAutoScroll } from "./lib/useAutoScroll";
import { useElementWidth } from "./lib/useElementWidth";
import ChessboardWithOptions from "./components/chessboardWithOptions";
import DesktopSidebar from "./components/desktopSidebar";
import MobilePlayerRow from "./components/mobilePlayerRow";
import PlayerPanel from "./components/playerPanel";
import BoardToolbar from "./components/boardToolbar";
import EvaluationBar from "./components/evaluationBar";
import RequestBanner from "./components/requestBanner";
import MobileControls from "./components/mobileControls";
import MobileAccordions from "./components/mobileAccordions";
import PromotionDialog from "./components/promotionDialog";
import type { MatchSessionGameRoomProps, GameRoomSettingKey } from "./types";

export function MatchSessionGameRoom({
  sessionId,
  opponentName,
  playerColor = "w",
}: MatchSessionGameRoomProps) {
  const { user } = useAuth();
  const { isConnected, isConnecting } = useSocketContext();
  const boardWrapperRef = useRef<HTMLDivElement | null>(null);
  const desktopChatRef = useRef<HTMLDivElement | null>(null);
  const mobileChatRef = useRef<HTMLDivElement | null>(null);
  const [mobileAccordionValue, setMobileAccordionValue] = useState<
    "moves" | "chat" | undefined
  >(undefined);

  const boardWidth = useElementWidth(boardWrapperRef, {
    padding: 24,
    min: 280,
    max: 720,
    initial: 360,
  });

  const room = useSessionGameRoom({
    sessionId,
    opponentName,
    playerColor,
    playerName: user ? `${user.firstName} ${user.lastName}` : "شما",
  });

  useAutoScroll(
    [desktopChatRef, mobileChatRef],
    [room.chatMessages, room.isOpponentTyping],
  );

  const squareStyles = useMemo(
    () =>
      getBoardSquareStyles({
        lastMove: room.lastMove,
        selectedSquare: room.selectedSquare,
        legalTargets: room.legalTargets,
        showLegalMoves: room.settings.showLegalMoves,
        checkSquare: room.checkSquare,
      }),
    [
      room.checkSquare,
      room.lastMove,
      room.legalTargets,
      room.selectedSquare,
      room.settings.showLegalMoves,
    ],
  );

  const connectionBadge = getConnectionBadge({
    isConnected,
    isConnecting,
  });

  const chessboardOptions = useMemo(
    () => ({
      id: "online-game-room-board",
      position: room.fen,
      boardWidth,
      boardOrientation: room.boardOrientation,
      arePiecesDraggable: room.isPlayerTurn,
      onPieceDrop: room.onPieceDrop,
      onSquareClick: (square: string) => room.selectSquare(square as Square),
      customSquareStyles: squareStyles,
      showBoardNotation: room.settings.showCoordinates,
      animationDuration: room.settings.enableAnimations ? 200 : 0,
      customDarkSquareStyle: { backgroundColor: "#8FA78D" },
      customLightSquareStyle: { backgroundColor: "#F2F0EA" },
      customBoardStyle: {
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 1px rgba(127, 159, 133, 0.15)",
      },
    }),
    [
      boardWidth,
      room.boardOrientation,
      room.fen,
      room.isPlayerTurn,
      room.onPieceDrop,
      room.selectSquare,
      room.settings.enableAnimations,
      room.settings.showCoordinates,
      squareStyles,
    ],
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[#F6F8F4] text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
        <header className="sticky top-0 z-30 rounded-[24px] border border-[#E5EAE2] bg-white px-4 py-4 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:px-5 lg:static">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-[16px] border-[#DCE4D9] bg-white px-4 text-[#4C5A4F]"
              >
                <Link href="/lobby">
                  <ArrowLeft className="size-4" />
                  <span className="sm:hidden">اتاق بازی</span>
                  <span className="hidden sm:inline">بازگشت به لابی</span>
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 text-[#6E7772]">
                  <Badge className="bg-[#E8F0E8] text-[#5B7A62] hover:bg-[#E8F0E8]">
                    اتاق بازی
                  </Badge>
                  <span className="text-sm">بازی استاندارد</span>
                  <span className="text-sm">10+5</span>
                </div>
                <h1 className="mt-2 text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                  جلسه آنلاین {sessionId.slice(0, 8)}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  "h-8 gap-1.5 px-3 text-sm",
                  connectionBadge.className,
                )}
              >
                <connectionBadge.icon className="size-4" />
                {connectionBadge.label}
              </Badge>
              <Badge
                variant="outline"
                className="h-8 border-[#DCE4D9] bg-[#F8FAF7] px-3 text-sm text-[#4C5A4F]"
              >
                {room.statusLabel}
              </Badge>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <DesktopSidebar
              chatDraft={room.chatDraft}
              chatMessages={room.chatMessages}
              currentMoveIndex={room.currentMoveIndex}
              desktopChatRef={desktopChatRef}
              incomingRequest={room.incomingRequest}
              isOpponentTyping={room.isOpponentTyping}
              movePairs={room.movePairs}
              onAcceptRequest={room.acceptIncomingRequest}
              onChatDraftChange={room.setChatDraft}
              onOfferDraw={room.offerDraw}
              onRejectRequest={room.rejectIncomingRequest}
              onRequestUndo={room.requestUndo}
              onSendMessage={room.sendChatMessage}
              onResign={room.resign}
              onToggleSetting={(key: GameRoomSettingKey) =>
                room.toggleSetting(key as any)
              }
              onFlipBoard={room.flipBoard}
              outgoingRequest={room.outgoingRequest}
              settings={room.settings}
              unreadCount={room.unreadCount}
            />
          </div>

          <section className="flex min-w-0 flex-col gap-4">
            <div className="lg:hidden">
              <MobilePlayerRow
                clockValue={formatClockTime(room.clocks.b)}
                isOnline={isConnected}
                name={room.opponentName}
                rating="1864"
                status={room.opponentStatus}
              />
            </div>

            <div className="hidden lg:block">
              <PlayerPanel
                clockValue={formatClockTime(room.clocks.b)}
                isOnline={isConnected}
                isOpponent={true}
                name={room.opponentName}
                rating="1864"
                status={room.opponentStatus}
              />
            </div>

            <div
              ref={boardWrapperRef}
              className="rounded-[28px] border border-[#E5EAE2] bg-white p-2 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:p-3 lg:p-4"
            >
              <div className="hidden items-center justify-between px-2 pb-3 lg:flex">
                <div className="text-sm text-[#6E7772]">
                  آخرین حرکت:{" "}
                  <span className="font-bold text-[#1F2525]">
                    {room.lastMove?.san ?? "ندارد"}
                  </span>
                </div>
                <BoardToolbar
                  isPlayerTurn={room.isPlayerTurn}
                  onFlipBoard={room.flipBoard}
                  onOfferDraw={room.offerDraw}
                  onRequestUndo={room.requestUndo}
                  onResign={room.resign}
                  onToggleSetting={(key: GameRoomSettingKey) =>
                    room.toggleSetting(key as any)
                  }
                  outgoingRequest={room.outgoingRequest}
                  settings={room.settings}
                />
              </div>

              <div className="mx-auto flex justify-center">
                <ChessboardWithOptions options={chessboardOptions} />
              </div>

              <div className="mt-3 lg:hidden">
                <EvaluationBar value={"+0.35"} />
              </div>
            </div>

            <div className="lg:hidden">
              <MobilePlayerRow
                clockValue={formatClockTime(room.clocks.w)}
                isOnline={true}
                name={room.playerName}
                rating="1928"
                status={room.playerStatus}
                highlightClock={true}
              />
            </div>

            <div className="hidden lg:block">
              <PlayerPanel
                clockValue={formatClockTime(room.clocks.w)}
                isOnline={true}
                isOpponent={false}
                name={room.playerName}
                rating="1928"
                status={room.playerStatus}
              />
            </div>

            {room.incomingRequest ? (
              <div className="lg:hidden">
                <RequestBanner
                  requestType={room.incomingRequest}
                  onAccept={room.acceptIncomingRequest}
                  onReject={room.rejectIncomingRequest}
                />
              </div>
            ) : null}

            <div className="grid gap-4 lg:hidden">
              <MobileControls
                onFlipBoard={room.flipBoard}
                onOfferDraw={room.offerDraw}
                onRequestUndo={room.requestUndo}
                onResign={room.resign}
                onToggleSetting={(key: GameRoomSettingKey) =>
                  room.toggleSetting(key as any)
                }
                outgoingRequest={room.outgoingRequest}
                settings={room.settings}
              />

              <MobileAccordions
                chatDraft={room.chatDraft}
                chatMessages={room.chatMessages}
                currentMoveIndex={room.currentMoveIndex}
                isOpponentTyping={room.isOpponentTyping}
                messageListRef={mobileChatRef}
                movePairs={room.movePairs}
                onChatDraftChange={room.setChatDraft}
                onSendMessage={room.sendChatMessage}
                value={mobileAccordionValue}
                onValueChange={(nextValue) => {
                  setMobileAccordionValue(nextValue);
                  room.setChatOpen(nextValue === "chat");
                }}
                unreadCount={room.unreadCount}
              />
            </div>
          </section>
        </div>
      </div>

      <PromotionDialog
        isOpen={Boolean(room.pendingPromotion)}
        onClose={room.cancelPromotion}
        onSelect={(value) => room.submitPromotion(value)}
      />
    </main>
  );
}

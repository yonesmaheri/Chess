"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Chessboard } from "react-chessboard";
import {
  ArrowLeft,
  Flag,
  Handshake,
  MessageCircle,
  RotateCcw,
  SendHorizontal,
  Settings2,
  ShieldCheck,
  Undo2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth } from "@/shared/contexts/auth-provider";
import { useSocketContext } from "@/shared/contexts/socket-provider";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import {
  formatClockTime,
  useSessionGameRoom,
  type GameRoomChatMessage,
  type GameRoomMovePair,
} from "./lib/useSessionGameRoom";

type MatchSessionGameRoomProps = {
  sessionId: string;
  opponentName: string;
  playerColor?: "w" | "b";
};

type PlayerPanelStatus = "idle" | "active" | "winner" | "loser";

const PROMOTION_OPTIONS = [
  { value: "q", label: "وزیر", symbol: "Q" },
  { value: "r", label: "رخ", symbol: "R" },
  { value: "b", label: "فیل", symbol: "B" },
  { value: "n", label: "اسب", symbol: "N" },
] as const;

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
  const [boardWidth, setBoardWidth] = useState(360);
  const [mobileSheetOffset, setMobileSheetOffset] = useState(0);
  const dragStartRef = useRef<number | null>(null);

  const room = useSessionGameRoom({
    sessionId,
    opponentName,
    playerColor,
    playerName: user ? `${user.firstName} ${user.lastName}` : "شما",
  });

  useEffect(() => {
    const element = boardWrapperRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      const nextWidth = Math.floor(element.clientWidth - 24);
      setBoardWidth(Math.max(280, Math.min(720, nextWidth)));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    desktopChatRef.current?.scrollTo({
      top: desktopChatRef.current.scrollHeight,
      behavior: "smooth",
    });
    mobileChatRef.current?.scrollTo({
      top: mobileChatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [room.chatMessages, room.isOpponentTyping]);

  const squareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (room.lastMove) {
      styles[room.lastMove.from] = {
        backgroundColor: "rgba(127, 159, 133, 0.18)",
      };
      styles[room.lastMove.to] = {
        backgroundColor: "rgba(127, 159, 133, 0.28)",
      };
    }

    if (room.selectedSquare) {
      styles[room.selectedSquare] = {
        backgroundColor: "rgba(255, 209, 102, 0.42)",
        boxShadow: "inset 0 0 0 2px rgba(255, 209, 102, 0.88)",
      };
    }

    if (room.settings.showLegalMoves) {
      room.legalTargets.forEach((targetSquare) => {
        styles[targetSquare] = {
          ...(styles[targetSquare] ?? {}),
          background:
            "radial-gradient(circle, rgba(127, 159, 133, 0.32) 0%, rgba(127, 159, 133, 0.14) 46%, rgba(127, 159, 133, 0) 48%)",
        };
      });
    }

    if (room.checkSquare) {
      styles[room.checkSquare] = {
        ...(styles[room.checkSquare] ?? {}),
        backgroundColor: "rgba(217, 83, 79, 0.35)",
        boxShadow: "inset 0 0 0 2px rgba(201, 82, 75, 0.7)",
      };
    }

    return styles;
  }, [
    room.checkSquare,
    room.lastMove,
    room.legalTargets,
    room.selectedSquare,
    room.settings.showLegalMoves,
  ]);

  const connectionBadge = isConnected
    ? {
        icon: Wifi,
        label: "متصل",
        className: "bg-[#E9F7EE] text-[#2F8A4E]",
      }
    : isConnecting
      ? {
          icon: ShieldCheck,
          label: "درحال اتصال",
          className: "bg-[#FFF4E5] text-[#B46D1D]",
        }
      : {
          icon: WifiOff,
          label: "قطع",
          className: "bg-[#FDECEC] text-[#C9524B]",
        };

  const handleSheetDragStart = (clientY: number) => {
    dragStartRef.current = clientY;
  };

  const handleSheetDragMove = (clientY: number) => {
    if (dragStartRef.current === null) {
      return;
    }

    setMobileSheetOffset(Math.max(0, clientY - dragStartRef.current));
  };

  const handleSheetDragEnd = () => {
    if (mobileSheetOffset > 90) {
      room.setChatOpen(false);
    }

    dragStartRef.current = null;
    setMobileSheetOffset(0);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#F6F8F4] text-[#1F2525]">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
        <header className="rounded-[24px] border border-[#E5EAE2] bg-white px-4 py-4 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-[16px] border-[#DCE4D9] bg-white px-4 text-[#4C5A4F]"
              >
                <Link href="/lobby">
                  <ArrowLeft className="size-4" />
                  بازگشت به لابی
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2 text-[#6E7772]">
                  <Badge className="bg-[#E8F0E8] text-[#5B7A62] hover:bg-[#E8F0E8]">
                    اتاق بازی
                  </Badge>
                  <span className="text-sm">بازی استاندارد 10+5</span>
                </div>
                <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
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

        <div className="hidden gap-4 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
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
            onToggleSetting={room.toggleSetting}
            onFlipBoard={room.flipBoard}
            outgoingRequest={room.outgoingRequest}
            settings={room.settings}
            unreadCount={room.unreadCount}
          />

          <section className="flex min-w-0 flex-col gap-4">
            <PlayerPanel
              clockValue={formatClockTime(room.clocks.b)}
              isOnline={isConnected}
              isOpponent={true}
              name={room.opponentName}
              rating="1864"
              status={room.opponentStatus}
            />

            <div
              ref={boardWrapperRef}
              className="rounded-[28px] border border-[#E5EAE2] bg-white p-3 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:p-4"
            >
              <div className="flex items-center justify-between px-2 pb-3">
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
                  onToggleSetting={room.toggleSetting}
                  outgoingRequest={room.outgoingRequest}
                  settings={room.settings}
                />
              </div>

              <div className="mx-auto flex justify-center">
                <Chessboard
                  id="online-game-room-board-desktop"
                  position={room.fen}
                  boardWidth={boardWidth}
                  boardOrientation={room.boardOrientation}
                  arePiecesDraggable={room.isPlayerTurn}
                  onPieceDrop={room.onPieceDrop}
                  onSquareClick={(square) =>
                    room.selectSquare(
                      square as Parameters<typeof room.selectSquare>[0],
                    )
                  }
                  customSquareStyles={squareStyles}
                  showBoardNotation={room.settings.showCoordinates}
                  animationDuration={room.settings.enableAnimations ? 200 : 0}
                  customDarkSquareStyle={{ backgroundColor: "#8FA78D" }}
                  customLightSquareStyle={{ backgroundColor: "#F2F0EA" }}
                  customBoardStyle={{
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "inset 0 0 0 1px rgba(127, 159, 133, 0.15)",
                  }}
                />
              </div>
            </div>

            <PlayerPanel
              clockValue={formatClockTime(room.clocks.w)}
              isOnline={true}
              isOpponent={false}
              name={room.playerName}
              rating="1928"
              status={room.playerStatus}
            />
          </section>
        </div>

        <div className="flex flex-col gap-3 lg:hidden">
          <PlayerPanel
            clockValue={formatClockTime(room.clocks.b)}
            isOnline={isConnected}
            isOpponent={true}
            name={room.opponentName}
            rating="1864"
            status={room.opponentStatus}
            compact={true}
          />

          <ClockStrip
            active={room.turn === "b"}
            label="ساعت حریف"
            value={formatClockTime(room.clocks.b)}
          />

          <MobileMoveStrip
            currentMoveIndex={room.currentMoveIndex}
            movePairs={room.movePairs}
          />

          <section
            ref={boardWrapperRef}
            className="rounded-[26px] border border-[#E5EAE2] bg-white p-2 shadow-[0_24px_60px_rgba(31,37,37,0.05)]"
          >
            <div className="mx-auto flex justify-center">
              <Chessboard
                id="online-game-room-board-mobile"
                position={room.fen}
                boardWidth={boardWidth}
                boardOrientation={room.boardOrientation}
                arePiecesDraggable={room.isPlayerTurn}
                onPieceDrop={room.onPieceDrop}
                onSquareClick={(square) =>
                  room.selectSquare(
                    square as Parameters<typeof room.selectSquare>[0],
                  )
                }
                customSquareStyles={squareStyles}
                showBoardNotation={room.settings.showCoordinates}
                animationDuration={room.settings.enableAnimations ? 180 : 0}
                customDarkSquareStyle={{ backgroundColor: "#8FA78D" }}
                customLightSquareStyle={{ backgroundColor: "#F2F0EA" }}
                customBoardStyle={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "inset 0 0 0 1px rgba(127, 159, 133, 0.15)",
                }}
              />
            </div>
          </section>

          <ClockStrip
            active={room.turn === "w"}
            label="ساعت شما"
            value={formatClockTime(room.clocks.w)}
            highlight={true}
          />

          <PlayerPanel
            clockValue={formatClockTime(room.clocks.w)}
            isOnline={true}
            isOpponent={false}
            name={room.playerName}
            rating="1928"
            status={room.playerStatus}
            compact={true}
          />

          {room.incomingRequest ? (
            <RequestBanner
              requestType={room.incomingRequest}
              onAccept={room.acceptIncomingRequest}
              onReject={room.rejectIncomingRequest}
            />
          ) : null}

          <div className="sticky bottom-3 z-20 rounded-[22px] border border-[#E5EAE2] bg-white/95 p-2 shadow-[0_24px_60px_rgba(31,37,37,0.08)] backdrop-blur">
            <div className="grid grid-cols-5 gap-2">
              <ToolbarButton
                icon={MessageCircle}
                label="گفت‌وگو"
                badge={room.unreadCount}
                onClick={() => room.setChatOpen(true)}
              />
              <ToolbarButton
                icon={Handshake}
                label="تساوی"
                onClick={room.offerDraw}
              />
              <ToolbarButton
                icon={Undo2}
                label="بازگشت"
                onClick={room.requestUndo}
              />
              <ToolbarButton
                icon={RotateCcw}
                label="چرخش"
                onClick={room.flipBoard}
              />
              <SettingsToolbarButton
                onToggleSetting={room.toggleSetting}
                settings={room.settings}
              />
            </div>
          </div>
        </div>
      </div>

      <PromotionDialog
        isOpen={Boolean(room.pendingPromotion)}
        onClose={room.cancelPromotion}
        onSelect={(value) => room.submitPromotion(value)}
      />

      <Sheet open={room.isChatOpen} onOpenChange={room.setChatOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="max-h-[78vh] rounded-t-[28px] border-0 bg-white px-0 pb-0"
          style={{
            transform: `translateY(${mobileSheetOffset}px)`,
          }}
        >
          <div
            className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-[#D8DED5]"
            onMouseDown={(event) => handleSheetDragStart(event.clientY)}
            onMouseMove={(event) => handleSheetDragMove(event.clientY)}
            onMouseUp={handleSheetDragEnd}
            onTouchStart={(event) =>
              handleSheetDragStart(event.touches[0]?.clientY ?? 0)
            }
            onTouchMove={(event) =>
              handleSheetDragMove(event.touches[0]?.clientY ?? 0)
            }
            onTouchEnd={handleSheetDragEnd}
          />
          <SheetHeader className="border-b border-[#EEF2EC] px-4 pb-4 pt-3">
            <SheetTitle className="text-right text-lg font-black text-[#1F2525]">
              گفت‌وگو
            </SheetTitle>
          </SheetHeader>
          <ChatPanel
            chatDraft={room.chatDraft}
            chatMessages={room.chatMessages}
            isOpponentTyping={room.isOpponentTyping}
            messageListRef={mobileChatRef}
            onDraftChange={room.setChatDraft}
            onSendMessage={room.sendChatMessage}
            padded={true}
          />
        </SheetContent>
      </Sheet>
    </main>
  );
}

function DesktopSidebar({
  chatDraft,
  chatMessages,
  currentMoveIndex,
  desktopChatRef,
  incomingRequest,
  isOpponentTyping,
  movePairs,
  onAcceptRequest,
  onChatDraftChange,
  onFlipBoard,
  onOfferDraw,
  onRejectRequest,
  onRequestUndo,
  onResign,
  onSendMessage,
  onToggleSetting,
  outgoingRequest,
  settings,
}: {
  chatDraft: string;
  chatMessages: GameRoomChatMessage[];
  currentMoveIndex: number;
  desktopChatRef: React.RefObject<HTMLDivElement | null>;
  incomingRequest: "draw" | "undo" | null;
  isOpponentTyping: boolean;
  movePairs: GameRoomMovePair[];
  onAcceptRequest: () => void;
  onChatDraftChange: (value: string) => void;
  onFlipBoard: () => void;
  onOfferDraw: () => void;
  onRejectRequest: () => void;
  onRequestUndo: () => void;
  onResign: () => void;
  onSendMessage: () => void;
  onToggleSetting: (
    key: "showCoordinates" | "showLegalMoves" | "enableAnimations",
  ) => void;
  outgoingRequest: "draw" | "undo" | null;
  settings: {
    enableAnimations: boolean;
    showCoordinates: boolean;
    showLegalMoves: boolean;
  };
}) {
  return (
    <aside className="flex min-h-[calc(100vh-170px)] flex-col gap-4">
      <section className="rounded-[28px] border border-[#E5EAE2] bg-white p-4 shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#1F2525]">حرکت‌ها</h2>
          <Badge className="bg-[#F0F4ED] text-[#5B7A62] hover:bg-[#F0F4ED]">
            تاریخچه زنده
          </Badge>
        </div>
        <div className="mt-4 max-h-[360px] overflow-y-auto rounded-[20px] border border-[#EEF2EC]">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-[#F8FAF7]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-14 text-right text-[#6E7772]">
                  #
                </TableHead>
                <TableHead className="text-right text-[#6E7772]">
                  سفید
                </TableHead>
                <TableHead className="text-right text-[#6E7772]">
                  سیاه
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movePairs.map((pair, pairIndex) => {
                const whiteMoveIndex = pairIndex * 2;
                const blackMoveIndex = whiteMoveIndex + 1;

                return (
                  <TableRow
                    key={pair.moveNumber}
                    className="hover:bg-[#F9FBF8]"
                  >
                    <TableCell className="text-right font-semibold text-[#6E7772]">
                      {pair.moveNumber}
                    </TableCell>
                    <TableCell className="text-right">
                      <MovePill
                        active={currentMoveIndex === whiteMoveIndex}
                        label={pair.white}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <MovePill
                        active={currentMoveIndex === blackMoveIndex}
                        label={pair.black}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#E5EAE2] bg-white p-4 shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
        <div className="grid grid-cols-2 gap-2">
          <SidebarActionButton
            icon={Handshake}
            label={outgoingRequest === "draw" ? "در انتظار..." : "تساوی"}
            onClick={onOfferDraw}
          />
          <SidebarActionButton
            icon={Undo2}
            label={outgoingRequest === "undo" ? "در انتظار..." : "بازگشت"}
            onClick={onRequestUndo}
          />
          <SidebarActionButton
            icon={RotateCcw}
            label="چرخش"
            onClick={onFlipBoard}
          />
          <SidebarActionButton
            icon={Flag}
            label="تسلیم"
            onClick={onResign}
            danger={true}
          />
        </div>

        {incomingRequest ? (
          <div className="mt-4">
            <RequestBanner
              requestType={incomingRequest}
              onAccept={onAcceptRequest}
              onReject={onRejectRequest}
            />
          </div>
        ) : null}

        <div className="mt-4 rounded-[20px] border border-[#EEF2EC] bg-[#F8FAF7] p-3">
          <div className="mb-3 flex items-center gap-2">
            <Settings2 className="size-4 text-[#6E7772]" />
            <p className="text-sm font-bold text-[#1F2525]">تنظیمات سریع</p>
          </div>
          <div className="grid gap-2">
            <SettingToggle
              active={settings.showCoordinates}
              label="نمایش مختصات"
              onClick={() => onToggleSetting("showCoordinates")}
            />
            <SettingToggle
              active={settings.showLegalMoves}
              label="هایلایت حرکت‌های مجاز"
              onClick={() => onToggleSetting("showLegalMoves")}
            />
            <SettingToggle
              active={settings.enableAnimations}
              label="انیمیشن مهره‌ها"
              onClick={() => onToggleSetting("enableAnimations")}
            />
          </div>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-[#E5EAE2] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.05)]">
        <div className="border-b border-[#EEF2EC] px-4 py-4">
          <h2 className="text-lg font-black text-[#1F2525]">گفت‌وگو</h2>
        </div>
        <ChatPanel
          chatDraft={chatDraft}
          chatMessages={chatMessages}
          isOpponentTyping={isOpponentTyping}
          messageListRef={desktopChatRef}
          onDraftChange={onChatDraftChange}
          onSendMessage={onSendMessage}
          padded={false}
        />
      </section>
    </aside>
  );
}

function PlayerPanel({
  clockValue,
  compact = false,
  isOnline,
  isOpponent,
  name,
  rating,
  status,
}: {
  clockValue: string;
  compact?: boolean;
  isOnline: boolean;
  isOpponent: boolean;
  name: string;
  rating: string;
  status: PlayerPanelStatus;
}) {
  const statusText =
    status === "winner"
      ? "برنده"
      : status === "loser"
        ? "بازنده"
        : status === "active"
          ? "نوبت حرکت"
          : "در انتظار";

  return (
    <section
      className={cn(
        "rounded-[28px] border border-[#E5EAE2] bg-white shadow-[0_24px_60px_rgba(31,37,37,0.05)]",
        compact ? "px-4 py-3" : "px-5 py-4",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className={cn("min-w-0", compact && "order-2")}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-lg font-black text-[#1F2525]">{name}</p>
            <span
              className={cn(
                "inline-flex size-2.5 rounded-full",
                isOnline ? "bg-[#3EAE5B]" : "bg-[#D46861]",
              )}
            />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#6E7772]">
            <span>{rating}</span>
            <span>امتیاز</span>
            <Badge
              className={cn(
                "h-7 px-3 text-xs",
                status === "winner"
                  ? "bg-[#E8F4EB] text-[#2F8A4E]"
                  : status === "loser"
                    ? "bg-[#FDECEC] text-[#C9524B]"
                    : status === "active"
                      ? "bg-[#FFF4E5] text-[#B46D1D]"
                      : "bg-[#F0F4ED] text-[#6E7772]",
              )}
            >
              {statusText}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-[20px] border px-4 py-3 text-center shadow-[0_12px_24px_rgba(31,37,37,0.05)]",
              status === "active"
                ? "border-[#9FD59D] bg-[#F2FFF1] text-[#2F8A4E]"
                : "border-[#E6EAE3] bg-[#FCFCFB] text-[#1F2525]",
            )}
          >
            <p className="text-[11px] text-[#6E7772]">ساعت</p>
            <p className="mt-1 text-2xl font-black tracking-tight">
              {clockValue}
            </p>
          </div>
          <Avatar className="size-16" size="lg">
            <AvatarFallback className="bg-[#EDF3EB] text-base font-bold text-[#5B7A62]">
              {name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </section>
  );
}

function ClockStrip({
  active,
  highlight = false,
  label,
  value,
}: {
  active: boolean;
  highlight?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border px-4 py-3 shadow-[0_12px_24px_rgba(31,37,37,0.05)]",
        active || highlight
          ? "border-[#9FD59D] bg-[#F4FFF2]"
          : "border-[#E5EAE2] bg-white",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6E7772]">{label}</span>
        <span className="text-3xl font-black tracking-tight text-[#374236]">
          {value}
        </span>
      </div>
    </div>
  );
}

function MobileMoveStrip({
  currentMoveIndex,
  movePairs,
}: {
  currentMoveIndex: number;
  movePairs: GameRoomMovePair[];
}) {
  const moves = movePairs.flatMap((pair) => [pair.white, pair.black]);

  return (
    <div className="overflow-x-auto rounded-[18px] border border-[#E5EAE2] bg-white px-3 py-2 shadow-[0_10px_20px_rgba(31,37,37,0.03)]">
      <div className="flex min-w-max items-center gap-2">
        {moves.map((move, index) =>
          move ? (
            <span
              key={`${move}-${index}`}
              className={cn(
                "rounded-full px-2.5 py-1 text-sm text-[#5D675E]",
                currentMoveIndex === index
                  ? "bg-[#E8F2E7] font-bold text-[#35553D]"
                  : "bg-[#F3F5F1]",
              )}
            >
              {move}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}

function BoardToolbar({
  isPlayerTurn,
  onFlipBoard,
  onOfferDraw,
  onRequestUndo,
  onResign,
  onToggleSetting,
  outgoingRequest,
  settings,
}: {
  isPlayerTurn: boolean;
  onFlipBoard: () => void;
  onOfferDraw: () => void;
  onRequestUndo: () => void;
  onResign: () => void;
  onToggleSetting: (
    key: "showCoordinates" | "showLegalMoves" | "enableAnimations",
  ) => void;
  outgoingRequest: "draw" | "undo" | null;
  settings: {
    enableAnimations: boolean;
    showCoordinates: boolean;
    showLegalMoves: boolean;
  };
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[14px] border-[#DCE4D9] bg-white px-3 text-[#4C5A4F]"
        onClick={onOfferDraw}
      >
        <Handshake className="size-4" />
        {outgoingRequest === "draw" ? "در انتظار" : "تساوی"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[14px] border-[#DCE4D9] bg-white px-3 text-[#4C5A4F]"
        onClick={onRequestUndo}
      >
        <Undo2 className="size-4" />
        {outgoingRequest === "undo" ? "در انتظار" : "بازگشت"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[14px] border-[#DCE4D9] bg-white px-3 text-[#4C5A4F]"
        onClick={onFlipBoard}
      >
        <RotateCcw className="size-4" />
        چرخش
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-[14px] border-[#DCE4D9] bg-white px-3 text-[#4C5A4F]"
          >
            <Settings2 className="size-4" />
            تنظیمات
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 rounded-[20px] border border-[#E5EAE2] bg-white p-3">
          <PopoverHeader className="mb-2">
            <PopoverTitle className="text-right font-bold text-[#1F2525]">
              تنظیمات بازی
            </PopoverTitle>
          </PopoverHeader>
          <div className="grid gap-2">
            <SettingToggle
              active={settings.showCoordinates}
              label="نمایش مختصات"
              onClick={() => onToggleSetting("showCoordinates")}
            />
            <SettingToggle
              active={settings.showLegalMoves}
              label="هایلایت حرکت‌های مجاز"
              onClick={() => onToggleSetting("showLegalMoves")}
            />
            <SettingToggle
              active={settings.enableAnimations}
              label="انیمیشن مهره‌ها"
              onClick={() => onToggleSetting("enableAnimations")}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[14px] border-[#F0D0CF] bg-[#FFF7F7] px-3 text-[#B24B46]"
        onClick={onResign}
      >
        <Flag className="size-4" />
        تسلیم
      </Button>
      <Badge
        className={cn(
          "h-10 px-3 text-sm",
          isPlayerTurn
            ? "bg-[#E8F6EA] text-[#2F8A4E]"
            : "bg-[#F4F5F2] text-[#6E7772]",
        )}
      >
        {isPlayerTurn ? "حرکت شما" : "در انتظار حریف"}
      </Badge>
    </div>
  );
}

function RequestBanner({
  requestType,
  onAccept,
  onReject,
}: {
  requestType: "draw" | "undo";
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-[#E9D9AF] bg-[#FFF9E8] p-3">
      <p className="text-sm font-bold text-[#805B15]">
        {requestType === "draw"
          ? "درخواست تساوی دریافت شد."
          : "درخواست بازگشت آخرین حرکت دریافت شد."}
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          className="h-10 flex-1 rounded-[14px] bg-[#7F9F85] text-white hover:bg-[#6E8F74]"
          onClick={onAccept}
        >
          تایید
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 flex-1 rounded-[14px] border-[#E6D7AA] bg-white text-[#7B632A]"
          onClick={onReject}
        >
          رد
        </Button>
      </div>
    </div>
  );
}

function ChatPanel({
  chatDraft,
  chatMessages,
  isOpponentTyping,
  messageListRef,
  onDraftChange,
  onSendMessage,
  padded,
}: {
  chatDraft: string;
  chatMessages: GameRoomChatMessage[];
  isOpponentTyping: boolean;
  messageListRef: React.RefObject<HTMLDivElement | null>;
  onDraftChange: (value: string) => void;
  onSendMessage: () => void;
  padded: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={messageListRef}
        className={cn(
          "min-h-0 flex-1 space-y-3 overflow-y-auto",
          padded ? "px-4 py-4" : "px-4 py-4",
        )}
      >
        {chatMessages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        {isOpponentTyping ? (
          <div className="flex justify-start">
            <div className="rounded-[18px] bg-[#F2F5F0] px-4 py-2 text-sm text-[#6E7772]">
              حریف درحال تایپ است...
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[#EEF2EC] p-4">
        <div className="flex items-center gap-2">
          <Input
            aria-label="پیام خود را بنویسید"
            className="h-11 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] px-4 text-right"
            placeholder="پیام خود را بنویسید..."
            value={chatDraft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button
            type="button"
            className="size-11 rounded-[16px] bg-[#7F9F85] text-white hover:bg-[#6E8F74]"
            onClick={onSendMessage}
            aria-label="ارسال پیام"
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatMessageBubble({ message }: { message: GameRoomChatMessage }) {
  if (message.author === "system") {
    return (
      <div className="rounded-[16px] border border-dashed border-[#DCE4D9] bg-[#FAFCF9] px-3 py-2 text-center text-xs text-[#6E7772]">
        <p>{message.text}</p>
        <span className="mt-1 block text-[11px] text-[#A0AAA1]">
          {message.timestamp}
        </span>
      </div>
    );
  }

  const isPlayer = message.author === "player";

  return (
    <div className={cn("flex", isPlayer ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[86%] rounded-[20px] px-4 py-3 shadow-[0_8px_18px_rgba(31,37,37,0.03)]",
          isPlayer
            ? "bg-[#E8F4E8] text-[#29472F]"
            : "bg-[#F2F5F0] text-[#1F2525]",
        )}
      >
        <p className="text-sm leading-6">{message.text}</p>
        <span className="mt-1 block text-[11px] text-[#8B938C]">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

function ToolbarButton({
  badge,
  icon: Icon,
  label,
  onClick,
}: {
  badge?: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="relative flex h-14 flex-col gap-1 rounded-[16px] border-[#E5EAE2] bg-white px-2 text-[#4C5A4F]"
      onClick={onClick}
    >
      {badge && badge > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#7F9F85] px-1 text-[11px] font-bold text-white">
          {badge}
        </span>
      ) : null}
      <Icon className="size-4" />
      <span className="text-[11px] font-medium">{label}</span>
    </Button>
  );
}

function SettingsToolbarButton({
  onToggleSetting,
  settings,
}: {
  onToggleSetting: (
    key: "showCoordinates" | "showLegalMoves" | "enableAnimations",
  ) => void;
  settings: {
    enableAnimations: boolean;
    showCoordinates: boolean;
    showLegalMoves: boolean;
  };
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex h-14 flex-col gap-1 rounded-[16px] border-[#E5EAE2] bg-white px-2 text-[#4C5A4F]"
        >
          <Settings2 className="size-4" />
          <span className="text-[11px] font-medium">تنظیمات</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 rounded-[20px] border border-[#E5EAE2] bg-white p-3">
        <PopoverHeader className="mb-2">
          <PopoverTitle className="text-right font-bold text-[#1F2525]">
            تنظیمات سریع
          </PopoverTitle>
        </PopoverHeader>
        <div className="grid gap-2">
          <SettingToggle
            active={settings.showCoordinates}
            label="نمایش مختصات"
            onClick={() => onToggleSetting("showCoordinates")}
          />
          <SettingToggle
            active={settings.showLegalMoves}
            label="هایلایت حرکت‌های مجاز"
            onClick={() => onToggleSetting("showLegalMoves")}
          />
          <SettingToggle
            active={settings.enableAnimations}
            label="انیمیشن مهره‌ها"
            onClick={() => onToggleSetting("enableAnimations")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SidebarActionButton({
  danger = false,
  icon: Icon,
  label,
  onClick,
}: {
  danger?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-12 rounded-[16px] border px-3",
        danger
          ? "border-[#F0D0CF] bg-[#FFF7F7] text-[#B24B46] hover:bg-[#FFF1F1]"
          : "border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]",
      )}
      onClick={onClick}
    >
      <Icon className="size-4" />
      {label}
    </Button>
  );
}

function SettingToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-between rounded-[16px] border px-3 py-2 text-sm transition",
        active
          ? "border-[#CFE3CF] bg-[#EEF8EE] text-[#2F8A4E]"
          : "border-[#E5EAE2] bg-white text-[#5D675E]",
      )}
      onClick={onClick}
    >
      <span>{label}</span>
      <span
        className={cn(
          "inline-flex h-6 w-11 rounded-full p-1 transition",
          active ? "bg-[#7F9F85]" : "bg-[#D9DED8]",
        )}
      >
        <span
          className={cn(
            "size-4 rounded-full bg-white transition",
            active ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}

function MovePill({
  active,
  label,
}: {
  active: boolean;
  label: string | null;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-14 justify-center rounded-full px-2.5 py-1 text-sm",
        active
          ? "bg-[#E8F2E7] font-bold text-[#35553D]"
          : "bg-[#F3F5F1] text-[#5D675E]",
      )}
    >
      {label ?? "-"}
    </span>
  );
}

function PromotionDialog({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (piece: "q" | "r" | "b" | "n") => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm rounded-[24px] border border-[#E5EAE2] bg-white p-5"
      >
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-black text-[#1F2525]">
            انتخاب مهره برای ترفیع
          </DialogTitle>
          <DialogDescription className="leading-7 text-[#6E7772]">
            مهره‌ای را انتخاب کنید که پیاده به آن تبدیل شود.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {PROMOTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className="rounded-[18px] border border-[#DCE4D9] bg-[#F8FAF7] px-4 py-4 text-center transition hover:border-[#BFD0BD] hover:bg-[#EEF5EC]"
              onClick={() => onSelect(option.value)}
            >
              <div className="text-3xl font-black text-[#2F4031]">
                {option.symbol}
              </div>
              <div className="mt-2 text-sm font-medium text-[#5D675E]">
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

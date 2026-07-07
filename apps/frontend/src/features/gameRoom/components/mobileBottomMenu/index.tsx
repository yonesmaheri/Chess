"use client";

import type { RefObject } from "react";
import { Flag, Handshake, MessageCircle, ScrollText, Settings2, Undo2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import type {
  GameRoomChatMessage,
  GameRoomMovePair,
  GameRoomRequestType,
  GameRoomSettingKey,
  GameRoomSettings,
} from "../../types";
import ChatPanel from "../chatPanel";
import MovePill from "../movePill";
import SettingToggle from "../settingToggle";
import RequestBanner from "../requestBanner";

type MobileBottomMenuProps = {
  chatDraft: string;
  chatMessages: GameRoomChatMessage[];
  currentMoveIndex: number;
  incomingRequest: GameRoomRequestType | null;
  isOpponentTyping: boolean;
  messageListRef: RefObject<HTMLDivElement | null>;
  movePairs: GameRoomMovePair[];
  onAcceptRequest: () => void;
  onChatDraftChange: (value: string) => void;
  onOfferDraw: () => void;
  onRejectRequest: () => void;
  onRequestUndo: () => void;
  onResign: () => void;
  onSendMessage: () => void;
  onToggleSetting: (key: GameRoomSettingKey) => void;
  outgoingRequest: GameRoomRequestType | null;
  settings: GameRoomSettings;
  unreadCount: number;
  onChatOpenChange: (open: boolean) => void;
};

export default function MobileBottomMenu({
  chatDraft,
  chatMessages,
  currentMoveIndex,
  incomingRequest,
  isOpponentTyping,
  messageListRef,
  movePairs,
  onAcceptRequest,
  onChatDraftChange,
  onOfferDraw,
  onRejectRequest,
  onRequestUndo,
  onResign,
  onSendMessage,
  onToggleSetting,
  outgoingRequest,
  settings,
  unreadCount,
  onChatOpenChange,
}: MobileBottomMenuProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="mx-auto w-full max-w-[1500px] px-4 pb-4 sm:px-5 lg:px-6">
        <div className="rounded-[22px] border border-[#E5EAE2] bg-white p-2 shadow-[0_24px_60px_rgba(31,37,37,0.08)]">
          <div className="grid grid-cols-3 gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]"
                >
                  <ScrollText className="size-4" />
                  حرکات
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[22px] border border-[#E5EAE2] bg-white p-0">
                <SheetHeader className="border-b border-[#EEF2EC]">
                  <SheetTitle className="text-right font-black text-[#1F2525]">
                    حرکات
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <div className="max-h-[55vh] overflow-y-auto rounded-[18px] border border-[#EEF2EC] bg-[#F8FAF7] px-3 py-2">
                    <div className="grid gap-2">
                      {movePairs.map((pair, pairIndex) => {
                        const whiteMoveIndex = pairIndex * 2;
                        const blackMoveIndex = whiteMoveIndex + 1;

                        return (
                          <div
                            key={pair.moveNumber}
                            className="grid min-h-11 grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 rounded-[14px] bg-white px-2 py-2"
                          >
                            <span className="text-right text-sm font-bold text-[#6E7772]">
                              {pair.moveNumber}
                            </span>
                            <span className="text-right">
                              <MovePill
                                active={currentMoveIndex === whiteMoveIndex}
                                label={pair.white}
                              />
                            </span>
                            <span className="text-right">
                              <MovePill
                                active={currentMoveIndex === blackMoveIndex}
                                label={pair.black}
                              />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet onOpenChange={(open) => onChatOpenChange(open)}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="relative h-11 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]"
                >
                  <MessageCircle className="size-4" />
                  گفت‌وگو
                  {unreadCount > 0 ? (
                    <span className="absolute -top-1 -left-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#7F9F85] px-1.5 text-[11px] font-bold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[22px] border border-[#E5EAE2] bg-white p-0">
                <SheetHeader className="border-b border-[#EEF2EC]">
                  <SheetTitle className="text-right font-black text-[#1F2525]">
                    گفت‌وگو
                  </SheetTitle>
                </SheetHeader>
                <div className="flex h-[70vh] min-h-0 flex-col">
                  <ChatPanel
                    chatDraft={chatDraft}
                    chatMessages={chatMessages}
                    isOpponentTyping={isOpponentTyping}
                    messageListRef={messageListRef}
                    onDraftChange={onChatDraftChange}
                    onSendMessage={onSendMessage}
                    padded={true}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]"
                >
                  <Settings2 className="size-4" />
                  منو
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-[22px] border border-[#E5EAE2] bg-white p-0">
                <SheetHeader className="border-b border-[#EEF2EC]">
                  <SheetTitle className="text-right font-black text-[#1F2525]">
                    کنترل‌ها و تنظیمات
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-3 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]"
                      onClick={onOfferDraw}
                    >
                      <Handshake className="size-4" />
                      {outgoingRequest === "draw" ? "در انتظار..." : "تساوی"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-[16px] border-[#F0D0CF] bg-[#FFF7F7] text-[#B24B46]"
                      onClick={onResign}
                    >
                      <Flag className="size-4" />
                      تسلیم
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-[16px] border-[#DCE4D9] bg-[#F8FAF7] text-[#4C5A4F]"
                      onClick={onRequestUndo}
                    >
                      <Undo2 className="size-4" />
                      {outgoingRequest === "undo" ? "در انتظار..." : "بازگشت"}
                    </Button>
                  </div>

                  {incomingRequest ? (
                    <RequestBanner
                      requestType={incomingRequest}
                      onAccept={onAcceptRequest}
                      onReject={onRejectRequest}
                    />
                  ) : null}

                  <div className="rounded-[20px] border border-[#EEF2EC] bg-[#F8FAF7] p-3">
                    <p className="mb-2 text-sm font-black text-[#1F2525]">
                      تنظیمات سریع
                    </p>
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}

